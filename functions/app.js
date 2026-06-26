/**
 * PromptCraft Google Apps Script receiver — DATA FIX V53
 *
 * Fixes:
 * - Normalizes live-site incremental payloads into the current workbook column order.
 * - Repairs old live rows where Prompt Text / Claude Response shifted into score columns.
 * - Converts ISO timestamp strings into real date values.
 * - Formats Incremental Saves timestamp exactly like Ideas Wall.
 * - Backfills Ideas Wall from high-scoring Incremental Saves rows.
 * - Rebuilds Research Dashboard formulas without FILTER(), so Excel exports do not show #NAME?.
 *
 * Deploy as Web App:
 *   Deploy > Manage deployments > Edit active deployment > Version: New version > Deploy
 */

const SHEET_INCREMENTAL = 'Incremental Saves';
const SHEET_RESPONSES   = 'PromptCraft Responses';
const SHEET_IDEAS       = 'Ideas Wall';
const SHEET_DASHBOARD   = 'Research Dashboard';

const PROMPTCRAFT_RECEIVER_VERSION = 'V53';
const SPREADSHEET_ID = '';

const TIMESTAMP_FORMAT = 'ddd, m/d/yyyy h:mm AM/PM';

const SCENARIO_LABELS = {
  1: 'S1: Engagement',
  2: 'S2: Metacognition',
  3: 'S3: Authentic Assessment',
  4: 'S4: Sync Bias',
  5: 'S5: Hallucination Hunt',
  6: 'S6: Predict the Output',
  7: 'S7: Overreliance',
  8: 'S8: Reflect & Revise'
};

function doGet(e) {
  return jsonResponse({
    status: 'ok',
    message: 'PromptCraft receiver is live',
    sheet: getSpreadsheet_().getName()
  });
}

function doPost(e) {
  try {
    const payload = parsePromptCraftPayload(e);
    const type = String(payload.type || '').toLowerCase();

    if (type === 'incremental') {
      const normalized = normalizeIncrementalPayload_(payload);
      appendIncrementalSave(normalized);
      maybeAppendIdeaFromIncremental(normalized);
      updateDashboardFormulas_();
      return jsonResponse({ status: 'ok', type: 'incremental', normalized: true });
    }

    if (type === 'idea' || type === 'ideas') {
      appendIdea(payload);
      updateDashboardFormulas_();
      return jsonResponse({ status: 'ok', type: 'idea' });
    }

    appendFullResponse(payload);
    updateDashboardFormulas_();
    return jsonResponse({ status: 'ok', type: type || 'full_response' });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return jsonResponse({
      status: 'error',
      message: String(err && err.message ? err.message : err)
    });
  }
}

function parsePromptCraftPayload(e) {
  const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
  try {
    return JSON.parse(raw || '{}');
  } catch (err) {
    console.error('Bad JSON payload:', raw);
    throw err;
  }
}

