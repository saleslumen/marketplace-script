/**
 * @description Update the schema of a specified custom object. PATCH /crm-object-schemas/{apiVersion}/schemas/{objectType}. clearDescription is required. Other input keys are the schema body.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {boolean} input.clearDescription
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function updateSchema(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  requiredBoolean(req, "clearDescription");
  return requestJson(`/crm-object-schemas/${configuredApiVersion()}/schemas/${encodeURIComponent(objectType)}`, "PATCH", bodyFrom(req, ["objectType"]));
}
