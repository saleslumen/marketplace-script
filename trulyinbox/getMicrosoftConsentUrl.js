/**
 * @description Get a Microsoft admin consent URL for a provider workspace.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {string} [input.domain]
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getMicrosoftConsentUrl(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const query = trulyinboxQuery({ domain: optionalQueryString(req, "domain") });
  return trulyinboxRequest("GET", `${workspacePath(workspaceId, "/provider-workspaces/microsoft/consent-url")}${query}`);
}
