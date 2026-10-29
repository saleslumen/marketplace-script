/**
 * @description Get a Microsoft single-mailbox consent link.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {string} input.email
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getMicrosoftMailboxConsentUrl(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const email = readRequired(req, "email", "email", "string");
  const query = trulyinboxQuery({ email });
  return trulyinboxRequest("GET", `${workspacePath(workspaceId, "/accounts/microsoft/consent-url")}${query}`);
}
