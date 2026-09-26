/**
 * @description List comments on a record, newest first. GET /v0/{baseId}/{tableIdOrName}/{recordId}/comments.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {string} input.recordId
 * @param {number} [input.pageSize] - Integer from 1 to 100
 * @param {string} [input.offset]
 * @returns {Object} comments and offset
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input or documented limit is violated
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function listComments(input) {
  const located = requireCommentLocation(input, false);
  const parts = [];
  const pageSize = optionalInt(located.req.pageSize, "pageSize", 1, 100);
  if (pageSize !== undefined) pushQuery(parts, "pageSize", pageSize);
  const offset = optionalText(located.req.offset, "offset");
  if (offset) pushQuery(parts, "offset", offset);
  const query = parts.length ? `?${parts.join("&")}` : "";
  return airtableRequest(`${located.path}${query}`, "GET");
}
