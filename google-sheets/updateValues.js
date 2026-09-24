/**
 * @description Write rows to one A1 range. Cells are string, number, or boolean, at most 1000 rows and 100 columns.
 * @param {Object} input
 * @param {string} input.spreadsheetId Spreadsheet id
 * @param {string} input.range A1 range
 * @param {Array<Array<string|number|boolean>>} input.values Rows to write
 * @returns {Object} Update
 * @property {string} spreadsheetId
 * @property {string} updatedRange
 * @property {number} updatedRows
 * @property {number} updatedColumns
 * @property {number} updatedCells
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId, range, or values is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function updateValues(input) {
  const source = inputObject(input);
  const spreadsheetId = requireSpreadsheetId(source.spreadsheetId);
  const range = requireRange(source.range);
  const values = requireValues(source.values);
  const response = await requestJson(
    `${sheetsPath(spreadsheetId, `/values/${encodeURIComponent(range)}`)}${queryString({ valueInputOption: "USER_ENTERED" })}`,
    "PUT",
    { range, majorDimension: "ROWS", values }
  );
  return updateResult(response);
}
