/**
 * @description Get metadata for one view. GET /v0/meta/bases/{baseId}/views/{viewId}.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.viewId
 * @param {Array<"visibleFieldIds">} [input.include]
 * @returns {Object} id, type, and name, plus visibleFieldIds when requested
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function getViewMetadata(input) {
  const req = requireObjectInput(input);
  const baseId = requireId(req.baseId, "baseId");
  const viewId = requireId(req.viewId, "viewId");
  return airtableRequest(`/meta/bases/${encodeURIComponent(baseId)}/views/${encodeURIComponent(viewId)}${includeQuery(req, ["visibleFieldIds"])}`, "GET");
}
