/**
 * @description List REST API versions. GET /services/data
 * @returns {Object[]} Salesforce version list
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function listVersions() {
  return requestJson("/services/data", "GET");
}
