/**
 * @description Retrieve a validation rule for a specific property and rule type. GET /crm/property-validations/{apiVersion}/{objectTypeId}/{propertyName}/rule-type/{ruleType}.
 * @param {Object} input
 * @param {string} input.objectTypeId
 * @param {string} input.propertyName
 * @param {string} input.ruleType
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function retrievePropertyValidationRule(input) {
  const req = inputObject(input);
  const objectTypeId = requiredPath(req, "objectTypeId");
  const propertyName = requiredPath(req, "propertyName");
  const ruleType = requiredPath(req, "ruleType");
  return requestJson(`/crm/property-validations/${configuredApiVersion()}/${encodeURIComponent(objectTypeId)}/${encodeURIComponent(propertyName)}/rule-type/${encodeURIComponent(ruleType)}`, "GET");
}
