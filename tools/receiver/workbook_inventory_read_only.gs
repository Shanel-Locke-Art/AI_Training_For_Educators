/**
 * PromptCraft production workbook inventory, read-only Phase 0 helper.
 *
 * Run inventoryPromptCraftWorkbookReadOnly() from the container-bound Apps
 * Script editor. It reads workbook metadata and headers, writes nothing, and
 * prints a JSON inventory to the execution log for comparison with a copied
 * workbook. Do not run either V83 reset/initialize function as part of this
 * inventory.
 */

const PROMPTCRAFT_RAW_SHEETS = Object.freeze([
  '97 - Raw Responses',
  '98 - Raw Events',
  '99 - Raw Audit'
]);

function promptCraftInventoryHash_(value) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    JSON.stringify(value),
    Utilities.Charset.UTF_8
  );
  return bytes.map(byte => (`0${(byte & 0xff).toString(16)}`).slice(-2)).join('');
}

function promptCraftInventoryHeaders_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (!lastColumn || !sheet.getLastRow()) return [];
  const headerRows = Math.min(2, sheet.getLastRow());
  return sheet.getRange(1, 1, headerRows, lastColumn).getDisplayValues();
}

function inventoryPromptCraftWorkbookReadOnly() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Open the PromptCraft workbook before running the read-only inventory.');

  const sheets = spreadsheet.getSheets().map((sheet, index) => {
    const headers = promptCraftInventoryHeaders_(sheet);
    return {
      position: index + 1,
      name: sheet.getName(),
      sheet_id: sheet.getSheetId(),
      hidden: sheet.isSheetHidden(),
      last_row: sheet.getLastRow(),
      last_column: sheet.getLastColumn(),
      max_rows: sheet.getMaxRows(),
      max_columns: sheet.getMaxColumns(),
      frozen_rows: sheet.getFrozenRows(),
      frozen_columns: sheet.getFrozenColumns(),
      header_rows: headers,
      header_sha256: promptCraftInventoryHash_(headers)
    };
  });

  const rawArchives = {};
  PROMPTCRAFT_RAW_SHEETS.forEach(name => {
    const sheet = spreadsheet.getSheetByName(name);
    rawArchives[name] = sheet ? {
      present: true,
      rows_including_headers: sheet.getLastRow(),
      columns: sheet.getLastColumn(),
      hidden: sheet.isSheetHidden()
    } : { present: false };
  });

  const inventory = {
    inventory_version: 1,
    mode: 'read_only',
    generated_at: new Date().toISOString(),
    spreadsheet_name: spreadsheet.getName(),
    sheet_count: sheets.length,
    sheets,
    raw_archives: rawArchives,
    workbook_shape_sha256: promptCraftInventoryHash_(sheets.map(sheet => ({
      position: sheet.position,
      name: sheet.name,
      hidden: sheet.hidden,
      last_row: sheet.last_row,
      last_column: sheet.last_column,
      header_sha256: sheet.header_sha256
    })))
  };

  console.log(JSON.stringify(inventory, null, 2));
  return inventory;
}
