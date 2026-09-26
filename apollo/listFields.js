/**
 * @description Get a list of fields. GET /fields. https://docs.apollo.io/reference/get-a-list-of-fields
 * @param {Object} input
 * @param {"system"|"custom"|"crm_synced"} [input.source]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when source is not system, custom, or crm_synced.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listFields(input) {
  const req = requireObject(input);
  if (req.source !== undefined && req.source !== "system" && req.source !== "custom" && req.source !== "crm_synced") invalid("source must be system, custom, or crm_synced");
  const query = pickFields(req, [["source", "string"]]);
  return apolloRequest(`/fields${buildQuery(query)}`, "GET");
}
