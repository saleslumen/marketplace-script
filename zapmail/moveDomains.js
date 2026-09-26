/**
 * @description Move Domains Across workspace. POST /v2/domains/move-workspace. serviceProvider is sent as x-service-provider and in the JSON body.
 * @param {Object} input
 * @param {string} input.x-workspace-key
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @param {Array} input.domainIds
 * @param {string} input.workspaceId
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function moveDomains(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, true);
  const workspaceKey = readHeader(req, "x-workspace-key", true);
  requireField(req, "domainIds", "array");
  requireField(req, "workspaceId", "string");
  const body = omit(req, ["x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/domains/move-workspace", "POST", { serviceProvider, workspaceKey, body });
}
