/**
 * @description Read values from 1 to 50 A1 ranges.
 * @param {Object} input
 * @param {string} input.spreadsheetId Spreadsheet id
 * @param {string[]} input.ranges A1 ranges
 * @returns {Object} Value ranges
 * @property {string} spreadsheetId
 * @property {Object[]} valueRanges range, majorDimension, and values for each range
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId or ranges is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function batchGetValues(input) {
  const source = inputObject(input);
  const spreadsheetId = requireSpreadsheetId(source.spreadsheetId);
  const ranges = requireRanges(source.ranges);
  const response = await requestJson(`${sheetsPath(spreadsheetId, "/values:batchGet")}${queryString({ ranges })}`, "GET");
  return batchGetResult(response, ranges.length);
}
