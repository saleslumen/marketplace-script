/**
 * @description Update a comment the caller created. PATCH /v0/{baseId}/{tableIdOrName}/{recordId}/comments/{rowCommentId}.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {string} input.recordId
 * @param {string} input.rowCommentId
 * @param {string} input.text
 * @returns {Object} comment, including id, createdTime, lastUpdatedTime, text, and author
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function updateComment(input) {
  const located = requireCommentLocation(input, true);
  return airtableRequest(located.path, "PATCH", { text: requireCommentText(located.req.text) });
}
