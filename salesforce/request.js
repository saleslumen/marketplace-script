/**
 * @description Call any Salesforce REST path on the configured instance. input.path is required. Paths that do not start with /services are prefixed with /services/data/{apiVersion}. Optional input.method defaults to GET. Optional input.body is JSON unless it is a string. Optional input.query is a string map and cannot be combined with a query already on path. Optional input.headers are extra request headers and cannot replace Authorization.
 * @param {Object} input Request
 * @returns {Object|string} Parsed JSON body, {} for an empty 2xx, or the response text for a non-JSON body
 * @throws {SALESFORCE_INVALID_INPUT} path is missing, leaves the instance, or repeats a query string
 * @throws {SALESFORCE_NOT_CONFIGURED} instanceUrl is missing or invalid
 * @throws {AUTH_NOT_CONNECTED} Salesforce is not connected
 * @throws {SALESFORCE_REQUEST_FAILED} Salesforce rejected or could not complete the request
 */
async function request(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("SALESFORCE_INVALID_INPUT: input must be an object");
  const req = input;
  let path = asString(req.path);
  if (!path) throw new Error("SALESFORCE_INVALID_INPUT: path is required");
  if (!/^https:\/\//i.test(path) && !path.startsWith("/")) path = `/${path}`;
  const method = asString(req.method).toUpperCase() || "GET";
  const query = req.query && typeof req.query === "object" && !Array.isArray(req.query) ? req.query : undefined;
  const headers = req.headers && typeof req.headers === "object" && !Array.isArray(req.headers) ? req.headers : undefined;
  const body = Object.prototype.hasOwnProperty.call(req, "body") ? req.body : undefined;
  if (path.startsWith("/services/") || /^https:\/\//i.test(path)) return requestJson(path, method, body, query, headers);
  return dataRequest(path, method, body, query, headers);
}
