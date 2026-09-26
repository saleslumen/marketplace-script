/**
 * @description List records created or updated in a time span. GET /services/data/vXX.X/sobjects/sObject/updated/?start=startDateAndTime&end=endDateAndTime
 * @param {Object} input
 * @param {string} input.sObject Object API name
 * @param {string} input.start UTC start date-time
 * @param {string} input.end UTC end date-time
 * @returns {Object} Salesforce updated-record list
 * @throws {SALESFORCE_INVALID_INPUT} sObject, start, or end is missing
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function getUpdated(input) {
  const req = requireInput(input);
  return dataRequest(sObjectPath(req.sObject, "/updated/"), "GET", undefined, { start: requireText(req.start, "start"), end: requireText(req.end, "end") });
}
