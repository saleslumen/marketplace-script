/**
 * @description List REST API versions available on the configured instance.
 * @returns {Object} Version list
 * @property {Object[]} versions
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function listVersions() {
  const result = await requestJson("/services/data", "GET");
  return { versions: asArray(result) };
}
