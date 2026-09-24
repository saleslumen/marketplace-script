/**
 * @description Delete up to 200 records with the sObject Collections API.
 * @param {string[]} ids Record ids
 * @param {boolean} [allOrNone] Fail the whole request when one record fails
 * @returns {Object} Collection result
 * @property {Object[]} results
 * @throws {SALESFORCE_INVALID_INPUT} ids are missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function deleteSObjects(ids, allOrNone) {
  const listed = requireList(ids, "ids", COLLECTION_RECORD_LIMIT).map((id, index) => {
    if (typeof id === "object" || asString(id) === "") throw new Error(`SALESFORCE_INVALID_INPUT: ids[${index}] must be a record id`);
    return asString(id);
  });
  return {
    results: asArray(await dataRequest("/composite/sobjects", "DELETE", undefined, { ids: listed.join(","), allOrNone: optionalFlag(allOrNone) })),
  };
}
