/**
 * @description List REST resources for the configured API version.
 * @returns {Object} Resource map of name to URI
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function listResources() {
  return dataRequest("", "GET");
}