function getSpreadsheet_() {
  return SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet_(name) {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function jsonResponse(obj) {
  const response = Object.assign({ receiver_version: PROMPTCRAFT_RECEIVER_VERSION }, obj || {});
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function pick_(obj, keys, fallback) {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
  }
  return fallback === undefined ? '' : fallback;
}

function stringify_(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function normalizeListText_(value) {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) {
    return value.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(' | ');
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function parseDate_(value) {
  if (!value) return new Date();
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) return value;

  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
}

function normalizeScenarioIndex_(p) {
  const raw = pick_(p, ['scenario_index', 'scenarioIndex', 'scenario_number', 'scenarioNumber', 'scenario'], '');
  const m = String(raw).match(/\d+/);
  return m ? Number(m[0]) : raw;
}

function getScenarioLabel_(scenarioIndex, payload) {
  return pick_(payload, ['scenario_label', 'scenarioLabel'], SCENARIO_LABELS[Number(scenarioIndex)] || '');
}

function normalizeScore_(value, fallback) {
  const v = value === undefined || value === null || value === '' ? fallback : value;
  if (v === undefined || v === null || v === '') return '';
  const n = Number(v);
  return isNaN(n) ? v : n;
}

function getLastIncrementalFor_(participantId, scenarioIndex) {
  const sheet = getSheet_(SHEET_INCREMENTAL);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const values = sheet.getRange(2, 1, lastRow - 1, 17).getValues();
  for (let i = values.length - 1; i >= 0; i--) {
    const row = values[i];
    if (String(row[1]) === String(participantId) && String(row[2]) === String(scenarioIndex)) {
      return {
        timestamp: row[0],
        currentScore: row[6],
        bestScore: row[7],
        attempts: row[5]
      };
    }
  }
  return null;
}

function normalizeIncrementalPayload_(p) {
  const participantId = pick_(p, ['participant_id', 'participantId'], 'anonymous');
  const scenarioIndex = normalizeScenarioIndex_(p);
  const scenarioLabel = getScenarioLabel_(scenarioIndex, p);

  const bestScoreRaw = pick_(p, ['best_score', 'bestScore'], '');
  const currentScoreRaw = pick_(p, ['current_score', 'currentScore', 'score'], bestScoreRaw);

  const bestScore = normalizeScore_(bestScoreRaw, '');
  const currentScore = normalizeScore_(currentScoreRaw, bestScore);
  const last = getLastIncrementalFor_(participantId, scenarioIndex);

  let scoreDelta = pick_(p, ['score_delta', 'scoreDelta'], '');
  if (scoreDelta === '' && last && currentScore !== '' && !isNaN(Number(currentScore)) && last.currentScore !== '' && !isNaN(Number(last.currentScore))) {
    scoreDelta = Number(currentScore) - Number(last.currentScore);
  }

  let timeSince = pick_(p, ['time_since_last_attempt_sec', 'timeSinceLastAttemptSec'], '');
  if (timeSince === '' && last && last.timestamp) {
    const now = parseDate_(p.timestamp);
    const old = parseDate_(last.timestamp);
    const deltaSec = Math.round((now.getTime() - old.getTime()) / 1000);
    timeSince = deltaSec >= 0 ? deltaSec : '';
  }

  return {
    type: 'incremental',
    timestamp: parseDate_(p.timestamp),
    participant_id: participantId,
    scenario_index: scenarioIndex,
    scenario_label: scenarioLabel,
    session_duration_min: pick_(p, ['session_duration_min', 'sessionDurationMin'], ''),
    attempts: pick_(p, ['attempts', 'attempt_number', 'attemptNumber'], ''),
    current_score: currentScore,
    best_score: bestScore === '' ? currentScore : bestScore,
    score_delta: scoreDelta,
    prompt_text: normalizeListText_(pick_(p, ['prompt_text', 'promptText', 'last_prompt', 'lastPrompt', 'prompts', 'all_prompts', 'allPrompts'], '')),
    claude_response: normalizeListText_(pick_(p, ['claude_response', 'claudeResponse', 'final_response', 'finalResponse', 'ai_response', 'aiResponse'], '')),
    quality_indicators_lit: normalizeListText_(pick_(p, ['quality_indicators_lit', 'qualityIndicatorsLit', 'oscqr_lit', 'oscqrLit', 'qualityIndicators', 'indicators'], '')),
    self_report_prediction: normalizeListText_(pick_(p, ['self_report_prediction', 'selfReportPrediction', 'self_report', 'selfReport', 'prediction', 'predictions'], '')),
    time_since_last_attempt_sec: timeSince,
    screen_width: pick_(p, ['screen_width', 'screenWidth', 'viewport_width', 'viewportWidth'], ''),
    event_type: pick_(p, ['event_type', 'eventType'], 'incremental_save'),
    notes_coding_memo: pick_(p, ['notes_coding_memo', 'notesCodingMemo', 'notes', 'codingMemo'], '')
  };
}

function appendIncrementalSave(p) {
  const sheet = getSheet_(SHEET_INCREMENTAL);
  ensureIncrementalHeaders(sheet);

  const row = [
    p.timestamp,
    p.participant_id,
    p.scenario_index,
    p.scenario_label,
    p.session_duration_min,
    p.attempts,
    p.current_score,
    p.best_score,
    p.score_delta,
    p.prompt_text,
    p.claude_response,
    p.quality_indicators_lit,
    p.self_report_prediction,
    p.time_since_last_attempt_sec,
    p.screen_width,
    p.event_type,
    p.notes_coding_memo
  ];

  sheet.appendRow(row);
  formatIncrementalSheet_(sheet);
}

function ensureIncrementalHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Participant ID',
    'Scenario #',
    'Scenario Label',
    'Session Duration (min)',
    'Attempts',
    'Current Score',
    'Best Score (0–5)',
    'Score Delta',
    'Prompt Text',
    'Claude Response',
    'Quality Indicators Lit',
    'Self-Report / Prediction',
    'Time Since Last Attempt (sec)',
    'Screen Width',
    'Event Type',
    'Notes / Coding Memo'
  ];

  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeaders = headers.some((h, i) => current[i] !== h);
  if (needsHeaders) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

function formatIncrementalSheet_(sheet) {
  ensureIncrementalHeaders(sheet);
  coerceTimestampColumn_(sheet, 2);

  const lastRow = Math.max(sheet.getLastRow(), 2);
  sheet.getRange('A:A').setNumberFormat(TIMESTAMP_FORMAT);
  sheet.getRange('E:I').setNumberFormat('0.0');
  sheet.getRange('N:O').setNumberFormat('0');
  sheet.getRange('J:M').setWrap(true);
  sheet.getRange('Q:Q').setWrap(true);
  sheet.getRange(1, 1, 1, 17).setFontWeight('bold').setBackground('#1f5132').setFontColor('#ffffff');

  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, 17).setVerticalAlignment('top');

  sheet.autoResizeColumns(1, 17);
  sheet.setColumnWidth(10, 360);
  sheet.setColumnWidth(11, 420);
  sheet.setColumnWidth(12, 260);
  sheet.setColumnWidth(13, 260);
  sheet.setColumnWidth(17, 300);
}

function appendFullResponse(p) {
  const sheet = getSheet_(SHEET_RESPONSES);
  ensureFullResponseHeaders(sheet);

  const d7 = p.s7_decisions || {};
  const row = [
    parseDate_(p.timestamp),
    pick_(p, ['participant_id', 'participantId'], 'anonymous'),
    pick_(p, ['session_duration_min', 'sessionDurationMin'], ''),
    pick_(p, ['scenarios_completed', 'scenariosCompleted'], ''),
    pick_(p, ['total_xp', 'totalXp'], ''),
    pick_(p, ['total_attempts', 'totalAttempts'], ''),
    normalizeListText_(pick_(p, ['presubmit_predictions', 'preSubmitPredictions'], '')),

    p.s1_attempts || '', p.s1_best_score || '', p.s1_prompts || '', p.s1_final_response || '', p.s1_oscqr || '',
    p.s2_attempts || '', p.s2_best_score || '', p.s2_prompts || '', p.s2_final_response || '', p.s2_oscqr || '',
    p.s3_attempts || '', p.s3_best_score || '', p.s3_prompts || '', p.s3_final_response || '', p.s3_oscqr || '',
    p.s4_attempts || '', p.s4_best_score || '', p.s4_prompts || '', p.s4_final_response || '', p.s4_oscqr || '', p.s1_section_reviews || '',
    p.s5_attempts || '', p.s5_best_score || '', p.s5_self_report || '', p.s5_prompts || '', p.s5_final_response || '',
    p.s6_attempts || '', p.s6_prediction || '', p.s6_prediction_correct || '', p.s6_prompts || '',
    d7.policy || '', d7.cases || '', d7.pledge || '', d7.scenarios || '', d7.objectives || '', p.s7_best_score || '',
    p.s8_initial_prompt || '', p.s8_initial_score || '', p.s8_revised_prompt || '', p.s8_revised_score || '', p.s8_score_delta || '',
    p.s8_reflection_1 || '', p.s8_reflection_2 || '', p.s8_reflection_3 || '',
    p.q1_surprise || '', p.q2_unexpected || '', p.q3_transfer || '', p.q4_other || '',
    p.ai_narrative || '', p.growth_json || '',
    pick_(p, ['screen_width', 'screenWidth'], ''),
    p.referrer || ''
  ];

  sheet.appendRow(row);
  formatFullResponseSheet_(sheet);
}

function ensureFullResponseHeaders(sheet) {
  const groups = [
    'Session','','','','','','',
    'S1: Engagement','','','','',
    'S2: Metacognition','','','','',
    'S3: Authentic Assessment','','','','',
    'S4: Sync Bias','','','','','',
    'S5: Hallucination Hunt','','','','',
    'S6: Predict the Output','','','',
    'S7: Overreliance','','','','','',
    'S8: Reflect & Revise','','','','','','','',
    'Reflection Room','','','',
    'Growth Summary','',
    'Metadata',''
  ];

  const labels = [
    'Timestamp','Participant ID','Session Duration (min)','Scenarios Completed','Total XP','Total Attempts','Pre-submit Predictions',
    'Attempts','Best Score (0–5)','All Prompts','Final AI Response','Quality Indicators Lit',
    'Attempts','Best Score (0–5)','All Prompts','Final AI Response','Quality Indicators Lit',
    'Attempts','Best Score (0–5)','All Prompts','Final AI Response','Quality Indicators Lit',
    'Attempts','Best Score (0–5)','All Prompts','Final AI Response','Quality Indicators Lit','Section Reviews JSON',
    'Attempts','Best Score (0–5)','Self-Report','Prompts / Notes','Final AI Response',
    'Attempts','Prediction Made','Prediction Correct','All Prompts',
    'Decision — Institutional Policies','Decision — Case Studies','Decision — Integrity Pledge','Decision — Scenario Cards','Decision — Learning Objectives','Best Score (0–5)',
    'Initial Prompt','Initial Score','Revised Prompt','Revised Score','Score Delta','Why Prompt Was Written This Way','What Worked','What Fell Short / Surprised',
    'Q1 Surprise','Q2 Unexpected Strength or Limitation','Q3 Transfer to Teaching Practice','Q4 Other',
    'AI Growth Narrative','Growth Data JSON','Screen Width','Referrer'
  ];

  sheet.getRange(1, 1, 1, labels.length).setValues([groups]);
  sheet.getRange(2, 1, 1, labels.length).setValues([labels]);
  sheet.setFrozenRows(2);
}

function formatFullResponseSheet_(sheet) {
  ensureFullResponseHeaders(sheet);
  coerceTimestampColumn_(sheet, 3);

  const lastRow = Math.max(sheet.getLastRow(), 3);
  const lastCol = Math.max(sheet.getLastColumn(), 59);

  sheet.getRange('A:A').setNumberFormat(TIMESTAMP_FORMAT);
  sheet.getRange('C:C').setNumberFormat('0.0');
  sheet.getRange('D:F').setNumberFormat('0');
  sheet.getRange('J:BG').setWrap(true);
  sheet.getRange(1, 1, 2, lastCol).setFontWeight('bold');
  sheet.getRange(1, 1, 1, lastCol).setBackground('#1f5132').setFontColor('#ffffff');
  sheet.getRange(2, 1, 1, lastCol).setBackground('#e8f0eb');

  if (lastRow > 2) sheet.getRange(3, 1, lastRow - 2, lastCol).setVerticalAlignment('top');
  sheet.autoResizeColumns(1, Math.min(lastCol, 59));
}

function appendIdea(p) {
  const sheet = getSheet_(SHEET_IDEAS);
  ensureIdeaHeaders(sheet);

  const ideas = Array.isArray(p.ideas) ? p.ideas : [p];
  ideas.forEach(item => {
    const scenarioIndex = pick_(item, ['scenario_index', 'scenarioIndex', 'scenario'], pick_(p, ['scenario_index', 'scenarioIndex', 'scenario'], ''));
    sheet.appendRow([
      parseDate_(item.timestamp || p.timestamp),
      pick_(item, ['participant_id', 'participantId'], pick_(p, ['participant_id', 'participantId'], 'anonymous')),
      scenarioIndex,
      pick_(item, ['scenario_label', 'scenarioLabel'], pick_(p, ['scenario_label', 'scenarioLabel'], SCENARIO_LABELS[Number(scenarioIndex)] || '')),
      pick_(item, ['score', 'best_score', 'bestScore', 'tag'], pick_(p, ['score', 'best_score', 'bestScore', 'tag'], '')),
      pick_(item, ['idea', 'text', 'note', 'final_response', 'finalResponse', 'claude_response', 'claudeResponse'], ''),
      pick_(item, ['approved', 'approved_for_wall', 'approvedForWall'], 'Needs Review'),
      pick_(item, ['research_notes', 'researchNotes', 'notes'], '')
    ]);
  });

  formatIdeasSheet_(sheet);
}

function ensureIdeaHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Participant ID',
    'Scenario #',
    'Scenario Label',
    'Score / Tag',
    'AI Response or Idea Excerpt',
    'Approved for Wall',
    'Research Notes'
  ];

  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeaders = headers.some((h, i) => current[i] !== h);
  if (needsHeaders) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

