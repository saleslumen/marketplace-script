/**
 * @description Export mailboxes. POST /v2/exports/mailboxes.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {Array} input.apps
 * @param {Array} input.ids
 * @param {Array} input.excludeIds
 * @param {Array} input.tagIds
 * @param {string} input.status
 * @param {string} input.contains
 * @param {string} [input.thirdPartyAccountId]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function exportMailboxes(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "apps", "array");
  requireField(req, "ids", "array");
  requireField(req, "excludeIds", "array");
  requireField(req, "tagIds", "array");
  requireField(req, "status", "string");
  requireField(req, "contains", "string");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/exports/mailboxes", "POST", { serviceProvider, workspaceKey, body });
}
