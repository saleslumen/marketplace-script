/**
 * @description Create a property. POST /crm/properties/{apiVersion}/{objectType}. fieldType, groupName, label, name, and type are required. Other input keys are the documented property body and are sent unchanged.
 * @param {Object} input
 * @param {string} input.objectType
 * @param {string} input.fieldType
 * @param {string} input.groupName
 * @param {string} input.label
 * @param {string} input.name
 * @param {string} input.type
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function createProperty(input) {
  const req = inputObject(input);
  const objectType = requiredPath(req, "objectType");
  requiredStringField(req, "fieldType");
  requiredStringField(req, "groupName");
  requiredStringField(req, "label");
  requiredStringField(req, "name");
  requiredStringField(req, "type");
  return requestJson(`/crm/properties/${configuredApiVersion()}/${encodeURIComponent(objectType)}`, "POST", bodyFrom(req, ["objectType"]));
}
