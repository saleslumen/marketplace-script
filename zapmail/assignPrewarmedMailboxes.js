/**
 * @description Assign prewarmed mailboxes. POST /v2/prewarmed-domains/assign.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {Array} input.domainIds
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function assignPrewarmedMailboxes(input) {
  const req = inputObject(input);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  requireField(req, "domainIds", "array");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/prewarmed-domains/assign", "POST", { workspaceKey, body });
}