function formatIdeasSheet_(sheet) {
  ensureIdeaHeaders(sheet);
  coerceTimestampColumn_(sheet, 2);

  const lastRow = Math.max(sheet.getLastRow(), 2);
  sheet.getRange('A:A').setNumberFormat(TIMESTAMP_FORMAT);
  sheet.getRange('F:H').setWrap(true);
  sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#1f5132').setFontColor('#ffffff');

  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, 8).setVerticalAlignment('top');

  sheet.autoResizeColumns(1, 8);
  sheet.setColumnWidth(6, 460);
  sheet.setColumnWidth(8, 300);
}

function maybeAppendIdeaFromIncremental(p) {
  const score = Number(p.best_score || p.current_score || p.score || 0);
  const text = p.claude_response || p.final_response || p.finalResponse || p.claudeResponse || '';
  if (score < 4 || !text) return;

  appendIdea({
    timestamp: p.timestamp,
    participant_id: p.participant_id || p.participantId || 'anonymous',
    scenario_index: p.scenario_index || p.scenarioIndex || p.scenario || '',
    scenario_label: p.scenario_label || p.scenarioLabel || '',
    score: score,
    idea: String(text).slice(0, 1500),
    approved: 'Needs Review',
    research_notes: 'Auto-added from high-scoring incremental save.'
  });
}

