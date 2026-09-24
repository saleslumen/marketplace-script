/**
 * @description Clear values from one A1 range.
 * @param {Object} input
 * @param {string} input.spreadsheetId Spreadsheet id
 * @param {string} input.range A1 range
 * @returns {Object} Clear
 * @property {string} spreadsheetId
 * @property {string} clearedRange
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId or range is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function clearValues(input) {
  const source = inputObject(input);
  const spreadsheetId = requireSpreadsheetId(source.spreadsheetId);
  const range = requireRange(source.range);
  const response = await requestJson(sheetsPath(spreadsheetId, `/values/${encodeURIComponent(range)}:clear`), "POST", {});
  return clearResult(response);
}
