/**
 * @description Get one record. GET /v0/{baseId}/{tableIdOrName}/{recordId}.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {string} input.recordId
 * @param {"json"|"string"} [input.cellFormat] - string requires timeZone and userLocale
 * @param {string} [input.timeZone]
 * @param {string} [input.userLocale]
 * @param {boolean} [input.returnFieldsByFieldId]
 * @param {boolean} [input.includeDateDependencyMetadata]
 * @returns {Object} id, createdTime, and fields
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function getRecord(input) {
  const located = requireBaseTable(input);
  const recordId = requireId(located.req.recordId, "recordId");
  return airtableRequest(tablePath(located.baseId, located.tableIdOrName, `/${encodeURIComponent(recordId)}${buildRecordReadQuery(located.req)}`), "GET");
}
