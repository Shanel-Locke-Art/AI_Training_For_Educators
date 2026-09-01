'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const RECEIVER_PATH = path.join(ROOT, 'apps-script', 'PromptCraft_Receiver_V83_Readable_Prompt_Data.js');
const FIXTURE_ROOT = path.join(__dirname, 'fixtures', 'receiver');
const INVENTORY_PATH = path.join(ROOT, 'tools', 'receiver', 'workbook_inventory_read_only.gs');
const MANIFEST_PATH = path.join(ROOT, 'release', 'baseline-manifest.json');
const EXPECTED_RECEIVER_SHA256 = 'f20107b3faa3f28794c9631bfa75e0834c84d96b6eaae2149095be0fb11bba58';

function blankRow(width) {
  return new Array(width).fill('');
}

class MockRange {
  constructor(sheet, row, column, rowCount, columnCount) {
    this.sheet = sheet;
    this.row = row;
    this.column = column;
    this.rowCount = rowCount;
    this.columnCount = columnCount;
  }

  getValues() {
    const values = [];
    for (let r = 0; r < this.rowCount; r += 1) {
      const source = this.sheet.rows[this.row - 1 + r] || [];
      values.push(Array.from({ length: this.columnCount }, (_, c) => source[this.column - 1 + c] ?? ''));
    }
    return values;
  }

  getDisplayValues() {
    return this.getValues().map(row => row.map(value => value === null || value === undefined ? '' : String(value)));
  }

  setValues(values) {
    assert.equal(values.length, this.rowCount, 'fixture row count must match the requested range');
    values.forEach((valuesRow, r) => {
      assert.equal(valuesRow.length, this.columnCount, 'fixture column count must match the requested range');
      this.sheet.ensureRow(this.row - 1 + r);
      valuesRow.forEach((value, c) => {
        this.sheet.rows[this.row - 1 + r][this.column - 1 + c] = value;
      });
    });
    return this;
  }

  setValue(value) {
    this.sheet.ensureRow(this.row - 1);
    this.sheet.rows[this.row - 1][this.column - 1] = value;
    return this;
  }

  breakApart() { return this; }
  merge() { return this; }
  setBackground() { return this; }
  setFontColor() { return this; }
  setFontWeight() { return this; }
  setHorizontalAlignment() { return this; }
  setNumberFormat() { return this; }
}

class MockSheet {
  constructor(name) {
    this.name = name;
    this.rows = [];
    this.maxColumns = 100;
  }

  ensureRow(index) {
    while (this.rows.length <= index) this.rows.push(blankRow(this.maxColumns));
  }

  getName() { return this.name; }
  getMaxColumns() { return this.maxColumns; }
  getLastRow() {
    for (let r = this.rows.length - 1; r >= 0; r -= 1) {
      if (this.rows[r].some(value => value !== '' && value !== null && value !== undefined)) return r + 1;
    }
    return 0;
  }

  getRange(row, column, rowCount = 1, columnCount = 1) {
    assert.equal(typeof row, 'number', 'the Phase 0 fixture supports numeric ranges only');
    return new MockRange(this, row, column, rowCount, columnCount);
  }

  insertColumnsAfter(_column, count) { this.maxColumns += count; }
  insertRowsBefore(row, count) {
    this.rows.splice(row - 1, 0, ...Array.from({ length: count }, () => blankRow(this.maxColumns)));
  }
  setFrozenRows() {}
}

class MockSpreadsheet {
  constructor() { this.sheets = new Map(); }
  getSheetByName(name) { return this.sheets.get(name) || null; }
  insertSheet(name) {
    const sheet = new MockSheet(name);
    this.sheets.set(name, sheet);
    return sheet;
  }
}

function responseBody(response) {
  return JSON.parse(response.text);
}

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_ROOT, name), 'utf8'));
}

function createReceiverHarness() {
  const spreadsheet = new MockSpreadsheet();
  const context = {
    Blob: class Blob {},
    console: { log() {}, warn() {}, error() {} },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput(text) {
        return {
          text,
          mimeType: '',
          setMimeType(mimeType) { this.mimeType = mimeType; return this; }
        };
      }
    },
    SpreadsheetApp: {
      getActiveSpreadsheet: () => spreadsheet,
      flush() {}
    }
  };
  vm.createContext(context);
  const source = fs.readFileSync(RECEIVER_PATH, 'utf8');
  vm.runInContext(`${source}\n;globalThis.__promptCraftReceiver = PromptCraftReceiver;`, context, { filename: RECEIVER_PATH });
  return { receiver: context.__promptCraftReceiver, spreadsheet };
}

function post(receiver, payload) {
  return responseBody(receiver.doPost({ postData: { contents: JSON.stringify(payload) } }));
}

function dataRows(sheet, headerRows = 1) {
  return sheet.rows.slice(headerRows, sheet.getLastRow()).filter(row => row.some(value => value !== ''));
}

function testSourceIdentity() {
  const bytes = fs.readFileSync(RECEIVER_PATH);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), EXPECTED_RECEIVER_SHA256);
}

