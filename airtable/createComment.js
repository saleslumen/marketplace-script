/**
 * @description Create a comment on a record. POST /v0/{baseId}/{tableIdOrName}/{recordId}/comments.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {string} input.recordId
 * @param {string} input.text
 * @param {string} [input.parentCommentId]
 * @returns {Object} comment, including id, createdTime, text, and author
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function createComment(input) {
  const located = requireCommentLocation(input, false);
  const body = {};
  if (located.req.parentCommentId !== undefined && located.req.parentCommentId !== null && located.req.parentCommentId !== "") {
    body.parentCommentId = requireId(located.req.parentCommentId, "parentCommentId");
  }
  body.text = requireCommentText(located.req.text);
  return airtableRequest(located.path, "POST", body);
}
