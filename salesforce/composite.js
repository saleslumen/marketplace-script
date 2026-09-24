/**
 * @description Run a Salesforce composite request of up to 25 subrequests.
 * @param {Object[]} compositeRequest Subrequests
 * @param {boolean} [allOrNone] Fail the whole request when one subrequest fails
 * @param {boolean} [collateSubrequests] Collate independent subrequests
 * @returns {Object} Composite result
 * @property {Object[]} compositeResponse
 * @property {Object} raw Salesforce composite body
 * @throws {SALESFORCE_INVALID_INPUT} compositeRequest is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function composite(compositeRequest, allOrNone, collateSubrequests) {
  const requests = requireObjectList(compositeRequest, "compositeRequest", COMPOSITE_REQUEST_LIMIT);
  const result = await dataRequest("/composite", "POST", {
    allOrNone: optionalFlag(allOrNone) === true,
    collateSubrequests: optionalFlag(collateSubrequests) === true,
    compositeRequest: requests,
  });
  return { compositeResponse: asArray(result.compositeResponse), raw: result };
}
