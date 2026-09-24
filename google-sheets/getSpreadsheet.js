const SPREADSHEET_FIELDS = "spreadsheetId,properties.title,properties.locale,properties.timeZone,sheets.properties(sheetId,title,index)";
/**
 * @description Read a spreadsheet's id, title, locale, time zone, and sheets.
 * @param {Object} input
 * @param {string} input.spreadsheetId Spreadsheet id
 * @returns {Object} Spreadsheet
 * @property {string} spreadsheetId
 * @property {string} title
 * @property {string} locale
 * @property {string} timeZone
 * @property {Object[]} sheets Sheet id, title, and index
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function getSpreadsheet(input) {
  const source = inputObject(input);
  const spreadsheetId = requireSpreadsheetId(source.spreadsheetId);
  const response = await requestJson(`${sheetsPath(spreadsheetId, "")}${queryString({ fields: SPREADSHEET_FIELDS })}`, "GET");
  return spreadsheetResult(response);
}
