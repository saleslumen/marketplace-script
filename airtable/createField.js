/**
 * @description Create a field. POST /v0/meta/bases/{baseId}/tables/{tableId}/fields.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableId
 * @param {string} input.name
 * @param {string} input.type
 * @param {string} [input.description] - Non-empty and at most 20000 characters
 * @param {Object} [input.options]
 * @returns {Object} field schema
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function createField(input) {
  const req = requireObjectInput(input);
  const baseId = requireId(req.baseId, "baseId");
  const tableId = requireId(req.tableId, "tableId");
  return airtableRequest(`/meta/bases/${encodeURIComponent(baseId)}/tables/${encodeURIComponent(tableId)}/fields`, "POST", buildCreateFieldBody(req));
}
