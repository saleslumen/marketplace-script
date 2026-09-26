/**
 * @description Update association label. PUT /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/labels. associationTypeId and label are required. Other input keys are the documented body and are sent unchanged.
 * @param {Object} input
 * @param {string} input.fromObjectType
 * @param {string} input.toObjectType
 * @param {number|string} input.associationTypeId
 * @param {string} input.label
 * @param {string} [input.inverseLabel]
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function updateAssociationLabel(input) {
  const req = inputObject(input);
  const fromObjectType = requiredPath(req, "fromObjectType");
  const toObjectType = requiredPath(req, "toObjectType");
  requiredPresent(req, "associationTypeId");
  requiredStringField(req, "label");
  return requestJson(`/crm/associations/${configuredApiVersion()}/${encodeURIComponent(fromObjectType)}/${encodeURIComponent(toObjectType)}/labels`, "PUT", bodyFrom(req, ["fromObjectType", "toObjectType"]));
}
