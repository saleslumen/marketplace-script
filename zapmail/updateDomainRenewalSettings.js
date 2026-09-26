/**
 * @description Update Domain Renewal Settings. POST /v2/workspaces/update-domain-renewal-settings.
 * @param {Object} input
 * @param {string} input.x-workspace-key
 * @param {boolean} input.domainRenewalSettings
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function updateDomainRenewalSettings(input) {
  const req = inputObject(input);
  const workspaceKey = readHeader(req, "x-workspace-key", true);
  requireField(req, "domainRenewalSettings", "boolean");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/workspaces/update-domain-renewal-settings", "POST", { workspaceKey, body });
}
