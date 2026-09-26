/**
 * @description Download Attachment. POST /v2/onebox/download-attachment.
 * @param {Object} input
 * @param {string} [input.x-workspace-id]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @param {string} input.attachmentId
 * @param {string} input.provider
 * @param {string} input.messageId
 * @param {string} input.account
 * @param {string} input.filename
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function downloadAttachment(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceId = readHeader(req, "x-workspace-id", false);
  requireField(req, "attachmentId", "string");
  requireField(req, "provider", "string");
  requireField(req, "messageId", "string");
  requireField(req, "account", "string");
  requireField(req, "filename", "string");
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/onebox/download-attachment", "POST", { serviceProvider, workspaceId, body });
}
