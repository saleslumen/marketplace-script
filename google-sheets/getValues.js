/**
 * @description Read values from one A1 range.
 * @param {Object} input
 * @param {string} input.spreadsheetId Spreadsheet id
 * @param {string} input.range A1 range
 * @returns {Object} Values
 * @property {string} spreadsheetId
 * @property {string} range
 * @property {string} majorDimension
 * @property {Array[]} values Rows. Missing values are an empty array
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId or range is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function getValues(input) {
  const source = inputObject(input);
  const spreadsheetId = requireSpreadsheetId(source.spreadsheetId);
  const range = requireRange(source.range);
  const response = await requestJson(sheetsPath(spreadsheetId, `/values/${encodeURIComponent(range)}`), "GET");
  return valuesResult(spreadsheetId, response);
}
