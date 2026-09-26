/**
 * @description Create a base and its tables. POST /v0/meta/bases.
 * @param {Object} input
 * @param {string} input.name
 * @param {string} input.workspaceId
 * @param {Array<{name: string, description?: string, fields: Array<{name: string, type: string, description?: string, options?: Object}>}>} input.tables - At least one table, each with at least one field
 * @returns {Object} id and tables
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function createBase(input) {
  const req = requireObjectInput(input);
  const body = { name: requireId(req.name, "name"), workspaceId: requireId(req.workspaceId, "workspaceId"), tables: requireTables(req.tables) };
  return airtableRequest("/meta/bases", "POST", body);
}
