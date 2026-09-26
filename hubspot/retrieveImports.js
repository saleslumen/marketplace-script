/**
 * @description Retrieve imports. GET /crm/imports/{apiVersion}.
 * @param {Object} input
 * @param {string} [input.after]
 * @param {number} [input.limit]
 * @returns {Object} HubSpot response body. An empty 2xx body is {}.
 * @throws {Error} HUBSPOT_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} HUBSPOT_NOT_CONFIGURED when apiVersion is invalid
 * @throws {Error} AUTH_NOT_CONNECTED when HubSpot is not connected
 * @throws {Error} HUBSPOT_REQUEST_FAILED when HubSpot returns a non-2xx status
 */
async function retrieveImports(input) {
  const req = input === undefined ? {} : inputObject(input);
  return requestJson(`/crm/imports/${configuredApiVersion()}`, "GET", undefined, queryFrom(req, ["after", "limit"]));
}
