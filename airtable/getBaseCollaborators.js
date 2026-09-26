/**
 * @description Get base metadata and, when requested, collaborators, invites, interfaces, or packages. GET /v0/meta/bases/{baseId}.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {Array<"collaborators"|"inviteLinks"|"interfaces"|"packages">} [input.include]
 * @returns {Object} id, createdTime, permissionLevel, workspaceId, and name, plus included keys
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function getBaseCollaborators(input) {
  const req = requireObjectInput(input);
  const baseId = requireId(req.baseId, "baseId");
  return airtableRequest(`/meta/bases/${encodeURIComponent(baseId)}${includeQuery(req, ["collaborators", "inviteLinks", "interfaces", "packages"])}`, "GET");
}
