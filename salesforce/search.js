/**
 * @description Run a SOSL search.
 * @param {string} sosl SOSL statement
 * @returns {Object} Search result
 * @property {Object[]} searchRecords
 * @throws {SALESFORCE_INVALID_INPUT} sosl is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function search(sosl) {
  const statement = asString(sosl);
  if (!statement) throw new Error("SALESFORCE_INVALID_INPUT: sosl is required");
  const result = await dataRequest("/search", "GET", undefined, { q: statement });
  return { searchRecords: asArray(result.searchRecords) };
}
