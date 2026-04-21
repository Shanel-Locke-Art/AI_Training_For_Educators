// ══════════════════════════════════════════════════════
//  PromptCraft — Google Apps Script Data Collector
//  
//  SETUP INSTRUCTIONS:
//  1. Open your Google Sheet
//  2. Click Extensions > Apps Script
//  3. Delete any existing code and paste this entire file
//  4. Click Save (disk icon)
//  5. Click Deploy > New deployment
//  6. Type: Web app
//  7. Execute as: Me
//  8. Who has access: Anyone
//  9. Click Deploy, authorize, copy the Web App URL
//  10. Paste that URL into index.html as SHEETS_URL
// ══════════════════════════════════════════════════════

const SHEET_NAME = 'PromptCraft Responses';

// Column headers — order must match appendRow() call below
const HEADERS = [
  'Timestamp',
  'Participant ID',
  'Session Duration (min)',
  'Scenarios Completed',
  'Total XP Earned',
  'Total Attempts',

  // Scenario 1
  'S1: Attempts',
  'S1: Best Prompt Score (0-5)',
  'S1: Prompts (all)',
  'S1: Final AI Response (excerpt)',
  'S1: OSCQR Indicators Lit',

  // Scenario 2
  'S2: Attempts',
  'S2: Best Prompt Score (0-5)',
  'S2: Prompts (all)',
  'S2: Final AI Response (excerpt)',
  'S2: OSCQR Indicators Lit',

  // Scenario 3
  'S3: Attempts',
  'S3: Best Prompt Score (0-5)',
  'S3: Prompts (all)',
  'S3: Final AI Response (excerpt)',
  'S3: OSCQR Indicators Lit',

  // Reflection questions
  'Q1: What surprised you?',
  'Q2: How did your prompts change?',
  'Q3: What would you do differently?',
  'Q4: Anything else?',

  // Metadata
  'User Agent',
  'Screen Width',
  'Referrer'
];

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet and headers if it does not exist yet
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);

      // Style the header row
      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground('#2c3e35');
      headerRange.setFontColor('#a8d5b5');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(10);
      sheet.setFrozenRows(1);

      // Set column widths
      sheet.setColumnWidth(1, 160);  // Timestamp
      sheet.setColumnWidth(2, 120);  // Participant ID
      sheet.setColumnWidth(9, 300);  // S1 Prompts
      sheet.setColumnWidth(10, 300); // S1 AI Response
      sheet.setColumnWidth(14, 300); // S2 Prompts
      sheet.setColumnWidth(15, 300); // S2 AI Response
      sheet.setColumnWidth(19, 300); // S3 Prompts
      sheet.setColumnWidth(20, 300); // S3 AI Response
      sheet.setColumnWidth(22, 280); // Q1
      sheet.setColumnWidth(23, 280); // Q2
      sheet.setColumnWidth(24, 280); // Q3
      sheet.setColumnWidth(25, 280); // Q4
    }

    // Parse the JSON payload
    const data = JSON.parse(e.postData.contents);

    // Append the data row
    sheet.appendRow([
      data.timestamp            || new Date().toISOString(),
      data.participant_id       || 'anonymous',
      data.session_duration_min || '',
      data.scenarios_completed  || 0,
      data.total_xp             || 0,
      data.total_attempts       || 0,

      data.s1_attempts          || 0,
      data.s1_best_score        || 0,
      data.s1_prompts           || '',
      data.s1_final_response    || '',
      data.s1_oscqr             || '',

      data.s2_attempts          || 0,
      data.s2_best_score        || 0,
      data.s2_prompts           || '',
      data.s2_final_response    || '',
      data.s2_oscqr             || '',

      data.s3_attempts          || 0,
      data.s3_best_score        || 0,
      data.s3_prompts           || '',
      data.s3_final_response    || '',
      data.s3_oscqr             || '',

      data.q1_surprise          || '',
      data.q2_change            || '',
      data.q3_practice          || '',
      data.q4_other             || '',

      data.user_agent           || '',
      data.screen_width         || '',
      data.referrer             || ''
    ]);

    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    // Log error and return it
    console.error('PromptCraft sheet error:', err);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test this function manually in the Apps Script editor
// to verify your sheet is set up correctly
function testWrite() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        participant_id: 'test-001',
        session_duration_min: 12.5,
        scenarios_completed: 3,
        total_xp: 72,
        total_attempts: 7,
        s1_attempts: 3,
        s1_best_score: 4,
        s1_prompts: 'Prompt 1 | Prompt 2 | Prompt 3',
        s1_final_response: 'Here is a compelling discussion activity...',
        s1_oscqr: 'Clear Objectives, Student Interaction',
        s2_attempts: 2,
        s2_best_score: 5,
        s2_prompts: 'Prompt 1 | Prompt 2',
        s2_final_response: 'Here is a differentiated reading strategy...',
        s2_oscqr: 'Accessibility, Multiple Means, Scaffolding',
        s3_attempts: 2,
        s3_best_score: 4,
        s3_prompts: 'Prompt 1 | Prompt 2',
        s3_final_response: 'Here is an authentic assessment design...',
        s3_oscqr: 'Authentic Tasks, Student Agency',
        q1_surprise: 'I was surprised by how much context mattered.',
        q2_change: 'I started including more specific learner details.',
        q3_practice: 'I would always mention the grade level and subject.',
        q4_other: '',
        user_agent: 'Test Browser',
        screen_width: 1440,
        referrer: 'test'
      })
    }
  };
  doPost(testData);
}
