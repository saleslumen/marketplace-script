/**
 * @description Create tag. POST /api/v1/tags.
 * @param {Object} input
 * @param {string} input.name
 * @param {string} input.color
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: name is required when name is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: color is required when color is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function createTag(input) {
  const req = inputObject(input);
  const body = {};
  body.name = requireText(req, "name");
  body.color = requireText(req, "color");
  return emailguardRequest("/api/v1/tags", "POST", body);
}
