/**
 * @description Cancel an active import. POST /crm/imports/{apiVersion}/{importId}/cancel.
 * @param {Object} input
 * @param {string} input.importId
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function cancelImport(input) {
  const req = inputObject(input);
  const importId = requiredPath(req, "importId");
  return requestJson(`/crm/imports/${configuredApiVersion()}/${encodeURIComponent(importId)}/cancel`, "POST");
}
