/**
 * @description Returns the spreadsheet at the given ID, selecting subsets with data filters. POST /v4/spreadsheets/{spreadsheetId}:getByDataFilter
 * @param {Object} input
 * @param {string} input.spreadsheetId
 * @param {Object[]} [input.dataFilters] DataFilter objects. Each may set a1Range, gridRange, or developerMetadataLookup
 * @param {boolean} [input.includeGridData]
 * @param {boolean} [input.excludeTablesInBandedRanges]
 * @param {string} [input.commentsViewMode] COMMENTS_VIEW_MODE_UNSPECIFIED, COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS, COMMENTS_VIEW_MODE_OMITTED, or COMMENTS_VIEW_MODE_INCLUDED
 * @param {string} [input.fields] Partial response field mask
 * @returns {Object} Spreadsheet
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId or a request field is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsGetByDataFilter(input) {
  const source = inputObject(input);
  const spreadsheetId = requireString(source.spreadsheetId, "spreadsheetId");
  const query = queryString({ fields: optionalString(source.fields, "fields") });
  const body = bodyFrom([
    ["dataFilters", optionalDataFilters(source.dataFilters, "dataFilters")],
    ["includeGridData", optionalBoolean(source.includeGridData, "includeGridData")],
    ["excludeTablesInBandedRanges", optionalBoolean(source.excludeTablesInBandedRanges, "excludeTablesInBandedRanges")],
    ["commentsViewMode", optionalEnum(source.commentsViewMode, "commentsViewMode", COMMENTS_VIEW_MODES)],
  ]);
  return requestJson(`${spreadsheetPath(spreadsheetId)}:getByDataFilter${query}`, "POST", body);
}
