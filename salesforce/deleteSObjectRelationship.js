/**
 * @description Delete the record at a relationship URL. DELETE /services/data/vXX.X/sobjects/sObject/id/relationshipName. An empty 2xx body is {}.
 * @param {Object} input
 * @param {string} input.sObject Object API name
 * @param {string} input.id Record id
 * @param {string} input.relationshipName Relationship name
 * @returns {Object} Salesforce response body. An empty 2xx body is {}.
 * @throws {SALESFORCE_INVALID_INPUT} sObject, id, or relationshipName is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function deleteSObjectRelationship(input) {
  const req = requireInput(input);
  return dataRequest(sObjectPath(req.sObject, `/${encodeURIComponent(requireId(req.id))}/${encodeURIComponent(requireApiName(req.relationshipName, "relationshipName"))}`), "DELETE");
}
