/**
 * PromptCraft Google Apps Script receiver — START WITH LEARNING V91
 *
 * Live job:
 *   1. Receive PromptCraft payloads.
 *   2. Preserve raw technical records.
 *   3. Update the session/scenario checkpoint.
 *   4. Rebuild research-facing views only at meaningful completion points.
 *
 * Manual administration:
 *   - initializeWorkbookNow()  -> format raw headers and rebuild readable views;
 *                                 hide obsolete S1 result tabs without erasing them.
 *   - refreshResearchViewsNow()-> rebuild readable tabs from preserved raw rows.
 *   - inspectS1TrackingNow()    -> count received S1 event types without showing participant text.
 *   - verifyV84MigrationNow()  -> read-only row-count/header-fingerprint inventory for copied-workbook verification.
 *   - resetResearchDataNow()   -> clear testing records while preserving workbook structure.
 *
 * V91 preserves every raw V121 column and lossless payload archive. The S1
 * readable tab shows only Start With the Learning design checkpoints.
 * Testing reset is enabled and rebuilds the formatted, empty research views.
 */

const SHEET_OVERVIEW       = '00 - Overview';
const SHEET_SESSIONS       = '01 - Sessions';
const SHEET_SCENARIO_TABS  = Object.freeze({
  1: '02 - S1 Start With Learning',
  2: '03 - S2 Metacognition',
  3: '04 - S3 Assessment',
  4: '05 - S4 Sync Bias',
  5: '06 - S5 Hallucination',
  6: '07 - S6 Prediction',
  7: '08 - S7 Overreliance',
  8: '09 - S8 Reflect & Revise'
});
const SHEET_PROCESS_LOG    = '10 - Process Log';
const SHEET_IDEAS          = '11 - Ideas Wall';
const SHEET_READABLE_RESPONSES = '12 - Research Responses';
const SHEET_PROCESS_EVENTS = '13 - Process Events';
const SHEET_RESEARCH_GUIDE = '90 - Research Guide';
const SHEET_RAW_ARCHIVE    = '96 - Raw Payload Archive';
const SHEET_RESPONSES      = '97 - Raw Responses';
const SHEET_INCREMENTAL    = '98 - Raw Events';
const SHEET_RAW_AUDIT      = '99 - Raw Audit';
const SHEET_CHALLENGE       = '12 - Challenge Scores';
const LEGACY_S1_VIEW_NAME = /^02\s*-\s*S1\b/i;
const S1_LEARNING_EVENTS = Object.freeze([
  's1_learning_path_organized', 's1_alignment_diagnosis_complete',
  's1_course_guide_step_added', 's1_course_guide_complete'
]);

const SCENARIO_TAB_COLORS = Object.freeze({
  1: '#215C45', 2: '#2E6A4E', 3: '#23665F', 4: '#8A5A20',
  5: '#8A4B2A', 6: '#475569', 7: '#5C3D73', 8: '#0F6A63'
});

const PROMPTCRAFT_RECEIVER_VERSION = 'V91';
const EXPECTED_APP_SCHEMA_VERSION = 'V121';
const EXPECTED_APP_BUILD = 'PROMPTCRAFT_V429';
const SPREADSHEET_ID = '';
const TIMESTAMP_FORMAT = 'ddd, m/d/yyyy h:mm AM/PM';
const IDEAS_WALL_MIN_SCORE = 4;
const IDEAS_WALL_MIN_TEXT_CHARS = 120;
const IDEAS_WALL_REVIEW_STATUSES = Object.freeze(['Needs Review','Publish','Hold','Reject']);
const RAW_ARCHIVE_CHUNK_SIZE = 45000;
const RAW_ARCHIVE_HEADERS = Object.freeze([
  'Event ID','Received At','Receiver Version','Status','Chunk Index','Chunk Count','Raw Length','Raw JSON Chunk'
]);
const READABLE_RESPONSE_HEADERS = Object.freeze([
  'Timestamp','Participant ID','Session ID','Scenario #','Scenario','Activity','Attempts',
  'Current Score','Score Scale','Best Score','Score Delta','Prompt / Input','Babbage Response',
  'AI Source','Event Type','Event ID'
]);
const PROCESS_EVENT_HEADERS = Object.freeze([
  'Timestamp','Participant ID','Session ID','Scenario','Activity','Event','Attempt',
  'Score','Score Scale','Seconds Since Previous','Screen Width','Event ID'
]);

const INCREMENTAL_HEADERS = [
  'Timestamp','Participant ID','Session ID','Scenario #','Scenario Label','Session Duration (min)',
  'Scenarios Completed','Total XP','Total Attempts','Attempts','Current Score','Best Score (0–5)',
  'Score Delta','Prompt Text','All Prompts','Babbage Response','Quality Indicators Lit',
  'Self-Report / Prediction','AI Provider','AI Model','AI Request ID','AI Elapsed (ms)',
  'AI Usage JSON','Babbage Analysis JSON','Scenario Detail JSON','Time Since Last Attempt (sec)',
  'Screen Width','Event Type','App Schema','App Build','Payload Shape','Notes / Coding Memo'
];

const RESPONSE_HEADERS = [
  'Timestamp','Participant ID','Session ID','Session Duration (min)','Scenarios Completed','Total XP','Total Attempts','Pre-submit Predictions',
  'Attempts','Best Score (0–5)','All Prompts','Final Babbage Response','Quality Indicators Lit','Section Reviews JSON',
  'Attempts','Best Score (0–5)','All Prompts','Diagnosis Choice','Diagnosis Attempts JSON','Intervention Choice','Intervention Attempts JSON','Thinking Move','Audit Choice','Audit Correct','Audit Attempts JSON','Repair Text','Babbage Draft JSON','Babbage Review JSON','Review Source','AI Provider','AI Model','Final Babbage Response','Quality Indicators Lit',
  'Attempts','Best Score (0–5)','All Prompts','Final Babbage Response','Quality Indicators Lit',
  'Attempts','Best Score (0–5)','All Prompts','Final Babbage Response','Quality Indicators Lit',
  'Attempts','Best Score (0–5)','Self-Report','Prompts / Notes','Final Babbage Response',
  'Attempts','Prediction Made','Prediction Correct','All Prompts',
  'Decision — Institutional Policies','Decision — Case Studies','Decision — Integrity Pledge','Decision — Scenario Cards','Decision — Learning Objectives','Best Score (0–5)',
  'Initial Prompt','Initial Score','Revised Prompt','Revised Score','Score Delta','Why Prompt Was Written This Way','What Worked','What Fell Short / Surprised',
  'Q1 Surprise','Q2 Unexpected Strength or Limitation','Q3 Transfer to Teaching Practice','Q4 Other',
  'AI Growth Narrative','Growth Data JSON','Screen Width','Referrer','Row Source'
];

const RESPONSE_GROUPS = [
  ['Session', 1, 8, '#174C3A'],
  ['S1: Start With the Learning', 9, 14, '#215C45'],
  ['S2: Metacognition', 15, 33, '#2E6A4E'],
  ['S3: Authentic Assessment', 34, 38, '#23665F'],
  ['S4: Sync Bias', 39, 43, '#8A5A20'],
  ['S5: Hallucination Hunt', 44, 48, '#8A4B2A'],
  ['S6: Predict Output', 49, 52, '#475569'],
  ['S7: Overreliance', 53, 58, '#5C3D73'],
  ['S8: Reflect & Revise', 59, 66, '#0F6A63'],
  ['Reflection Room', 67, 70, '#1F6773'],
  ['Growth Report', 71, 72, '#4F641F'],
  ['Metadata', 73, 75, '#374151']
];

const INC_COL = Object.freeze({
  timestamp: 1, participant: 2, session: 3, scenario: 4, label: 5, duration: 6,
  completed: 7, totalXp: 8, totalAttempts: 9, attempts: 10, currentScore: 11,
  bestScore: 12, scoreDelta: 13, promptText: 14, allPrompts: 15, babbageResponse: 16,
  quality: 17, selfReport: 18, aiProvider: 19, aiModel: 20, aiRequestId: 21,
  aiElapsed: 22, aiUsage: 23, analysis: 24, detail: 25, timeSince: 26,
  screenWidth: 27, eventType: 28, appSchema: 29, appBuild: 30, payloadShape: 31, notes: 32
});

const SCENARIO_LABELS = {
  1: 'S1: Start With the Learning',
  2: 'S2: Access Is Part of the Design',
  3: 'S3: The Confident Student Problem',
  4: 'S4: The 96% Problem',
  5: 'S5: Hallucination Hunt',
  6: 'S6: Predict the Output',
  7: 'S7: Human Judgment Line',
  8: 'S8: Reflect, Revise, Reuse'
};

