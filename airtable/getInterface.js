/**
 * @description Get one interface. GET /v0/meta/bases/{baseId}/interfaces/{pageBundleId}.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.pageBundleId
 * @param {Array<"collaborators"|"inviteLinks">} [input.include]
 * @returns {Object} interface id, baseId, createdTime, name, and permissionLevel
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function getInterface(input) {
  const req = requireObjectInput(input);
  const baseId = requireId(req.baseId, "baseId");
  const pageBundleId = requireId(req.pageBundleId, "pageBundleId");
  return airtableRequest(`/meta/bases/${encodeURIComponent(baseId)}/interfaces/${encodeURIComponent(pageBundleId)}${includeQuery(req, ["collaborators", "inviteLinks"])}`, "GET");
}
