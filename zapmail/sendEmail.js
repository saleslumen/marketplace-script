/**
 * @description Send Email. POST /v2/onebox/send-email.
 * @param {Object} input
 * @param {string} [input.x-workspace-id]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {string} input.account
 * @param {string} input.to
 * @param {string} input.subject
 * @param {string} input.body
 * @param {Array} [input.cc]
 * @param {Array} [input.bcc]
 * @param {string} [input.messageId]
 * @param {string} [input.threadId]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function sendEmail(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceId = readHeader(req, "x-workspace-id", false);
  requireField(req, "account", "string");
  requireField(req, "to", "string");
  requireField(req, "subject", "string");
  requireField(req, "body", "string");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/onebox/send-email", "POST", { serviceProvider, workspaceId, body });
}
