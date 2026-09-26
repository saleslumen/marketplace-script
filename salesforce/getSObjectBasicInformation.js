/**
 * @description Get basic metadata for one object. GET /services/data/vXX.X/sobjects/sObject/
 * @param {Object} input
 * @param {string} input.sObject Object API name
 * @returns {Object} Salesforce sObject basic information
 * @throws {SALESFORCE_INVALID_INPUT} sObject is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function getSObjectBasicInformation(input) {
  const req = requireInput(input);
  return dataRequest(sObjectPath(req.sObject, "/"), "GET");
}
