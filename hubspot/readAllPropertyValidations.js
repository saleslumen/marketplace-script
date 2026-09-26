/**
 * @description Read all property validation rules for an object. GET /crm/property-validations/{apiVersion}/{objectTypeId}.
 * @param {Object} input
 * @param {string} input.objectTypeId
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function readAllPropertyValidations(input) {
  const req = inputObject(input);
  const objectTypeId = requiredPath(req, "objectTypeId");
  return requestJson(`/crm/property-validations/${configuredApiVersion()}/${encodeURIComponent(objectTypeId)}`, "GET");
}
