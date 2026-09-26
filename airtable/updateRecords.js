/**
 * @description Update or upsert up to 10 records. PATCH /v0/{baseId}/{tableIdOrName}. Omitted fields are left unchanged.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {Array<{id?: string, fields: Object}>} input.records - 1 to 10 records. id is required unless performUpsert is set. fields is required.
 * @param {{fieldsToMergeOn: string[]}} [input.performUpsert] - 1 to 3 field names or ids. Records without id match on these fields.
 * @param {boolean} [input.typecast]
 * @param {boolean} [input.returnFieldsByFieldId]
 * @returns {Object} records. Upsert responses also include createdRecords and updatedRecords.
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function updateRecords(input) {
  const located = requireBaseTable(input);
  return airtableRequest(tablePath(located.baseId, located.tableIdOrName), "PATCH", buildBatchWriteBody(located.req));
}
