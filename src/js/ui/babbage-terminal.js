function showBabbageConsultOverlay(partLabel, options = {}) {
  // Shared Babbage analyzing presentation. Scenarios supply only copy; the
  // workstation, terminal, dialogue, progress, and responsive behavior stay shared.
  const {
    speakerName = 'Professor Pixel',
    heading = "Let's ask Babbage what it notices.",
    body = 'Babbage is analyzing the teaching problem now.'
  } = options || {};

  vnQueue = [];
  clearTimeout(vnTypeTimer);
  vnTyping = true;
  vnOnComplete = null;
  vnFullText = '';
  vnCurrentText = '';

  pcClearAnalysisLayout();

  pcSetVNOverlayState({
    active: true,
    modes: ['babbage-terminal-consult']
  });
  setBabbageTerminalTextMode(false);
  musicStartVN();
  setBabbageShelfState('idle', 'idle');

  setBabbageTerminalState(
    'thinking',
    'BABBAGE ENGINE',
    `SECTION:
${esc(partLabel).toUpperCase()}

ANALYZING...`
  );

  renderBabbageAnalyzingReadout(partLabel);
  pcQueueModernTerminalAlignment();
  pcScheduleLiveAnalyzingLayout({ immediate: true });

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = speakerName;

  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `<div><strong>${esc(heading)}</strong></div><div style="margin-top:8px;">${esc(body)}</div><div class="vn-prediction-note">Terminal active...</div>`;
  }

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');

  pcScheduleScenarioTask(() => {
    document.getElementById('vnDialogue')?.focus({ preventScroll: true });
  }, 100);
}

function parseBabbageDiagnosticSections(text) {
  const clean = terminalizeBabbageText(text);
  const lines = clean
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean);

  const result = {
    status: '',
    confidence: '',
    summary: '',
    worked: '',
    issue: '',
    repair: '',
    impact: ''
  };

  let current = '';

  for (const line of lines) {
    const upper = line.toUpperCase().replace(/:$/, '');

    if (/^(MOCK )?ANALYSIS COMPLETE$/.test(upper) || upper === 'SCENARIO DIAGNOSTIC') continue;

    if (upper === 'STATUS') { current = 'status'; continue; }
    if (upper === 'CONFIDENCE') { current = 'confidence'; continue; }
    if (upper === 'FEEDBACK SUMMARY') { current = 'summary'; continue; }
    if (upper === 'WHAT WORKED') { current = 'worked'; continue; }
    if (upper === 'ISSUE DETECTED') { current = 'issue'; continue; }
    if (upper === 'RECOMMENDED REPAIR') { current = 'repair'; continue; }
    if (upper === 'EXPECTED IMPACT') { current = 'impact'; continue; }
    if (upper === 'REVISED DISCUSSION PROMPT' || upper === 'COURSE QUALITY CHECK') { current = ''; continue; }

    if (current && result[current]) result[current] += ' ' + line;
    else if (current) result[current] = line;
  }

  const fallbackIssue = clean
    .replace(/^(MOCK )?ANALYSIS COMPLETE\s*/i, '')
    .replace(/^SCENARIO DIAGNOSTIC\s*/i, '')
    .trim();

  return {
    status: result.status || 'High-confidence repair',
    confidence: result.confidence || 'High',
    summary: result.summary || 'Babbage evaluated the specific repair choices in your prompt and identified the strongest next refinement.',
    worked: result.worked || 'Your prompt gave Babbage enough instructional direction to produce a targeted redesign.',
    issue: result.issue || fallbackIssue || 'The prompt has a discussion design problem that may limit student interaction.',
    repair: result.repair || 'Add a clear reason for students to extend, challenge, compare, or build on a peer’s idea using evidence or reasoning.',
    impact: result.impact || 'Students will be more likely to extend conversations, challenge ideas, compare perspectives, and engage in deeper discussion.'
  };
}

function pcNormalizeBabbageFindingItems(items = []) {
  if (!Array.isArray(items)) return [];
  return items
    .map(item => {
      if (typeof item === 'string') return { label: item.trim(), detail: '' };
      return {
        label: String(item?.label || item?.title || '').trim(),
        detail: String(item?.detail || item?.value || item?.evidence || '').trim()
      };
    })
    .filter(item => item.label || item.detail);
}