function coerceTimestampColumn_(sheet, startRow) {
  const lastRow = sheet.getLastRow();
  if (lastRow < startRow) return;

  const range = sheet.getRange(startRow, 1, lastRow - startRow + 1, 1);
  const values = range.getValues();
  let changed = false;

  values.forEach(row => {
    const value = row[0];
    if (typeof value === 'string' && value.trim()) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        row[0] = d;
        changed = true;
      }
    }
  });

  if (changed) range.setValues(values);
  sheet.getRange('A:A').setNumberFormat(TIMESTAMP_FORMAT);
}

function updateDashboardFormulas_() {
  const sheet = getSheet_(SHEET_DASHBOARD);

  if (sheet.getLastRow() < 16) {
    sheet.getRange('A1:E16').setValues([
      ['PromptCraft Research Dashboard','','','',''],
      ['Metric','Formula / Value','Notes','',''],
      ['Total full sessions','','Counts submitted full-session rows','',''],
      ['Average duration (min)','','Time-on-task indicator','',''],
      ['Average scenarios completed','','Completion indicator','',''],
      ['Average total attempts','','Iteration/persistence indicator','',''],
      ['Incremental saves','','Partial-session/process events','',''],
      ['','','','',''],
      ['Scenario','Avg Score','Avg Attempts','Research Construct','Notes'],
      ['S1 Engagement','','','Prompt specificity + interaction design','Dead discussion-board repair'],
      ['S2 Metacognition','','','Metacognitive activity design','Reflection/check-in design'],
      ['S3 Assessment','','','Authentic assessment design','Applied competency'],
      ['S4 Sync Bias','','','Bias/access critique','Async/access assumptions'],
      ['S5 Hallucination','','','Critical evaluation','Noticing questionable output'],
      ['S7 Overreliance','','','Professional judgment','Safe vs needs judgment vs original'],
      ['S8 Revise Delta','','','Metacognitive revision','Revised score minus initial score']
    ]);
  }

  sheet.getRange('B3').setFormula("=MAX(0,COUNTA('PromptCraft Responses'!A3:A1000))");
  sheet.getRange('B4').setFormula("=IFERROR(AVERAGE('PromptCraft Responses'!C3:C1000),0)");
  sheet.getRange('B5').setFormula("=IFERROR(AVERAGE('PromptCraft Responses'!D3:D1000),0)");
  sheet.getRange('B6').setFormula("=IFERROR(AVERAGE('PromptCraft Responses'!F3:F1000),0)");
  sheet.getRange('B7').setFormula("=MAX(0,COUNTA('Incremental Saves'!A2:A1000))");

  const rows = [
    [10, 1], [11, 2], [12, 3], [13, 4], [14, 5], [15, 7], [16, 8]
  ];

  rows.forEach(([row, scenarioNum]) => {
    sheet.getRange(row, 2).setFormula(
      `=IFERROR(SUMIF('Incremental Saves'!$C$2:$C$1000,${scenarioNum},'Incremental Saves'!$H$2:$H$1000)/COUNTIF('Incremental Saves'!$C$2:$C$1000,${scenarioNum}),0)`
    );
    if (scenarioNum <= 5) {
      sheet.getRange(row, 3).setFormula(
        `=IFERROR(SUMIF('Incremental Saves'!$C$2:$C$1000,${scenarioNum},'Incremental Saves'!$F$2:$F$1000)/COUNTIF('Incremental Saves'!$C$2:$C$1000,${scenarioNum}),0)`
      );
    }
  });

  sheet.getRange('A1:E1').setFontWeight('bold').setFontSize(14).setBackground('#1f5132').setFontColor('#ffffff');
  sheet.getRange('A2:E2').setFontWeight('bold').setBackground('#e8f0eb');
  sheet.getRange('A9:E9').setFontWeight('bold').setBackground('#e8f0eb');
  sheet.getRange('B3:B7').setNumberFormat('0.0');
  sheet.getRange('B10:C16').setNumberFormat('0.0');
  sheet.autoResizeColumns(1, 5);
}

