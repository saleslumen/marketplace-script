/**
 * @description Update up to 200 records with the sObject Collections API.
 * @param {string} sobject API name applied when a record omits attributes.type
 * @param {Object[]} records Field maps that include Id
 * @param {boolean} [allOrNone] Fail the whole request when one record fails
 * @returns {Object} Collection result
 * @property {Object[]} results
 * @throws {SALESFORCE_INVALID_INPUT} sobject or records are missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function updateSObjects(sobject, records, allOrNone) {
  const type = requireSObject(sobject);
  return {
    results: asArray(await dataRequest("/composite/sobjects", "PATCH", { allOrNone: optionalFlag(allOrNone) === true, records: withSObjectType(type, records) })),
  };
}
