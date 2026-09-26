/**
 * @description Returns the spreadsheet at the given ID. GET /v4/spreadsheets/{spreadsheetId}
 * @param {Object} input
 * @param {string} input.spreadsheetId
 * @param {string[]} [input.ranges]
 * @param {boolean} [input.includeGridData]
 * @param {boolean} [input.excludeTablesInBandedRanges]
 * @param {string} [input.commentsViewMode] COMMENTS_VIEW_MODE_UNSPECIFIED, COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS, COMMENTS_VIEW_MODE_OMITTED, or COMMENTS_VIEW_MODE_INCLUDED
 * @param {string} [input.fields] Partial response field mask
 * @returns {Object} Spreadsheet
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId or a query parameter is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsGet(input) {
  const source = inputObject(input);
  const spreadsheetId = requireString(source.spreadsheetId, "spreadsheetId");
  const query = queryString({
    ranges: optionalStringList(source.ranges, "ranges"),
    includeGridData: optionalBoolean(source.includeGridData, "includeGridData"),
    excludeTablesInBandedRanges: optionalBoolean(source.excludeTablesInBandedRanges, "excludeTablesInBandedRanges"),
    commentsViewMode: optionalEnum(source.commentsViewMode, "commentsViewMode", COMMENTS_VIEW_MODES),
    fields: optionalString(source.fields, "fields"),
  });
  return requestJson(`${spreadsheetPath(spreadsheetId)}${query}`, "GET");
}
