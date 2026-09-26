/**
 * @description Create one record with the external-id resource. POST /services/data/vXX.X/sobjects/sObject/Id. Every property except sObject is a field value in the request body. Do not send Id or an external id field in the body.
 * @param {Object} input
 * @param {string} input.sObject Object API name
 * @returns {Object} Salesforce create response
 * @throws {SALESFORCE_INVALID_INPUT} sObject is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function createSObjectByExternalId(input) {
  const req = requireInput(input);
  return dataRequest(sObjectPath(req.sObject, "/Id"), "POST", recordBody(req, ["sObject"]));
}
