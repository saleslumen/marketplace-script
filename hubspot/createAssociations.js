/**
 * @description Create up to 2000 labeled associations via POST /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/batch/create. inputs is an array of objects with from, to, and types (associationCategory and associationTypeId). Use getAssociationLabels to resolve associationTypeId.
 * @param {string} fromObjectType From object type path
 * @param {string} toObjectType To object type path
 * @param {Object[]} inputs Batch create inputs
 * @returns {Object} Batch result
 * @throws {HUBSPOT_INVALID_INPUT} fromObjectType, toObjectType, or inputs are missing or inputs exceeds 2000
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function createAssociations(fromObjectType, toObjectType, inputs) {
  return requestJson(associationsBatchPath(fromObjectType, toObjectType, "/batch/create"), "POST", {
    inputs: requireAssociationCreateInputs(inputs),
  });
}