function testPhase0ManifestIdentity() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  assert.equal(manifest.baseline_id, 'PROMPTCRAFT_V429_PHASE0_R524');
  assert.equal(manifest.application.build, 'PROMPTCRAFT_V429');
  assert.equal(manifest.application.research_schema, 'V121');
  assert.equal(manifest.application.browser_cache_patch, 523);
  assert.equal(manifest.application.runtime_changed_in_phase_0, false);
  assert.equal(manifest.receiver.version, 'V83');
  assert.equal(manifest.receiver.source_sha256, EXPECTED_RECEIVER_SHA256);
  assert.equal(manifest.receiver.source_changed_in_phase_0, false);
}

function testInventoryHelperIsReadOnly() {
  const source = fs.readFileSync(INVENTORY_PATH, 'utf8');
  const executable = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
  assert.match(executable, /SpreadsheetApp\.getActiveSpreadsheet\(\)/);
  [
    /\.setValue\s*\(/,
    /\.setValues\s*\(/,
    /\.clear(?:Content)?\s*\(/,
    /\.deleteSheet\s*\(/,
    /\.insertSheet\s*\(/,
    /\.appendRow\s*\(/,
    /\.insertRows?/,
    /\.insertColumns?/
  ].forEach(pattern => assert.doesNotMatch(executable, pattern));
}

function testHealthContract() {
  const { receiver } = createReceiverHarness();
  const health = responseBody(receiver.doGet({ parameter: {} }));
  assert.equal(health.status, 'ok');
  assert.equal(health.receiver_version, 'V83');
  assert.equal(health.expected_app_schema, 'V121');
  assert.equal(health.expected_app_build, 'PROMPTCRAFT_V429');
}

function testCurrentRoadmapIncrementalPreservation() {
  const { receiver, spreadsheet } = createReceiverHarness();
  const fixtures = [
    loadFixture('v121_s3_metacognition_incremental.json'),
    loadFixture('v121_s4_assessment_incremental.json')
  ];

  fixtures.forEach(payload => {
    const result = post(receiver, payload);
    assert.equal(result.status, 'ok');
    assert.equal(result.type, 'incremental');
    assert.equal(result.schema_compatible, true);
    assert.equal(result.research_views_refreshed, false);
    assert.match(result.checkpoint_status, /pending/);
  });

  const rawEvents = dataRows(spreadsheet.getSheetByName('98 - Raw Events'));
  assert.equal(rawEvents.length, 2);
  assert.equal(rawEvents[0][3], 4);
  assert.equal(rawEvents[0][4], 'S4: The 96% Problem');
  assert.match(rawEvents[0][24], /s4_diagnosis_json/);
  assert.equal(rawEvents[1][3], 3);
  assert.equal(rawEvents[1][4], 'S3: The Confident Student Problem');
  assert.match(rawEvents[1][24], /s2_diagnosis_json/);

  const auditRows = dataRows(spreadsheet.getSheetByName('99 - Raw Audit'));
  assert.equal(auditRows.length, 2);
  assert.equal(auditRows[0][1], 'V83');
  assert.equal(auditRows[0][2], 'V121');
  assert.equal(auditRows[0][3], 'PROMPTCRAFT_V429');
}

function testS1CheckpointUpsert() {
  const { receiver, spreadsheet } = createReceiverHarness();
  const first = loadFixture('v121_s1_content_avalanche_incremental.json');
  const second = { ...first, timestamp: '2026-09-01T12:01:00.000Z', attempts: 2, current_score: 2, best_score: 2 };
  assert.equal(post(receiver, first).checkpoint_status, 'inserted');
  assert.equal(post(receiver, second).checkpoint_status, 'updated');

  const responseRows = dataRows(spreadsheet.getSheetByName('97 - Raw Responses'), 2);
  assert.equal(responseRows.length, 1, 'the S1 checkpoint must update rather than duplicate the session');
  assert.equal(responseRows[0][1], 'fixture-s1');
  assert.equal(responseRows[0][2], 'fixture-session-s1');
  assert.equal(responseRows[0][8], 2);
  assert.equal(responseRows[0][9], 2);
}

function testMalformedJsonIsRejectedWithoutAuditRow() {
  const { receiver, spreadsheet } = createReceiverHarness();
  const result = responseBody(receiver.doPost({ postData: { contents: '{not-json' } }));
  assert.equal(result.status, 'error');
  assert.equal(spreadsheet.getSheetByName('99 - Raw Audit'), null);
}

function testKnownV83ProjectionContractIsRecorded() {
  const source = fs.readFileSync(RECEIVER_PATH, 'utf8');
  assert.match(source, /1:\s*'02 - S1 Engagement'/);
  assert.match(source, /2:\s*'03 - S2 Metacognition'/);
  assert.match(source, /3:\s*'04 - S3 Assessment'/);
  assert.match(source, /4:\s*'05 - S4 Sync Bias'/);
  assert.match(source, /raw\.slice\(0, 4500\)/);
  assert.doesNotMatch(source, /LockService/);
}

testSourceIdentity();
testPhase0ManifestIdentity();
testInventoryHelperIsReadOnly();
testHealthContract();
testCurrentRoadmapIncrementalPreservation();
testS1CheckpointUpsert();
testMalformedJsonIsRejectedWithoutAuditRow();
testKnownV83ProjectionContractIsRecorded();

console.log('PromptCraft V83 receiver characterization fixtures passed.');
