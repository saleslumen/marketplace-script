/**
 * @description List the connected user's default global search scope. GET /services/data/vXX.X/search/scopeOrder
 * @returns {Object} Salesforce search scope
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function searchScopeOrder() {
  return dataRequest("/search/scopeOrder", "GET");
}
