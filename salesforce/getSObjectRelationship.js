/**
 * @description Get the records at a relationship URL. GET /services/data/vXX.X/sobjects/sObject/id/relationshipName
 * @param {Object} input
 * @param {string} input.sObject Object API name
 * @param {string} input.id Record id
 * @param {string} input.relationshipName Relationship name
 * @returns {Object} Salesforce relationship response
 * @throws {SALESFORCE_INVALID_INPUT} sObject, id, or relationshipName is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function getSObjectRelationship(input) {
  const req = requireInput(input);
  return dataRequest(sObjectPath(req.sObject, `/${encodeURIComponent(requireId(req.id))}/${encodeURIComponent(requireApiName(req.relationshipName, "relationshipName"))}`), "GET");
}
