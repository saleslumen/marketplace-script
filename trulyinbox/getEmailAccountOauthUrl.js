/**
 * @description Generate an OAuth connection URL.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {string} input.provider
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getEmailAccountOauthUrl(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const body = { provider: readRequired(req, "provider", "provider", "string") };
  return trulyinboxRequest("POST", workspacePath(workspaceId, "/accounts/oauth-url"), body);
}
