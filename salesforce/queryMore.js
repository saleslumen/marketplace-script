/**
 * @description Fetch the next SOQL page from a previous nextRecordsUrl.
 * @param {string} nextRecordsUrl Path or instance URL from query or queryAll
 * @returns {Object} Query result
 * @property {number} totalSize
 * @property {boolean} done
 * @property {string} nextRecordsUrl
 * @property {Object[]} records
 * @throws {SALESFORCE_INVALID_INPUT} nextRecordsUrl is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function queryMore(nextRecordsUrl) {
  const path = asString(nextRecordsUrl);
  if (!path) throw new Error("SALESFORCE_INVALID_INPUT: nextRecordsUrl is required");
  return queryResult(await requestJson(path, "GET"));
}
