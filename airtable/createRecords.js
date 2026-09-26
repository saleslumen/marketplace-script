/**
 * @description Create up to 10 records. POST /v0/{baseId}/{tableIdOrName}. Send records, or fields for one record.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {Array<{fields: Object}>} [input.records] - 1 to 10 records. Each fields object is required. id is not allowed.
 * @param {Object} [input.fields] - Single-record form. Cannot be combined with records.
 * @param {boolean} [input.typecast]
 * @param {boolean} [input.returnFieldsByFieldId]
 * @returns {Object} records when creating multiple, or id, createdTime, and fields when creating one
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function createRecords(input) {
  const located = requireBaseTable(input);
  return airtableRequest(tablePath(located.baseId, located.tableIdOrName), "POST", buildCreateRecordsBody(located.req));
}
