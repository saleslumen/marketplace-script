/**
 * @description Update one record. PATCH /v0/{baseId}/{tableIdOrName}/{recordId}. Omitted fields are left unchanged.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {string} input.recordId
 * @param {Object} input.fields
 * @param {boolean} [input.typecast]
 * @param {boolean} [input.returnFieldsByFieldId]
 * @returns {Object} id, createdTime, and fields
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function updateRecord(input) {
  const located = requireBaseTable(input);
  const recordId = requireId(located.req.recordId, "recordId");
  return airtableRequest(tablePath(located.baseId, located.tableIdOrName, `/${encodeURIComponent(recordId)}`), "PATCH", buildSingleWriteBody(located.req));
}
