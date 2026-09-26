/**
 * @description Retrieve one record's associations of one object type. GET /crm/objects/{apiVersion}/{fromObjectType}/{objectId}/associations/{toObjectType}.
 * @param {Object} input
 * @param {string} input.fromObjectType
 * @param {string} input.objectId
 * @param {string} input.toObjectType
 * @param {string} [input.after]
 * @param {number} [input.limit]
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function listAssociations(input) {
  const req = inputObject(input);
  const fromObjectType = requiredPath(req, "fromObjectType");
  const objectId = requiredPath(req, "objectId");
  const toObjectType = requiredPath(req, "toObjectType");
  return requestJson(`/crm/objects/${configuredApiVersion()}/${encodeURIComponent(fromObjectType)}/${encodeURIComponent(objectId)}/associations/${encodeURIComponent(toObjectType)}`, "GET", undefined, queryFrom(req, ["after", "limit"]));
}
