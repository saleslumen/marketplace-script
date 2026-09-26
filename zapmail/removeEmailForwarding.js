/**
 * @description Remove email forwarding. DELETE /v2/domains/email-forwarding.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {Array} input.domainIds
 * @param {string} input.contains
 * @param {Array} input.status
 * @param {Array} input.tagIds
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function removeEmailForwarding(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "domainIds", "array");
  requireField(req, "contains", "string");
  requireField(req, "status", "array");
  requireField(req, "tagIds", "array");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/domains/email-forwarding", "DELETE", { serviceProvider, workspaceKey, body });
}
