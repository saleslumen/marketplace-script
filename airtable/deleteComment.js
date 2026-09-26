/**
 * @description Delete a comment. DELETE /v0/{baseId}/{tableIdOrName}/{recordId}/comments/{rowCommentId}.
 * @param {Object} input
 * @param {string} input.baseId
 * @param {string} input.tableIdOrName
 * @param {string} input.recordId
 * @param {string} input.rowCommentId
 * @returns {Object} id and deleted
 * @throws {Error} AIRTABLE_INVALID_INPUT when a required input is missing
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function deleteComment(input) {
  const located = requireCommentLocation(input, true);
  return airtableRequest(located.path, "DELETE");
}
