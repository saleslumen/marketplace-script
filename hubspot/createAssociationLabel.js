/**
 * @description Create association label. POST /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/labels. label and name are required. Other input keys are the documented body and are sent unchanged.
 * @param {Object} input
 * @param {string} input.fromObjectType
 * @param {string} input.toObjectType
 * @param {string} input.label
 * @param {string} input.name
 * @param {string} [input.inverseLabel]
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function createAssociationLabel(input) {
  const req = inputObject(input);
  const fromObjectType = requiredPath(req, "fromObjectType");
  const toObjectType = requiredPath(req, "toObjectType");
  requiredStringField(req, "label");
  requiredStringField(req, "name");
  return requestJson(`/crm/associations/${configuredApiVersion()}/${encodeURIComponent(fromObjectType)}/${encodeURIComponent(toObjectType)}/labels`, "POST", bodyFrom(req, ["fromObjectType", "toObjectType"]));
}
