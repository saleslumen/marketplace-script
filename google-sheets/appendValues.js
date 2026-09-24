/**
 * @description Append rows to a table. Cells are string, number, or boolean, at most 1000 rows and 100 columns.
 * @param {Object} input
 * @param {string} input.spreadsheetId Spreadsheet id
 * @param {string} input.range A1 range
 * @param {Array<Array<string|number|boolean>>} input.values Rows to append
 * @returns {Object} Append
 * @property {string} spreadsheetId
 * @property {string} [tableRange] Table range from the response when Google sends one
 * @property {string} updatedRange Updated range from updates.updatedRange
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId, range, or values is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function appendValues(input) {
  const source = inputObject(input);
  const spreadsheetId = requireSpreadsheetId(source.spreadsheetId);
  const range = requireRange(source.range);
  const values = requireValues(source.values);
  const response = await requestJson(
    `${sheetsPath(spreadsheetId, `/values/${encodeURIComponent(range)}:append`)}${queryString({ valueInputOption: "USER_ENTERED", insertDataOption: "INSERT_ROWS" })}`,
    "POST",
    { range, majorDimension: "ROWS", values }
  );
  return appendResult(response);
}