function repairOldLiveIncrementalRows() {
  const sheet = getSheet_(SHEET_INCREMENTAL);
  ensureIncrementalHeaders(sheet);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  const range = sheet.getRange(2, 1, lastRow - 1, 17);
  const values = range.getValues();

  let repaired = 0;

  values.forEach(row => {
    const looksShifted =
      isNumeric_(row[3]) &&
      isNumeric_(row[4]) &&
      isLikelyPromptText_(row[6]) &&
      isLikelyClaudeText_(row[7]);

    if (!looksShifted) {
      if (typeof row[0] === 'string') row[0] = parseDate_(row[0]);
      return;
    }

    const old = row.slice();
    const scenarioIndex = old[2];

    row[0] = parseDate_(old[0]);
    row[1] = old[1] || 'anonymous';
    row[2] = scenarioIndex || '';
    row[3] = SCENARIO_LABELS[Number(scenarioIndex)] || '';
    row[4] = old[3] || '';
    row[5] = old[4] || '';
    row[6] = old[5] || '';
    row[7] = old[5] || '';
    row[8] = '';
    row[9] = old[6] || '';
    row[10] = old[7] || '';
    row[11] = old[8] || '';
    row[12] = old[9] || '';
    row[13] = '';
    row[14] = old[10] || '';
    row[15] = 'repaired_legacy_live_row';
    row[16] = 'Repaired from old live deployment column order.';
    repaired++;
  });

  range.setValues(values);
  formatIncrementalSheet_(sheet);
  return repaired;
}

