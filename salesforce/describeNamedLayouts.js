/**
 * @description Describe one named layout. GET /services/data/vXX.X/sobjects/sObject/describe/namedLayouts/layoutName
 * @param {Object} input
 * @param {string} input.sObject Object API name
 * @param {string} input.layoutName Named layout name
 * @returns {Object} Salesforce named layout
 * @throws {SALESFORCE_INVALID_INPUT} sObject or layoutName is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function describeNamedLayouts(input) {
  const req = requireInput(input);
  return dataRequest(sObjectPath(req.sObject, `/describe/namedLayouts/${encodeURIComponent(requireId(req.layoutName, "layoutName"))}`), "GET");
}
