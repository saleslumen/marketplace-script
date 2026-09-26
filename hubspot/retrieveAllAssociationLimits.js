/**
 * @description Retrieve all association limits. GET /crm/associations/{apiVersion}/definitions/configurations/all.
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function retrieveAllAssociationLimits() {
  return requestJson(`/crm/associations/${configuredApiVersion()}/definitions/configurations/all`, "GET");
}
