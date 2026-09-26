/**
 * @description Retrieve associations. POST /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/batch/read. inputs is required.
 * @param {Object} input
 * @param {string} input.fromObjectType
 * @param {string} input.toObjectType
 * @param {Object[]} input.inputs
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function retrieveAssociations(input) {
  const req = inputObject(input);
  const fromObjectType = requiredPath(req, "fromObjectType");
  const toObjectType = requiredPath(req, "toObjectType");
  requiredArray(req, "inputs");
  return requestJson(`/crm/associations/${configuredApiVersion()}/${encodeURIComponent(fromObjectType)}/${encodeURIComponent(toObjectType)}/batch/read`, "POST", bodyFrom(req, ["fromObjectType", "toObjectType"]));
}
