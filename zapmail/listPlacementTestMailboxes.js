/**
 * @description Get Eligible Mailboxes for Placement Tests. POST /v2/placement-tests/eligible-mailboxes.
 * @param {Object} input
 * @param {string} input.page
 * @param {string} input.limit
 * @param {string} [input.status]
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} input.serviceProvider
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listPlacementTestMailboxes(input) {
  const req = inputObject(input);
  requireField(req, "page", "string");
  requireField(req, "limit", "string");
  const serviceProvider = readServiceProvider(req, true);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  return zapmailRequest(withQuery("/v2/placement-tests/eligible-mailboxes", req, ["page", "limit", "status"]), "POST", { serviceProvider, workspaceKey });
}
