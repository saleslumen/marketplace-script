/**
 * @description Create. POST /crm/objects/{apiVersion}/{objectType}. properties is required. Other input keys are the documented create body and are sent unchanged.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {Object} input.properties
 * @param {Object[]} [input.associations]
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function createObject(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  requiredObjectField(req, "properties");
  return requestJson(`/crm/objects/${configuredApiVersion()}/${encodeURIComponent(objectType)}`, "POST", bodyFrom(req, ["objectType"]));
}
