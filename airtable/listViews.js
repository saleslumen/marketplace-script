/**
 * @description List views in a base. GET /v0/meta/bases/{baseId}/views.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {Array<"visibleFieldIds">} [input.include]
 * @returns {Object} views
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function listViews(input) {
  const req = requireObjectInput(input);
  const baseId = requireId(req.baseId, "baseId");
  return airtableRequest(`/meta/bases/${encodeURIComponent(baseId)}/views${includeQuery(req, ["visibleFieldIds"])}`, "GET");
}
