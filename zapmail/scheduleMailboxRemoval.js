/**
 * @description Remove mailboxes on next renewal. PUT /v2/mailboxes/scheduled-removal.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {boolean} input.remove
 * @param {string} [input.status]
 * @param {string} [input.contains]
 * @param {Array} input.domainIds
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function scheduleMailboxRemoval(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "domainIds", "array");
  requireField(req, "remove", "boolean");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/mailboxes/scheduled-removal", "PUT", { serviceProvider, workspaceKey, body });
}
