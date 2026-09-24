/**
 * @description Describe one sObject, including fields.
 * @param {string} sobject API name such as Account
 * @returns {Object} sObject describe
 * @throws {SALESFORCE_INVALID_INPUT} sobject is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function describeSObject(sobject) {
  return dataRequest(`/sobjects/${encodeURIComponent(requireSObject(sobject))}/describe`, "GET");
}
