/**
 * @description Clears one or more ranges of values matched by data filters. POST /v4/spreadsheets/{spreadsheetId}/values:batchClearByDataFilter
 * @param {Object} input
 * @param {string} input.spreadsheetId
 * @param {Object[]} input.dataFilters DataFilter objects. Each may set a1Range, gridRange, or developerMetadataLookup
 * @returns {Object} BatchClearValuesByDataFilterResponse
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId or dataFilters is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsValuesBatchClearByDataFilter(input) {
  const source = inputObject(input);
  const spreadsheetId = requireString(source.spreadsheetId, "spreadsheetId");
  const body = { dataFilters: requireDataFilters(source.dataFilters, "dataFilters") };
  return requestJson(`${spreadsheetPath(spreadsheetId)}/values:batchClearByDataFilter`, "POST", body);
}
