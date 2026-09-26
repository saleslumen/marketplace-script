/**
 * @description Retrieve association limits. GET /crm/associations/{apiVersion}/definitions/configurations/{fromObjectType}/{toObjectType}.
 * @param {Object} input
 * @param {string} input.fromObjectType
 * @param {string} input.toObjectType
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function retrieveAssociationLimits(input) {
  const req = inputObject(input);
  const fromObjectType = requiredPath(req, "fromObjectType");
  const toObjectType = requiredPath(req, "toObjectType");
  return requestJson(`/crm/associations/${configuredApiVersion()}/definitions/configurations/${encodeURIComponent(fromObjectType)}/${encodeURIComponent(toObjectType)}`, "GET");
}
