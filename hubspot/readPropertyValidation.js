/**
 * @description Read validation rules for a property. GET /crm/property-validations/{apiVersion}/{objectTypeId}/{propertyName}.
 * @param {Object} input
 * @param {string} input.objectTypeId
 * @param {string} input.propertyName
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function readPropertyValidation(input) {
  const req = inputObject(input);
  const objectTypeId = requiredPath(req, "objectTypeId");
  const propertyName = requiredPath(req, "propertyName");
  return requestJson(`/crm/property-validations/${configuredApiVersion()}/${encodeURIComponent(objectTypeId)}/${encodeURIComponent(propertyName)}`, "GET");
}
