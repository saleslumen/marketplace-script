/**
 * @description Get workspace metadata and, when requested, collaborators or invite links. GET /v0/meta/workspaces/{workspaceId}.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {Array<"collaborators"|"inviteLinks">} [input.include]
 * @returns {Object} id, createdTime, name, workspaceRestrictions, and baseIds
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function getWorkspaceCollaborators(input) {
  const req = requireObjectInput(input);
  const workspaceId = requireId(req.workspaceId, "workspaceId");
  return airtableRequest(`/meta/workspaces/${encodeURIComponent(workspaceId)}${includeQuery(req, ["collaborators", "inviteLinks"])}`, "GET");
}
