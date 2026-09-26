/**
 * @description Delete one record. DELETE /v0/{baseId}/{tableIdOrName}/{recordId}.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {string} input.recordId
 * @returns {Object} id and deleted
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function deleteRecord(input) {
  const located = requireBaseTable(input);
  const recordId = requireId(located.req.recordId, "recordId");
  return airtableRequest(tablePath(located.baseId, located.tableIdOrName, `/${encodeURIComponent(recordId)}`), "DELETE");
}
