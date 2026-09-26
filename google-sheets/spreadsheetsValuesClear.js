/**
 * @description Clears values from a spreadsheet. POST /v4/spreadsheets/{spreadsheetId}/values/{range}:clear
 * @param {Object} input
 * @param {string} input.spreadsheetId
 * @param {string} input.range A1 notation or R1C1 notation of the values to clear
 * @returns {Object} ClearValuesResponse
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId or range is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsValuesClear(input) {
  const source = inputObject(input);
  const spreadsheetId = requireString(source.spreadsheetId, "spreadsheetId");
  const range = requireString(source.range, "range");
  return requestJson(`${spreadsheetPath(spreadsheetId)}/values/${encodeURIComponent(range)}:clear`, "POST", {});
}
