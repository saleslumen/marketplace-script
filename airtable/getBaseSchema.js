/**
 * @description Return the schema of tables in a base. GET /v0/meta/bases/{baseId}/tables.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {Array<"visibleFieldIds">} [input.include]
 * @returns {Object} tables
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function getBaseSchema(input) {
  const req = requireObjectInput(input);
  const baseId = requireId(req.baseId, "baseId");
  return airtableRequest(`/meta/bases/${encodeURIComponent(baseId)}/tables${includeQuery(req, ["visibleFieldIds"])}`, "GET");
}
