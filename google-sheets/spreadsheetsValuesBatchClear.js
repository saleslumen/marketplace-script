/**
 * @description Clears one or more ranges of values from a spreadsheet. POST /v4/spreadsheets/{spreadsheetId}/values:batchClear
 * @param {Object} input
 * @param {string} input.spreadsheetId
 * @param {string[]} input.ranges A1 notation or R1C1 notation
 * @returns {Object} BatchClearValuesResponse
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId or ranges is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsValuesBatchClear(input) {
  const source = inputObject(input);
  const spreadsheetId = requireString(source.spreadsheetId, "spreadsheetId");
  const body = { ranges: requireStringList(source.ranges, "ranges") };
  return requestJson(`${spreadsheetPath(spreadsheetId)}/values:batchClear`, "POST", body);
}
