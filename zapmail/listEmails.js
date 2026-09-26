/**
 * @description Fetch emails. GET /v2/onebox/top-emails.
 * @param {Object} input
 * @param {string} [input.account]
 * @param {string} [input.folder]
 * @param {number} [input.cursor]
 * @param {number} [input.limit]
 * @param {boolean} [input.includeWarmUp]
 * @param {string} [input.x-workspace-id]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listEmails(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceId = readHeader(req, "x-workspace-id", false);
  return zapmailRequest(withQuery("/v2/onebox/top-emails", req, ["account", "folder", "cursor", "limit", "includeWarmUp"]), "GET", { serviceProvider, workspaceId });
}
