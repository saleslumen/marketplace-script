/**
 * @description Remove catch all emails. DELETE /v2/domains/catch-all.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {Array} input.domainIds
 * @param {string} input.contains
 * @param {Array} input.tagIds
 * @param {Array} input.status
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function removeCatchAllEmails(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "domainIds", "array");
  requireField(req, "contains", "string");
  requireField(req, "tagIds", "array");
  requireField(req, "status", "array");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/domains/catch-all", "DELETE", { serviceProvider, workspaceKey, body });
}
