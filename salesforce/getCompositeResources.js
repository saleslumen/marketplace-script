/**
 * @description List composite resource URIs. GET /services/data/vXX.X/composite
 * @returns {Object} Salesforce composite resource list
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function getCompositeResources() {
  return dataRequest("/composite", "GET");
}
