/**
 * @description Connect a partner-managed OAuth mailbox.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {string} input.provider
 * @param {string} input.emailAddress
 * @param {string} input.accessToken
 * @param {string} input.expiresAt
 * @param {string} [input.senderName]
 * @param {string} [input.displayName]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function connectPartnerOauthAccount(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const body = {
    provider: readRequired(req, "provider", "provider", "string"),
    emailAddress: readRequired(req, "emailAddress", "emailAddress", "string"),
    accessToken: readRequired(req, "accessToken", "accessToken", "string"),
    expiresAt: readRequired(req, "expiresAt", "expiresAt", "string"),
  };
  put(body, "senderName", readOptional(req, "senderName", "string"));
  put(body, "displayName", readOptional(req, "displayName", "string"));
  return trulyinboxRequest("POST", workspacePath(workspaceId, "/accounts/oauth"), body);
}
