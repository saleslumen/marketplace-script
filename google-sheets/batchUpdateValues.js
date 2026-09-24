/**
 * @description Write 1 to 50 A1 ranges. Each entry has at most 1000 rows and 100 columns of string, number, or boolean cells.
 * @param {Object} input
 * @param {string} input.spreadsheetId Spreadsheet id
 * @param {Object[]} input.data range and values for each write
 * @returns {Object} Batch update
 * @property {string} spreadsheetId
 * @property {number} totalUpdatedRows
 * @property {number} totalUpdatedColumns
 * @property {number} totalUpdatedCells
 * @property {string[]} updatedRanges Updated range for each response entry
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId or data is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function batchUpdateValues(input) {
  const source = inputObject(input);
  const spreadsheetId = requireSpreadsheetId(source.spreadsheetId);
  const data = requireBatchData(source.data);
  const response = await requestJson(sheetsPath(spreadsheetId, "/values:batchUpdate"), "POST", {
    valueInputOption: "USER_ENTERED",
    data,
  });
  return batchUpdateResult(response, data.length);
}
