/**
 * @description Delete association label. DELETE /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/labels/{associationTypeId}.
 * @param {Object} input
 * @param {string} input.fromObjectType
 * @param {string} input.toObjectType
 * @param {number|string} input.associationTypeId
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function deleteAssociationLabel(input) {
  const req = inputObject(input);
  const fromObjectType = requiredPath(req, "fromObjectType");
  const toObjectType = requiredPath(req, "toObjectType");
  const associationTypeId = requiredPath(req, "associationTypeId");
  return requestJson(`/crm/associations/${configuredApiVersion()}/${encodeURIComponent(fromObjectType)}/${encodeURIComponent(toObjectType)}/labels/${encodeURIComponent(associationTypeId)}`, "DELETE");
}
