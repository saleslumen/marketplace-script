/**
 * @description List one page of records. GET /v0/{baseId}/{tableIdOrName}. When the URL would be 16000 characters or longer, POST /v0/{baseId}/{tableIdOrName}/listRecords with the same parameters in the JSON body.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {number} [input.pageSize] - Integer from 1 to 100
 * @param {number} [input.maxRecords] - Integer greater than or equal to 1
 * @param {string} [input.offset]
 * @param {string} [input.view]
 * @param {Array<{field: string, direction?: "asc"|"desc"}>} [input.sort]
 * @param {string} [input.filterByFormula]
 * @param {"json"|"string"} [input.cellFormat] - string requires timeZone and userLocale
 * @param {string} [input.timeZone]
 * @param {string} [input.userLocale]
 * @param {string[]} [input.fields]
 * @param {boolean} [input.returnFieldsByFieldId]
 * @param {boolean} [input.includeDateDependencyMetadata]
 * @param {Array<"commentCount">} [input.recordMetadata]
 * @returns {Object} records, and offset when another page exists
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function listRecords(input) {
  const located = requireBaseTable(input);
  const listed = buildListRecordsQuery(located.req);
  const path = tablePath(located.baseId, located.tableIdOrName, listed.query);
  if (`${AIRTABLE_API_BASE}${path}`.length >= LIST_URL_LIMIT) {
    return airtableRequest(`${tablePath(located.baseId, located.tableIdOrName)}/listRecords`, "POST", listed.body);
  }
  return airtableRequest(path, "GET");
}
