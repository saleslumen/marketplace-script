/**
 * @description Execute up to 25 subrequests. POST /services/data/vXX.X/composite
 * @param {Object} input
 * @param {Object[]} input.compositeRequest Subrequests
 * @param {boolean} [input.allOrNone] Roll back the request when a subrequest fails
 * @param {boolean} [input.collateSubrequests] Collate independent subrequests
 * @returns {Object} Salesforce composite response
 * @throws {SALESFORCE_INVALID_INPUT} compositeRequest is missing or longer than 25
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function composite(input) {
  const req = requireInput(input);
  const body = assignBoolean({ compositeRequest: requireObjectList(req.compositeRequest, "compositeRequest", COMPOSITE_REQUEST_LIMIT) }, req, "allOrNone");
  return dataRequest("/composite", "POST", assignBoolean(body, req, "collateSubrequests"));
}
