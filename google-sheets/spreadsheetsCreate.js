/**
 * @description Creates a spreadsheet, returning the newly created spreadsheet. POST /v4/spreadsheets
 * @param {Object} input Spreadsheet
 * @param {Object} [input.properties]
 * @param {Object[]} [input.sheets]
 * @param {Object[]} [input.namedRanges]
 * @param {Object[]} [input.developerMetadata]
 * @param {Object[]} [input.dataSources]
 * @returns {Object} Spreadsheet
 * @throws {SHEETS_INVALID_INPUT} a Spreadsheet field is invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsCreate(input) {
  const source = inputObject(input);
  const body = bodyFrom([
    ["properties", optionalPlainObject(source.properties, "properties")],
    ["sheets", optionalObjectList(source.sheets, "sheets")],
    ["namedRanges", optionalObjectList(source.namedRanges, "namedRanges")],
    ["developerMetadata", optionalObjectList(source.developerMetadata, "developerMetadata")],
    ["dataSources", optionalObjectList(source.dataSources, "dataSources")],
  ]);
  return requestJson("/v4/spreadsheets", "POST", body);
}
