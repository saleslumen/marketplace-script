/**
 * @description Update a validation rule for a specific property and rule type. PUT /crm/property-validations/{apiVersion}/{objectTypeId}/{propertyName}/rule-type/{ruleType}. ruleArguments is required. Other input keys are the rule body.
 * @param {Object} input
 * @param {string} input.objectTypeId
 * @param {string} input.propertyName
 * @param {string} input.ruleType
 * @param {string[]} input.ruleArguments
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function updatePropertyValidationRule(input) {
  const req = inputObject(input);
  const objectTypeId = requiredPath(req, "objectTypeId");
  const propertyName = requiredPath(req, "propertyName");
  const ruleType = requiredPath(req, "ruleType");
  presentArray(req, "ruleArguments");
  return requestJson(`/crm/property-validations/${configuredApiVersion()}/${encodeURIComponent(objectTypeId)}/${encodeURIComponent(propertyName)}/rule-type/${encodeURIComponent(ruleType)}`, "PUT", bodyFrom(req, ["objectTypeId", "propertyName", "ruleType"]));
}