// Internal implementation is intentionally namespaced so the Apps Script function
// picker exposes only the five public entry points below.
const PromptCraftReceiver = (() => {
  function doGet(e) {
    const action = String((e && e.parameter && e.parameter.action) || '').trim().toLowerCase();
    if (action === 'getideas') {
      return jsonResponse({
        status: 'ok',
        action: 'getIdeas',
        ideas: getApprovedIdeasForWall_(),
        timestamp: new Date().toISOString()
      });
    }
    if (action === 'getchallengetop') {
      return jsonResponse({
        status: 'ok',
        action: 'getChallengeTop',
        top_xp: getChallengeTopXP_(),
        timestamp: new Date().toISOString()
      });
    }

    return jsonResponse({
      status: 'ok',
      message: 'PromptCraft receiver is live',
      timestamp: new Date().toISOString(),
      expected_app_schema: EXPECTED_APP_SCHEMA_VERSION,
      expected_app_build: EXPECTED_APP_BUILD,
      workflow: 'V91 Start With the Learning projections + participant-safe views + lossless raw archives'
    });
  }

  function doPost(e) {
    const raw = rawPostBody_(e);
    let payload = null;
    let eventId = '';
    let lock = null;
    try {
      payload = parsePromptCraftPayload(e);
      const type = String(payload.type || '').toLowerCase();
      lock = LockService.getScriptLock();
      if (!lock.tryLock(30000)) throw new Error('Receiver is busy. Retry shortly.');

      // Challenge scores are deliberately kept outside V121 research rows. The
      // sheet contains anonymous game-state numbers only: no names, course text,
      // prompts, participant IDs, or My Course content.
      if (type === 'challenge_score') {
        const challenge = upsertChallengeScore_(payload);
        SpreadsheetApp.flush();
        return jsonResponse({ status: 'ok', type: 'challenge_score', top_xp: challenge.topXP });
      }

      eventId = eventIdForPayload_(payload, raw);
      if (hasArchivedEventId_(eventId)) {
        return jsonResponse({ status: 'ok', duplicate: true, event_id: eventId });
      }

      if (type === 'incremental') {
        const normalized = normalizeIncrementalPayload_(payload);
        appendIncrementalSave(normalized);
        const checkpointStatus = upsertPromptCraftResponseCheckpointFromIncremental_(normalized);
        const viewsRefreshed = shouldRefreshResearchViewsForIncremental_(normalized);
        if (viewsRefreshed) refreshHumanReadableViews_();
        appendRawPayloadArchive_(eventId, raw, 'accepted');
        appendRawPayloadAudit_(payload, e);
        SpreadsheetApp.flush();
        return jsonResponse({
          status: 'ok',
          type: 'incremental',
          normalized: true,
          event_id: eventId,
          checkpoint_status: checkpointStatus,
          research_views_refreshed: viewsRefreshed,
          app_schema_seen: payload.schema_version || '',
          app_build_seen: payload.app_build || '',
          schema_compatible: !payload.schema_version || payload.schema_version === EXPECTED_APP_SCHEMA_VERSION,
          expected_app_schema: EXPECTED_APP_SCHEMA_VERSION,
          app_build_compatible: !payload.app_build || payload.app_build === EXPECTED_APP_BUILD
        });
      }

      if (type === 'idea' || type === 'ideas') {
        appendIdea(payload);
        refreshHumanReadableViews_();
        appendRawPayloadArchive_(eventId, raw, 'accepted');
        appendRawPayloadAudit_(payload, e);
        SpreadsheetApp.flush();
        return jsonResponse({ status: 'ok', type: 'idea', event_id: eventId, research_views_refreshed: true });
      }

      appendFullResponse(payload);
      refreshHumanReadableViews_();
      appendRawPayloadArchive_(eventId, raw, 'accepted');
      appendRawPayloadAudit_(payload, e);
      SpreadsheetApp.flush();
      return jsonResponse({ status: 'ok', type: type || 'full_response', event_id: eventId, research_views_refreshed: true });
    } catch (err) {
      console.error(err && err.stack ? err.stack : err);
      if (!payload) {
        eventId = eventId || fallbackEventId_(raw, 'parse_error');
        try {
          appendRawPayloadArchive_(eventId, raw, 'parse_error');
          appendReceiverFailureAudit_(eventId, raw, err, 'parse_error');
        } catch (auditError) {
          console.error(auditError && auditError.stack ? auditError.stack : auditError);
        }
      } else {
        try {
          appendRawPayloadArchive_(eventId || eventIdForPayload_(payload, raw), raw, 'processing_error');
          appendReceiverFailureAudit_(eventId || '', raw, err, 'processing_error');
        } catch (auditError) {
          console.error(auditError && auditError.stack ? auditError.stack : auditError);
        }
      }
      return jsonResponse({ status: 'error', message: String(err && err.message ? err.message : err) });
    } finally {
      if (lock) lock.releaseLock();
    }
  }

  function rawPostBody_(e) {
    return e && e.postData && e.postData.contents ? String(e.postData.contents) : '{}';
  }

  function parsePromptCraftPayload(e) {
    const raw = rawPostBody_(e);
    try {
      return JSON.parse(raw || '{}');
    } catch (err) {
      console.error('Bad JSON payload:', raw);
      throw err;
    }
  }

  function getSpreadsheet_() {
    if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);

    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (!active) {
      throw new Error('No active spreadsheet found. Open the Google Sheet > Extensions > Apps Script, or set SPREADSHEET_ID in the receiver code.');
    }
    return active;
  }

  function getSheet_(name) {
    const ss = getSpreadsheet_();
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    return sheet;
  }

  function ensureCurrentS1Tab_() {
    const ss = getSpreadsheet_();
    const currentName = SHEET_SCENARIO_TABS[1];
    let current = ss.getSheetByName(currentName);
    const older = ss.getSheets().filter(sheet =>
      sheet.getName() !== currentName && LEGACY_S1_VIEW_NAME.test(sheet.getName()));
    if (!current && older.length) {
      current = older.shift();
      current.setName(currentName);
    }
    older.forEach(sheet => sheet.hideSheet()); // Preserve old results and any manual cells.
  }

  function hideLegacyScenarioTabs_() {
    const ss = getSpreadsheet_();
    const currentNames = Object.keys(SHEET_SCENARIO_TABS).map(key => SHEET_SCENARIO_TABS[key]);
    ss.getSheets().forEach(sheet => {
      const name = sheet.getName();
      if (/^0[2-9]\s*-\s*S[1-8]\b/i.test(name) && currentNames.indexOf(name) === -1) {
        sheet.hideSheet();
      }
    });
  }

  function ensureChallengeSheet_() {
    const sheet = getSheet_(SHEET_CHALLENGE);
    const headers = ['Anonymous Challenge ID','Best XP','Scenarios Completed','Guide Sections','App Build','Updated At'];
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    } else {
      const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
      if (existing.join('|') !== headers.join('|')) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    const header = sheet.getRange(1, 1, 1, headers.length);
    header.setBackground('#174C3A').setFontColor('#FFFFFF').setFontWeight('bold')
      .setWrap(true).setVerticalAlignment('middle');
    sheet.setRowHeight(1, 42);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 250);
    sheet.setColumnWidth(2, 110);
    sheet.setColumnWidth(3, 170);
    sheet.setColumnWidth(4, 145);
    sheet.setColumnWidth(5, 180);
    sheet.setColumnWidth(6, 200);
    sheet.getRange('B:D').setNumberFormat('0');
    sheet.getRange('F:F').setNumberFormat(TIMESTAMP_FORMAT);
    sheet.setTabColor('#174C3A');
    return sheet;
  }

  function normalizeChallengeId_(value) {
    const id = String(value || '').trim();
    if (!/^pc-[a-f0-9]{24}$/i.test(id)) throw new Error('Invalid anonymous challenge ID.');
    return id.toLowerCase();
  }

  function getChallengeTopXP_() {
    const sheet = ensureChallengeSheet_();
    if (sheet.getLastRow() < 2) return 0;
    const values = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
    return values.reduce((top, row) => Math.max(top, Number(row[0]) || 0), 0);
  }

  function upsertChallengeScore_(payload) {
    const id = normalizeChallengeId_(pick_(payload, ['challenge_id','challengeId'], ''));
    const xp = Math.max(0, Math.min(9999, Math.floor(Number(pick_(payload, ['xp'], 0)) || 0)));
    const scenarios = Math.max(0, Math.min(8, Math.floor(Number(pick_(payload, ['scenarios_completed','scenariosCompleted'], 0)) || 0)));
    const guideSections = Math.max(0, Math.min(32, Math.floor(Number(pick_(payload, ['guide_sections','guideSections'], 0)) || 0)));
    const appBuild = String(pick_(payload, ['app_build','appBuild'], '') || '').slice(0, 80);
    const sheet = ensureChallengeSheet_();
    const lastRow = sheet.getLastRow();
    let targetRow = 0;
    let previousXP = 0;
    if (lastRow >= 2) {
      const ids = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
      for (let i = 0; i < ids.length; i += 1) {
        if (String(ids[i][0] || '').toLowerCase() === id) {
          targetRow = i + 2;
          previousXP = Number(ids[i][1]) || 0;
          break;
        }
      }
    }
    const bestXP = Math.max(previousXP, xp);
    const row = [id, bestXP, scenarios, guideSections, appBuild, new Date()];
    if (targetRow) sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
    else sheet.appendRow(row);
    return { topXP: Math.max(bestXP, getChallengeTopXP_()) };
  }

  function jsonResponse(obj) {
    const response = Object.assign({ receiver_version: PROMPTCRAFT_RECEIVER_VERSION }, obj || {});
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  }

  function safeResearchCell_(value) {
    if (typeof value !== 'string') return value;
    return /^\s*[=+\-@]/.test(value) ? "'" + value : value;
  }

  function safeResearchRow_(row) {
    return (row || []).map(safeResearchCell_);
  }

  function fallbackEventId_(raw, status) {
    return ['receiver', status || 'legacy', Date.now(), String(raw || '').length].join('-');
  }

  function eventIdForPayload_(payload, raw) {
    const supplied = pick_(payload, ['event_id', 'eventId'], '');
    if (supplied) return String(supplied).slice(0, 240);
    const parts = [
      'legacy',
      pick_(payload, ['timestamp'], ''),
      pick_(payload, ['session_id', 'sessionId'], ''),
      pick_(payload, ['scenario_index', 'scenarioIndex', 'scenario'], ''),
      pick_(payload, ['type'], ''),
      String(raw || '').length
    ];
    return parts.map(value => String(value || '').replace(/[^A-Za-z0-9_.:-]/g, '_')).join(':').slice(0, 240);
  }

  function ensureRawArchiveHeaders_(sheet) {
    ensureColumnCount_(sheet, RAW_ARCHIVE_HEADERS.length);
    const current = sheet.getRange(1, 1, 1, RAW_ARCHIVE_HEADERS.length).getDisplayValues()[0];
    if (RAW_ARCHIVE_HEADERS.some((header, index) => current[index] !== header)) {
      sheet.getRange(1, 1, 1, RAW_ARCHIVE_HEADERS.length).setValues([RAW_ARCHIVE_HEADERS]);
    }
    sheet.setFrozenRows(1);
  }

  function hasArchivedEventId_(eventId) {
    if (!eventId) return false;
    const sheet = getSheet_(SHEET_RAW_ARCHIVE);
    ensureRawArchiveHeaders_(sheet);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return false;
    return sheet.getRange(2, 1, lastRow - 1, 4).getDisplayValues()
      .some(row => String(row[0] || '') === String(eventId) && String(row[3] || '') === 'accepted');
  }

  function appendRawPayloadArchive_(eventId, raw, status) {
    const sheet = getSheet_(SHEET_RAW_ARCHIVE);
    ensureRawArchiveHeaders_(sheet);
    const text = String(raw || '');
    const chunks = [];
    for (let offset = 0; offset < Math.max(1, text.length); offset += RAW_ARCHIVE_CHUNK_SIZE) {
      chunks.push(text.slice(offset, offset + RAW_ARCHIVE_CHUNK_SIZE));
    }
    const receivedAt = new Date();
    const rows = chunks.map((chunk, index) => [
      eventId, receivedAt, PROMPTCRAFT_RECEIVER_VERSION, status || 'accepted',
      index + 1, chunks.length, text.length, chunk
    ]);
    insertRowsBelowHeader_(sheet, 1, rows);
    sheet.getRange(2, 2, rows.length, 1).setNumberFormat(TIMESTAMP_FORMAT);
    return rows.length;
  }

  function appendReceiverFailureAudit_(eventId, raw, error, status) {
    const sheet = getSheet_(SHEET_RAW_AUDIT);
    ensureRawAuditHeaders_(sheet);
    insertRowsBelowHeader_(sheet, 1, [[
      new Date(), PROMPTCRAFT_RECEIVER_VERSION, '', '', status || 'processing_error', '', '',
      'event_id=' + eventId + ', error=' + String(error && error.message ? error.message : error),
      String(raw || '').slice(0, 4500)
    ]]);
  }

  function insertRowsBelowHeader_(sheet, headerRows, rows) {
    if (!rows || !rows.length) return 0;

    const startRow = headerRows + 1;
    const colCount = rows[0].length;

    sheet.insertRowsBefore(startRow, rows.length);
    sheet.getRange(startRow, 1, rows.length, colCount).setValues(rows);

    return rows.length;
  }

  function timestampToMillis_(value) {
    if (!value) return 0;

    if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
      return value.getTime();
    }

    if (typeof value === 'number' && !isNaN(value)) {
      // Google Sheets may occasionally expose date serials as numbers.
      return Math.round((value - 25569) * 86400000);
    }

    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  }

  function pick_(obj, keys, fallback) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
    }
    return fallback === undefined ? '' : fallback;
  }

  function normalizeListText_(value) {
    if (value === undefined || value === null) return '';
    if (Array.isArray(value)) return value.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(' | ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  function readablePromptLabel_(value) {
    return String(value || '')
      .replace(/^S\d+\s+evidence\s+case\s+(\d+)\s*\(([^)]+)\)\s*:\s*/i, 'Case $1 ($2): ')
      .replace(/^S\d+\s+Babbage\s+audit\s*:\s*/i, 'Babbage audit: ')
      .replace(/^S\d+\s+([A-Za-z][A-Za-z ]{1,32})\s*:\s*/i, (_, label) => {
        const clean = String(label || '').trim();
        return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) + ': ' : '';
      })
      .replace(/\s+/g, ' ')
      .trim();
  }

  function collectReadablePromptItems_(value, items) {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach(item => collectReadablePromptItems_(item, items));
      return;
    }

    if (typeof value === 'object') {
      const preferredKeys = ['prompt','prompt_text','text','response','answer','selection','value','label','title'];
      const preferred = preferredKeys.filter(key => value[key] !== undefined && value[key] !== null && value[key] !== '');
      if (preferred.length) {
        preferred.forEach(key => collectReadablePromptItems_(value[key], items));
        return;
      }
      Object.keys(value).forEach(key => {
        if (/^(id|timestamp|request|provider|model|usage|metadata|schema|build)/i.test(key)) return;
        const nested = [];
        collectReadablePromptItems_(value[key], nested);
        nested.forEach(text => items.push(`${key.replace(/_/g, ' ')}: ${text}`));
      });
      return;
    }

    const text = String(value).trim();
    if (!text) return;

    if (/^[\[{]/.test(text)) {
      const parsed = parseJsonMaybe_(text, null);
      if (parsed !== null) {
        collectReadablePromptItems_(parsed, items);
        return;
      }
    }

    text.split(/\s+\|\s+/).forEach(part => {
      const clean = readablePromptLabel_(part);
      if (clean) items.push(clean);
    });
  }

  function readablePromptData_(value) {
    const items = [];
    collectReadablePromptItems_(value, items);
    const unique = [];
    const seen = {};
    items.forEach(item => {
      const key = String(item || '').toLowerCase().replace(/\s+/g, ' ').trim();
      if (!key || seen[key]) return;
      seen[key] = true;
      unique.push(item);
    });
    if (!unique.length) return '';
    if (unique.length === 1) return unique[0];
    return unique.map(item => `• ${item}`).join('\n');
  }

  function ensureColumnCount_(sheet, count) {
    const maxColumns = sheet.getMaxColumns();
    if (maxColumns < count) sheet.insertColumnsAfter(maxColumns, count - maxColumns);
  }

  function parseJsonMaybe_(value, fallback) {
    if (value && typeof value === 'object') return value;
    if (typeof value === 'string' && value.trim()) {
      try { return JSON.parse(value); } catch (err) { /* keep fallback */ }
    }
    return fallback === undefined ? null : fallback;
  }

  function buildScenarioDetailJson_(payload) {
    if (payload && payload.scenario_detail_json) return normalizeListText_(payload.scenario_detail_json);
    const detail = {};
    Object.keys(payload || {}).forEach(key => {
      if (/^s\d+_/i.test(key)) detail[key] = payload[key];
    });
    return Object.keys(detail).length ? JSON.stringify(detail) : '';
  }

  function incrementalRowToObject_(row) {
    return {
      timestamp: row[INC_COL.timestamp - 1],
      participant_id: row[INC_COL.participant - 1],
      session_id: row[INC_COL.session - 1],
      scenario_index: row[INC_COL.scenario - 1],
      scenario_label: row[INC_COL.label - 1],
      session_duration_min: row[INC_COL.duration - 1],
      scenarios_completed: row[INC_COL.completed - 1],
      total_xp: row[INC_COL.totalXp - 1],
      total_attempts: row[INC_COL.totalAttempts - 1],
      attempts: row[INC_COL.attempts - 1],
      current_score: row[INC_COL.currentScore - 1],
      best_score: row[INC_COL.bestScore - 1],
      score_delta: row[INC_COL.scoreDelta - 1],
      prompt_text: row[INC_COL.promptText - 1],
      all_prompts: row[INC_COL.allPrompts - 1],
      babbage_response: row[INC_COL.babbageResponse - 1],
      quality_indicators_lit: row[INC_COL.quality - 1],
      self_report_prediction: row[INC_COL.selfReport - 1],
      ai_provider: row[INC_COL.aiProvider - 1],
      ai_model: row[INC_COL.aiModel - 1],
      ai_request_id: row[INC_COL.aiRequestId - 1],
      ai_elapsed_ms: row[INC_COL.aiElapsed - 1],
      ai_usage_json: row[INC_COL.aiUsage - 1],
      babbage_analysis_json: row[INC_COL.analysis - 1],
      scenario_detail_json: row[INC_COL.detail - 1],
      time_since_last_attempt_sec: row[INC_COL.timeSince - 1],
      screen_width: row[INC_COL.screenWidth - 1],
      event_type: row[INC_COL.eventType - 1],
      schema_version: row[INC_COL.appSchema - 1],
      app_build: row[INC_COL.appBuild - 1],
      payload_shape: row[INC_COL.payloadShape - 1],
      notes_coding_memo: row[INC_COL.notes - 1]
    };
  }

  function getLatestIncrementalRecord_(participantId, scenarioIndex, sessionId) {
    const sheet = getSheet_(SHEET_INCREMENTAL);
    ensureIncrementalHeaders(sheet);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return null;
    const rows = sheet.getRange(2, 1, lastRow - 1, INCREMENTAL_HEADERS.length).getValues();
    const participant = String(participantId || '');
    const scenario = String(scenarioIndex || '');
    const session = String(sessionId || '');
    for (let i = 0; i < rows.length; i++) {
      const record = incrementalRowToObject_(rows[i]);
      if (String(record.participant_id || '') !== participant) continue;
      if (String(record.scenario_index || '') !== scenario) continue;
      if (session && String(record.session_id || '') !== session) continue;
      return record;
    }
    return null;
  }

  function lastAttemptFromJson_(value) {
    const parsed = parseJsonMaybe_(value, []);
    return Array.isArray(parsed) && parsed.length ? parsed[parsed.length - 1] : null;
  }

  function choiceFromAttempt_(attempt) {
    if (!attempt) return '';
    const selection = attempt.selection;
    if (Array.isArray(selection)) return selection.length ? String(selection[0] || '') : '';
    return selection === undefined || selection === null ? '' : String(selection);
  }

  function deriveS2ReviewSource_(provider, review) {
    const p = String(provider || '').toLowerCase();
    const status = String((review && review.status) || '').toLowerCase();
    if (p === 'local-fallback' || status.indexOf('fallback') >= 0) return 'fallback';
    if (review && typeof review === 'object' && Object.keys(review).length) return 'live';
    return provider ? 'live' : 'unknown';
  }

  function extractS2Record_(payload, incrementalRecord) {
    const p = payload || {};
    const inc = incrementalRecord || {};
    const detail = parseJsonMaybe_(pick_(p, ['scenario_detail_json'], inc.scenario_detail_json || ''), {}) || {};

    const diagnosisJson = pick_(p, ['s2_diagnosis_json'], pick_(detail, ['s2_diagnosis_json'], ''));
    const evidenceJson = pick_(p, ['s2_evidence_json'], pick_(detail, ['s2_evidence_json'], ''));
    const thinkingMove = pick_(p, ['s2_thinking_move'], pick_(detail, ['s2_thinking_move'], ''));
    const auditJson = pick_(p, ['s2_audit_json'], pick_(detail, ['s2_audit_json'], ''));
    const repairText = pick_(p, ['s2_repair_text'], pick_(detail, ['s2_repair_text'], ''));

    const analysisRaw = pick_(p, ['s2_babbage_analysis_json', 'babbage_analysis_json'], inc.babbage_analysis_json || '');
    const analysis = parseJsonMaybe_(analysisRaw, {}) || {};
    const draft = parseJsonMaybe_(pick_(p, ['s2_babbage_draft_json'], analysis.s2_draft || null), analysis.s2_draft || null);
    const review = parseJsonMaybe_(pick_(p, ['s2_babbage_review_json'], analysis.s2_review || null), analysis.s2_review || null);

    const diagnosisAttempt = lastAttemptFromJson_(diagnosisJson);
    const evidenceAttempt = lastAttemptFromJson_(evidenceJson);
    const auditAttempt = lastAttemptFromJson_(auditJson);
    const provider = pick_(p, ['s2_ai_provider', 'ai_provider'], inc.ai_provider || '');
    const model = pick_(p, ['s2_ai_model', 'ai_model'], inc.ai_model || '');

    return {
      attempts: pick_(p, ['s2_attempts'], inc.attempts || ''),
      best_score: pick_(p, ['s2_best_score'], inc.best_score || ''),
      all_prompts: normalizeListText_(pick_(p, ['s2_prompts'], inc.all_prompts || inc.prompt_text || '')),
      diagnosis_choice: pick_(p, ['s2_diagnosis_final'], choiceFromAttempt_(diagnosisAttempt)),
      diagnosis_json: normalizeListText_(diagnosisJson),
      intervention_choice: pick_(p, ['s2_evidence_final'], choiceFromAttempt_(evidenceAttempt)),
      intervention_json: normalizeListText_(evidenceJson),
      thinking_move: thinkingMove,
      audit_choice: pick_(p, ['s2_audit_final'], choiceFromAttempt_(auditAttempt)),
      audit_correct: pick_(p, ['s2_audit_correct'], auditAttempt && auditAttempt.exact !== undefined ? auditAttempt.exact : ''),
      audit_json: normalizeListText_(auditJson),
      repair_text: repairText,
      draft_json: draft ? JSON.stringify(draft) : '',
      review_json: review ? JSON.stringify(review) : '',
      review_source: pick_(p, ['s2_review_source'], deriveS2ReviewSource_(provider, review)),
      ai_provider: provider,
      ai_model: model,
      final_response: normalizeListText_(pick_(p, ['s2_final_response', 'final_response', 'babbage_response', 'claude_response'], inc.babbage_response || '')),
      quality_indicators: normalizeListText_(pick_(p, ['s2_oscqr', 'quality_indicators_lit', 'oscqr_lit'], inc.quality_indicators_lit || ''))
    };
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
    const verified = SCENARIO_LABELS[Number(scenarioIndex)] || '';
    if (verified) return verified;
    const supplied = pick_(payload, ['scenario_label', 'scenarioLabel'], '');
    if (supplied && !isNumeric_(supplied)) return supplied;
    return '';
  }

  function normalizeScore_(value, fallback) {
    const v = value === undefined || value === null || value === '' ? fallback : value;
    if (v === undefined || v === null || v === '') return '';
    const n = Number(v);
    return isNaN(n) ? v : n;
  }

  function metadataFromNotes_(notes, key) {
    const match = String(notes || '').match(new RegExp('(?:^|\\s*::\\s*)' + key + '=([^:]+?)(?=\\s*::\\s*|$)'));
    return match ? String(match[1] || '').trim() : '';
  }

  function normalizeIncrementalPayload_(p) {
    const participantId = pick_(p, ['participant_id', 'participantId'], 'anonymous');
    const sessionId = pick_(p, ['session_id', 'sessionId'], '');
    const scenarioIndex = normalizeScenarioIndex_(p);
    const scenarioLabel = getScenarioLabel_(scenarioIndex, p);
    const activityId = String(pick_(p, ['activity_id', 'activityId'], '') || 'scenario').trim();
    const scoreScaleMax = normalizeScore_(pick_(p, ['score_scale_max', 'scoreScaleMax'], 5), 5);

    const bestScoreRaw = pick_(p, ['best_score', 'bestScore'], '');
    const currentScoreRaw = pick_(p, ['current_score', 'currentScore', 'score'], bestScoreRaw);
    const bestScore = normalizeScore_(bestScoreRaw, '');
    const currentScore = normalizeScore_(currentScoreRaw, bestScore);

    const last = getLatestIncrementalRecord_(participantId, scenarioIndex, sessionId);
    let scoreDelta = pick_(p, ['score_delta', 'scoreDelta'], '');
    const lastActivityId = last ? metadataFromNotes_(last.notes_coding_memo, 'activity_id') : '';
    const lastScoreScale = last ? metadataFromNotes_(last.notes_coding_memo, 'score_scale_max') : '';
    const comparableAttempt = !last || (
      (!lastActivityId || lastActivityId === activityId) &&
      (!lastScoreScale || Number(lastScoreScale) === Number(scoreScaleMax))
    );
    if (!comparableAttempt) scoreDelta = 0;
    if (scoreDelta === '' && last && currentScore !== '' && !isNaN(Number(currentScore)) && last.current_score !== '' && !isNaN(Number(last.current_score))) {
      scoreDelta = Number(currentScore) - Number(last.current_score);
    }
    if (scoreDelta === '') scoreDelta = 0;

    let timeSince = pick_(p, ['time_since_last_attempt_sec', 'timeSinceLastAttemptSec'], '');
    if (timeSince === '' && last && last.timestamp) {
      const now = parseDate_(p.timestamp);
      const old = parseDate_(last.timestamp);
      const deltaSec = Math.round((now.getTime() - old.getTime()) / 1000);
      timeSince = deltaSec >= 0 ? deltaSec : '';
    }
    if (timeSince === '') timeSince = 0;

    const promptText = normalizeListText_(pick_(p, ['prompt_text', 'promptText', 'last_prompt', 'lastPrompt'], ''));
    const allPrompts = normalizeListText_(pick_(p, ['prompts', 'all_prompts', 'allPrompts'], promptText));
    const babbageResponse = normalizeListText_(pick_(p, ['babbage_response', 'babbageResponse', 'final_response', 'finalResponse', 'claude_response', 'claudeResponse', 'ai_response', 'aiResponse'], ''));

    return {
      type: 'incremental',
      timestamp: parseDate_(p.timestamp),
      participant_id: participantId,
      session_id: sessionId,
      scenario_index: scenarioIndex,
      scenario_label: scenarioLabel,
      session_duration_min: pick_(p, ['session_duration_min', 'sessionDurationMin'], ''),
      scenarios_completed: pick_(p, ['scenarios_completed', 'scenariosCompleted'], ''),
      total_xp: pick_(p, ['total_xp', 'totalXp', 'totalXP', 'xp'], ''),
      total_attempts: pick_(p, ['total_attempts', 'totalAttempts'], ''),
      attempts: pick_(p, ['attempts', 'attempt_number', 'attemptNumber'], ''),
      current_score: currentScore,
      best_score: bestScore === '' ? currentScore : bestScore,
      score_delta: scoreDelta,
      prompt_text: promptText || allPrompts,
      all_prompts: allPrompts || promptText,
      babbage_response: babbageResponse,
      quality_indicators_lit: normalizeListText_(pick_(p, ['quality_indicators_lit', 'qualityIndicatorsLit', 'oscqr_lit', 'oscqrLit', 'qualityIndicators', 'indicators'], '')),
      self_report_prediction: normalizeListText_(pick_(p, ['self_report_prediction', 'selfReportPrediction', 'self_report', 'selfReport', 'prediction', 'predictions'], '')),
      ai_provider: pick_(p, ['ai_provider', 'aiProvider'], ''),
      ai_model: pick_(p, ['ai_model', 'aiModel'], ''),
      ai_request_id: pick_(p, ['ai_request_id', 'aiRequestId'], ''),
      ai_elapsed_ms: pick_(p, ['ai_elapsed_ms', 'aiElapsedMs'], ''),
      ai_usage_json: normalizeListText_(pick_(p, ['ai_usage_json', 'aiUsageJson'], '')),
      babbage_analysis_json: normalizeListText_(pick_(p, ['babbage_analysis_json', 'babbageAnalysisJson'], '')),
      scenario_detail_json: buildScenarioDetailJson_(p),
      time_since_last_attempt_sec: timeSince,
      screen_width: pick_(p, ['screen_width', 'screenWidth', 'viewport_width', 'viewportWidth'], ''),
      event_type: pick_(p, ['event_type', 'eventType'], 'incremental_save'),
      event_id: eventIdForPayload_(p, JSON.stringify(p || {})),
      activity_id: activityId,
      score_scale_max: scoreScaleMax,
      schema_version: pick_(p, ['schema_version'], ''),
      app_build: pick_(p, ['app_build'], ''),
      payload_shape: pick_(p, ['payload_shape'], ''),
      notes_coding_memo: [
        pick_(p, ['notes_coding_memo', 'notesCodingMemo', 'notes', 'codingMemo'], ''),
        'event_id=' + eventIdForPayload_(p, JSON.stringify(p || {})),
        'activity_id=' + activityId,
        'score_scale_max=' + scoreScaleMax
      ].filter(Boolean).join(' :: ')
    };
  }

  function clampColumnWidth_(sheet, column, minWidth, maxWidth) {
    const measured = sheet.getColumnWidth(column);
    const width = Math.max(minWidth, Math.min(maxWidth, measured));
    if (width !== measured) sheet.setColumnWidth(column, width);
    return width;
  }

  function smartAutoFitColumns_(sheet, headerRow, columnCount, options) {
    const opts = options || {};
    const lastRow = Math.max(sheet.getLastRow(), headerRow);
    const headers = sheet.getRange(headerRow, 1, 1, columnCount).getDisplayValues()[0];

    // Start from Google's current content measurement, then make it research-sheet sane.
    sheet.autoResizeColumns(1, columnCount);

    for (let col = 1; col <= columnCount; col++) {
      const header = String(headers[col - 1] || '').toLowerCase();
      let minWidth = 90;
      let maxWidth = 190;

      if (col === 1 || /timestamp|received at/.test(header)) {
        minWidth = 155;
        maxWidth = 190;
      } else if (/participant id/.test(header)) {
        minWidth = 220;
        maxWidth = 320;
      } else if (/scenario label/.test(header)) {
        minWidth = 150;
        maxWidth = 240;
      } else if (/prompt|response|narrative|json|reflection|notes|memo|idea|excerpt|prediction|self-report|payload keys|raw json/.test(header)) {
        minWidth = 220;
        maxWidth = /raw json/.test(header) ? 520 : 420;
      } else if (/quality indicators|section reviews/.test(header)) {
        minWidth = 200;
        maxWidth = 360;
      } else if (/referrer/.test(header)) {
        minWidth = 180;
        maxWidth = 320;
      } else if (/screen width|score|attempt|duration|completed|xp|correct|scenario #|event type/.test(header)) {
        minWidth = 95;
        maxWidth = 155;
      }

      // Optional sheet-specific bounds win over generic header rules.
      if (opts.columns && opts.columns[col]) {
        const rule = opts.columns[col];
        if (rule.min !== undefined) minWidth = rule.min;
        if (rule.max !== undefined) maxWidth = rule.max;
      }

      clampColumnWidth_(sheet, col, minWidth, maxWidth);
    }

    if (lastRow > headerRow) {
      sheet.autoResizeRows(headerRow + 1, lastRow - headerRow);
    }
  }

  function formatIncrementalSheet_(sheet) {
    ensureIncrementalHeaders(sheet);
    coerceTimestampColumn_(sheet, 2);
    const lastRow = Math.max(sheet.getLastRow(), 2);
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(5);
    sheet.getRange('A:A').setNumberFormat(TIMESTAMP_FORMAT);
    sheet.getRange('F:F').setNumberFormat('0.0');
    sheet.getRange('G:J').setNumberFormat('0');
    sheet.getRange('K:M').setNumberFormat('0.0');
    sheet.getRange('V:V').setNumberFormat('0');
    sheet.getRange('Z:AA').setNumberFormat('0');

    // Keep narrative fields readable, but do not let technical JSON create enormous rows.
    sheet.getRange('A:AF').setWrap(false);
    sheet.getRange('N:R').setWrap(true);
    sheet.getRange('AF:AF').setWrap(true);
    if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, INCREMENTAL_HEADERS.length).setVerticalAlignment('top').setFontSize(9);

    const header = sheet.getRange(1, 1, 1, INCREMENTAL_HEADERS.length);
    header.setFontWeight('bold').setFontColor('#ffffff').setWrap(true).setVerticalAlignment('middle').setHorizontalAlignment('center');
    sheet.getRange('A1:M1').setBackground('#174C3A');
    sheet.getRange('N1:R1').setBackground('#215C45');
    sheet.getRange('S1:Y1').setBackground('#23665F');
    sheet.getRange('Z1:AF1').setBackground('#475569');
    sheet.setRowHeight(1, 42);

    smartAutoFitColumns_(sheet, 1, INCREMENTAL_HEADERS.length, {
      columns: {
        1: { min: 155, max: 190 }, 2: { min: 180, max: 260 }, 3: { min: 180, max: 260 },
        4: { min: 85, max: 110 }, 5: { min: 150, max: 220 },
        14: { min: 240, max: 360 }, 15: { min: 260, max: 380 }, 16: { min: 260, max: 400 },
        17: { min: 200, max: 300 }, 18: { min: 200, max: 300 },
        23: { min: 220, max: 320 }, 24: { min: 260, max: 360 }, 25: { min: 260, max: 360 },
        28: { min: 130, max: 190 }, 29: { min: 120, max: 170 }, 30: { min: 150, max: 220 },
        31: { min: 150, max: 220 }, 32: { min: 240, max: 360 }
      }
    });
  }

  function applyResponseGroupHeaders_(sheet) {
    ensureColumnCount_(sheet, RESPONSE_HEADERS.length);
    sheet.getRange(1, 1, 1, RESPONSE_HEADERS.length).breakApart();
    RESPONSE_GROUPS.forEach(g => {
      const [label, start, end, color] = g;
      const range = sheet.getRange(1, start, 1, end - start + 1);
      if (end > start) range.merge();
      range.setValue(label);
      range.setBackground(color).setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
    });
  }

  function formatFullResponseSheet_(sheet) {
    ensureFullResponseHeaders(sheet);
    coerceTimestampColumn_(sheet, 3);
    const lastRow = Math.max(sheet.getLastRow(), 3);
    const lastCol = RESPONSE_HEADERS.length;
    sheet.getRange('A:A').setNumberFormat(TIMESTAMP_FORMAT);
    sheet.getRange('D:D').setNumberFormat('0.0');
    sheet.getRange('E:G').setNumberFormat('0');
    sheet.getRange('H:H').setWrap(true);
    sheet.getRange(2, 1, 1, lastCol).setFontWeight('bold').setBackground('#e8f0eb').setWrap(true).setVerticalAlignment('middle');
    if (lastRow > 2) sheet.getRange(3, 1, lastRow - 2, lastCol).setVerticalAlignment('top').setWrap(true);
    sheet.getRange('B:C').setWrap(false);
    smartAutoFitColumns_(sheet, 2, lastCol, {
      columns: {
        2: { min: 220, max: 320 },
        3: { min: 220, max: 320 },
        8: { min: 220, max: 360 },
        17: { min: 260, max: 440 },
        19: { min: 260, max: 420 },
        21: { min: 260, max: 420 },
        25: { min: 260, max: 420 },
        26: { min: 300, max: 520 },
        27: { min: 300, max: 520 },
        28: { min: 300, max: 520 },
        32: { min: 300, max: 520 },
        73: { min: 110, max: 150 },
        74: { min: 180, max: 320 },
        75: { min: 180, max: 280 }
      }
    });
  }

  function deriveTotalXPFromIncrementalPayload_(p) {
    const rawDirect = pick_(p, ['total_xp', 'totalXp', 'totalXP', 'xp'], '');
    if (rawDirect !== '' && rawDirect !== null && rawDirect !== undefined) {
      const direct = Number(rawDirect);
      if (!isNaN(direct) && direct >= 0) return Math.round(direct);
    }

    const best = Number(p.best_score || p.bestScore || p.current_score || p.currentScore || 0);
    if (!isNaN(best) && best > 0) return Math.round(best * 25);
    return 0;
  }

  function derivePreSubmitPredictionFromPayload_(p) {
    const prediction = normalizeListText_(pick_(p, [
      'self_report_prediction',
      'selfReportPrediction',
      'self_report',
      'selfReport',
      'prediction',
      'predictions'
    ], ''));

    return prediction || 'No pre-submit prediction captured';
  }

  function normalizeWallReviewStatus_(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (['publish','published','public','approved','yes','true'].indexOf(raw) >= 0) return 'Publish';
    if (['hold','held','later','maybe'].indexOf(raw) >= 0) return 'Hold';
    if (['reject','rejected','no','false'].indexOf(raw) >= 0) return 'Reject';
    return 'Needs Review';
  }

  function ensureIdeaHeaders(sheet) {
    const headers = ['Timestamp','Participant ID','Scenario #','Scenario Label','Score','Wall Candidate','Candidate Reason','Review Status','Research Notes'];
    const lastRow = sheet.getLastRow();
    const currentWidth = Math.max(sheet.getLastColumn(), 9);
    const current = sheet.getRange(1, 1, 1, currentWidth).getValues()[0];

    const isLegacyEightColumn = String(current[0] || '') === 'Timestamp'
      && String(current[5] || '') === 'AI Response or Idea Excerpt'
      && String(current[6] || '') === 'Approved for Wall';

    if (isLegacyEightColumn) {
      const oldRows = lastRow >= 2 ? sheet.getRange(2, 1, lastRow - 1, 8).getValues() : [];
      const migrated = oldRows.map(row => [
        row[0], row[1], row[2], row[3], row[4], row[5],
        'Legacy Ideas Wall entry',
        normalizeWallReviewStatus_(row[6]),
        row[7]
      ]);

      if (sheet.getMaxRows() > 1) {
        sheet.getRange(2, 1, sheet.getMaxRows() - 1, 9).clearContent();
      }
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      if (migrated.length) sheet.getRange(2, 1, migrated.length, headers.length).setValues(migrated);
    } else if (headers.some((h, i) => current[i] !== h)) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    sheet.setFrozenRows(1);

    const validation = SpreadsheetApp.newDataValidation()
      .requireValueInList(IDEAS_WALL_REVIEW_STATUSES.slice(), true)
      .setAllowInvalid(false)
      .setHelpText('Choose whether this candidate should appear on the public Ideas Wall.')
      .build();
    if (sheet.getMaxRows() > 1) {
      // Remove validation left behind on blank rows by older receiver versions.
      sheet.getRange(2, 8, sheet.getMaxRows() - 1, 1).clearDataValidations();
    }
    const validationRows = Math.max(1, sheet.getLastRow() - 1);
    sheet.getRange(2, 8, validationRows, 1).setDataValidation(validation);
  }

  function applyIdeasWallStatusFormatting_(sheet) {
    const rowCount = Math.max(1, sheet.getLastRow() - 1);
    const range = sheet.getRange(2, 8, rowCount, 1);
    const rules = [
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Publish').setBackground('#DDF2E5').setFontColor('#155B36').setBold(true).setRanges([range]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Needs Review').setBackground('#FFF3CD').setFontColor('#795500').setBold(true).setRanges([range]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Hold').setBackground('#E9EEF3').setFontColor('#475569').setBold(true).setRanges([range]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Reject').setBackground('#FCE3E3').setFontColor('#8A2E2E').setBold(true).setRanges([range]).build()
    ];
    sheet.setConditionalFormatRules(rules);
  }

  function formatIdeasSheet_(sheet) {
    ensureIdeaHeaders(sheet);
    coerceTimestampColumn_(sheet, 2);
    const lastRow = Math.max(sheet.getLastRow(), 2);
    const bodyRows = Math.max(1, lastRow - 1);
    if (sheet.getMaxRows() > 1) sheet.getRange(2, 1, sheet.getMaxRows() - 1, 9).clearFormat();
    sheet.getRange(2, 1, bodyRows, 9).setWrap(false);
    sheet.getRange(2, 1, bodyRows, 1).setNumberFormat(TIMESTAMP_FORMAT);
    sheet.getRange(2, 6, bodyRows, 2).setWrap(true);
    sheet.getRange(2, 9, bodyRows, 1).setWrap(true);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#174C3A').setFontColor('#ffffff').setWrap(true).setHorizontalAlignment('center').setVerticalAlignment('middle');
    sheet.setRowHeight(1, 34);
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 9).setVerticalAlignment('top').setFontSize(9);
      sheet.autoResizeRows(2, lastRow - 1);
    }
    smartAutoFitColumns_(sheet, 1, 9, {
      columns: {
        1:{min:155,max:190}, 2:{min:150,max:230}, 3:{min:85,max:110}, 4:{min:150,max:220},
        5:{min:80,max:105}, 6:{min:300,max:480}, 7:{min:190,max:300}, 8:{min:125,max:165}, 9:{min:220,max:340}
      }
    });
    applyIdeasWallStatusFormatting_(sheet);
  }

  function ensureRawAuditHeaders_(sheet) {
    const headers = ['Received At','Receiver Version','App Schema Seen','App Build Seen','Payload Type','Participant ID','Scenario #','Payload Keys','Raw JSON Preview'];
    const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (headers.some((h, i) => current[i] !== h)) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  function formatRawAuditSheet_(sheet) {
    ensureRawAuditHeaders_(sheet);
    sheet.getRange('A:A').setNumberFormat(TIMESTAMP_FORMAT);
    sheet.getRange('A:I').setWrap(false);
    sheet.getRange('H:I').setWrap(true);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#374151').setFontColor('#ffffff').setWrap(true).setHorizontalAlignment('center').setVerticalAlignment('middle');
    sheet.setRowHeight(1, 36);
    smartAutoFitColumns_(sheet, 1, 9, {
      columns: { 1:{min:155,max:190}, 2:{min:120,max:170}, 3:{min:120,max:170}, 4:{min:150,max:220}, 5:{min:120,max:170}, 6:{min:180,max:260}, 7:{min:85,max:110}, 8:{min:260,max:420}, 9:{min:320,max:520} }
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

  function isPresentForView_(value) {
    return value !== '' && value !== null && value !== undefined;
  }

  function excerptForView_(value, limit) {
    if (!isPresentForView_(value)) return '';
    const text = String(value);
    const max = Number(limit || 700);
    return text.length <= max ? text : text.slice(0, max).replace(/\s+$/, '') + ' …';
  }

  function fullTextForView_(value) {
    if (!isPresentForView_(value)) return '';
    return String(value);
  }

  function getReadableColumnProfile_(header) {
    const h = String(header || '').toLowerCase();
    if (/timestamp/.test(h)) return { min: 145, max: 175, wrap: false, align: 'left' };
    if (/participant id/.test(h)) return { min: 135, max: 190, wrap: false, align: 'left' };
    if (/session id/.test(h)) return { min: 155, max: 220, wrap: false, align: 'left' };
    if (/scenario$|scenario label/.test(h)) return { min: 135, max: 180, wrap: true, align: 'left' };
    if (/diagnosis|intervention|thinking move|audit choice|function choice|check choice|prediction made|institutional policies|case studies|integrity pledge|scenario cards|learning objectives/.test(h)) {
      return { min: 135, max: 220, wrap: true, align: 'left' };
    }
    if (/evidence statement|flagged claim|corrected claim|verification note|self-report|what worked|what fell short|why prompt|surprise|transfer/.test(h)) {
      return { min: 190, max: 285, wrap: true, align: 'left', narrative: true };
    }
    if (/renamed activities/.test(h)) return { min: 220, max: 300, wrap: true, align: 'left', narrative: true };
    if (/learning path|prepare\s*\/\s*practice\s*\/\s*evidence/.test(h)) return { min: 260, max: 340, wrap: true, align: 'left', narrative: true };
    if (/oscqr references/.test(h)) return { min: 280, max: 380, wrap: true, align: 'left', narrative: true };
    if (/checkpoint feedback/.test(h)) return { min: 300, max: 400, wrap: true, align: 'left', narrative: true };
    if (/guide step added|guide completed|guide progress/.test(h)) return { min: 150, max: 190, wrap: true, align: 'left' };
    if (/input|prompt|response|repair|revision|reflection|notes|growth narrative/.test(h)) return { min: 220, max: 320, wrap: true, align: 'left', narrative: true };
    if (/quality indicators/.test(h)) return { min: 180, max: 250, wrap: true, align: 'left' };
    if (/review source|provider|model|ai source/.test(h)) return { min: 125, max: 190, wrap: true, align: 'left' };
    if (/score|attempt|duration|completed|xp|correct|scenario #|elapsed|screen width|time since/.test(h)) return { min: 78, max: 110, wrap: false, align: 'center' };
    return { min: 105, max: 175, wrap: true, align: 'left' };
  }

  function estimateReadableColumnWidth_(sheet, column, header, dataStartRow, dataEndRow, profile) {
    let longest = String(header || '').length;
    let hasLongNarrative = false;

    if (dataEndRow >= dataStartRow) {
      const rowCount = dataEndRow - dataStartRow + 1;
      // Sizing every value in a very large research sheet can make each POST sluggish.
      // A representative sample is enough because the width is clamped by column type.
      const sampleCount = Math.min(rowCount, 200);
      const values = sheet.getRange(dataStartRow, column, sampleCount, 1).getDisplayValues();
      values.forEach(row => {
        const text = String(row[0] || '');
        if (text.length > 140) hasLongNarrative = true;
        text.split(/\r?\n/).forEach(line => {
          longest = Math.max(longest, Math.min(line.length, 80));
        });
      });
    }

    // A practical approximation of 9–10 pt spreadsheet text in pixels.
    let estimated = Math.round(longest * 7.2 + 28);

    // Narrative fields should be comfortably readable once real participant text exists,
    // even if the first line itself is short because the response contains line breaks.
    if (profile.narrative && hasLongNarrative) {
      estimated = Math.max(estimated, 320);
    }

    return Math.max(profile.min, Math.min(profile.max, estimated));
  }

  function formatReadableColumn_(sheet, column, header, dataStartRow, dataEndRow) {
    const profile = getReadableColumnProfile_(header);
    const width = estimateReadableColumnWidth_(sheet, column, header, dataStartRow, dataEndRow, profile);

    sheet.setColumnWidth(column, width);

    if (dataEndRow >= dataStartRow) {
      const dataRange = sheet.getRange(dataStartRow, column, dataEndRow - dataStartRow + 1, 1);
      dataRange.setWrap(profile.wrap).setHorizontalAlignment(profile.align);
    }
  }

  function fitReadableDataRows_(sheet, startRow, rowCount, columnCount) {
    if (rowCount <= 0 || columnCount <= 0) return;

    // Resize *after* all final column widths and wrap settings are in place.
    // This is what lets the actual content determine the row height.
    sheet.autoResizeRows(startRow, rowCount);

    // Keep short rows compact while allowing wrapped excerpts enough room to display.
    // The excerpts already cap the amount of narrative shown in these research views,
    // so this upper bound prevents a single row from swallowing the sheet.
    const headers = sheet.getRange(1, 1, 1, columnCount).getDisplayValues()[0];
    const values = sheet.getRange(startRow, 1, rowCount, columnCount).getDisplayValues();
    for (let r = startRow; r < startRow + rowCount; r++) {
      const measured = sheet.getRowHeight(r);
      let estimatedLines = 1;
      values[r - startRow].forEach((value, i) => {
        const profile = getReadableColumnProfile_(headers[i]);
        if (!profile.wrap || !value) return;
        const charsPerLine = Math.max(12, Math.floor(sheet.getColumnWidth(i + 1) / 7.2));
        const lines = String(value).split(/\r?\n/).reduce(
          (sum, line) => sum + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);
        estimatedLines = Math.max(estimatedLines, lines);
      });
      const estimated = estimatedLines * 16 + 10;
      const fitted = Math.max(30, Math.min(160, Math.max(measured, estimated)));
      if (fitted !== measured) sheet.setRowHeight(r, fitted);
    }
  }

  function fitScenarioDataRows_(sheet, startRow, rowCount) {
    if (rowCount <= 0) return;

    // Scenario tabs keep the complete narrative text. Re-measure after wrapping so
    // most responses are visible without opening the cell, while preventing an
    // unusually long response from turning one record into a multi-screen row.
    sheet.autoResizeRows(startRow, rowCount);
    const columnCount = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, columnCount).getDisplayValues()[0];
    const values = sheet.getRange(startRow, 1, rowCount, columnCount).getDisplayValues();
    for (let r = startRow; r < startRow + rowCount; r++) {
      const measured = sheet.getRowHeight(r);
      let estimatedLines = 1;
      values[r - startRow].forEach((value, i) => {
        const profile = getReadableColumnProfile_(headers[i]);
        if (!profile.wrap || !value) return;
        const charsPerLine = Math.max(12, Math.floor(sheet.getColumnWidth(i + 1) / 7.2));
        const lines = String(value).split(/\r?\n/).reduce(
          (sum, line) => sum + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);
        estimatedLines = Math.max(estimatedLines, lines);
      });
      const estimated = estimatedLines * 16 + 10;
      const fitted = Math.max(30, Math.min(420, Math.max(measured, estimated)));
      if (fitted !== measured) sheet.setRowHeight(r, fitted);
    }
  }

  function setAlternatingReadableRows_(sheet, startRow, rowCount, columnCount) {
    if (rowCount <= 0) return;
    const backgrounds = [];
    for (let r = 0; r < rowCount; r++) {
      const fill = (r % 2 === 1) ? '#FBFCFB' : '#FFFFFF';
      backgrounds.push(new Array(columnCount).fill(fill));
    }
    sheet.getRange(startRow, 1, rowCount, columnCount).setBackgrounds(backgrounds);
  }

  function setReviewSourceRules_(sheet, headerRow, dataStartRow, rowCount, headers) {
    if (rowCount <= 0) return;
    const idx = headers.indexOf('Review Source');
    if (idx < 0) return;
    const col = idx + 1;
    const range = sheet.getRange(dataStartRow, col, rowCount, 1);
    const rules = sheet.getConditionalFormatRules().filter(rule => {
      return !rule.getRanges().some(r => r.getSheet().getSheetId() === sheet.getSheetId() && r.getColumn() === col);
    });
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo('fallback')
        .setBackground('#FFF0CC').setFontColor('#7A4A00').setBold(true)
        .setRanges([range]).build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo('live')
        .setBackground('#DDF2E5').setFontColor('#155B36').setBold(true)
        .setRanges([range]).build()
    );
    sheet.setConditionalFormatRules(rules);
  }

  function setProviderRules_(sheet, dataStartRow, rowCount, headers) {
    if (rowCount <= 0) return;
    const idx = headers.indexOf('AI Provider');
    if (idx < 0) return;
    const col = idx + 1;
    const range = sheet.getRange(dataStartRow, col, rowCount, 1);
    const rules = sheet.getConditionalFormatRules().filter(rule => {
      return !rule.getRanges().some(r => r.getSheet().getSheetId() === sheet.getSheetId() && r.getColumn() === col);
    });
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextContains('fallback')
        .setBackground('#FFF0CC').setFontColor('#7A4A00').setBold(true)
        .setRanges([range]).build()
    );
    sheet.setConditionalFormatRules(rules);
  }

  function safeNumberForResearch_(value) {
    if (value === '' || value === null || value === undefined) return null;
    const n = Number(value);
    return isNaN(n) ? null : n;
  }

  function collectResearchEvents_() {
    const source = getSheet_(SHEET_INCREMENTAL);
    ensureIncrementalHeaders(source);
    const lastRow = source.getLastRow();
    if (lastRow < 2) return [];

    const raw = source.getRange(2, 1, lastRow - 1, INCREMENTAL_HEADERS.length).getValues();
    const seen = {};
    const events = [];
    raw.forEach(row => {
      const e = normalizeResearchEventRow_(row);
      if (!e || !e.session || !e.scenario) return;
      // A real event ID is authoritative. Multiple choices can happen in the
      // same millisecond with unchanged prompt/response text.
      const key = e.eventId ? 'id:' + e.eventId : 'legacy:' + JSON.stringify([
        timestampToMillis_(e.timestamp), e.participant, e.session, e.scenario,
        e.eventType, e.activityId, e.prompt, e.response, e.detail
      ]);
      if (seen[key]) return;
      seen[key] = true;
      events.push(e);
    });
    events.sort((a, b) => timestampToMillis_(b.timestamp) - timestampToMillis_(a.timestamp));
    return events;
  }

  function participantSessionKey_(participant, session) {
    return JSON.stringify([String(participant || 'anonymous'), String(session || '')]);
  }

  function latestResponseRowsBySession_() {
    const source = getSheet_(SHEET_RESPONSES);
    ensureFullResponseHeaders(source);
    const lastRow = source.getLastRow();
    const bySession = {};
    if (lastRow < 3) return bySession;

    const rows = source.getRange(3, 1, lastRow - 2, RESPONSE_HEADERS.length).getValues();
    rows.forEach(row => {
      const session = String(row[2] || '').trim();
      if (!session) return; // Legacy rows without a valid session key are recovered from Raw Events instead.
      const key = participantSessionKey_(row[1], session);
      const current = bySession[key];
      if (!current || timestampToMillis_(row[0]) > timestampToMillis_(current[0])) bySession[key] = row;
    });
    return bySession;
  }

  function maxResearchNumber_(values) {
    const nums = (values || []).map(safeNumberForResearch_).filter(v => v !== null);
    return nums.length ? Math.max.apply(null, nums) : '';
  }

  function researchAiStatus_(events) {
    const providers = (events || []).map(e => String(e.aiProvider || '').toLowerCase()).filter(Boolean);
    const hasFallback = providers.some(p => p.indexOf('fallback') >= 0);
    const hasLive = providers.some(p => p.indexOf('fallback') < 0);
    if (hasFallback && hasLive) return 'Mixed';
    if (hasFallback) return 'Fallback';
    if (hasLive) return 'Live';
    return 'Not recorded';
  }

  function responseScenarioFields_(row, scenario) {
    const blank = {
      attempts: '', bestScore: '', primaryInput: '', decision1: '', decision2: '', decision3: '',
      judgment: '', judgmentCorrect: '', repair: '', reviewSource: '', provider: '', model: '', response: '', quality: ''
    };
    if (!row) return blank;

    const f = Object.assign({}, blank);
    if (scenario === 1) {
      f.attempts = row[8]; f.bestScore = row[9]; f.primaryInput = row[10]; f.response = row[11]; f.quality = row[12];
    } else if (scenario === 2) {
      f.attempts = row[14]; f.bestScore = row[15]; f.primaryInput = row[16];
      f.decision1 = row[17]; f.decision2 = row[19]; f.decision3 = row[21]; f.judgment = row[22];
      f.judgmentCorrect = row[23]; f.repair = row[25]; f.reviewSource = row[28];
      f.provider = row[29]; f.model = row[30]; f.response = row[31]; f.quality = row[32];
    } else if (scenario === 3) {
      f.attempts = row[33]; f.bestScore = row[34]; f.primaryInput = row[35]; f.response = row[36]; f.quality = row[37];
    } else if (scenario === 4) {
      f.attempts = row[38]; f.bestScore = row[39]; f.primaryInput = row[40]; f.response = row[41]; f.quality = row[42];
    } else if (scenario === 5) {
      f.attempts = row[43]; f.bestScore = row[44]; f.decision1 = row[45]; f.primaryInput = row[46]; f.response = row[47];
    } else if (scenario === 6) {
      f.attempts = row[48]; f.decision1 = row[49]; f.judgmentCorrect = row[50]; f.primaryInput = row[51];
    } else if (scenario === 7) {
      f.decision1 = row[52]; f.decision2 = row[53]; f.decision3 = row[54]; f.judgment = row[55]; f.repair = row[56]; f.bestScore = row[57];
    } else if (scenario === 8) {
      f.primaryInput = row[58]; f.decision1 = row[63]; f.decision2 = row[64]; f.decision3 = row[65];
      f.repair = row[60]; f.bestScore = row[61]; f.judgmentCorrect = row[62];
    }
    return f;
  }

  function setReadableHeader_(sheet, headers, color) {
    if (!headers.length) return;
    const range = sheet.getRange(1, 1, 1, headers.length);
    range.setValues([headers]).setBackground(color).setFontColor('#FFFFFF').setFontWeight('bold')
      .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
    sheet.setRowHeight(1, 44);
  }

  function formatSimpleResearchTable_(sheet, headers, rowCount, frozenColumns, headerColor) {
    setReadableHeader_(sheet, headers, headerColor || '#215C45');
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(Math.min(frozenColumns || 0, headers.length));
    if (rowCount > 0) {
      sheet.getRange(2, 1, rowCount, headers.length).setVerticalAlignment('top').setFontSize(9);
      setAlternatingReadableRows_(sheet, 2, rowCount, headers.length);
    }
    headers.forEach((h, i) => formatReadableColumn_(sheet, i + 1, h, 2, rowCount + 1));
    fitReadableDataRows_(sheet, 2, rowCount, headers.length);
    sheet.getRange(2, 1, Math.max(rowCount, 1), 1).setNumberFormat(TIMESTAMP_FORMAT);
  }

  function cleanIdeasWallForResearch_() {
    const sheet = getSheet_(SHEET_IDEAS);
    ensureIdeaHeaders(sheet);
    const lastRow = sheet.getLastRow();
    const rows = lastRow >= 2 ? sheet.getRange(2, 1, lastRow - 1, 9).getValues() : [];
    const seen = {};
    const clean = [];

    rows.forEach(row => {
      const scenario = safeNumberForResearch_(row[2]);
      const label = String(row[3] || '');
      const idea = String(row[5] || '').trim();
      if (scenario === null || scenario < 1 || scenario > 8 || !/^S\d+:/i.test(label) || !idea) return;

      row[3] = SCENARIO_LABELS[Number(scenario)] || label;
      row[7] = normalizeWallReviewStatus_(row[7]);
      const key = [row[1], scenario, idea.replace(/\s+/g, ' ').slice(0, 240)].join('||');
      if (seen[key]) return;
      seen[key] = true;
      clean.push(row);
    });

    clean.sort((a, b) => timestampToMillis_(b[0]) - timestampToMillis_(a[0]));
    if (sheet.getMaxRows() > 1) sheet.getRange(2, 1, sheet.getMaxRows() - 1, 9).clearContent();
    if (clean.length) sheet.getRange(2, 1, clean.length, 9).setValues(clean.map(safeResearchRow_));
    formatIdeasSheet_(sheet);
    sheet.setTabColor('#8A5A20');
    return clean.length;
  }

  function moveSheetToPosition_(sheet, position) {
    const ss = getSpreadsheet_();
    sheet.showSheet();
    ss.setActiveSheet(sheet);
    ss.moveActiveSheet(position);
  }

  function organizeResearchTabs_() {
    const ss = getSpreadsheet_();
    hideLegacyScenarioTabs_();
    const visible = [[SHEET_OVERVIEW, '#163F33'], [SHEET_SESSIONS, '#215C45']];
    Object.keys(SHEET_SCENARIO_TABS).forEach(n => {
      const sheet = getSheet_(SHEET_SCENARIO_TABS[n]);
      if (Number(n) === 1 || sheet.getLastRow() > 1) {
        visible.push([SHEET_SCENARIO_TABS[n], SCENARIO_TAB_COLORS[n]]);
      } else {
        sheet.hideSheet(); // Keep unused future views available without clutter.
      }
    });
    visible.push(
      [SHEET_PROCESS_LOG, '#35646A'], [SHEET_IDEAS, '#8A5A20'],
      [SHEET_READABLE_RESPONSES, '#215C45'], [SHEET_PROCESS_EVENTS, '#35646A'],
      [SHEET_RESEARCH_GUIDE, '#475569']
    );

    visible.forEach((item, i) => {
      const sheet = getSheet_(item[0]);
      sheet.setTabColor(item[1]);
      moveSheetToPosition_(sheet, i + 1);
    });

    [SHEET_CHALLENGE, SHEET_RAW_ARCHIVE, SHEET_RESPONSES, SHEET_INCREMENTAL, SHEET_RAW_AUDIT].forEach(name => {
      const sh = getSheet_(name);
      sh.setTabColor('#9CA3AF');
      sh.hideSheet();
    });
    ss.setActiveSheet(getSheet_(SHEET_OVERVIEW));
  }

  function applyParticipantIdColumnWidths_() {
    [
      [getSheet_(SHEET_INCREMENTAL), 2],
      [getSheet_(SHEET_RESPONSES), 2],
      [getSheet_(SHEET_IDEAS), 2],
      [getSheet_(SHEET_RAW_AUDIT), 6]
    ].forEach(item => {
      const sheet = item[0];
      const col = item[1];
      sheet.autoResizeColumn(col);
      clampColumnWidth_(sheet, col, 220, 320);
      sheet.getRange(2, col, Math.max(1, sheet.getLastRow() - 1), 1).setWrap(false);
    });
    [getSheet_(SHEET_INCREMENTAL), getSheet_(SHEET_RESPONSES)].forEach(sheet => {
      sheet.getRange(2, 3, Math.max(1, sheet.getLastRow() - 1), 1).setWrap(false);
    });
  }

  function isNumeric_(value) {
    if (value === '' || value === null || value === undefined) return false;
    return !isNaN(Number(value));
  }

  function appendIncrementalSave(p) {
    const sheet = getSheet_(SHEET_INCREMENTAL);
    ensureIncrementalHeaders(sheet);
    const row = [
      p.timestamp, p.participant_id, p.session_id, p.scenario_index, p.scenario_label,
      p.session_duration_min, p.scenarios_completed, p.total_xp, p.total_attempts, p.attempts,
      p.current_score, p.best_score, p.score_delta, p.prompt_text, p.all_prompts,
      p.babbage_response, p.quality_indicators_lit, p.self_report_prediction,
      p.ai_provider, p.ai_model, p.ai_request_id, p.ai_elapsed_ms,
      p.ai_usage_json, p.babbage_analysis_json, p.scenario_detail_json,
      p.time_since_last_attempt_sec, p.screen_width, p.event_type,
      p.schema_version, p.app_build, p.payload_shape, p.notes_coding_memo
    ];
    insertRowsBelowHeader_(sheet, 1, [safeResearchRow_(row)]);
    sheet.getRange(2, 1).setNumberFormat(TIMESTAMP_FORMAT);
  }

  function ensureIncrementalHeaders(sheet) {
    ensureColumnCount_(sheet, INCREMENTAL_HEADERS.length);
    const current = sheet.getRange(1, 1, 1, INCREMENTAL_HEADERS.length).getDisplayValues()[0];
    if (INCREMENTAL_HEADERS.some((h, i) => current[i] !== h)) {
      sheet.getRange(1, 1, 1, INCREMENTAL_HEADERS.length).setValues([INCREMENTAL_HEADERS]);
    }
    sheet.setFrozenRows(1);
  }

  function appendFullResponse(p) {
    const sheet = getSheet_(SHEET_RESPONSES);
    ensureFullResponseHeaders(sheet);
    const participant = pick_(p, ['participant_id', 'participantId'], 'anonymous');
    const sessionId = pick_(p, ['session_id', 'sessionId'], '');
    const s2Inc = getLatestIncrementalRecord_(participant, 2, sessionId);
    const s2 = extractS2Record_(p, s2Inc);
    const d7 = p.s7_decisions || {};

    const row = new Array(RESPONSE_HEADERS.length).fill('');
    row[0] = parseDate_(p.timestamp);
    row[1] = participant;
    row[2] = sessionId;
    row[3] = pick_(p, ['session_duration_min', 'sessionDurationMin'], '');
    row[4] = pick_(p, ['scenarios_completed', 'scenariosCompleted'], '');
    row[5] = pick_(p, ['total_xp', 'totalXp'], '');
    row[6] = pick_(p, ['total_attempts', 'totalAttempts'], '');
    row[7] = normalizeListText_(pick_(p, ['presubmit_predictions', 'preSubmitPredictions'], ''));

    row[8] = p.s1_attempts || '';
    row[9] = p.s1_best_score || '';
    row[10] = p.s1_prompts || '';
    row[11] = p.s1_final_response || '';
    row[12] = p.s1_oscqr || '';
    row[13] = p.s1_section_reviews || '';

    row[14] = s2.attempts;
    row[15] = s2.best_score;
    row[16] = s2.all_prompts;
    row[17] = s2.diagnosis_choice;
    row[18] = s2.diagnosis_json;
    row[19] = s2.intervention_choice;
    row[20] = s2.intervention_json;
    row[21] = s2.thinking_move;
    row[22] = s2.audit_choice;
    row[23] = s2.audit_correct;
    row[24] = s2.audit_json;
    row[25] = s2.repair_text;
    row[26] = s2.draft_json;
    row[27] = s2.review_json;
    row[28] = s2.review_source;
    row[29] = s2.ai_provider;
    row[30] = s2.ai_model;
    row[31] = s2.final_response;
    row[32] = s2.quality_indicators;

    row[33] = p.s3_attempts || ''; row[34] = p.s3_best_score || ''; row[35] = p.s3_prompts || ''; row[36] = p.s3_final_response || ''; row[37] = p.s3_oscqr || '';
    row[38] = p.s4_attempts || ''; row[39] = p.s4_best_score || ''; row[40] = p.s4_prompts || ''; row[41] = p.s4_final_response || ''; row[42] = p.s4_oscqr || '';
    row[43] = p.s5_attempts || ''; row[44] = p.s5_best_score || ''; row[45] = p.s5_self_report || ''; row[46] = p.s5_prompts || ''; row[47] = p.s5_final_response || '';
    row[48] = p.s6_attempts || ''; row[49] = p.s6_prediction || ''; row[50] = p.s6_prediction_correct || ''; row[51] = p.s6_prompts || '';
    row[52] = d7.policy || ''; row[53] = d7.cases || ''; row[54] = d7.pledge || ''; row[55] = d7.scenarios || ''; row[56] = d7.objectives || ''; row[57] = p.s7_best_score || '';
    row[58] = p.s8_initial_prompt || ''; row[59] = p.s8_initial_score || ''; row[60] = p.s8_revised_prompt || ''; row[61] = p.s8_revised_score || ''; row[62] = p.s8_score_delta || '';
    row[63] = p.s8_reflection_1 || ''; row[64] = p.s8_reflection_2 || ''; row[65] = p.s8_reflection_3 || '';
    row[66] = p.q1_surprise || ''; row[67] = p.q2_unexpected || ''; row[68] = p.q3_transfer || ''; row[69] = p.q4_other || '';
    row[70] = p.ai_narrative || ''; row[71] = p.growth_json || '';
    row[72] = pick_(p, ['screen_width', 'screenWidth'], '');
    row[73] = p.referrer || '';
    row[74] = 'full_response V84';

    if (sessionId && sheet.getLastRow() >= 3) {
      const existingRows = sheet.getRange(3, 1, sheet.getLastRow() - 2, RESPONSE_HEADERS.length).getValues();
      for (let i = 0; i < existingRows.length; i++) {
        const existing = existingRows[i];
        if (String(existing[1] || '') !== String(participant) || String(existing[2] || '') !== String(sessionId)) continue;
        const merged = existing.slice();
        row.forEach((value, c) => { if (value !== '' && value !== null && value !== undefined) merged[c] = value; });
        merged[74] = 'full_response V84';
        sheet.getRange(i + 3, 1, 1, RESPONSE_HEADERS.length).setValues([safeResearchRow_(merged)]);
        return;
      }
    }

    insertRowsBelowHeader_(sheet, 2, [safeResearchRow_(row)]);
  }


  function ensureFullResponseHeaders(sheet) {
    ensureColumnCount_(sheet, RESPONSE_HEADERS.length);
    const current = sheet.getRange(2, 1, 1, RESPONSE_HEADERS.length).getDisplayValues()[0];
    if (RESPONSE_HEADERS.some((h, i) => current[i] !== h)) {
      sheet.getRange(2, 1, 1, RESPONSE_HEADERS.length).setValues([RESPONSE_HEADERS]);
    }
    applyResponseGroupHeaders_(sheet);
    sheet.setFrozenRows(2);
  }

  function upsertPromptCraftResponseCheckpointFromIncremental_(p) {
    const scenario = Number(p.scenario_index || 0);
    if (scenario !== 1 && scenario !== 2) return 'raw_event_saved; full-response checkpoint pending';

    const resp = getSheet_(SHEET_RESPONSES);
    ensureFullResponseHeaders(resp);

    const participant = p.participant_id || 'anonymous';
    const sessionId = p.session_id || '';
    const row = new Array(RESPONSE_HEADERS.length).fill('');
    row[0] = parseDate_(p.timestamp);
    row[1] = participant;
    row[2] = sessionId;
    row[3] = p.session_duration_min || '';
    row[4] = p.scenarios_completed || scenario || 1;
    row[5] = p.total_xp || deriveTotalXPFromIncrementalPayload_(p);
    row[6] = p.total_attempts || p.attempts || '';
    row[7] = derivePreSubmitPredictionFromPayload_(p);

    if (scenario === 1) {
      row[8] = p.attempts || '';
      row[9] = p.best_score || p.current_score || '';
      row[10] = p.all_prompts || p.prompt_text || '';
      row[11] = p.babbage_response || '';
      row[12] = p.quality_indicators_lit || '';
    }

    if (scenario === 2) {
      const s2 = extractS2Record_(p, p);
      row[14] = s2.attempts; row[15] = s2.best_score; row[16] = s2.all_prompts;
      row[17] = s2.diagnosis_choice; row[18] = s2.diagnosis_json;
      row[19] = s2.intervention_choice; row[20] = s2.intervention_json;
      row[21] = s2.thinking_move; row[22] = s2.audit_choice; row[23] = s2.audit_correct; row[24] = s2.audit_json;
      row[25] = s2.repair_text; row[26] = s2.draft_json; row[27] = s2.review_json; row[28] = s2.review_source;
      row[29] = s2.ai_provider; row[30] = s2.ai_model; row[31] = s2.final_response; row[32] = s2.quality_indicators;
    }

    row[72] = p.screen_width || '';
    row[74] = 'checkpoint from incremental post V84';

    const lastRow = resp.getLastRow();
    if (lastRow >= 3) {
      const values = resp.getRange(3, 1, lastRow - 2, RESPONSE_HEADERS.length).getValues();
      for (let i = 0; i < values.length; i++) {
        const existing = values[i];
        const sameParticipant = String(existing[1] || '') === String(participant);
        const sameSession = sessionId && String(existing[2] || '') === String(sessionId);
        if (!sameParticipant || !sameSession) continue;

        const merged = existing.slice();
        merged[0] = row[0] || merged[0];
        merged[1] = merged[1] || row[1];
        merged[2] = merged[2] || row[2];
        merged[3] = row[3] || merged[3];
        merged[4] = row[4] || merged[4];
        merged[5] = row[5] !== '' ? row[5] : merged[5];
        merged[6] = row[6] || merged[6];
        merged[7] = row[7] || merged[7];

        const start = scenario === 1 ? 8 : 14;
        const end = scenario === 1 ? 13 : 32;
        for (let c = start; c <= end; c++) if (row[c] !== '' && row[c] !== null) merged[c] = row[c];
        merged[72] = row[72] || merged[72];
        if (!String(merged[74] || '').startsWith('full_response')) merged[74] = 'checkpoint updated from incremental post V84';

        resp.getRange(i + 3, 1, 1, RESPONSE_HEADERS.length).setValues([safeResearchRow_(merged)]);
        return 'updated';
      }
    }

    insertRowsBelowHeader_(resp, 2, [safeResearchRow_(row)]);
    return 'inserted';
  }

  function getApprovedIdeasForWall_() {
    const sheet = getSheet_(SHEET_IDEAS);
    ensureIdeaHeaders(sheet);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];

    const rows = sheet.getRange(2, 1, lastRow - 1, 9).getValues();

    return rows
      .filter(row => String(row[7] || '').trim() === 'Publish')
      .map(row => ({
        timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
        scenario: row[2] || '',
        scenarioLabel: row[3] || SCENARIO_LABELS[Number(row[2])] || '',
        score: row[4] || '',
        idea: String(row[5] || '')
      }))
      .filter(item => item.idea.trim())
      .sort((a, b) => timestampToMillis_(b.timestamp) - timestampToMillis_(a.timestamp));
  }

  function wallQualityIndicatorCount_(value) {
    const text = String(value || '').trim();
    if (!text) return 0;

    const parsed = parseJsonMaybe_(text, null);
    if (Array.isArray(parsed)) return parsed.filter(Boolean).length;
    if (parsed && typeof parsed === 'object') return Object.keys(parsed).filter(k => parsed[k]).length;

    return text
      .split(/\n|,|;|\u2022|\|/)
      .map(v => v.replace(/^[-*\d.)\s]+/, '').trim())
      .filter(Boolean).length;
  }

  function wallCandidateReason_(score, quality) {
    const parts = [`Score ${Number(score)}/5`, 'Completed result'];
    const qualityCount = wallQualityIndicatorCount_(quality);
    if (qualityCount) parts.push(`${qualityCount} quality indicator${qualityCount === 1 ? '' : 's'}`);
    return parts.join(' \u00b7 ');
  }

  function wallCandidateTextFromRecord_(scenario, record) {
    const latest = record.latest || {};
    const row = record.responseRow || null;
    const fields = responseScenarioFields_(row, scenario);
    const detail = latest.detail || {};
    let text = '';

    if (scenario === 2) {
      text = fields.repair || detail.s2_repair_text || '';
      if (!text && latest.prompt) text = String(latest.prompt).replace(/^S2 repair:\s*/i, '');
      if (!text) text = fields.response || latest.response || fields.primaryInput || latest.allPrompts;
    } else if (scenario === 3) {
      text = detail.s3_repair_text || fields.repair || fields.response || latest.response || fields.primaryInput || latest.allPrompts || latest.prompt;
    } else if (scenario === 4) {
      text = detail.s4_async_repair || fields.repair || fields.response || latest.response || fields.primaryInput || latest.allPrompts || latest.prompt;
    } else if (scenario === 5) {
      text = fields.response || latest.response || detail.s5_corrected_claim || fields.primaryInput || latest.allPrompts || latest.prompt;
    } else if (scenario === 6) {
      text = fields.response || latest.response || fields.primaryInput || latest.allPrompts || latest.prompt;
    } else if (scenario === 7) {
      text = fields.response || latest.response || fields.primaryInput || latest.allPrompts || latest.prompt;
    } else if (scenario === 8) {
      text = row ? row[60] : '';
      text = text || fields.repair || detail.s8_revised_prompt || latest.prompt || fields.primaryInput || latest.allPrompts || latest.response;
    }

    return String(text || '').trim();
  }

  function wallRecordHasCompletion_(record) {
    return (record.list || []).some(e => /complete|completed|final|result|review/i.test(String(e.eventType || '')));
  }

  function wallCandidateKey_(participant, scenario, text) {
    return [
      String(participant || ''),
      String(scenario || ''),
      String(text || '').replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 500)
    ].join('||');
  }

  function existingWallCandidateKeys_() {
    const sheet = getSheet_(SHEET_IDEAS);
    ensureIdeaHeaders(sheet);
    const lastRow = sheet.getLastRow();
    const keys = {};
    if (lastRow < 2) return keys;

    sheet.getRange(2, 1, lastRow - 1, 9).getValues().forEach(row => {
      const text = String(row[5] || '').trim();
      if (!text) return;
      keys[wallCandidateKey_(row[1], row[2], text)] = true;
    });
    return keys;
  }

  function syncIdeasWallCandidatesFromResearchData_(events, responseBySession) {
    const sheet = getSheet_(SHEET_IDEAS);
    ensureIdeaHeaders(sheet);
    const existing = existingWallCandidateKeys_();
    const additions = [];

    // Current S1 checkpoints do not contain an instructor-approved public idea.
    for (let scenario = 2; scenario <= 8; scenario++) {
      const records = getScenarioSessionRecords_(scenario, events, responseBySession);
      records.forEach(record => {
        if (!wallRecordHasCompletion_(record)) return;

        const latest = record.latest || {};
        const fields = responseScenarioFields_(record.responseRow, scenario);
        const scoreRaw = fields.bestScore !== '' && fields.bestScore !== undefined ? fields.bestScore : latest.bestScore;
        const score = Number(scoreRaw);
        if (!Number.isFinite(score) || score < IDEAS_WALL_MIN_SCORE) return;

        const candidate = wallCandidateTextFromRecord_(scenario, record);
        if (candidate.length < IDEAS_WALL_MIN_TEXT_CHARS) return;

        const participant = latest.participant || (record.responseRow ? record.responseRow[1] : 'anonymous') || 'anonymous';
        const key = wallCandidateKey_(participant, scenario, candidate);
        if (existing[key]) return;
        existing[key] = true;

        const quality = fields.quality || latest.quality || '';
        additions.push([
          parseDate_(latest.timestamp || (record.responseRow ? record.responseRow[0] : new Date())),
          participant,
          scenario,
          latest.label || SCENARIO_LABELS[scenario] || '',
          score,
          candidate,
          wallCandidateReason_(score, quality),
          'Needs Review',
          ''
        ]);
      });
    }

    additions.sort((a, b) => timestampToMillis_(b[0]) - timestampToMillis_(a[0]));
    if (additions.length) insertRowsBelowHeader_(sheet, 1, additions.map(safeResearchRow_));
    return additions.length;
  }

  function appendIdea(p) {
    const sheet = getSheet_(SHEET_IDEAS);
    ensureIdeaHeaders(sheet);
    const ideas = Array.isArray(p.ideas) ? p.ideas : [p];
    const rows = ideas.map(item => {
      const scenarioIndex = pick_(item, ['scenario_index', 'scenarioIndex', 'scenario'], pick_(p, ['scenario_index', 'scenarioIndex', 'scenario'], ''));
      const score = pick_(item, ['score', 'best_score', 'bestScore', 'tag'], pick_(p, ['score', 'best_score', 'bestScore', 'tag'], ''));
      const idea = pick_(item, ['idea', 'text', 'note', 'final_response', 'finalResponse', 'claude_response', 'claudeResponse'], '');
      const suppliedStatus = pick_(item, ['review_status', 'reviewStatus', 'approved', 'approved_for_wall', 'approvedForWall'], 'Needs Review');
      return [
        parseDate_(item.timestamp || p.timestamp),
        pick_(item, ['participant_id', 'participantId'], pick_(p, ['participant_id', 'participantId'], 'anonymous')),
        scenarioIndex,
        SCENARIO_LABELS[Number(scenarioIndex)] || pick_(item, ['scenario_label', 'scenarioLabel'], pick_(p, ['scenario_label', 'scenarioLabel'], '')),
        score,
        idea,
        pick_(item, ['candidate_reason', 'candidateReason'], 'Explicit Ideas Wall submission'),
        normalizeWallReviewStatus_(suppliedStatus),
        pick_(item, ['research_notes', 'researchNotes', 'notes'], '')
      ];
    }).filter(row => String(row[5] || '').trim());

    rows.sort((a, b) => timestampToMillis_(b[0]) - timestampToMillis_(a[0]));
    if (rows.length) insertRowsBelowHeader_(sheet, 1, rows.map(safeResearchRow_));
    return rows.length;
  }


  function appendRawPayloadAudit_(payload, e) {
    const sheet = getSheet_(SHEET_RAW_AUDIT);
    ensureRawAuditHeaders_(sheet);
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : JSON.stringify(payload || {});
    insertRowsBelowHeader_(sheet, 1, [[
      new Date(),
      PROMPTCRAFT_RECEIVER_VERSION,
      pick_(payload, ['schema_version'], ''),
      pick_(payload, ['app_build'], ''),
      pick_(payload, ['type'], ''),
      pick_(payload, ['participant_id', 'participantId'], ''),
      pick_(payload, ['scenario_index', 'scenarioIndex', 'scenario'], ''),
      Object.keys(payload || {}).join(', '),
      raw.slice(0, 4500)
    ]]);
  }


  function normalizeResearchEventRow_(row) {
    const r = (row || []).slice();
    while (r.length < INCREMENTAL_HEADERS.length) r.push('');
    const scenario = safeNumberForResearch_(r[3]);
    if (scenario === null || scenario < 1 || scenario > 8) return null;

    return {
      timestamp: r[0], participant: r[1] || 'anonymous', session: r[2] || '',
      scenario: Number(scenario), label: SCENARIO_LABELS[Number(scenario)] || r[4] || '',
      duration: r[5], completed: r[6], totalXp: r[7], totalAttempts: r[8], attempts: r[9],
      currentScore: r[10], bestScore: r[11], scoreDelta: r[12], prompt: r[13], allPrompts: r[14],
      response: r[15], quality: r[16], selfReport: r[17], aiProvider: r[18], aiModel: r[19],
      aiElapsed: r[21], timeSince: r[25], screenWidth: r[26], eventType: r[27] || 'event',
      analysis: parseJsonMaybe_(r[23], {}) || {}, detail: parseJsonMaybe_(r[24], {}) || {},
      payloadShape: r[30] || 'current', notes: r[31] || '',
      eventId: metadataFromNotes_(r[31], 'event_id'),
      activityId: metadataFromNotes_(r[31], 'activity_id'),
      scoreScaleMax: metadataFromNotes_(r[31], 'score_scale_max') || 5
    };
  }

  function buildSessionResearchRows_(events) {
    const groups = {};
    (events || []).forEach(e => {
      const key = participantSessionKey_(e.participant, e.session);
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });

    const rows = [];
    Object.keys(groups).forEach(key => {
      const list = groups[key].slice().sort((a, b) => timestampToMillis_(b.timestamp) - timestampToMillis_(a.timestamp));
      const latest = list[0];
      const session = latest.session;
      const scenarioMap = {};
      list.forEach(e => { scenarioMap[e.scenario] = e.label || SCENARIO_LABELS[e.scenario] || ('S' + e.scenario); });
      const scenarioNums = Object.keys(scenarioMap).map(Number).sort((a, b) => a - b);

      let totalAttempts = maxResearchNumber_(list.map(e => e.totalAttempts));
      if (totalAttempts === '') {
        const bestAttemptByScenario = {};
        list.forEach(e => {
          const n = safeNumberForResearch_(e.attempts);
          if (n !== null) bestAttemptByScenario[e.scenario] = Math.max(bestAttemptByScenario[e.scenario] || 0, n);
        });
        totalAttempts = Object.keys(bestAttemptByScenario).reduce((sum, k) => sum + bestAttemptByScenario[k], 0) || '';
      }

      rows.push([
        latest.timestamp, latest.participant, session,
        maxResearchNumber_(list.map(e => e.duration)),
        maxResearchNumber_(list.map(e => e.completed)) || scenarioNums.length,
        maxResearchNumber_(list.map(e => e.totalXp)), totalAttempts,
        scenarioNums.map(n => scenarioMap[n]).join(', '),
        latest.label || SCENARIO_LABELS[latest.scenario] || '',
        maxResearchNumber_(list.map(e => e.bestScore)),
        researchAiStatus_(list),
        maxResearchNumber_(list.map(e => e.screenWidth))
      ]);
    });
    rows.sort((a, b) => timestampToMillis_(b[0]) - timestampToMillis_(a[0]));
    return rows;
  }

  function scenarioResponseHasData_(row, scenario) {
    if (!row) return false;
    const ranges = {
      1: [8, 13], 2: [14, 32], 3: [33, 37], 4: [38, 42],
      5: [43, 47], 6: [48, 51], 7: [52, 57], 8: [58, 71]
    };
    const range = ranges[scenario];
    if (!range) return false;
    for (let i = range[0]; i <= range[1]; i++) {
      if (row[i] !== '' && row[i] !== null && row[i] !== undefined) return true;
    }
    return false;
  }

  function isCurrentS1Event_(event) {
    return S1_LEARNING_EVENTS.indexOf(String(event && event.eventType || '')) !== -1;
  }

  function getScenarioSessionRecords_(scenario, events, responseBySession) {
    const groups = {};
    (events || []).forEach(e => {
      if (Number(e.scenario) !== Number(scenario) || !e.session) return;
      if (Number(scenario) === 1 && !isCurrentS1Event_(e)) return;
      const key = participantSessionKey_(e.participant, e.session);
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });

    Object.keys(responseBySession || {}).forEach(key => {
      const row = responseBySession[key];
      if (!scenarioResponseHasData_(row, scenario)) return;
      if (Number(scenario) === 1 && !groups[key]) return; // Old S1 responses remain raw history.
      if (!groups[key]) groups[key] = [];
    });

    return Object.keys(groups).map(key => {
      const list = groups[key].slice().sort((a, b) => timestampToMillis_(b.timestamp) - timestampToMillis_(a.timestamp));
      const responseRow = responseBySession ? responseBySession[key] : null;
      const session = list[0] ? list[0].session : String(responseRow && responseRow[2] || '');
      const latest = list[0] || {
        timestamp: responseRow ? responseRow[0] : '', participant: responseRow ? (responseRow[1] || 'anonymous') : 'anonymous',
        session: session, scenario: scenario, label: SCENARIO_LABELS[scenario] || '', attempts: '', bestScore: '',
        prompt: '', allPrompts: '', response: '', quality: '', selfReport: '', aiProvider: '', aiModel: '', detail: {}, analysis: {}
      };
      return { session, list, latest, responseRow };
    }).sort((a, b) => timestampToMillis_(b.latest.timestamp) - timestampToMillis_(a.latest.timestamp));
  }

  function detailChoice_(event, key) {
    const detail = (event && event.detail) || {};
    return choiceFromAttempt_(lastAttemptFromJson_(detail[key] || ''));
  }

  function detailExact_(event, key) {
    const detail = (event && event.detail) || {};
    const attempt = lastAttemptFromJson_(detail[key] || '');
    return attempt && attempt.exact !== undefined ? attempt.exact : '';
  }

  function scenarioAiSource_(reviewSource, provider, model) {
    const source = reviewSource || (provider ? (/fallback/i.test(String(provider)) ? 'fallback' : 'live') : '');
    return [source, provider, model].filter(Boolean).join(' · ');
  }

  function commonScenarioValues_(record, fields) {
    const latest = record.latest;
    const list = record.list;
    const responseRow = record.responseRow;
    return {
      timestamp: responseRow && responseRow[0] ? responseRow[0] : latest.timestamp,
      participant: responseRow && responseRow[1] ? responseRow[1] : latest.participant,
      session: record.session,
      attempts: fields.attempts || maxResearchNumber_(list.map(e => e.attempts)),
      bestScore: fields.bestScore || maxResearchNumber_(list.map(e => e.bestScore)),
      latest: latest,
      fields: fields
    };
  }

  function scenarioTabHeaders_(scenario) {
    const map = {
      1: ['Timestamp','Participant ID','Session ID','Checkpoints','Best S1 Score (0–5)','Renamed Activities','Learning Path','Alignment Diagnosis','Guide Progress','Guide OSCQR References','Latest Checkpoint Feedback'],
      2: ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Activity Inputs','Diagnosis','Intervention','Thinking Move','Audit Choice','Audit Correct','Repair / Revised Reflection','AI Review Source','AI Provider','AI Model','Babbage Review','Quality Indicators'],
      3: ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Assessment Inputs','Diagnosis','Evidence Choice','Audit Choice','Audit Correct','Repair / Revision','Evidence Statement','Babbage Response','Quality Indicators','AI Source'],
      4: ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Course Inputs','Diagnosis','Function Choice','Audit Choice','Audit Correct','Async Repair','Evidence Statement','Babbage Response','Quality Indicators','AI Source'],
      5: ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Self-Report','Notes / Inputs','Check Choice','Audit Choice','Audit Correct','Flagged Claim','Corrected Claim','Verification Note','Babbage Response','AI Source'],
      6: ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Prediction Made','Prediction Correct','Prediction Inputs','Self-Report / Prediction'],
      7: ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Institutional Policies','Case Studies','Integrity Pledge','Scenario Cards','Learning Objectives'],
      8: ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Initial Prompt','Initial Score','Revised Prompt','Revised Score','Score Delta','Why Prompt Was Written This Way','What Worked','What Fell Short / Surprised','Q1 Surprise','Q2 Unexpected Strength or Limitation','Q3 Transfer to Teaching Practice','Q4 Other','AI Growth Narrative']
    };
    return (map[scenario] || ['Timestamp','Participant ID','Session ID','Attempts','Best Score']).slice();
  }

  function buildScenarioTabData_(scenario, events, responseBySession) {
    const records = getScenarioSessionRecords_(scenario, events, responseBySession);
    const rows = [];
    let headers = scenarioTabHeaders_(scenario);

    records.forEach(record => {
      const latest = record.latest;
      const row = record.responseRow;
      const fields = responseScenarioFields_(row, scenario);
      const c = commonScenarioValues_(record, fields);
      const detail = latest.detail || {};
      const aiSource = scenarioAiSource_(fields.reviewSource, fields.provider || latest.aiProvider, fields.model || latest.aiModel);

      if (scenario === 1) {
        // Each checkpoint can carry only part of the design. Combine the
        // current S1 events in time order so later guide work keeps earlier
        // renamed activities, placements, and the diagnosis visible.
        const s1Events = record.list.slice().reverse();
        const learningPath = {};
        let oscqr = '';
        s1Events.forEach(event => {
          const eventDetail = event.detail || {};
          Object.assign(learningPath, parseJsonMaybe_(eventDetail.s1_learning_path_json, {}) || {});
          if (eventDetail.s1_oscqr_standards) oscqr = eventDetail.s1_oscqr_standards;
        });
        const renamedTitles = Array.isArray(learningPath.renamedTitles) ? learningPath.renamedTitles : [];
        const renamed = renamedTitles.join('\n');
        const organization = learningPath.organization && typeof learningPath.organization === 'object'
          ? Object.keys(learningPath.organization).map((key, index) => {
            const fallbackTitle = String(key || '').replace(/[-_]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
            const title = renamedTitles[index] || fallbackTitle;
            const purpose = String(learningPath.organization[key] || '').replace(/\b\w/g, letter => letter.toUpperCase());
            return title + ': ' + purpose;
          }).join('\n')
          : '';
        const guideProgress = [];
        if (learningPath.guideStepAdded) guideProgress.push('Step 1 added');
        if (record.list.some(event => event.eventType === 's1_course_guide_complete')) guideProgress.push('Guide completed');
        if (learningPath.activityCount !== undefined) guideProgress.push(`${learningPath.activityCount} course activities`);
        rows.push([latest.timestamp,latest.participant,record.session,
          maxResearchNumber_(record.list.map(event => event.attempts)),
          maxResearchNumber_(record.list.map(event => event.bestScore)),
          fullTextForView_(renamed, 620),
          fullTextForView_(organization, 620),
          String(learningPath.diagnosisChoice || '').replace(/[-_]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()),
          guideProgress.join('\n'),
          fullTextForView_(String(oscqr || latest.quality || '').replace(/\s*\|\s*/g, '\n'), 760),
          fullTextForView_(latest.response, 720)]);
      }

      if (scenario === 2) {
        headers = ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Activity Inputs','Diagnosis','Intervention','Thinking Move','Audit Choice','Audit Correct','Repair / Revised Reflection','AI Review Source','AI Provider','AI Model','Babbage Review','Quality Indicators'];
        const diagnosis = fields.decision1 || detailChoice_(latest, 's2_diagnosis_json');
        const intervention = fields.decision2 || detailChoice_(latest, 's2_evidence_json');
        const thinking = fields.decision3 || detail.s2_thinking_move || '';
        const audit = fields.judgment || detailChoice_(latest, 's2_audit_json');
        const auditCorrect = (fields.judgmentCorrect !== '' && fields.judgmentCorrect !== null && fields.judgmentCorrect !== undefined)
          ? fields.judgmentCorrect : detailExact_(latest, 's2_audit_json');
        let repair = fields.repair || detail.s2_repair_text || '';
        if (!repair && latest.prompt) repair = String(latest.prompt).replace(/^S2 repair:\s*/i, '');
        const provider = fields.provider || latest.aiProvider || '';
        const model = fields.model || latest.aiModel || '';
        const reviewSource = fields.reviewSource || (provider ? (/fallback/i.test(provider) ? 'fallback' : 'live') : 'unknown');
        rows.push([c.timestamp,c.participant,c.session,c.attempts,c.bestScore,
          readablePromptData_(fields.primaryInput || latest.allPrompts || latest.prompt), diagnosis, intervention, thinking, audit, auditCorrect,
          fullTextForView_(repair, 620), reviewSource, provider, model,
          fullTextForView_(fields.response || latest.response, 720), fullTextForView_(fields.quality || latest.quality, 320)]);
      }

      if (scenario === 3) {
        headers = ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Assessment Inputs','Diagnosis','Evidence Choice','Audit Choice','Audit Correct','Repair / Revision','Evidence Statement','Babbage Response','Quality Indicators','AI Source'];
        rows.push([c.timestamp,c.participant,c.session,c.attempts,c.bestScore,
          readablePromptData_(fields.primaryInput || latest.allPrompts || latest.prompt),
          detailChoice_(latest,'s3_diagnosis_json'), detailChoice_(latest,'s3_evidence_json'), detailChoice_(latest,'s3_audit_json'), detailExact_(latest,'s3_audit_json'),
          fullTextForView_(detail.s3_repair_text || '', 560), fullTextForView_(detail.s3_evidence_statement || '', 420),
          fullTextForView_(fields.response || latest.response, 680), fullTextForView_(fields.quality || latest.quality, 300), aiSource]);
      }

      if (scenario === 4) {
        headers = ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Course Inputs','Diagnosis','Function Choice','Audit Choice','Audit Correct','Async Repair','Evidence Statement','Babbage Response','Quality Indicators','AI Source'];
        rows.push([c.timestamp,c.participant,c.session,c.attempts,c.bestScore,
          readablePromptData_(fields.primaryInput || latest.allPrompts || latest.prompt),
          detailChoice_(latest,'s4_diagnosis_json'), detailChoice_(latest,'s4_function_json'), detailChoice_(latest,'s4_audit_json'), detailExact_(latest,'s4_audit_json'),
          fullTextForView_(detail.s4_async_repair || '', 560), fullTextForView_(detail.s4_evidence_statement || '', 420),
          fullTextForView_(fields.response || latest.response, 680), fullTextForView_(fields.quality || latest.quality, 300), aiSource]);
      }

      if (scenario === 5) {
        headers = ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Self-Report','Notes / Inputs','Check Choice','Audit Choice','Audit Correct','Flagged Claim','Corrected Claim','Verification Note','Babbage Response','AI Source'];
        rows.push([c.timestamp,c.participant,c.session,c.attempts,c.bestScore,
          fullTextForView_(fields.decision1 || latest.selfReport, 320), readablePromptData_(fields.primaryInput || latest.allPrompts || latest.prompt),
          detailChoice_(latest,'s5_check_json'), detailChoice_(latest,'s5_audit_json'), detailExact_(latest,'s5_audit_json'),
          fullTextForView_(detail.s5_flagged_claim || '', 420), fullTextForView_(detail.s5_corrected_claim || '', 420), fullTextForView_(detail.s5_verification_note || '', 420),
          fullTextForView_(fields.response || latest.response, 680), aiSource]);
      }

      if (scenario === 6) {
        headers = ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Prediction Made','Prediction Correct','Prediction Inputs','Self-Report / Prediction'];
        rows.push([c.timestamp,c.participant,c.session,c.attempts,c.bestScore,
          fields.decision1 || '', fields.judgmentCorrect,
          readablePromptData_(fields.primaryInput || latest.allPrompts || latest.prompt), fullTextForView_(latest.selfReport || '', 420)]);
      }

      if (scenario === 7) {
        headers = ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Institutional Policies','Case Studies','Integrity Pledge','Scenario Cards','Learning Objectives'];
        rows.push([c.timestamp,c.participant,c.session,c.attempts,c.bestScore,
          fields.decision1 || '', fields.decision2 || '', fields.decision3 || '', fields.judgment || '', fields.repair || '']);
      }

      if (scenario === 8) {
        headers = ['Timestamp','Participant ID','Session ID','Attempts','Best Score','Initial Prompt','Initial Score','Revised Prompt','Revised Score','Score Delta','Why Prompt Was Written This Way','What Worked','What Fell Short / Surprised','Q1 Surprise','Q2 Unexpected Strength or Limitation','Q3 Transfer to Teaching Practice','Q4 Other','AI Growth Narrative'];
        rows.push([c.timestamp,c.participant,c.session,c.attempts,
          row ? (row[61] || c.bestScore) : c.bestScore,
          readablePromptData_(row ? row[58] : fields.primaryInput), row ? row[59] : '',
          readablePromptData_(row ? row[60] : fields.repair), row ? row[61] : '', row ? row[62] : '',
          fullTextForView_(row ? row[63] : '', 460), fullTextForView_(row ? row[64] : '', 460), fullTextForView_(row ? row[65] : '', 460),
          fullTextForView_(row ? row[66] : '', 420), fullTextForView_(row ? row[67] : '', 420), fullTextForView_(row ? row[68] : '', 420),
          fullTextForView_(row ? row[69] : '', 420), fullTextForView_(row ? row[70] : '', 620)]);
      }
    });

    return { headers, rows };
  }

  function buildProcessResearchRows_(events) {
    return (events || []).map(e => [
      e.timestamp, e.participant, e.session, e.label || SCENARIO_LABELS[e.scenario] || '',
      e.eventType || 'event', e.attempts || '',
      [e.currentScore, e.bestScore].filter(v => v !== '' && v !== null && v !== undefined).join(' / '),
      excerptForView_(readablePromptData_(e.prompt || e.allPrompts), 380), excerptForView_(e.response, 430),
      [e.aiProvider, e.aiModel].filter(Boolean).join(' · '), e.timeSince || '', e.screenWidth || ''
    ]);
  }

  function rebuildReadableResponsesView_(events) {
    const sheet = getSheet_(SHEET_READABLE_RESPONSES);
    sheet.clear();
    const rows = (events || []).map(event => safeResearchRow_([
      event.timestamp, event.participant, event.session, event.scenario,
      SCENARIO_LABELS[event.scenario] || event.label || '', event.activityId || 'scenario',
      event.attempts || '', event.currentScore, event.scoreScaleMax || 5,
      event.bestScore, event.scoreDelta,
      fullTextForView_(readablePromptData_(event.prompt || event.allPrompts), 900),
      fullTextForView_(event.response, 1200),
      [event.aiProvider, event.aiModel].filter(Boolean).join(' · '),
      event.eventType || 'event', event.eventId || ''
    ]));
    sheet.getRange(1, 1, 1, READABLE_RESPONSE_HEADERS.length).setValues([READABLE_RESPONSE_HEADERS]);
    if (rows.length) sheet.getRange(2, 1, rows.length, READABLE_RESPONSE_HEADERS.length).setValues(rows);
    formatSimpleResearchTable_(sheet, READABLE_RESPONSE_HEADERS, rows.length, 1, '#215C45');
    sheet.setTabColor('#215C45');
    return rows.length;
  }

  function rebuildProcessEventsView_(events) {
    const sheet = getSheet_(SHEET_PROCESS_EVENTS);
    sheet.clear();
    const rows = (events || []).map(event => safeResearchRow_([
      event.timestamp, event.participant, event.session,
      SCENARIO_LABELS[event.scenario] || event.label || '', event.activityId || 'scenario',
      event.eventType || 'event', event.attempts || '', event.currentScore,
      event.scoreScaleMax || 5, event.timeSince || '', event.screenWidth || '', event.eventId || ''
    ]));
    sheet.getRange(1, 1, 1, PROCESS_EVENT_HEADERS.length).setValues([PROCESS_EVENT_HEADERS]);
    if (rows.length) sheet.getRange(2, 1, rows.length, PROCESS_EVENT_HEADERS.length).setValues(rows);
    formatSimpleResearchTable_(sheet, PROCESS_EVENT_HEADERS, rows.length, 1, '#35646A');
    sheet.setTabColor('#35646A');
    return rows.length;
  }

  function rebuildSessionsView_(events) {
    const sheet = getSheet_(SHEET_SESSIONS);
    sheet.clear();
    sheet.setConditionalFormatRules([]);
    const headers = ['Timestamp','Participant ID','Session ID','Duration (min)','Scenarios Completed','Total XP','Total Attempts',
      'Scenarios Seen','Latest Scenario','Best Score','AI Status','Screen Width'];
    const rows = buildSessionResearchRows_(events);
    if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows.map(safeResearchRow_));
    formatSimpleResearchTable_(sheet, headers, rows.length, 3, '#215C45');
    sheet.setTabColor('#215C45');
    if (rows.length) {
      const aiCol = headers.indexOf('AI Status') + 1;
      const range = sheet.getRange(2, aiCol, rows.length, 1);
      const rules = sheet.getConditionalFormatRules();
      rules.push(
        SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Fallback').setBackground('#FFF0CC').setFontColor('#7A4A00').setBold(true).setRanges([range]).build(),
        SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Live').setBackground('#DDF2E5').setFontColor('#155B36').setBold(true).setRanges([range]).build()
      );
      sheet.setConditionalFormatRules(rules);
    }
    return rows.length;
  }

  function applyAiSourceRules_(sheet, headers, rowCount) {
    if (rowCount <= 0) return;
    const idx = headers.indexOf('AI Source');
    if (idx < 0) return;
    const range = sheet.getRange(2, idx + 1, rowCount, 1);
    const rules = sheet.getConditionalFormatRules();
    rules.push(
      SpreadsheetApp.newConditionalFormatRule().whenTextContains('fallback').setBackground('#FFF0CC').setFontColor('#7A4A00').setBold(true).setRanges([range]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextContains('live').setBackground('#DDF2E5').setFontColor('#155B36').setBold(true).setRanges([range]).build()
    );
    sheet.setConditionalFormatRules(rules);
  }

  function applyReviewSourceRules_(sheet, headers, rowCount) {
    if (rowCount <= 0) return;
    const idx = headers.indexOf('AI Review Source');
    if (idx < 0) return;
    const range = sheet.getRange(2, idx + 1, rowCount, 1);
    const rules = sheet.getConditionalFormatRules();
    rules.push(
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('fallback').setBackground('#FFF0CC').setFontColor('#7A4A00').setBold(true).setRanges([range]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('live').setBackground('#DDF2E5').setFontColor('#155B36').setBold(true).setRanges([range]).build()
    );
    sheet.setConditionalFormatRules(rules);
  }

  function rebuildScenarioTabView_(scenario, events, responseBySession) {
    const sheet = getSheet_(SHEET_SCENARIO_TABS[scenario]);
    sheet.clear();
    sheet.setConditionalFormatRules([]);
    const data = buildScenarioTabData_(scenario, events, responseBySession);
    const headers = data.headers.length ? data.headers : ['Timestamp','Participant ID','Session ID','Attempts','Best Score'];
    const rows = data.rows;
    if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows.map(safeResearchRow_));
    formatSimpleResearchTable_(sheet, headers, rows.length, scenario === 1 ? 2 : 3, SCENARIO_TAB_COLORS[scenario] || '#2E6A4E');
    fitScenarioDataRows_(sheet, 2, rows.length);
    sheet.setTabColor(SCENARIO_TAB_COLORS[scenario] || '#2E6A4E');
    applyAiSourceRules_(sheet, headers, rows.length);
    applyReviewSourceRules_(sheet, headers, rows.length);
    return rows.length;
  }

  function rebuildProcessLogView_(events) {
    const sheet = getSheet_(SHEET_PROCESS_LOG);
    sheet.clear();
    sheet.setConditionalFormatRules([]);
    const headers = ['Timestamp','Participant ID','Session ID','Scenario','Event','Attempt','Score (current / best)',
      'Input / Action','AI Response','AI Source','Time Since Last Attempt (sec)','Screen Width'];
    const rows = buildProcessResearchRows_(events);
    if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows.map(safeResearchRow_));
    formatSimpleResearchTable_(sheet, headers, rows.length, 4, '#35646A');
    sheet.setTabColor('#35646A');
    setProviderRules_(sheet, 2, rows.length, headers);
    return rows.length;
  }

  function rebuildResearchGuideView_() {
    const sheet = getSheet_(SHEET_RESEARCH_GUIDE);
    sheet.getRange(1, 1, Math.max(sheet.getMaxRows(), 90), Math.min(Math.max(sheet.getMaxColumns(), 6), 20)).breakApart();
    sheet.clear();
    ensureColumnCount_(sheet, 6);

    sheet.getRange('A1:F1').merge().setValue('PromptCraft Research Guide')
      .setBackground('#163F33').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(16);
    sheet.setRowHeight(1, 32);

    const coding = [
      ['Construct','Primary Evidence','How to Interpret','Coding Notes'],
      ['Learning path','02 - S1 Start With Learning','Renamed activities and Prepare / Practice / Evidence placements.','These are design choices; they do not alone prove student learning.'],
      ['Alignment judgment','02 - S1 Start With Learning','Diagnosis of the gap between the intended learning and the module evidence.','Compare the diagnosis with the participant’s placement choices.'],
      ['Transfer to My Course','02 - S1 Start With Learning','Guide completion and number of listed activities.','Personal module wording stays on the participant’s device.'],
      ['Process','01 - Sessions + 10 - Process Log','Checkpoint count, sequence, and time across the activity.','A design checkpoint is not an AI prompt attempt or a mastery score.'],
      ['AI provenance','Raw Events','Provider details only where the app sends them.','The separate S1 Babbage review is not currently saved as a research event.']
    ];
    sheet.getRange(3, 1, coding.length, 4).setValues(coding);
    sheet.getRange('A3:D3').setBackground('#475569').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange(4, 1, coding.length - 1, 4).setWrap(true).setVerticalAlignment('top');

    const guide = [
      ['Tab','Main contents','Use','Notes'],
      ['00 - Overview','Workbook status and counts','Start here','S1 fallback AI count is not inferred from course text.'],
      ['01 - Sessions','One row per participant and session','Participation summary','Join on participant ID plus session ID.'],
      ['02 - S1 Start With Learning','Current S1 design checkpoints','S1 analysis','Older Content Avalanche events remain only in raw history.'],
      ['10 - Process Log','Event sequence','Process analysis','Includes historical raw events.'],
      ['11 - Ideas Wall','Manually moderated candidate queue','Public sharing review','Current S1 course text is not automatically added as a wall candidate.'],
      ['12–13 Readable','Research responses and process events','Detailed analysis','Built from raw records.'],
      ['96–99 Raw','Payload archive, responses, events, and audit','Recovery and verification','Preserve these tabs; refresh never resets them.']
    ];
    sheet.getRange('A10:D10').merge().setValue('Plain-language tab guide').setBackground('#E7F0EC').setFontWeight('bold').setFontColor('#163F33');
    sheet.getRange(11, 1, guide.length, 4).setValues(guide);
    sheet.getRange('A11:D11').setBackground('#215C45').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange(12, 1, guide.length - 1, 4).setWrap(true).setVerticalAlignment('top');
    sheet.setFrozenRows(3);
    [190, 260, 420, 340].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
    sheet.setTabColor('#475569');
  }

  function rebuildOverviewView_(sessionCount, scenarioCounts, processCount) {
    const sheet = getSheet_(SHEET_OVERVIEW);
    sheet.getRange(1, 1, Math.max(sheet.getMaxRows(), 34), Math.min(Math.max(sheet.getMaxColumns(), 7), 20)).breakApart();
    sheet.clear();
    sheet.setConditionalFormatRules([]);
    ensureColumnCount_(sheet, 7);

    sheet.getRange('A1:G1').merge().setValue('PromptCraft Research Workbook')
      .setBackground('#163F33').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(16).setVerticalAlignment('middle');
    sheet.setRowHeight(1, 34);

    sheet.getRange('A3:B8').setValues([
      ['Start here','What it is for'],
      ['01 - Sessions','One row per participant session for participation, duration, completion, and overall AI status.'],
      ['02–09 Scenario tabs','Each scenario has its own research table and columns matched to what that scenario actually measures.'],
      ['10 - Process Log','Chronological attempt/event trail when you need sequence-level evidence.'],
      ['11 - Ideas Wall','Automatic score-4+ candidate queue with manual Review Status dropdown.'],
      ['90 - Research Guide','Coding constructs and a plain-language map of all research tabs.']
    ]);
    sheet.getRange('A3:B3').setBackground('#2E6A4E').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange('A4:B8').setWrap(true).setVerticalAlignment('top');

    sheet.getRange('D3:E3').setValues([['Quick metric','Value']]).setBackground('#35646A').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange('D4:D9').setValues([
      ['Sessions'],['Scenario result rows'],['Process events'],['Average duration (min)'],['Average total attempts'],['Fallback AI records']
    ]);
    sheet.getRange('E4').setFormula("=MAX(0,COUNTA('01 - Sessions'!C2:C))");
    const scenarioCountFormula = Object.keys(SHEET_SCENARIO_TABS).map(n => `COUNTA('${SHEET_SCENARIO_TABS[n]}'!C2:C)`).join('+');
    sheet.getRange('E5').setFormula('=' + scenarioCountFormula);
    sheet.getRange('E6').setFormula("=MAX(0,COUNTA('10 - Process Log'!C2:C))");
    sheet.getRange('E7').setFormula("=IFERROR(AVERAGE('01 - Sessions'!D2:D),0)");
    sheet.getRange('E8').setFormula("=IFERROR(AVERAGE('01 - Sessions'!G2:G),0)");
    const fallbackParts = [
      `COUNTIF('${SHEET_SCENARIO_TABS[2]}'!M2:M,"fallback")`,
      `COUNTIF('${SHEET_SCENARIO_TABS[3]}'!O2:O,"*fallback*")`,
      `COUNTIF('${SHEET_SCENARIO_TABS[4]}'!O2:O,"*fallback*")`,
      `COUNTIF('${SHEET_SCENARIO_TABS[5]}'!O2:O,"*fallback*")`
    ];
    sheet.getRange('E9').setFormula('=' + fallbackParts.join('+'));
    sheet.getRange('E4:E6').setNumberFormat('0'); sheet.getRange('E7:E8').setNumberFormat('0.0'); sheet.getRange('E9').setNumberFormat('0');

    sheet.getRange('A11:F11').setValues([['Scenario','Results Tab','Sessions','Avg Score','Avg Attempts','Fallback AI']])
      .setBackground('#215C45').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
    Object.keys(SCENARIO_LABELS).forEach((n, idx) => {
      const scenario = Number(n);
      const r = 12 + idx;
      const tab = SHEET_SCENARIO_TABS[scenario];
      sheet.getRange(r, 1, 1, 2).setValues([[SCENARIO_LABELS[scenario], tab]]);
      sheet.getRange(r, 3).setFormula(`=COUNTA('${tab}'!C2:C)`);
      sheet.getRange(r, 4).setFormula(`=IFERROR(AVERAGE('${tab}'!E2:E),0)`);
      sheet.getRange(r, 5).setFormula(`=IFERROR(AVERAGE('${tab}'!D2:D),0)`);
      let fallbackFormula = '=0';
      if (scenario === 2) fallbackFormula = `=COUNTIF('${tab}'!M2:M,"fallback")`;
      if (scenario >= 3 && scenario <= 5) fallbackFormula = `=COUNTIF('${tab}'!O2:O,"*fallback*")`;
      sheet.getRange(r, 6).setFormula(fallbackFormula);
    });
    sheet.getRange('A12:B19').setWrap(true).setVerticalAlignment('middle');
    for (let row = 12; row <= 19; row++) sheet.setRowHeight(row, 34);
    sheet.getRange('C12:C19').setNumberFormat('0'); sheet.getRange('D12:E19').setNumberFormat('0.0'); sheet.getRange('F12:F19').setNumberFormat('0');

    sheet.getRange('A21:F22').merge().setValue(
      'Normal research work should happen in 01 - Sessions and the eight scenario tabs (02–09). Raw technical sheets are hidden and retained only for troubleshooting.'
    ).setBackground('#EEF1F3').setFontColor('#475569').setFontStyle('italic').setWrap(true).setVerticalAlignment('middle');

    sheet.getRange('D24:E29').setValues([
      ['Deployment health','Value'],
      ['Receiver code',PROMPTCRAFT_RECEIVER_VERSION],
      ['Receiver on last saved event',''],
      ['App build on last saved event',''],
      ['Expected app build',EXPECTED_APP_BUILD],
      ['Data status','']
    ]);
    sheet.getRange('D24:E24').setBackground('#475569').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange('D25:E29').setWrap(true).setVerticalAlignment('middle');
    for (let row = 25; row <= 29; row++) sheet.setRowHeight(row, 32);
    sheet.getRange('E26').setFormula("=IFERROR('99 - Raw Audit'!B2,\"No payload yet\")");
    sheet.getRange('E27').setFormula("=IFERROR('99 - Raw Audit'!D2,\"No payload yet\")");
    sheet.getRange('E29').setFormula(`=IF(E26="${PROMPTCRAFT_RECEIVER_VERSION}","Current","Waiting for ${PROMPTCRAFT_RECEIVER_VERSION} event")`);
    sheet.getRange('D25:E29').setBackground('#F7F9F8');
    const statusRange = sheet.getRange('E29');
    const rules = sheet.getConditionalFormatRules();
    rules.push(
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Current').setBackground('#DDF2E5').setFontColor('#155B36').setBold(true).setRanges([statusRange]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextContains('Waiting for').setBackground('#FFF0CC').setFontColor('#7A4A00').setBold(true).setRanges([statusRange]).build()
    );
    sheet.setConditionalFormatRules(rules);

    sheet.setColumnWidth(1, 230); sheet.setColumnWidth(2, 300); sheet.setColumnWidth(3, 95);
    sheet.setColumnWidth(4, 190); sheet.setColumnWidth(5, 185); sheet.setColumnWidth(6, 100); sheet.setColumnWidth(7, 24);
    sheet.setFrozenRows(1);
    sheet.setTabColor('#163F33');
  }

  function refreshHumanReadableViews_() {
    ensureCurrentS1Tab_();
    const events = collectResearchEvents_();
    const responseBySession = latestResponseRowsBySession_();
    const sessions = rebuildSessionsView_(events);
    const scenarioCounts = {};
    Object.keys(SHEET_SCENARIO_TABS).forEach(n => {
      scenarioCounts[n] = rebuildScenarioTabView_(Number(n), events, responseBySession);
    });
    const process = rebuildProcessLogView_(events);
    const readableResponses = rebuildReadableResponsesView_(events);
    const processEvents = rebuildProcessEventsView_(events);
    const wallCandidatesAdded = syncIdeasWallCandidatesFromResearchData_(events, responseBySession);
    cleanIdeasWallForResearch_();
    rebuildResearchGuideView_();
    rebuildOverviewView_(sessions, scenarioCounts, process);
    organizeResearchTabs_();
    return {
      sessions: sessions,
      scenario_tabs: scenarioCounts,
      process_log: process,
      readable_responses: readableResponses,
      process_events: processEvents,
      wall_candidates_added: wallCandidatesAdded
    };
  }

  function refreshResearchViewsNow() {
    const counts = refreshHumanReadableViews_();
    SpreadsheetApp.flush();
    return jsonResponse({
      status: 'ok',
      research_schema: EXPECTED_SCHEMA,
      receiver_workflow: 'Start With the Learning readable views + lossless raw archive',
      counts: counts,
      message: 'Readable tabs rebuilt from retained raw records. Current S1 guide checkpoints are excluded from automatic Ideas Wall candidacy.'
    });
  }

  function inspectS1TrackingNow() {
    const source = getSheet_(SHEET_INCREMENTAL);
    ensureIncrementalHeaders(source);
    const lastRow = source.getLastRow();
    const counts = {};
    let currentCheckpoints = 0;
    let missingSessionId = 0;
    if (lastRow > 1) {
      const rows = source.getRange(2, 1, lastRow - 1, INCREMENTAL_HEADERS.length).getValues();
      rows.forEach(row => {
        if (Number(row[INC_COL.scenario - 1]) !== 1) return;
        const eventType = String(row[INC_COL.eventType - 1] || '(missing event type)');
        counts[eventType] = (counts[eventType] || 0) + 1;
        if (S1_LEARNING_EVENTS.indexOf(eventType) !== -1) currentCheckpoints++;
        if (!String(row[INC_COL.session - 1] || '').trim()) missingSessionId++;
      });
    }
    const report = {
      status: 'ok', receiver_version: PROMPTCRAFT_RECEIVER_VERSION,
      s1_raw_events: Object.values(counts).reduce((sum, count) => sum + count, 0),
      current_s1_checkpoints: currentCheckpoints,
      missing_session_id: missingSessionId,
      event_types: counts,
      note: 'Only the four Start With the Learning checkpoint events appear in the current S1 tab. Browser connection tests and older S1 events remain in raw history.'
    };
    console.log(JSON.stringify(report, null, 2));
    return report;
  }


  function shouldRefreshResearchViewsForIncremental_(p) {
    const eventType = String((p && p.event_type) || '').toLowerCase();
    if (Number(p && p.scenario_index) === 1 && S1_LEARNING_EVENTS.indexOf(eventType) !== -1) return true;
    return /complete|completed|final|result|review/.test(eventType);
  }

  function formatRawWorkbook_() {
    formatIncrementalSheet_(getSheet_(SHEET_INCREMENTAL));
    formatFullResponseSheet_(getSheet_(SHEET_RESPONSES));
    formatIdeasSheet_(getSheet_(SHEET_IDEAS));
    formatRawAuditSheet_(getSheet_(SHEET_RAW_AUDIT));
    ensureRawArchiveHeaders_(getSheet_(SHEET_RAW_ARCHIVE));
    applyParticipantIdColumnWidths_();
  }

  function initializeWorkbookNow() {
    const consolidated = { skipped: true, reason: 'Raw rows are preserved; the older derived S1 tab may be renamed.' };
    ensureRawArchiveHeaders_(getSheet_(SHEET_RAW_ARCHIVE));
    ensureIncrementalHeaders(getSheet_(SHEET_INCREMENTAL));
    ensureFullResponseHeaders(getSheet_(SHEET_RESPONSES));
    ensureIdeaHeaders(getSheet_(SHEET_IDEAS));
    ensureRawAuditHeaders_(getSheet_(SHEET_RAW_AUDIT));
    formatRawWorkbook_();
    const counts = refreshHumanReadableViews_();
    SpreadsheetApp.flush();
    return jsonResponse({
      status: 'ok',
      research_schema: EXPECTED_SCHEMA,
      receiver_workflow: 'Start With the Learning readable views + lossless raw archive',
      counts: counts,
      consolidated: consolidated,
      message: 'Readable research tabs rebuilt, empty future tabs hidden, and older S1 derived tab aligned to the current name. V121 raw rows were preserved.'
    });
  }

  function clearTestingRows_(sheetName, headerRows) {
    const sheet = getSheet_(sheetName);
    const firstDataRow = Number(headerRows || 1) + 1;
    const rowCount = Math.max(0, sheet.getLastRow() - Number(headerRows || 1));
    if (rowCount > 0) sheet.getRange(firstDataRow, 1, rowCount, sheet.getMaxColumns()).clearContent();
    return rowCount;
  }

  function resetResearchDataNow() {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(30000)) throw new Error('Receiver is busy. Retry the testing-data reset shortly.');
    try {
      const cleared = {};
      cleared[SHEET_RAW_ARCHIVE] = clearTestingRows_(SHEET_RAW_ARCHIVE, 1);
      cleared[SHEET_RESPONSES] = clearTestingRows_(SHEET_RESPONSES, 2);
      cleared[SHEET_INCREMENTAL] = clearTestingRows_(SHEET_INCREMENTAL, 1);
      cleared[SHEET_RAW_AUDIT] = clearTestingRows_(SHEET_RAW_AUDIT, 1);
      cleared[SHEET_IDEAS] = clearTestingRows_(SHEET_IDEAS, 1);
      cleared[SHEET_CHALLENGE] = clearTestingRows_(SHEET_CHALLENGE, 1);

      const currentScenarioNames = Object.keys(SHEET_SCENARIO_TABS).map(key => SHEET_SCENARIO_TABS[key]);
      getSpreadsheet_().getSheets().forEach(sheet => {
        const name = sheet.getName();
        if (/^0[2-9]\s*-\s*S[1-8]\b/i.test(name) && currentScenarioNames.indexOf(name) === -1) {
          cleared[name] = clearTestingRows_(name, 1);
        }
      });

      ensureRawArchiveHeaders_(getSheet_(SHEET_RAW_ARCHIVE));
      ensureIncrementalHeaders(getSheet_(SHEET_INCREMENTAL));
      ensureFullResponseHeaders(getSheet_(SHEET_RESPONSES));
      ensureIdeaHeaders(getSheet_(SHEET_IDEAS));
      ensureRawAuditHeaders_(getSheet_(SHEET_RAW_AUDIT));
      ensureChallengeSheet_();
      formatRawWorkbook_();
      const views = refreshHumanReadableViews_();
      SpreadsheetApp.flush();
      const report = {
        status: 'ok',
        testing_data_reset: true,
        cleared_rows: cleared,
        views: views,
        message: 'Testing records were cleared. Headers, formatting, formulas, and the workbook structure were rebuilt.'
      };
      console.log(JSON.stringify(report, null, 2));
      return jsonResponse(report);
    } finally {
      lock.releaseLock();
    }
  }

  function bytesToHex_(bytes) {
    return bytes.map(value => ('0' + ((value < 0 ? value + 256 : value).toString(16))).slice(-2)).join('');
  }

  function sheetFingerprint_(name) {
    const sheet = getSpreadsheet_().getSheetByName(name);
    if (!sheet) return { sheet: name, exists: false, rows: 0, columns: 0, sha256: '' };
    const rows = sheet.getLastRow();
    const columns = sheet.getLastColumn();
    const values = rows && columns ? sheet.getRange(1, 1, rows, columns).getDisplayValues() : [];
    const bytes = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      JSON.stringify(values),
      Utilities.Charset.UTF_8
    );
    return { sheet: name, exists: true, rows: rows, columns: columns, sha256: bytesToHex_(bytes) };
  }

  function verifyV84MigrationNow() {
    const names = [SHEET_RESPONSES, SHEET_INCREMENTAL, SHEET_RAW_AUDIT, SHEET_RAW_ARCHIVE];
    return jsonResponse({
      status: 'ok',
      read_only: true,
      receiver_schema: 'V84 migration inventory',
      sheets: names.map(sheetFingerprint_),
      message: 'Compare these row counts and SHA-256 fingerprints before and after running V84 on a recovery copy.'
    });
  }

  function resetChallengeScoresNow() {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(30000)) throw new Error('Receiver is busy. Retry the Challenge Scores reset shortly.');
    try {
      const sheet = ensureChallengeSheet_();
      const rows = Math.max(0, sheet.getLastRow() - 1);
      if (rows) sheet.getRange(2, 1, rows, sheet.getMaxColumns()).clearContent();
      SpreadsheetApp.flush();
      return { status: 'ok', cleared: rows, sheet: SHEET_CHALLENGE, top_xp: 0 };
    } finally {
      lock.releaseLock();
    }
  }

  return { doGet, doPost, initializeWorkbookNow, resetResearchDataNow, refreshResearchViewsNow, inspectS1TrackingNow, verifyV84MigrationNow, resetChallengeScoresNow };
})();

function doGet(e) { return PromptCraftReceiver.doGet(e); }
function doPost(e) { return PromptCraftReceiver.doPost(e); }
function initializeWorkbookNow() { return PromptCraftReceiver.initializeWorkbookNow(); }
function resetResearchDataNow() { return PromptCraftReceiver.resetResearchDataNow(); }
function refreshResearchViewsNow() { return PromptCraftReceiver.refreshResearchViewsNow(); }
function inspectS1TrackingNow() { return PromptCraftReceiver.inspectS1TrackingNow(); }
function verifyV84MigrationNow() { return PromptCraftReceiver.verifyV84MigrationNow(); }
function resetChallengeScoresNow() { return PromptCraftReceiver.resetChallengeScoresNow(); }
