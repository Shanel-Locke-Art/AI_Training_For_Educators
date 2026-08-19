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

function buildBabbageAnalysisHTML(feedback, mock = false, mockReason = '') {
  const d = parseBabbageDiagnosticSections(feedback);
  const badge = mock ? (mockReason === 'backend-unavailable' ? 'BACKEND FALLBACK ANALYSIS' : 'MOCK ANALYSIS COMPLETE') : 'ANALYSIS COMPLETE';
  const totalCharacters = [d.status, d.confidence, d.summary, d.worked, d.issue, d.repair, d.impact]
    .join(' ')
    .length;
  const densityClass = totalCharacters > 1100
    ? 'analysis-report-very-dense'
    : totalCharacters > 820
      ? 'analysis-report-dense'
      : '';

  return `
    <div class="analysis-report ${densityClass}" data-analysis-characters="${totalCharacters}" role="document" aria-label="Babbage scenario diagnostic report">
      <header class="analysis-header">
        <div class="analysis-badge">${esc(badge)}</div>
        <h2 class="analysis-title">Scenario Diagnostic</h2>
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
          <div class="analysis-value">${esc(d.worked)}</div>
        </section>

        <section class="analysis-card analysis-issue-card">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">!</span><span>Issue Detected</span></span>
          <div class="analysis-value">${esc(d.issue)}</div>
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
  if (!report) return false;

  const { scenarioLabel, submittedWork } = pcGetBabbagePrintContext();
  const printedAt = new Date().toLocaleString();
  const reportClone = report.cloneNode(true);
  reportClone.querySelectorAll('button, [data-pc-action]').forEach(el => el.remove());

  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;
  try { printWindow.opener = null; } catch (e) {}

  let printLogoUrl = '';
  try {
    printLogoUrl = new URL('assets/images/brand/great-falls-college-logo.jpg', window.location.href).href;
  } catch (e) {}

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
    ? `<section class="pc-print-input"><div class="pc-print-section-label">Input provided to Babbage</div><div class="pc-print-work">${workBlocks}</div></section>`
    : '';

  const logoHTML = printLogoUrl
    ? `<img class="pc-print-logo" src="${esc(printLogoUrl)}" alt="Great Falls College Montana State University">`
    : '';

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>PromptCraft · Babbage Diagnosis · ${esc(scenarioLabel)}</title>
  <style>
    :root{color-scheme:light;--navy:#112650;--navy-deep:#081a36;--blue:#086c9f;--sky:#59b7e3;--sky-pale:#e9f5fb;--gold:#e6a51d;--gold-pale:#fff4d5;--ink:#172236;--muted:#5f6e7f;--paper:#fffdf8;--line:#b9c9d6;}
    *{box-sizing:border-box}html,body{margin:0;padding:0}body{background:#edf2f6;color:var(--ink);font-family:Arial,Helvetica,sans-serif;line-height:1.42;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .pc-print-shell{max-width:940px;margin:0 auto 32px;background:#fff;box-shadow:0 14px 42px rgba(8,26,54,.13)}
    .pc-print-brand{display:grid;grid-template-columns:108px 1fr;gap:24px;align-items:center;padding:24px 30px 20px;border-top:9px solid var(--navy);border-bottom:4px solid var(--gold);background:linear-gradient(105deg,#f8fbfd,#fff 68%)}
    .pc-print-logo{display:block;width:100px;height:100px;object-fit:contain}
    .pc-print-brand-copy{min-width:0}.pc-print-kicker{margin:0 0 3px;font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--blue)}
    .pc-print-title{margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.05;color:var(--navy)}
    .pc-print-meta{margin:7px 0 0;color:var(--muted);font-size:12.5px;font-weight:600}
    .pc-print-content{padding:25px 30px 30px}
    .pc-print-input{margin:22px 0 0;padding:16px 18px 14px;border:1px solid #c7d7e2;border-left:6px solid var(--blue);border-radius:8px;background:var(--sky-pale)}
    .pc-print-section-label{margin:0 0 9px;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--navy)}
    .pc-print-work{font-size:12.5px;line-height:1.42;color:#263547}.pc-print-work-line{margin:0 0 7px}.pc-print-work-line:last-child{margin-bottom:0}.pc-print-work-line strong{color:var(--navy)}.pc-print-work-opening{font-weight:600}
    .analysis-report{margin:0}.analysis-header{margin:0 0 14px;padding:16px 18px 15px;border-radius:10px;background:var(--navy);color:#fff;break-after:avoid}
    .analysis-badge{display:inline-block;margin:0 0 7px;padding:3px 8px;border:1px solid var(--gold);border-radius:999px;background:rgba(255,255,255,.08);font-size:9.5px;font-weight:900;letter-spacing:.11em;text-transform:uppercase;color:#ffe5a4}
    .analysis-title{margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:25px;line-height:1.08;color:#fff}.analysis-summary{margin:0;color:#e8f3fa;font-size:12.5px;line-height:1.38}
    .analysis-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:start}.analysis-card{padding:13px 14px 12px;border:1px solid var(--line);border-top:4px solid var(--sky);border-radius:8px;background:#fff;break-inside:avoid;page-break-inside:avoid}
    .analysis-card.wide,.analysis-impact-card,.analysis-worked-card{grid-column:1/-1}.analysis-label{display:flex;align-items:center;gap:5px;margin:0 0 6px;font-size:9.5px;font-weight:900;letter-spacing:.09em;text-transform:uppercase;color:var(--blue)}.analysis-icon{margin:0;color:var(--gold-dark,#98670d)}
    .analysis-value{font-size:12.5px;line-height:1.34;color:#1c2b3b}.analysis-value.big{font-size:14px;font-weight:800;color:var(--navy)}.analysis-note{margin-top:5px;color:var(--muted);font-size:10.5px;line-height:1.34}
    .analysis-issue-card{border-top-color:#d66b39;background:#fffaf7}.analysis-repair-card{border-top-color:var(--gold);background:#fffdf6}.analysis-impact-card{border-top-color:var(--blue);background:#f8fcff}.analysis-worked-card{border-top-color:var(--navy);background:#f6f8fb}
    .pc-print-footer{margin:24px 0 0;padding:12px 15px;border-top:2px solid var(--gold);background:#f6f8fb;color:#536273;font-size:10.5px;line-height:1.35;break-inside:avoid;page-break-inside:avoid}
    .pc-print-toolbar{display:flex;justify-content:flex-end;gap:10px;max-width:940px;margin:16px auto;padding:0 8px}.pc-print-toolbar button{padding:10px 16px;border:2px solid var(--gold);border-radius:7px;background:var(--navy);color:#fff;font-weight:800;cursor:pointer}
    @media(max-width:680px){.pc-print-brand{grid-template-columns:78px 1fr;padding:20px}.pc-print-logo{width:72px;height:72px}.pc-print-content{padding:20px}.analysis-grid{grid-template-columns:1fr}.analysis-card,.analysis-card.wide,.analysis-impact-card,.analysis-worked-card{grid-column:1}.pc-print-title{font-size:27px}}
    @media print{body{background:#fff}.pc-print-toolbar{display:none}.pc-print-shell{max-width:none;margin:0;box-shadow:none}.pc-print-brand{padding:0 0 14px;margin:0 0 17px;border-top:0;border-bottom:3px solid var(--gold);background:#fff}.pc-print-logo{width:86px;height:86px}.pc-print-content{padding:0}.pc-print-input{margin:0;padding:12px 14px;break-before:page;page-break-before:always}.analysis-header{padding:13px 15px}.analysis-grid{display:block}.analysis-card,.analysis-card.wide,.analysis-impact-card,.analysis-worked-card{display:block;width:100%;margin:0 0 8px;padding:10px 11px 9px}.pc-print-footer{margin-top:14px}@page{size:auto;margin:.52in .58in}}
  </style>
</head>
<body>
  <div class="pc-print-toolbar"><button type="button" onclick="window.print()">Print / Save PDF</button></div>
  <main class="pc-print-shell">
    <header class="pc-print-brand">
      ${logoHTML}
      <div class="pc-print-brand-copy">
        <div class="pc-print-kicker">PromptCraft · The Prompt Lab</div>
        <h1 class="pc-print-title">Babbage Diagnosis</h1>
        <p class="pc-print-meta">${esc(scenarioLabel)} · Generated ${esc(printedAt)}</p>
      </div>
    </header>
    <div class="pc-print-content">
      ${reportClone.outerHTML}
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
    printUrl.hash = 'babbage-diagnosis';
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
  // Scenario-specific result handoff: S2 currently uses the shared terminal flow.
  let effectiveClose = onClose;
  if (scenarioIndex === 1) {
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
    const terminalOutput = scenarioIndex === 0 && typeof scoreTotal === 'number'
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

  const { expression, text, onComplete, speaker = 'Professor Pixel', character = 'pixel', cast = null } = vnQueue.shift();
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

  vnSetDialogueCharacter(character, expression, speaker, cast);
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
