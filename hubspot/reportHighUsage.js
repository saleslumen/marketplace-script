/**
 * @description Report high usage. POST /crm/associations/{apiVersion}/usage/high-usage-report/{userId}.
 * @param {Object} input
 * @param {string} input.userId
 * @returns {Object} HubSpot response body
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function reportHighUsage(input) {
  const req = inputObject(input);
  const userId = requiredPath(req, "userId");
  return requestJson(`/crm/associations/${configuredApiVersion()}/usage/high-usage-report/${encodeURIComponent(userId)}`, "POST");
}