function backfillIdeasWallFromIncremental() {
  const inc = getSheet_(SHEET_INCREMENTAL);
  const ideas = getSheet_(SHEET_IDEAS);
  ensureIdeaHeaders(ideas);

  const incLast = inc.getLastRow();
  if (incLast < 2) return 0;

  const ideaLast = ideas.getLastRow();
  const existing = {};
  if (ideaLast >= 2) {
    const ideaValues = ideas.getRange(2, 1, ideaLast - 1, 8).getValues();
    ideaValues.forEach(row => {
      const key = [row[1], row[2], String(row[5] || '').slice(0, 140)].join('||');
      existing[key] = true;
    });
  }

  const rows = inc.getRange(2, 1, incLast - 1, 17).getValues();
  const newRows = [];

  rows.forEach(row => {
    const score = Number(row[7] || row[6] || 0);
    const response = String(row[10] || '');
    if (score < 4 || !response) return;

    const key = [row[1], row[2], response.slice(0, 140)].join('||');
    if (existing[key]) return;

    newRows.push([
      parseDate_(row[0]),
      row[1] || 'anonymous',
      row[2] || '',
      row[3] || '',
      score,
      response.slice(0, 1500),
      'Needs Review',
      'Backfilled from Incremental Saves.'
    ]);
    existing[key] = true;
  });

  if (newRows.length) {
    ideas.getRange(ideas.getLastRow() + 1, 1, newRows.length, 8).setValues(newRows);
  }

  formatIdeasSheet_(ideas);
  return newRows.length;
}

