/**
 * @description Sets values in one or more ranges of a spreadsheet selected by data filters. POST /v4/spreadsheets/{spreadsheetId}/values:batchUpdateByDataFilter
 * @param {Object} input
 * @param {string} input.spreadsheetId
 * @param {string} input.valueInputOption INPUT_VALUE_OPTION_UNSPECIFIED, RAW, or USER_ENTERED
 * @param {Object[]} input.data DataFilterValueRange objects with dataFilter and values
 * @param {boolean} [input.includeValuesInResponse]
 * @param {string} [input.responseValueRenderOption] FORMATTED_VALUE, UNFORMATTED_VALUE, or FORMULA
 * @param {string} [input.responseDateTimeRenderOption] SERIAL_NUMBER or FORMATTED_STRING
 * @returns {Object} BatchUpdateValuesByDataFilterResponse
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId, valueInputOption, or data is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsValuesBatchUpdateByDataFilter(input) {
  const source = inputObject(input);
  const spreadsheetId = requireString(source.spreadsheetId, "spreadsheetId");
  const body = bodyFrom([
    ["valueInputOption", requireEnum(source.valueInputOption, "valueInputOption", VALUE_INPUT_OPTIONS)],
    ["data", requireDataFilterValueRanges(source.data, "data")],
    ["includeValuesInResponse", optionalBoolean(source.includeValuesInResponse, "includeValuesInResponse")],
    ["responseValueRenderOption", optionalEnum(source.responseValueRenderOption, "responseValueRenderOption", VALUE_RENDER_OPTIONS)],
    ["responseDateTimeRenderOption", optionalEnum(source.responseDateTimeRenderOption, "responseDateTimeRenderOption", DATE_TIME_RENDER_OPTIONS)],
  ]);
  return requestJson(`${spreadsheetPath(spreadsheetId)}/values:batchUpdateByDataFilter`, "POST", body);
}
