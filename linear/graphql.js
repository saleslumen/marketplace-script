/**
 * @description Send a GraphQL query and variables to https://api.linear.app/graphql. https://linear.app/developers/graphql
 * @param {Object} input
 * @param {string} input.query
 * @param {Object} [input.variables]
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when query is missing or variables is not an object
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function graphql(input) {
  const req = requireObjectInput(input);
  const query = requireString(req.query, "query");
  if (Object.prototype.hasOwnProperty.call(req, "variables") && (!req.variables || typeof req.variables !== "object" || Array.isArray(req.variables))) {
    throw new Error("LINEAR_INVALID_INPUT: variables must be an object");
  }
  return linearGraphql(query, Object.prototype.hasOwnProperty.call(req, "variables") ? req.variables : undefined);
}
