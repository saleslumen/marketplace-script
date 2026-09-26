/**
 * @description Update Auto Renew Preference. POST /v2/domains/update-auto-renew.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {Array} input.domainIds
 * @param {boolean} input.autoRenew
 * @param {string} [input.contains]
 * @param {Array} [input.tagIds]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function updateAutoRenew(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "domainIds", "array");
  requireField(req, "autoRenew", "boolean");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/domains/update-auto-renew", "POST", { serviceProvider, workspaceKey, body });
}