function applyWorkbookFormatting() {
  formatIncrementalSheet_(getSheet_(SHEET_INCREMENTAL));
  formatFullResponseSheet_(getSheet_(SHEET_RESPONSES));
  formatIdeasSheet_(getSheet_(SHEET_IDEAS));
  updateDashboardFormulas_();
}

/**
 * Run this once after deploying V53.
 */
function repairWorkbookNow() {
  const repairedRows = repairOldLiveIncrementalRows();
  const ideasAdded = backfillIdeasWallFromIncremental();

  applyWorkbookFormatting();
  SpreadsheetApp.flush();

  return jsonResponse({
    status: 'ok',
    repaired_rows: repairedRows,
    ideas_added: ideasAdded,
    message: 'Workbook repaired, Ideas Wall backfilled, timestamps formatted, and dashboard formulas updated.'
  });
}

function isNumeric_(value) {
  if (value === '' || value === null || value === undefined) return false;
  return !isNaN(Number(value));
}

function isLikelyPromptText_(value) {
  const text = String(value || '');
  return text.length > 30 && /prompt|discussion|students|learners|course|redesign|reply|assessment/i.test(text);
}

function isLikelyClaudeText_(value) {
  const text = String(value || '');
  return text.length > 30 && /revised|prompt|why|addresses|course quality|students|discussion/i.test(text);
}

function testReceiverVersion() {
  return jsonResponse({
    status: 'ok',
    message: 'Receiver version check from editor.',
    active_spreadsheet: getSpreadsheet_().getName()
  });
}

function testWrite() {
  return testIncrementalWrite();
}

function testIncrementalWrite() {
  return doPost({
    postData: {
      contents: JSON.stringify({
        type: 'incremental',
        participant_id: 'test-user',
        scenario_index: 1,
        scenario_label: 'S1: Engagement',
        session_duration_min: 2.5,
        attempts: 1,
        current_score: 5,
        best_score: 5,
        score_delta: 0,
        prompt_text: 'Test prompt text',
        claude_response: 'Test Claude response',
        quality_indicators_lit: 'Clear Objectives, Student Interaction',
        self_report_prediction: 'It might still be generic.',
        time_since_last_attempt_sec: 42,
        screen_width: 1536,
        event_type: 'manual_test',
        notes_coding_memo: 'Manual Apps Script test row.'
      })
    }
  });
}

function testFullResponseWrite() {
  return doPost({
    postData: {
      contents: JSON.stringify({
        type: 'full_response',
        participant_id: 'test-user',
        session_duration_min: 12.5,
        scenarios_completed: 1,
        total_xp: 125,
        total_attempts: 3,
        s1_attempts: 3,
        s1_best_score: 5,
        s1_prompts: 'Prompt A | Prompt B',
        s1_final_response: 'Final response sample',
        s1_oscqr: 'Clear Objectives, Student Interaction',
        screen_width: 1536,
        referrer: 'manual test'
      })
    }
  });
}
