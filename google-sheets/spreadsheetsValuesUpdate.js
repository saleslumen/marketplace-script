/**
 * @description Sets values in a range of a spreadsheet. PUT /v4/spreadsheets/{spreadsheetId}/values/{range}
 * @param {Object} input
 * @param {string} input.spreadsheetId
 * @param {string} input.range A1 notation of the values to update
 * @param {string} input.valueInputOption INPUT_VALUE_OPTION_UNSPECIFIED, RAW, or USER_ENTERED
 * @param {boolean} [input.includeValuesInResponse]
 * @param {string} [input.responseValueRenderOption] FORMATTED_VALUE, UNFORMATTED_VALUE, or FORMULA
 * @param {string} [input.responseDateTimeRenderOption] SERIAL_NUMBER or FORMATTED_STRING
 * @param {string} [input.majorDimension] ValueRange.majorDimension: DIMENSION_UNSPECIFIED, ROWS, or COLUMNS
 * @param {Array[]} input.values ValueRange.values
 * @returns {Object} UpdateValuesResponse
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId, range, valueInputOption, or values is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsValuesUpdate(input) {
  const source = inputObject(input);
  const spreadsheetId = requireString(source.spreadsheetId, "spreadsheetId");
  const range = requireString(source.range, "range");
  const query = queryString({
    valueInputOption: requireEnum(source.valueInputOption, "valueInputOption", VALUE_INPUT_OPTIONS),
    includeValuesInResponse: optionalBoolean(source.includeValuesInResponse, "includeValuesInResponse"),
    responseValueRenderOption: optionalEnum(source.responseValueRenderOption, "responseValueRenderOption", VALUE_RENDER_OPTIONS),
    responseDateTimeRenderOption: optionalEnum(source.responseDateTimeRenderOption, "responseDateTimeRenderOption", DATE_TIME_RENDER_OPTIONS),
  });
  const body = bodyFrom([
    ["range", range],
    ["majorDimension", optionalEnum(source.majorDimension, "majorDimension", MAJOR_DIMENSIONS)],
    ["values", requireMatrix(source.values, "values")],
  ]);
  return requestJson(`${spreadsheetPath(spreadsheetId)}/values/${encodeURIComponent(range)}${query}`, "PUT", body);
}
