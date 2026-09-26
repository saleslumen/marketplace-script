/**
 * @description Retrieve export details. GET /crm/exports/{apiVersion}/export/{exportId}.
 * @param {Object} input
 * @param {string} input.exportId
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function retrieveExportDetails(input) {
  const req = inputObject(input);
  const exportId = requiredPath(req, "exportId");
  return requestJson(`/crm/exports/${configuredApiVersion()}/export/${encodeURIComponent(exportId)}`, "GET");
}
