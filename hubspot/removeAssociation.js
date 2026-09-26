/**
 * @description Remove association between records. DELETE /crm/objects/{apiVersion}/{objectType}/{objectId}/associations/{toObjectType}/{toObjectId}.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} input.objectId
 * @param {string} input.toObjectType
 * @param {string} input.toObjectId
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function removeAssociation(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  const objectId = requiredPath(req, "objectId");
  const toObjectType = requiredPath(req, "toObjectType");
  const toObjectId = requiredPath(req, "toObjectId");
  return requestJson(`/crm/objects/${configuredApiVersion()}/${encodeURIComponent(objectType)}/${encodeURIComponent(objectId)}/associations/${encodeURIComponent(toObjectType)}/${encodeURIComponent(toObjectId)}`, "DELETE");
}
