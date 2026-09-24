/**
 * @description Run a SOQL query that can include deleted, merged, and archived records.
 * @param {string} soql SOQL statement
 * @returns {Object} Query result
 * @property {number} totalSize
 * @property {boolean} done
 * @property {string} nextRecordsUrl
 * @property {Object[]} records
 * @throws {SALESFORCE_INVALID_INPUT} soql is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function queryAll(soql) {
  const statement = asString(soql);
  if (!statement) throw new Error("SALESFORCE_INVALID_INPUT: soql is required");
  return queryResult(await dataRequest("/queryAll", "GET", undefined, { q: statement }));
}
