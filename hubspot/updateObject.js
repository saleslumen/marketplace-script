/**
 * @description Update. PATCH /crm/objects/{apiVersion}/{objectType}/{objectId}. properties is required. idProperty is a query parameter.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} input.objectId
 * @param {Object} input.properties
 * @param {string} [input.idProperty]
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function updateObject(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  const objectId = requiredPath(req, "objectId");
  requiredObjectField(req, "properties");
  return requestJson(`/crm/objects/${configuredApiVersion()}/${encodeURIComponent(objectType)}/${encodeURIComponent(objectId)}`, "PATCH", bodyFrom(req, ["objectType", "objectId", "idProperty"]), queryFrom(req, ["idProperty"]));
}
