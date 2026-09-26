/**
 * @description Read. GET /crm/objects/{apiVersion}/{objectType}/{objectId}.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} input.objectId
 * @param {boolean} [input.archived]
 * @param {string|string[]} [input.associations]
 * @param {string} [input.idProperty]
 * @param {string|string[]} [input.properties]
 * @param {string|string[]} [input.propertiesWithHistory]
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function readObject(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  const objectId = requiredPath(req, "objectId");
  return requestJson(`/crm/objects/${configuredApiVersion()}/${encodeURIComponent(objectType)}/${encodeURIComponent(objectId)}`, "GET", undefined, queryFrom(req, ["archived", "associations", "idProperty", "properties", "propertiesWithHistory"]));
}
