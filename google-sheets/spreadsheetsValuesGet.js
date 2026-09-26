/**
 * @description Returns a range of values from a spreadsheet. GET /v4/spreadsheets/{spreadsheetId}/values/{range}
 * @param {Object} input
 * @param {string} input.spreadsheetId
 * @param {string} input.range A1 notation or R1C1 notation
 * @param {string} [input.majorDimension] DIMENSION_UNSPECIFIED, ROWS, or COLUMNS
 * @param {string} [input.valueRenderOption] FORMATTED_VALUE, UNFORMATTED_VALUE, or FORMULA
 * @param {string} [input.dateTimeRenderOption] SERIAL_NUMBER or FORMATTED_STRING
 * @returns {Object} ValueRange
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId, range, or a query parameter is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsValuesGet(input) {
  const source = inputObject(input);
  const spreadsheetId = requireString(source.spreadsheetId, "spreadsheetId");
  const range = requireString(source.range, "range");
  const query = queryString({
    majorDimension: optionalEnum(source.majorDimension, "majorDimension", MAJOR_DIMENSIONS),
    valueRenderOption: optionalEnum(source.valueRenderOption, "valueRenderOption", VALUE_RENDER_OPTIONS),
    dateTimeRenderOption: optionalEnum(source.dateTimeRenderOption, "dateTimeRenderOption", DATE_TIME_RENDER_OPTIONS),
  });
  return requestJson(`${spreadsheetPath(spreadsheetId)}/values/${encodeURIComponent(range)}${query}`, "GET");
}
