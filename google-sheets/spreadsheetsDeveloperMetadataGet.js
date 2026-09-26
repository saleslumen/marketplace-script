/**
 * @description Returns the developer metadata with the specified ID. GET /v4/spreadsheets/{spreadsheetId}/developerMetadata/{metadataId}
 * @param {Object} input
 * @param {string} input.spreadsheetId
 * @param {number} input.metadataId int32
 * @returns {Object} DeveloperMetadata
 * @throws {SHEETS_INVALID_INPUT} spreadsheetId or metadataId is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Google Sheets is not connected
 * @throws {SHEETS_REQUEST_FAILED} Google Sheets rejected the request
 * @throws {SHEETS_INVALID_RESPONSE} Google Sheets returned an unreadable body
 */
async function spreadsheetsDeveloperMetadataGet(input) {
  const source = inputObject(input);
  const spreadsheetId = requireString(source.spreadsheetId, "spreadsheetId");
  const metadataId = requireInt32(source.metadataId, "metadataId");
  return requestJson(`${spreadsheetPath(spreadsheetId)}/developerMetadata/${metadataId}`, "GET");
}
