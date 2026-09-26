/**
 * @description Delete up to 10 records. DELETE /v0/{baseId}/{tableIdOrName}?records[]={recordId}.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {string[]} input.records - 1 to 10 record ids
 * @returns {Object} records, each with id and deleted
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function deleteRecords(input) {
  const located = requireBaseTable(input);
  const parts = [];
  pushQueryList(parts, "records", requireRecordIdList(located.req.records));
  return airtableRequest(tablePath(located.baseId, located.tableIdOrName, `?${parts.join("&")}`), "DELETE");
}
