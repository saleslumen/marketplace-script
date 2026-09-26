/**
 * @description Search with URI parameters. GET /services/data/vXX.X/parameterizedSearch/?q=searchString. Repeat sobject by passing an array. Object parameters use the documented names, such as Account.fields.
 * @param {Object} input
 * @param {string} input.q Search string
 * @returns {Object} Salesforce search response
 * @throws {SALESFORCE_INVALID_INPUT} q is missing or a parameter value is an object
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid, or apiVersion is invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function parameterizedSearch(input) {
  const req = requireInput(input);
  requireText(req.q, "q");
  const pairs = [];
  const append = (key, value) => {
    if (Array.isArray(value)) {
      value.forEach((item) => append(key, item));
      return;
    }
    if (value === undefined || value === null || value === "") return;
    if (typeof value === "object") throw new Error(`SALESFORCE_INVALID_INPUT: ${key} must be a string, number, or boolean`);
    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  };
  Object.keys(req).forEach((key) => append(key, req[key]));
  return dataRequest(`/parameterizedSearch/?${pairs.join("&")}`, "GET");
}
