/**
 * @description Create up to 200 records. POST /services/data/vXX.X/composite/sobjects. Each record supplies attributes.type.
 * @param {Object} input
 * @param {boolean} [input.allOrNone] Roll back the request when one record fails
 * @param {Object[]} input.records Records
 * @returns {Object[]} Salesforce SaveResult list
 * @throws {SALESFORCE_INVALID_INPUT} records is missing or longer than 200
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function createSObjects(input) {
  return dataRequest("/composite/sobjects", "POST", collectionBody(requireInput(input)));
}
