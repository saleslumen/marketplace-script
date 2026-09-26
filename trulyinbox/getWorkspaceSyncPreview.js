/**
 * @description Preview mailboxes in a workspace that are not connected yet.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string} [input.search]
 * @param {string} [input.domain] Comma-separated domains.
 * @returns {Object}
 * @throws {Error} TRULYINBOX_INVALID_INPUT: <reason>
 * @throws {Error} TRULYINBOX_REQUEST_FAILED: <status> <message>
 */
async function getWorkspaceSyncPreview(input) {
  const req = requireObjectInput(input);
  const workspaceId = readRequired(req, "workspaceId", "workspaceId", "string");
  const query = trulyinboxQuery({
    search: optionalQueryString(req, "search"),
    domain: optionalQueryString(req, "domain"),
  });
  return trulyinboxRequest("GET", `/workspaces/${encodeURIComponent(workspaceId)}/preview${query}`);
}
