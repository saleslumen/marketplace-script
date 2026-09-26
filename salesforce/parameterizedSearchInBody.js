/**
 * @description Search with a JSON body. POST /services/data/vXX.X/parameterizedSearch/
 * @param {Object} input Request body. q is required. Other properties are the documented body parameters, including sobjects and dataCategories.
 * @param {string} input.q Search string
 * @returns {Object} Salesforce search response
 * @throws {SALESFORCE_INVALID_INPUT} q is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function parameterizedSearchInBody(input) {
  const req = requireInput(input);
  requireText(req.q, "q");
  return dataRequest("/parameterizedSearch/", "POST", req);
}
