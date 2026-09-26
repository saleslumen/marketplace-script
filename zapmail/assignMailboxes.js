/**
 * @description Assign New Mailboxes to Domains. POST /v2/mailboxes. The JSON body is a map of domain id to mailbox arrays. Mailbox fields include firstName, lastName, mailboxUsername, and domainName.
 * @param {Object} input
 * @param {string} [input.x-workspace-key]
 * @param {"GOOGLE"|"MICROSOFT"} [input.serviceProvider]
 * @returns {Object|string} Zapmail response body
 * @throws {Error} ZAPMAIL_INVALID_INPUT: <reason> when a required input is missing or invalid
 * @throws {Error} ZAPMAIL_REQUEST_FAILED: <status> <message> when Zapmail returns a non-2xx status
 */
async function assignMailboxes(input) {
  const req = inputObject(input);
  const serviceProvider = readServiceProvider(req, false);
  const workspaceKey = readHeader(req, "x-workspace-key", false);
  const body = omit(req, ["serviceProvider", "x-workspace-key", "x-workspace-id"]);
  return zapmailRequest("/v2/mailboxes", "POST", { serviceProvider, workspaceKey, body });
}
