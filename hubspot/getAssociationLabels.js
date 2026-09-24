/**
 * @description List association labels via GET /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/labels. Use typeId values as associationTypeId when creating associations.
 * @param {string} fromObjectType From object type path
 * @param {string} toObjectType To object type path
 * @returns {Object} Association label list
 * @throws {HUBSPOT_INVALID_INPUT} fromObjectType or toObjectType is missing
 * @throws {HUBSPOT_NOT_CONFIGURED} apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function getAssociationLabels(fromObjectType, toObjectType) {
  return requestJson(associationsBatchPath(fromObjectType, toObjectType, "/labels"), "GET");
}
