/**
 * @description Sync raw CSV into a Sync API table. POST /v0/{baseId}/{tableIdOrName}/sync/{apiEndpointSyncId} with Content-Type text/csv. The CSV may contain at most 10000 rows, 500 columns, and 2 MB.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {string} input.apiEndpointSyncId
 * @param {string} input.csv - Raw CSV request body
 * @returns {Object} Airtable response body
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function syncCsvData(input) {
  const located = requireBaseTable(input);
  const apiEndpointSyncId = requireId(located.req.apiEndpointSyncId, "apiEndpointSyncId");
  const path = `${tablePath(located.baseId, located.tableIdOrName)}/sync/${encodeURIComponent(apiEndpointSyncId)}`;
  return airtableRequest(path, "POST", requireCsv(located.req.csv), { contentType: "text/csv", raw: true });
}
