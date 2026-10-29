/**
 * @description Preview mailboxes in a provider workspace.
 * @param {Object} input
 * @param {number} input.workspaceId
 * @param {number} input.providerWorkspaceId
 * @param {number} [input.page]
 * @param {number} [input.limit]
 * @param {string} [input.search]
 * @param {string[]} [input.domain] Sent as one query value containing a JSON array.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function previewProviderWorkspace(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "number");
  const providerWorkspaceId = readRequired(req, "providerWorkspaceId", "providerWorkspaceId", "number");
  const domain = readTypedArray(req, "domain", false, "string");
  const query = trulyinboxQuery({
    page: optionalQueryNumber(req, "page"),
    limit: optionalQueryNumber(req, "limit"),
    search: optionalQueryString(req, "search"),
    domain: domain === undefined ? undefined : JSON.stringify(domain),
  });
  return trulyinboxRequest("GET", `${workspacePath(workspaceId, `/provider-workspaces/${encodeURIComponent(providerWorkspaceId)}/preview`)}${query}`);
}
