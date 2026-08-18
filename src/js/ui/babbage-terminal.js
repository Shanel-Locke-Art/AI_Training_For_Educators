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

  const inputSection = submittedWork
    ? `<section class="pc-print-input"><h2>Your prompt / repair</h2><div>${esc(submittedWork).replace(/\n/g, '<br>')}</div></section>`
    : '';

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>PromptCraft · Babbage Diagnosis · ${esc(scenarioLabel)}</title>
  <style>
    :root{color-scheme:light;}*{box-sizing:border-box;}body{margin:0;background:#f4f1e8;color:#1e2821;font-family:Arial,Helvetica,sans-serif;line-height:1.5;}
    .pc-print-shell{max-width:920px;margin:0 auto;padding:34px 42px 48px;background:#fff;min-height:100vh;}
    .pc-print-kicker{font-size:12px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:#356046;}
    .pc-print-title{margin:4px 0 4px;font-size:30px;line-height:1.1;color:#173d29;}.pc-print-meta{margin:0 0 24px;color:#687269;font-size:13px;}
    .pc-print-input{margin:0 0 24px;padding:18px 20px;border:1px solid #b8c7b9;border-left:5px solid #356046;background:#f7faf7;break-inside:avoid;}
    .pc-print-input h2{margin:0 0 8px;font-size:15px;color:#244b34;}.pc-print-input div{font-size:14px;white-space:normal;}
    .analysis-header{margin-bottom:18px}.analysis-badge{display:inline-block;padding:4px 8px;border:1px solid #356046;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#244b34;}
    .analysis-title{margin:8px 0 4px;font-size:24px;color:#173d29}.analysis-summary{margin:0;color:#4b574e;}
    .analysis-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.analysis-card{padding:16px;border:1px solid #bfc9c0;border-radius:8px;break-inside:avoid;background:#fff;}
    .analysis-card.wide,.analysis-impact-card,.analysis-worked-card{grid-column:1/-1}.analysis-label{display:block;margin-bottom:7px;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#356046}.analysis-icon{margin-right:6px}.analysis-value{font-size:14px}.analysis-value.big{font-size:16px;font-weight:700}.analysis-note{margin-top:7px;color:#687269;font-size:12px;}
    .pc-print-footer{margin-top:28px;padding-top:14px;border-top:1px solid #d6ddd6;color:#69736b;font-size:11px;}.pc-print-toolbar{display:flex;justify-content:flex-end;gap:10px;max-width:920px;margin:18px auto;padding:0 8px;}.pc-print-toolbar button{padding:10px 16px;border:0;border-radius:6px;background:#174b2f;color:#fff;font-weight:700;cursor:pointer;}
    @media(max-width:680px){.pc-print-shell{padding:24px 20px}.analysis-grid{grid-template-columns:1fr}.analysis-card,.analysis-card.wide,.analysis-impact-card,.analysis-worked-card{grid-column:1;}}
    @media print{body{background:#fff}.pc-print-toolbar{display:none}.pc-print-shell{max-width:none;padding:0;background:#fff}.analysis-card{border-color:#888}.pc-print-footer{page-break-inside:avoid}@page{margin:.55in;}}
  </style>
</head>
<body>
  <div class="pc-print-toolbar"><button type="button" onclick="window.print()">Print / Save PDF</button></div>
  <main class="pc-print-shell">
    <div class="pc-print-kicker">PromptCraft · Faculty AI Training</div>
    <h1 class="pc-print-title">Babbage Diagnosis</h1>
    <p class="pc-print-meta">${esc(scenarioLabel)} · Generated ${esc(printedAt)}</p>
    ${inputSection}
    ${reportClone.outerHTML}
    <footer class="pc-print-footer">Babbage feedback is an AI-supported diagnostic aid. Review recommendations using your instructional context and professional judgment.</footer>
  </main>
</body>
</html>`);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    try { printWindow.print(); } catch (e) {}
  }, 250);
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
  ariaLabel = 'Babbage analysis report'
} = {}) {
  babbageTerminalCloseCallback = typeof onClose === 'function' ? onClose : null;
  setBabbageTerminalTextMode(true);
  setBabbageTerminalState('responding', engineLabel, esc(terminalStateText));

  const output = document.getElementById('babbageTerminalOutput');
  if (output) {
    output.classList.add('babbage-analysis-layout');
    output.setAttribute('aria-label', ariaLabel);
    output.innerHTML = reportHTML;
  }

  requestAnimationFrame(() => {
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
    ariaLabel: 'Babbage scenario diagnostic report'
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
  babbageTerminalCloseCallback = null;
  const directVNHandoff = typeof cb === 'function';

  pcClearAnalysisLayout();

  // A completed Babbage report can hand directly back to Professor Pixel. Keep
  // the shared VN overlay active for that handoff so the browser never paints
  // the underlying workbench or a half-reset terminal between the two scenes.
  // The previous 250 ms close/reopen gap exposed legacy/base overlay geometry
  // during the VN opacity transition, producing the visible flash captured in
  // the August 18 screen recording. All mode cleanup still happens in this same
  // task, before the callback renders the next VN line.
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

  musicEndVN();
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
