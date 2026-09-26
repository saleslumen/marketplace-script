/**
 * @description Call any HubSpot JSON REST path on https://api.hubapi.com. input.path is required. Paths that do not start with / get a leading /. Absolute https URLs must stay on https://api.hubapi.com. Paths that are already HubSpot API paths are used as-is. Optional input.method defaults to GET. Optional input.body is JSON unless it is a string. Optional input.query is a string map and cannot be combined with a query already on path. Optional input.headers are extra request headers and cannot replace Authorization.
 * @param {Object} input Request
 * @returns {Object|string} Parsed JSON body. An empty 2xx body is {}. A non-JSON text body is the response text.
 * @throws {HUBSPOT_INVALID_INPUT} path is missing, leaves api.hubapi.com, or repeats a query string
 * @throws {AUTH_NOT_CONNECTED} HubSpot is not connected
 * @throws {HUBSPOT_REQUEST_FAILED} HubSpot rejected or could not complete the request
 */
async function request(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("HUBSPOT_INVALID_INPUT: input must be an object");
  const req = input;
  let path = asString(req.path);
  if (!path) throw new Error("HUBSPOT_INVALID_INPUT: path is required");
  if (!/^https:\/\//i.test(path) && !path.startsWith("/")) path = `/${path}`;
  const method = asString(req.method).toUpperCase() || "GET";
  const query = req.query && typeof req.query === "object" && !Array.isArray(req.query) ? req.query : undefined;
  const headers = req.headers && typeof req.headers === "object" && !Array.isArray(req.headers) ? req.headers : undefined;
  const body = Object.prototype.hasOwnProperty.call(req, "body") ? req.body : undefined;
  return requestJson(path, method, body, query, headers);
}
