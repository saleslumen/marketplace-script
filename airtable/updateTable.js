/**
 * @description Update a table name, description, or date dependency settings. PATCH /v0/meta/bases/{baseId}/tables/{tableIdOrName}.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {string} [input.name]
 * @param {string} [input.description] - Non-empty and at most 20000 characters
 * @param {Object} [input.dateDependencySettings]
 * @returns {Object} table schema
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function updateTable(input) {
  const located = requireBaseTable(input);
  return airtableRequest(`/meta/bases/${encodeURIComponent(located.baseId)}/tables/${encodeURIComponent(located.tableIdOrName)}`, "PATCH", buildUpdateTableBody(located.req));
}
