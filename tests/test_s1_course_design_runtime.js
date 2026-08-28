#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_TYPES = {
  '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript',
  '.json': 'application/json', '.mp3': 'audio/mpeg', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml'
};

async function choose(page, name, value) {
  await page.evaluate(([inputName, inputValue]) => {
    const input = [...document.querySelectorAll(`input[name="${inputName}"]`)]
      .find(item => item.value === inputValue);
    if (!input) throw new Error(`Missing ${inputName}=${inputValue}`);
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, [name, value]);
}

async function place(page, card, zone) {
  await page.locator(`[data-pc-drag-card="${card}"]`).click();
  await page.locator(`[data-pc-drop-zone="${zone}"]`).click();
}

async function run() {
  const executablePath = process.env.PROMPTCRAFT_CHROMIUM || chromium.executablePath();
  if (!fs.existsSync(executablePath)) {
    console.log(`SKIP: Chromium is unavailable at ${executablePath}.`);
    return;
  }
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
    .replace('<head>', '<head><base href="https://promptcraft.test/">');
  const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));

  await page.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname !== 'promptcraft.test') return route.abort();
    if (request.method() !== 'GET') {
      return route.fulfill({ status: 503, body: 'offline scenario regression', contentType: 'text/plain' });
    }
    const relative = url.pathname.replace(/^\//, '') || 'index.html';
    const target = path.join(ROOT, relative);
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      return route.fulfill({ status: 404, body: 'missing', contentType: 'text/plain' });
    }
    return route.fulfill({
      status: 200,
      body: fs.readFileSync(target),
      contentType: CONTENT_TYPES[path.extname(target).toLowerCase()] || 'application/octet-stream'
    });
  });

  try {
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      window.PC_BABBAGE_MIN_VISIBLE_ANALYSIS_MS = 0;
      window.PC_BABBAGE_PROCESSING_HOLD_MS = 0;
      for (const id of ['mainMenuOverlay', 'nameModalOverlay', 'audioSetupOverlay']) {
        const element = document.getElementById(id);
        if (!element) continue;
        element.hidden = true;
        element.style.display = 'none';
        element.classList.remove('visible', 'open');
      }
      pcActivateScenario(SCENARIO_INDEX.COURSE_DESIGN, { playIntroduction: false });
      renderS1CourseDiagnosisActivity();
    });

    await choose(page, 's1-course-diagnosis', 'pathway');
    await page.locator('#s1CourseDiagnosisSubmit').click();
    await page.evaluate(() => renderS1CoursePathwayActivity());
    for (const [card, zone] of [
      ['module_overview', 'entry'],
      ['action_labels', 'labels'],
      ['learn_practice_submit', 'sequence'],
      ['submit_and_continue', 'completion']
    ]) await place(page, card, zone);
    await page.locator('#s1CoursePathSubmit').click();
    await page.locator('[data-pc-action="s1-course-run-babbage"]').click();

    await page.waitForFunction(
      () => document.getElementById('babbageTerminalOutput')?.innerText.includes('MODULE PATH DRAFTED'),
      null,
      { timeout: 10000 }
    );
    await page.getByRole('button', { name: 'Audit Babbage' }).click();
    await page.waitForSelector('#s1CourseAuditSubmit');
    await choose(page, 's1-course-audit', 'buried_submission');
    await page.locator('#s1CourseAuditSubmit').click();
    await page.locator('[data-pc-action="s1-course-after-audit"]').click();
    await page.locator('.vn-skip').click();
    await page.waitForSelector('#s1CourseRepairPurpose');

    const values = {
      '#s1CourseRepairPurpose': 'Compare two community planning models and explain which model better fits a local decision.',
      '#s1CourseRepairSequence': 'Read the guide, watch the example, practice with the check, then submit; plan for 90 minutes.',
      '#s1CourseRepairSubmit': 'Submit a 400-word comparison by Sunday at 11:59 PM using evidence from both models and the success checklist.',
      '#s1CourseRepairNext': 'You are finished when Canvas confirms submission; continue to Week 5 or use the course Q&A for help.'
    };
    for (const [selector, value] of Object.entries(values)) await page.locator(selector).fill(value);
    await page.locator('#s1CourseRepairSubmitButton').click();
    await page.locator('.vn-skip').click();
    await page.waitForTimeout(250);

    const state = await page.evaluate(() => ({
      activeScenario: devStatus().activeScenario,
      resultText: document.getElementById('inputContainer')?.innerText || '',
      completed: scenarioCompleted[SCENARIO_INDEX.COURSE_DESIGN],
      bestScore: scenarioData[SCENARIO_INDEX.COURSE_DESIGN].bestScore,
      auditExact: scenarioData[SCENARIO_INDEX.COURSE_DESIGN].auditAttempts.at(-1)?.exact,
      draftSource: scenarioData[SCENARIO_INDEX.COURSE_DESIGN].courseDraftSource,
      pathway: scenarioData[SCENARIO_INDEX.COURSE_DESIGN].pathwayFinal,
      repair: scenarioData[SCENARIO_INDEX.COURSE_DESIGN].repairParts,
      bodyWidth: document.body.scrollWidth,
      viewportWidth: innerWidth
    }));

    assert.equal(state.activeScenario, 1);
    assert.match(state.resultText, /The content stayed\. The student path became visible\./);
    assert.equal(state.bestScore, 5);
    assert.equal(state.completed, true);
    assert.equal(state.auditExact, true);
    assert.equal(state.draftSource, 'fallback');
    assert.equal(state.pathway.entry, 'module_overview');
    assert.ok(state.repair.submission);
    assert.ok(state.bodyWidth <= state.viewportWidth + 1, 'S1 created horizontal page overflow');
    assert.deepEqual(pageErrors, []);
    console.log('PromptCraft S1 Content Avalanche browser flow passed.');
  } finally {
    await browser.close();
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
