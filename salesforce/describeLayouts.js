/**
 * @description List layouts for one object. GET /services/data/vXX.X/sobjects/sObject/describe/layouts/
 * @param {Object} input
 * @param {string} input.sObject Object API name. Use Global for publisher layouts.
 * @returns {Object} Salesforce layout list
 * @throws {SALESFORCE_INVALID_INPUT} sObject is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function describeLayouts(input) {
  const req = requireInput(input);
  return dataRequest(sObjectPath(req.sObject, "/describe/layouts/"), "GET");
}
