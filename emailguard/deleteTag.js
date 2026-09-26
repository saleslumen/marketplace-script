/**
 * @description Delete tag. DELETE /api/v1/tags/{tag_uuid}.
 * @param {Object} input
 * @param {string} input.tag_uuid
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: tag_uuid is required when tag_uuid is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function deleteTag(input) {
  const req = inputObject(input);
  const tag_uuid = requireText(req, "tag_uuid");
  return emailguardRequest(`/api/v1/tags/${encodeURIComponent(tag_uuid)}`, "DELETE");
}
