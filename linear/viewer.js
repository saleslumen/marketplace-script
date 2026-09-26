/**
 * @description Read the authenticated user. query viewer. https://linear.app/developers/graphql
 * @param {Object} input
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when input is not an object
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function viewer(input) {
  requireObjectInput(input);
  return linearGraphql("query Viewer { viewer { " + USER_FIELDS + " } }");
}