function pcBuildBabbageFindingHTML(value, items = [], statusLabel = 'PASS') {
  const normalized = pcNormalizeBabbageFindingItems(items);
  if (!normalized.length) return `<div class="analysis-value">${esc(value)}</div>`;
  return `
    <div class="analysis-value analysis-value-structured">
      <div class="analysis-finding-list" role="list">
        ${normalized.map(item => `
          <div class="analysis-finding-row" role="listitem">
            <span class="analysis-finding-status">${esc(statusLabel)}</span>
            <div class="analysis-finding-copy">${item.label ? `<strong>${esc(item.label)}</strong>` : ''}${item.detail ? `<p>${esc(item.detail)}</p>` : ''}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

function pcBuildBabbageProcessExampleHTML(example = null) {
  if (!example || !Array.isArray(example.steps)) return '';
  const steps = example.steps
    .map(step => ({
      label: String(step?.label || step?.title || '').trim(),
      detail: String(step?.detail || step?.value || '').trim()
    }))
    .filter(step => step.label || step.detail);
  if (!steps.length) return '';

  const title = String(example.title || 'Application example').trim();
  const intro = String(example.intro || '').trim();
  const ariaLabel = String(example.ariaLabel || title || 'Application example sequence').trim();
  return `
    <section class="analysis-process-example" aria-labelledby="analysisProcessExampleTitle">
      <h3 id="analysisProcessExampleTitle">${esc(title)}</h3>
      ${intro ? `<p class="analysis-process-intro">${esc(intro)}</p>` : ''}
      <div class="analysis-process-grid" role="list" aria-label="${esc(ariaLabel)}">
        ${steps.map((step, index) => `
          <div class="analysis-process-step" role="listitem">
            <span class="analysis-process-number" aria-hidden="true">${index + 1}</span>
            ${step.label ? `<strong>${esc(step.label)}</strong>` : ''}
            ${step.detail ? `<small>${esc(step.detail)}</small>` : ''}
          </div>`).join('')}
      </div>
    </section>`;
}

function buildBabbageAnalysisHTML(feedback, mock = false, mockReason = '', presentation = {}) {
  const d = parseBabbageDiagnosticSections(feedback);
  const badge = mock ? (mockReason === 'backend-unavailable' ? 'BACKEND FALLBACK ANALYSIS' : 'MOCK ANALYSIS COMPLETE') : 'ANALYSIS COMPLETE';
  const workedItems = pcNormalizeBabbageFindingItems(presentation?.workedItems);
  const issueItems = pcNormalizeBabbageFindingItems(presentation?.issueItems);
  const processExampleHTML = pcBuildBabbageProcessExampleHTML(presentation?.processExample);
  const title = String(presentation?.title || 'Scenario Diagnostic').trim();
  const reportTitle = String(presentation?.reportTitle || 'Babbage Analysis Report').trim();
  const inputTitle = String(presentation?.inputTitle || 'Repair brief submitted').trim();
  const submittedWork = String(presentation?.submittedWork || '').trim();
  const structuredCharacters = [...workedItems, ...issueItems]
    .map(item => `${item.label} ${item.detail}`)
    .join(' ');
  const totalCharacters = [d.status, d.confidence, d.summary, d.worked, d.issue, d.repair, d.impact, structuredCharacters]
    .join(' ')
    .length;
  const densityClass = totalCharacters > 1100
    ? 'analysis-report-very-dense'
    : totalCharacters > 820
      ? 'analysis-report-dense'
      : '';

  return `
    <div class="analysis-report ${densityClass}" data-analysis-characters="${totalCharacters}" data-print-report-title="${esc(reportTitle)}" data-print-input-title="${esc(inputTitle)}" data-print-submitted-work="${esc(submittedWork)}" role="document" aria-label="Babbage scenario diagnostic report">
      <header class="analysis-header">
        <div class="analysis-badge">${esc(badge)}</div>
        <h2 class="analysis-title">${esc(title)}</h2>
        <p class="analysis-summary">${esc(d.summary)}</p>
      </header>

      <div class="analysis-grid" aria-label="Diagnostic findings">
        <section class="analysis-card analysis-status-card compact">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">✓</span><span>Status</span></span>
          <div class="analysis-value big">${esc(d.status)}</div>
        </section>

        <section class="analysis-card analysis-confidence-card compact">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">◎</span><span>Confidence</span></span>
          <div class="analysis-value big">${esc(d.confidence)}</div>
          <div class="analysis-note">Babbage's confidence in this specific diagnosis.</div>
        </section>

        <section class="analysis-card analysis-worked-card">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">+</span><span>What Worked</span></span>
          ${pcBuildBabbageFindingHTML(d.worked, workedItems, 'PASS')}
        </section>

        <section class="analysis-card analysis-issue-card">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">!</span><span>Issue Detected</span></span>
          ${pcBuildBabbageFindingHTML(d.issue, issueItems, 'CHECK')}
        </section>

        <section class="analysis-card analysis-repair-card">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">↗</span><span>Recommended Repair</span></span>
          <div class="analysis-value">${esc(d.repair)}</div>
        </section>

        <section class="analysis-card analysis-impact-card wide">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">▥</span><span>Expected Impact</span></span>
          <div class="analysis-value">${esc(d.impact)}</div>
        </section>
      </div>
      ${processExampleHTML}
    </div>
  `;
}

function pcGetBabbagePrintContext() {
  let scenarioLabel = `Scenario ${Number(scenarioIndex || 0) + 1}`;
  try {
    const ui = typeof getScenarioUI === 'function' ? getScenarioUI(scenarioIndex) : null;
    scenarioLabel = ui?.tabLabel || ui?.missionTitle || scenarioLabel;
  } catch (e) {}

  const data = (typeof scenarioData !== 'undefined' && scenarioData?.[scenarioIndex])
    ? scenarioData[scenarioIndex]
    : {};
  const submittedWork = String(
    data?.repairText ||
    data?.revisedPrompt ||
    data?.revised_prompt ||
    data?.promptText ||
    data?.prompt_text ||
    lastPromptText ||
    document.getElementById('promptInput')?.value ||
    ''
  ).trim();

  return { scenarioLabel, submittedWork };
}

function pcPrintCurrentBabbageReport() {
  const report = document.querySelector('#babbageTerminalOutput .analysis-report');
  const pathReport = document.getElementById('pcS1WeekPlanAnalysis');
  if (!report && !pathReport) return false;

  let { scenarioLabel, submittedWork } = pcGetBabbagePrintContext();
  const printedAt = new Date().toLocaleString();
  const activeReport = report || pathReport;
  const textOf = selector => String(activeReport.querySelector(selector)?.textContent || '').trim();
  const cardValue = selector => String(report.querySelector(`${selector} .analysis-value`)?.textContent || '').trim();
  const cardNote = selector => String(report.querySelector(`${selector} .analysis-note`)?.textContent || '').trim();

  let reportTitle = 'Babbage Analysis Report';
  let inputTitle = 'Repair brief submitted';
  let summary = '';
  let status = '';
  let confidence = '';
  let confidenceNote = '';
  let whatWorked = '';
  let whatWorkedItems = [];
  let issue = '';
  let issueItems = [];
  let repair = '';
  let impact = '';
  let sharedProcessExampleSection = '';

  if (report) {
    const renderedFindingItems = selector => [...report.querySelectorAll(`${selector} .analysis-finding-row`)]
      .map(item => ({
        label: String(item.querySelector('.analysis-finding-copy strong')?.textContent || '').trim(),
        detail: String(item.querySelector('.analysis-finding-copy p')?.textContent || '').trim()
      }))
      .filter(item => item.label || item.detail);
    const renderedProcessExample = report?.querySelector('.analysis-process-example');

    reportTitle = String(report.dataset.printReportTitle || reportTitle).trim();
    inputTitle = String(report.dataset.printInputTitle || inputTitle).trim();
    submittedWork = String(report.dataset.printSubmittedWork || submittedWork).trim();
    summary = textOf('.analysis-summary');
    status = cardValue('.analysis-status-card');
    confidence = cardValue('.analysis-confidence-card');
    confidenceNote = cardNote('.analysis-confidence-card');
    whatWorked = cardValue('.analysis-worked-card');
    whatWorkedItems = renderedFindingItems('.analysis-worked-card');
    issue = cardValue('.analysis-issue-card');
    issueItems = renderedFindingItems('.analysis-issue-card');
    repair = cardValue('.analysis-repair-card');
    impact = cardValue('.analysis-impact-card');

    if (renderedProcessExample) {
      const processTitle = String(renderedProcessExample.querySelector('h3')?.textContent || 'Application example').trim();
      const processIntro = String(renderedProcessExample.querySelector('.analysis-process-intro')?.textContent || '').trim();
      const processLabel = String(renderedProcessExample.querySelector('.analysis-process-grid')?.getAttribute('aria-label') || processTitle).trim();
      const processSteps = [...renderedProcessExample.querySelectorAll('.analysis-process-step')]
        .map((step, index) => ({
          number: String(step.querySelector('.analysis-process-number')?.textContent || index + 1).trim(),
          label: String(step.querySelector('strong')?.textContent || '').trim(),
          detail: String(step.querySelector('small')?.textContent || '').trim()
        }))
        .filter(step => step.label || step.detail);
      if (processSteps.length) {
        sharedProcessExampleSection = `
          <section class="pc-print-section pc-print-path-example">
            <h2>${esc(processTitle)}</h2>
            ${processIntro ? `<p class="pc-print-path-intro">${esc(processIntro)}</p>` : ''}
            <div class="pc-print-path-grid" role="list" aria-label="${esc(processLabel)}">
              ${processSteps.map(step => `<div class="pc-print-path-step" role="listitem"><span>${esc(step.number)}</span><strong>${esc(step.label)}</strong>${step.detail ? `<small>${esc(step.detail)}</small>` : ''}</div>`).join('')}
            </div>
          </section>`;
      }
    }
  } else {
    const criterionItems = selector => [...pathReport.querySelectorAll(selector)]
      .map(item => ({
        label: String(item.querySelector('strong')?.textContent || '').trim(),
        detail: String(item.querySelector('p')?.textContent || '').trim()
      }))
      .filter(item => item.label || item.detail);
    const teachingPoints = [...pathReport.querySelectorAll('.pc-s1-reflection-teaching-point p')]
      .map(item => String(item.textContent || '').trim())
      .filter(Boolean);

    reportTitle = textOf('.pc-s1-reflection-analysis-header h2') || 'Module Path Analysis';
    inputTitle = 'Module path submitted';
    scenarioLabel = 'Scenario 1 · Module Path';
    const submittedPath = pathReport.querySelector('.pc-s1-reflection-response blockquote');
    submittedWork = String(submittedPath?.innerText || submittedPath?.textContent || '').trim() || submittedWork;
    summary = textOf('.pc-s1-reflection-focus h3');
    status = textOf('.pc-s1-reflection-analysis-verdict').replace(/^STATUS:\s*/i, '');
    confidence = textOf('.pc-s1-reflection-analysis-kicker').replace(/^LEARNING PATH SIGNALS\s*·\s*/i, '');
    whatWorkedItems = criterionItems('.pc-s1-reflection-feedback li.is-met');
    issueItems = criterionItems('.pc-s1-reflection-feedback li.is-missing');
    repair = teachingPoints[0] || '';
    impact = teachingPoints[1] || '';
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;
  try { printWindow.opener = null; } catch (e) {}

  const workBlocks = String(submittedWork || '')
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const match = line.match(/^([^:]{2,48}:)(\s*)(.*)$/);
      if (match) {
        return `<p class="pc-print-work-line"><strong>${esc(match[1])}</strong> ${esc(match[3])}</p>`;
      }
      return `<p class="pc-print-work-line${index === 0 ? ' pc-print-work-opening' : ''}">${esc(line)}</p>`;
    })
    .join('');

  const inputSection = workBlocks
    ? `<section class="pc-print-section pc-print-input">
        <h2>${esc(inputTitle)}</h2>
        <div class="pc-print-work">${workBlocks}</div>
      </section>`
    : '';

  // The uploaded baseline does not contain a licensed GFC image file. Keep the
  // existing text affiliation and omit the formerly broken image dependency.
  const logoHTML = '';

  const finding = (label, value, className = '', items = []) => {
    const validItems = Array.isArray(items) ? items.filter(item => item?.label || item?.detail) : [];
    if (!value && !validItems.length) return '';
    const content = validItems.length
      ? `<div class="pc-print-finding-list">${validItems.map(item => `
          <div class="pc-print-finding-row">
            <span class="pc-print-finding-status">${className === 'issue' ? 'CHECK' : 'PASS'}</span>
            <div><strong>${esc(item.label)}</strong>${item.detail ? `<p>${esc(item.detail)}</p>` : ''}</div>
          </div>`).join('')}</div>`
      : `<p>${esc(value)}</p>`;
    return `<section class="pc-print-finding ${className}"><h3>${esc(label)}</h3>${content}</section>`;
  };

  const pathExampleSection = pathReport ? `
    <section class="pc-print-section pc-print-path-example">
      <h2>Suggested Canvas module layout</h2>
      <p class="pc-print-path-intro">Use one visible sequence so students can tell where to begin, how to prepare, what to submit, and what happens next.</p>
      <div class="pc-print-path-grid" role="list" aria-label="Suggested Canvas module sequence">
        <div class="pc-print-path-step" role="listitem"><span>1</span><strong>START HERE</strong><small>Overview + first action</small></div>
        <div class="pc-print-path-step" role="listitem"><span>2</span><strong>LEARN</strong><small>Readings + media</small></div>
        <div class="pc-print-path-step" role="listitem"><span>3</span><strong>PRACTICE</strong><small>Worked example + low-stakes check</small></div>
        <div class="pc-print-path-step" role="listitem"><span>4</span><strong>SUBMIT</strong><small>Task + criteria + submission location</small></div>
        <div class="pc-print-path-step" role="listitem"><span>5</span><strong>CONTINUE</strong><small>Feedback + reflection + next step</small></div>
      </div>
    </section>` : '';

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>PromptCraft · Babbage Analysis Report · ${esc(scenarioLabel)}</title>
  <style>
    :root{color-scheme:light;--navy:#112650;--navy-deep:#081a36;--blue:#086c9f;--sky:#59b7e3;--sky-pale:#edf7fc;--gold:#e6a51d;--gold-pale:#fff7e2;--ink:#172236;--muted:#607083;--paper:#fff;--line:#cad6df;}
    *{box-sizing:border-box}html,body{margin:0;padding:0}body{background:#eef3f7;color:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.52;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .pc-print-toolbar{display:flex;justify-content:flex-end;max-width:900px;margin:14px auto;padding:0 4px}.pc-print-toolbar button{padding:10px 16px;border:2px solid var(--gold);border-radius:7px;background:var(--navy);color:#fff;font-weight:800;cursor:pointer}
    .pc-print-shell{max-width:900px;margin:0 auto 36px;background:var(--paper);box-shadow:0 14px 40px rgba(8,26,54,.12)}
    .pc-print-header{padding:28px 34px 22px;border-top:8px solid var(--navy);border-bottom:3px solid var(--gold)}
    .pc-print-brand-row{display:flex;align-items:center;gap:18px;margin-bottom:17px}.pc-print-logo{width:68px;height:68px;object-fit:contain;flex:0 0 auto}.pc-print-brand-text{min-width:0}.pc-print-brand{font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--blue)}.pc-print-affiliation{margin-top:3px;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
    .pc-print-title{margin:0;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.05;color:var(--navy)}.pc-print-meta{margin:8px 0 0;color:var(--muted);font-size:12.5px}
    .pc-print-body{padding:27px 34px 30px}.pc-print-section{margin:0 0 26px}.pc-print-section>h2{margin:0 0 12px;padding-bottom:6px;border-bottom:2px solid var(--navy);font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.2;color:var(--navy)}
    .pc-print-summary{margin:0 0 17px;font-size:14.5px;line-height:1.55;color:#28384b}.pc-print-glance{display:grid;grid-template-columns:1.25fr .75fr;gap:16px;padding:14px 16px;border:1px solid var(--line);border-left:5px solid var(--blue);background:#f8fbfd}.pc-print-glance-item{min-width:0}.pc-print-label{display:block;margin-bottom:4px;font-size:9.5px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--blue)}.pc-print-glance strong{display:block;font-size:14.5px;line-height:1.3;color:var(--navy)}.pc-print-glance small{display:block;margin-top:4px;color:var(--muted);font-size:11.5px;line-height:1.4}
    .pc-print-findings{margin-top:4px}.pc-print-finding{padding:0 0 15px;margin:0 0 15px;border-bottom:1px solid var(--line);break-inside:avoid;page-break-inside:avoid}.pc-print-finding:last-child{margin-bottom:0;border-bottom:0}.pc-print-finding h3{margin:0 0 7px;font-size:11px;font-weight:900;letter-spacing:.09em;text-transform:uppercase;color:var(--blue)}.pc-print-finding>p{margin:0;font-size:13.5px;line-height:1.52;color:#263548}.pc-print-finding.issue h3{color:#a34d27}.pc-print-finding.repair h3{color:#8a5d08}.pc-print-finding.impact h3{color:var(--navy)}
    .pc-print-finding-list{display:grid;gap:6px}.pc-print-finding-row{display:grid;grid-template-columns:52px minmax(0,1fr);gap:10px;align-items:start;padding:8px 10px;border:1px solid #cfe0e9;border-left:4px solid var(--blue);background:#f8fbfd;break-inside:avoid;page-break-inside:avoid}.pc-print-finding-status{display:inline-grid;place-items:center;min-height:22px;padding:3px 5px;border-radius:3px;background:#e5f4eb;color:#087542;font-size:8.5px;font-weight:900;letter-spacing:.08em}.pc-print-finding-row strong{display:block;color:var(--navy);font-size:12.5px;line-height:1.3}.pc-print-finding-row p{margin:2px 0 0;color:#405166;font-size:12px;line-height:1.4}.pc-print-finding.issue .pc-print-finding-row{border-left-color:#a34d27;background:#fff8f4}.pc-print-finding.issue .pc-print-finding-status{background:#f8e5dc;color:#94401e}
    .pc-print-path-example{break-inside:avoid;page-break-inside:avoid}.pc-print-path-intro{margin:0 0 12px;color:#405166;font-size:12.5px}.pc-print-path-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}.pc-print-path-step{position:relative;min-width:0;padding:10px 8px;border:1px solid #b9d5e4;border-top:4px solid var(--blue);background:var(--sky-pale);text-align:center;break-inside:avoid}.pc-print-path-step span{display:grid;place-items:center;width:22px;height:22px;margin:0 auto 6px;border-radius:50%;background:var(--navy);color:#fff;font-size:10px;font-weight:900}.pc-print-path-step strong{display:block;color:var(--navy);font-size:10px;letter-spacing:.04em}.pc-print-path-step small{display:block;margin-top:4px;color:#4d6074;font-size:9.5px;line-height:1.3}
    .pc-print-input{margin-top:29px;padding-top:2px}.pc-print-work{padding:14px 16px;border:1px solid #b9d5e4;border-left:5px solid var(--sky);background:var(--sky-pale);color:#263548;font-size:12.5px;line-height:1.5}.pc-print-work-line{margin:0 0 8px;break-inside:avoid;page-break-inside:avoid}.pc-print-work-line:last-child{margin-bottom:0}.pc-print-work-line strong{color:var(--navy)}.pc-print-work-opening{font-weight:600}
    .pc-print-footer{margin-top:30px;padding:12px 0 0;border-top:2px solid var(--gold);color:#5d6a79;font-size:10.5px;line-height:1.4}.pc-print-footer strong{color:var(--navy)}
    @media(max-width:680px){.pc-print-header,.pc-print-body{padding-left:22px;padding-right:22px}.pc-print-title{font-size:29px}.pc-print-glance{grid-template-columns:1fr}.pc-print-path-grid{grid-template-columns:1fr}.pc-print-path-step{text-align:left}.pc-print-path-step span{display:inline-grid;margin:0 8px 0 0;vertical-align:middle}.pc-print-path-step strong{display:inline}.pc-print-brand-row{align-items:flex-start}.pc-print-logo{width:54px;height:54px}}
    @media print{body{background:#fff;font-size:11.5pt}.pc-print-toolbar{display:none}.pc-print-shell{max-width:none;margin:0;box-shadow:none}.pc-print-header{padding:0 0 16px;border-top:0;border-bottom:2.5px solid var(--gold)}.pc-print-brand-row{margin-bottom:13px}.pc-print-logo{width:58px;height:58px}.pc-print-title{font-size:27pt}.pc-print-meta{font-size:9pt}.pc-print-body{padding:18px 0 0}.pc-print-section{margin-bottom:19px}.pc-print-section>h2{font-size:15pt}.pc-print-summary{font-size:10.5pt}.pc-print-glance{padding:10px 12px;gap:12px}.pc-print-glance strong{font-size:10.5pt}.pc-print-finding{padding-bottom:10px;margin-bottom:10px}.pc-print-finding>p{font-size:10pt;line-height:1.43}.pc-print-finding-row{padding:6px 8px}.pc-print-finding-row strong{font-size:9.5pt}.pc-print-finding-row p{font-size:9pt}.pc-print-path-intro{font-size:9pt}.pc-print-input{margin-top:18px}.pc-print-work{padding:10px 12px;font-size:9.5pt}.pc-print-footer{margin-top:20px;font-size:8pt}@page{size:auto;margin:.58in .62in}}
  </style>
</head>
<body>
  <div class="pc-print-toolbar"><button type="button" onclick="window.print()">Print / Save PDF</button></div>
  <main class="pc-print-shell">
    <header class="pc-print-header">
      <div class="pc-print-brand-row">
        ${logoHTML}
        <div class="pc-print-brand-text">
          <div class="pc-print-brand">PromptCraft · The Prompt Lab</div>
          <div class="pc-print-affiliation">Great Falls College Montana State University</div>
        </div>
      </div>
      <h1 class="pc-print-title">${esc(reportTitle)}</h1>
      <p class="pc-print-meta">${esc(scenarioLabel)} · Generated ${esc(printedAt)}</p>
    </header>
    <div class="pc-print-body">
      <section class="pc-print-section">
        <h2>Analysis summary</h2>
        ${summary ? `<p class="pc-print-summary">${esc(summary)}</p>` : ''}
        <div class="pc-print-glance">
          <div class="pc-print-glance-item"><span class="pc-print-label">Status</span><strong>${esc(status || 'Analysis complete')}</strong></div>
          <div class="pc-print-glance-item"><span class="pc-print-label">Confidence</span><strong>${esc(confidence || 'Not stated')}</strong>${confidenceNote ? `<small>${esc(confidenceNote)}</small>` : ''}</div>
        </div>
      </section>
      <section class="pc-print-section pc-print-findings">
        <h2>Diagnostic findings</h2>
        ${finding('What worked', whatWorked, 'worked', whatWorkedItems)}
        ${finding('Issue detected', issue, 'issue', issueItems)}
        ${finding('Recommended repair', repair, 'repair')}
        ${finding('Expected impact', impact, 'impact')}
      </section>
      ${pathExampleSection}
      ${sharedProcessExampleSection}
      ${inputSection}
      <footer class="pc-print-footer"><strong>Instructional judgment still matters.</strong> Babbage feedback is an AI-supported diagnostic aid. Review recommendations using your course context, student needs, and professional judgment.</footer>
    </div>
  </main>
</body>
</html>`);
  printWindow.document.close();
  try {
    const printUrl = new URL(window.location.href);
    printUrl.search = '';
    printUrl.hash = 'babbage-analysis-report';
    printWindow.history.replaceState(null, '', printUrl.href);
  } catch (e) {}
  printWindow.focus();

  const images = Array.from(printWindow.document.images || []);
  Promise.all(images.map(img => img.complete
    ? Promise.resolve()
    : new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      })
  )).finally(() => {
    window.setTimeout(() => {
      try { printWindow.print(); } catch (e) {}
    }, 120);
  });
  return true;
}

function showBabbageTerminalReport({
  reportHTML = '',
  terminalStateText = 'ANALYSIS COMPLETE',
  engineLabel = 'BABBAGE ENGINE',
  speakerName = 'Professor Pixel',
  onClose = null,
  readLabel = '🔊 Read Analysis',
  printLabel = '',
  continueLabel = 'Continue',
  ariaLabel = 'Babbage analysis report',
  closeHandoff = 'app'
} = {}) {
  babbageTerminalCloseCallback = typeof onClose === 'function' ? onClose : null;
  babbageTerminalCloseHandoff = closeHandoff === 'vn' ? 'vn' : 'app';

  // V429 GFC QA: A report can be revealed from several VN states. Reassert
  // the shared Babbage computer shell before text mode so a stale smartboard
  // or dialogue state can never remain visible underneath report controls.
  pcSetVNOverlayState({ active: true, modes: ['babbage-terminal-consult'] });
  setBabbageTerminalTextMode(true);
  setBabbageTerminalState('responding', engineLabel, esc(terminalStateText));

  const output = document.getElementById('babbageTerminalOutput');
  if (output) {
    output.classList.add('babbage-analysis-layout');
    output.setAttribute('aria-label', ariaLabel);
    output.innerHTML = reportHTML;
  }

  requestAnimationFrame(() => {
    const reportOverlay = document.getElementById('vnOverlay');
    if (reportOverlay?.classList.contains('active')) {
      reportOverlay.classList.add('babbage-terminal-consult', 'babbage-terminal-textmode');
    }
    pcScheduleAnalysisLayout({ immediate: true });
    const screen = output?.closest('.babbage-terminal-screen');
    if (screen) screen.scrollTop = 0;
    if (output) output.scrollTop = 0;
  });

  // v423: Font metrics can settle after the first report pass. Re-run the
  // shared layout once fonts are ready so long user/AI text cannot outgrow a
  // card after its initial measurements were captured.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      if (output?.classList.contains('babbage-analysis-layout') && pcIsAnalysisReportActive()) {
        pcScheduleAnalysisLayout({ immediate: true });
      }
    }).catch(() => {});
  }

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = speakerName;

  const vnText = document.getElementById('vnText');
  if (vnText) {
    const readButton = readLabel
      ? `<button id="babbageTTSBtn" class="babbage-tts-btn" type="button" data-pc-action="toggle-babbage-tts" data-pc-stop-propagation="true">${esc(readLabel)}</button>`
      : '';
    const printButton = printLabel
      ? `<button class="babbage-tts-btn babbage-print-btn" type="button" data-pc-action="print-babbage-report" data-pc-stop-propagation="true">${esc(printLabel)}</button>`
      : '';
    vnText.innerHTML = `
      ${readButton}
      ${printButton}
      <button class="vn-return-btn terminal-return" type="button" data-pc-action="close-babbage-consult" data-pc-stop-propagation="true">${esc(continueLabel)}</button>
    `;
    pcScheduleScenarioTask(() => vnText.querySelector('.vn-return-btn')?.focus({ preventScroll: true }), 100);
    pcScheduleAnalysisLayout();
  }

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');
  return true;
}

function showBabbageConsultResult(feedback, mock = false, onClose = null, mockReason = '') {
  const label = mock ? (mockReason === 'backend-unavailable' ? 'BACKEND FALLBACK ANALYSIS' : 'MOCK ANALYSIS COMPLETE') : 'ANALYSIS COMPLETE';
  const terminalText = `${label}

${terminalizeBabbageText(feedback)}`;
  return showBabbageTerminalReport({
    reportHTML: buildBabbageAnalysisHTML(terminalText, mock, mockReason),
    terminalStateText: terminalText,
    engineLabel: mock ? 'MOCK BABBAGE ENGINE' : 'BABBAGE ENGINE',
    speakerName: 'Professor Pixel',
    onClose,
    readLabel: '🔊 Read Analysis',
    printLabel: 'Print / Save PDF',
    continueLabel: 'Continue',
    ariaLabel: 'Babbage scenario diagnostic report',
    closeHandoff: 'vn'
  });
}

// NOTE: Terminal diagnosis copy is still inline. Candidate for dialogue.js or scenario-data.js.
function showBabbageFinalResponseInTerminal(responseText, mock = false, onClose = null, scoreTotal = null, mockReason = '', structuredAnalysis = null) {
  // Scenario-specific result handoff: the metacognition scenario uses the shared terminal flow.
  let effectiveClose = onClose;
  if (scenarioIndex === SCENARIO_INDEX.METACOGNITION) {
    effectiveClose = function() {
      addS2BabbageResultCard(responseText);
      if (typeof onClose === 'function') onClose();
    };
  }
  // If the thinking screen is already open, keep it and swap to the result quickly.
  const overlay = document.getElementById('vnOverlay');
  if (!overlay || !overlay.classList.contains('active')) {
    showBabbageConsultOverlay('Scenario diagnosis');
  }
  // V360: the progress bar now follows the real Babbage request lifecycle.
  // By the time this function runs the response has arrived; briefly show the
  // final parsing/rendering stages, then reveal the report.
  pcMarkBabbageResponseParsed();
  const babbageProcessingHoldMs = pcGetBabbageProcessingHoldMs();

  const resultScenario = scenarioIndex;
  pcScheduleScenarioTask(() => {
    pcCompleteBabbageAnalysisProgress();
    const terminalOutput = scenarioIndex === SCENARIO_INDEX.CONTENT_AVALANCHE && typeof scoreTotal === 'number'
      ? buildS1TerminalDiagnosis(scoreTotal, responseText, structuredAnalysis)
      : responseText;
    pcScheduleScenarioTask(() => {
      showBabbageConsultResult(terminalOutput, mock, effectiveClose, mockReason);
    }, Math.min(180, babbageProcessingHoldMs), resultScenario);
  }, Math.min(180, babbageProcessingHoldMs), resultScenario);
}

// NOTE: Pixel score-reflection dialogue is still inline. Candidate for dialogue.js pass 2.
function closeBabbageConsultOverlay() {
  const cb = babbageTerminalCloseCallback;
  const handoff = babbageTerminalCloseHandoff;
  babbageTerminalCloseCallback = null;
  babbageTerminalCloseHandoff = 'app';
  const directVNHandoff = typeof cb === 'function' && handoff === 'vn';

  pcClearAnalysisLayout();

  // Completed reports have two legitimate destinations: another VN line or an
  // application/workbench screen. Keeping the overlay active is correct only
  // for a direct VN handoff. Treating every callback as VN left S2's report
  // controls stranded over its smartboard after the app workspace had already
  // rendered underneath. The handoff contract now owns that distinction.
  pcSetVNOverlayState({ active: directVNHandoff });
  pcResetVNCharacters();
  pcResetVNDialogueState();
  setBabbageShelfState('idle', 'idle');
  setBabbageTerminalTextMode(false);
  setBabbageTerminalState('idle', 'BABBAGE ENGINE', 'IDLE');

  if (directVNHandoff) {
    cb();
    return;
  }

  const vnText = document.getElementById('vnText');
  if (vnText) vnText.innerHTML = '';
  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');

  musicEndVN();
  if (typeof cb === 'function') cb();
  document.getElementById('promptInput')?.focus();
}

pcRegisterUIActions({
  'toggle-babbage-tts': () => toggleBabbageTTS(),
  'print-babbage-report': () => pcPrintCurrentBabbageReport(),
  'open-ideas-wall': () => window.open('wall.html', '_blank', 'noopener,noreferrer'),
  'close-babbage-consult': () => closeBabbageConsultOverlay()
});

function setBabbageShelfState(state = 'idle', label = '') {
  const shelf = document.getElementById('babbageShelf');
  const status = document.getElementById('babbageShelfStatus');
  if (!shelf) return;
  shelf.classList.remove('idle', 'thinking', 'responding');
  shelf.classList.add(state);
  if (status) status.textContent = label || state;
}

function vnShow(expression, text, onComplete, meta = {}) {
  // Add to queue. Meta keeps the shared VN system backward compatible while
  // allowing any scenario line to identify a secondary speaker.
  vnQueue.push({ expression, text, onComplete, ...meta });
  if (!vnTyping) vnPlayNext();
}

function vnPlayNext() {
  if (vnQueue.length === 0) {
    pcScheduleScenarioTask(() => {
      // A dialogue completion callback can launch Babbage or another explicit
      // VN handoff before this delayed cleanup fires. Never close that newer
      // state just because the old dialogue queue is empty.
      if (typeof pcVNHasActiveHandoff === 'function' && pcVNHasActiveHandoff()) return;
      pcSetVNOverlayState({ active: false });
      pcResetVNCharacters();
      pcResetVNDialogueState();
      document.getElementById('promptInput')?.focus();
      // Fade music down when VN closes
      musicEndVN();
      setBabbageShelfState('idle', 'idle');
    }, 300);
    vnTyping = false;
    return;
  }

  const { expression, text, onComplete, speaker = 'Professor Pixel', character = 'pixel', cast = null, entrance = '' } = vnQueue.shift();
  vnOnComplete = onComplete || null;
  vnTyping = true;

  const overlay = pcSetVNOverlayState({
    active: true,
    preserve: ['scenario-intro-active']
  });

  // Reset Babbage modes, then configure the active VN speaker. Dual-cast scenes keep
  // the secondary character opposite Pixel on wide screens and show one on small screens.
  setBabbageTerminalTextMode(false);

  // Fade music up when VN opens
  musicStartVN();
  setBabbageShelfState('idle', 'idle');

  // S1 chains several dialogue sequences across the same Canvas evidence scene.
  // A queue handoff must not collapse the dual cast or restore the generic
  // challenge card. Reassert both pieces after the shared VN mode reset.
  const sceneCast = typeof pcGetS1CanvasDialogueCast === 'function' &&
    pcS1CanvasDialogueMode && scenarioIndex === SCENARIO_INDEX.CONTENT_AVALANCHE
    ? (Array.isArray(cast) && cast.length ? cast : pcGetS1CanvasDialogueCast())
    : cast;
  vnSetDialogueCharacter(character, expression, speaker, sceneCast);
  if (entrance && typeof pcAnimateVNCharacterEntrance === 'function') {
    pcAnimateVNCharacterEntrance(character, entrance);
  }
  if (typeof pcRestoreS1CanvasDialogueScene === 'function') pcRestoreS1CanvasDialogueScene();
  requestAnimationFrame(() => {
    // Responsive geometry remains owned by the shared S1 VN layout. The cast
    // renderer only decides which character art occupies each reusable slot.
    pcApplyIpadLayout();
  });

  setTimeout(() => {
    pcFocusWithoutScroll(document.getElementById('vnDialogue'));
  }, 100);

  document.getElementById('vnAdvanceHint').classList.remove('show');

  vnFullText = text;
  vnCurrentText = '';
  document.getElementById('vnText').innerHTML = '';
  vnTypeWriter(text);
}
