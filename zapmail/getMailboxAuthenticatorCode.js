/**
 * @description Get Authenticator code. GET /v2/mailboxes/authenticator-code.
 * @param {Object} input
 * @param {string} [input.mailboxId]
 * @param {string} [input.domainId]
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function getMailboxAuthenticatorCode(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  return zapmailRequest(withQuery("/v2/mailboxes/authenticator-code", req, ["mailboxId", "domainId"]), "GET", { serviceProvider, workspaceKey });
}
