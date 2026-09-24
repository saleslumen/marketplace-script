/**
 * @description Upsert up to 200 records by external id with the sObject Collections API.
 * @param {string} sobject API name such as Account
 * @param {string} externalIdField External id field API name
 * @param {Object[]} records Field maps
 * @param {boolean} [allOrNone] Fail the whole request when one record fails
 * @returns {Object} Collection result
 * @property {Object[]} results
 * @throws {SALESFORCE_INVALID_INPUT} sobject, externalIdField, or records are missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function upsertSObjects(sobject, externalIdField, records, allOrNone) {
  const type = requireSObject(sobject);
  const field = asString(externalIdField);
  if (!SOBJECT_NAME.test(field)) throw new Error("SALESFORCE_INVALID_INPUT: externalIdField is required");
  return {
    results: asArray(
      await dataRequest(`/composite/sobjects/${encodeURIComponent(type)}/${encodeURIComponent(field)}`, "PATCH", {
        allOrNone: optionalFlag(allOrNone) === true,
        records: withSObjectType(type, records),
      })
    ),
  };
}
