/**
 * @description Returns one or more ranges of values that match the specified data filters. POST /v4/spreadsheets/{spreadsheetId}/values:batchGetByDataFilter
 * @param {Object} input
 * @param {string} input.spreadsheetId
 * @param {Object[]} input.dataFilters DataFilter objects. Each may set a1Range, gridRange, or developerMetadataLookup
 * @param {string} [input.majorDimension] DIMENSION_UNSPECIFIED, ROWS, or COLUMNS
 * @param {string} [input.valueRenderOption] FORMATTED_VALUE, UNFORMATTED_VALUE, or FORMULA
 * @param {string} [input.dateTimeRenderOption] SERIAL_NUMBER or FORMATTED_STRING
 * @returns {Object} BatchGetValuesByDataFilterResponse
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId, dataFilters, or a request field is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsValuesBatchGetByDataFilter(input) {
  const source = inputObject(input);
  const spreadsheetId = requireString(source.spreadsheetId, "spreadsheetId");
  const body = bodyFrom([
    ["dataFilters", requireDataFilters(source.dataFilters, "dataFilters")],
    ["majorDimension", optionalEnum(source.majorDimension, "majorDimension", MAJOR_DIMENSIONS)],
    ["valueRenderOption", optionalEnum(source.valueRenderOption, "valueRenderOption", VALUE_RENDER_OPTIONS)],
    ["dateTimeRenderOption", optionalEnum(source.dateTimeRenderOption, "dateTimeRenderOption", DATE_TIME_RENDER_OPTIONS)],
  ]);
  return requestJson(`${spreadsheetPath(spreadsheetId)}/values:batchGetByDataFilter`, "POST", body);
}
