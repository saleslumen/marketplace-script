/**
 * @description Copies a single sheet from a spreadsheet to another spreadsheet. POST /v4/spreadsheets/{spreadsheetId}/sheets/{sheetId}:copyTo
 * @param {Object} input
 * @param {string} input.spreadsheetId
 * @param {number} input.sheetId int32
 * @param {string} input.destinationSpreadsheetId
 * @returns {Object} SheetProperties
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId, sheetId, or destinationSpreadsheetId is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsSheetsCopyTo(input) {
  const source = inputObject(input);
  const spreadsheetId = requireString(source.spreadsheetId, "spreadsheetId");
  const sheetId = requireInt32(source.sheetId, "sheetId");
  const body = { destinationSpreadsheetId: requireString(source.destinationSpreadsheetId, "destinationSpreadsheetId") };
  return requestJson(`${spreadsheetPath(spreadsheetId)}/sheets/${sheetId}:copyTo`, "POST", body);
}
