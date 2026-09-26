/**
 * @description Create a table. POST /v0/meta/bases/{baseId}/tables.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.name
 * @param {string} [input.description] - Non-empty and at most 20000 characters
 * @param {Array<{name: string, type: string, description?: string, options?: Object}>} input.fields - At least one field
 * @returns {Object} table schema, including id, primaryFieldId, fields, and views
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function createTable(input) {
  const req = requireObjectInput(input);
  const baseId = requireId(req.baseId, "baseId");
  const body = { name: requireId(req.name, "name"), fields: requireFieldConfigs(req.fields, "fields") };
  if (req.description !== undefined) body.description = optionalDescription(req.description);
  return airtableRequest(`/meta/bases/${encodeURIComponent(baseId)}/tables`, "POST", body);
}
