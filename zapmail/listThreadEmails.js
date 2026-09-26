/**
 * @description get emails from a thread. GET /v2/onebox/thread-emails.
 * @param {Object} input
 * @param {string} input.threadId
 * @param {string} [input.x-workspace-id]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function listThreadEmails(input) {
  const req = inputObject(input);
  requireField(req, "threadId", "string");
  const serviceProvider = readServiceProvider(req, false);
  const workspaceId = readHeader(req, "x-workspace-id", false);
  return zapmailRequest(withQuery("/v2/onebox/thread-emails", req, ["threadId"]), "GET", { serviceProvider, workspaceId });
}
