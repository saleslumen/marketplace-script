/**
 * @description Applies one or more updates to the spreadsheet. POST /v4/spreadsheets/{spreadsheetId}:batchUpdate
 * @param {Object} input
 * @param {string} input.spreadsheetId
 * @param {Object[]} input.requests Request objects, applied in order
 * @param {boolean} [input.includeSpreadsheetInResponse]
 * @param {string[]} [input.responseRanges]
 * @param {boolean} [input.responseIncludeGridData]
 * @param {string} [input.commentsViewMode] COMMENTS_VIEW_MODE_UNSPECIFIED, COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS, COMMENTS_VIEW_MODE_OMITTED, or COMMENTS_VIEW_MODE_INCLUDED
 * @param {string} [input.fields] Partial response field mask
 * @returns {Object} BatchUpdateSpreadsheetResponse
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId, requests, or a request field is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsBatchUpdate(input) {
  const source = inputObject(input);
  const spreadsheetId = requireString(source.spreadsheetId, "spreadsheetId");
  const query = queryString({ fields: optionalString(source.fields, "fields") });
  const body = bodyFrom([
    ["requests", requireObjectList(source.requests, "requests")],
    ["includeSpreadsheetInResponse", optionalBoolean(source.includeSpreadsheetInResponse, "includeSpreadsheetInResponse")],
    ["responseRanges", optionalStringList(source.responseRanges, "responseRanges")],
    ["responseIncludeGridData", optionalBoolean(source.responseIncludeGridData, "responseIncludeGridData")],
    ["commentsViewMode", optionalEnum(source.commentsViewMode, "commentsViewMode", COMMENTS_VIEW_MODES)],
  ]);
  return requestJson(`${spreadsheetPath(spreadsheetId)}:batchUpdate${query}`, "POST", body);
}
