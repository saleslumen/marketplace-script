/**
 * @description Return Salesforce org API limits for the connected user.
 * @returns {Object} Limits map keyed by limit name
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function getLimits() {
  return dataRequest("/limits", "GET");
}
