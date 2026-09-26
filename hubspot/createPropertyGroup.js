/**
 * @description Create a property group. POST /crm/properties/{apiVersion}/{objectType}/groups. label and name are required. Other input keys are the documented body and are sent unchanged.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} input.label
 * @param {string} input.name
 * @param {number} [input.displayOrder]
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function createPropertyGroup(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  requiredStringField(req, "label");
  requiredStringField(req, "name");
  return requestJson(`/crm/properties/${configuredApiVersion()}/${encodeURIComponent(objectType)}/groups`, "POST", bodyFrom(req, ["objectType"]));
}
