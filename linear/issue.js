/**
 * @description Read one issue. query issue(id: String!). https://linear.app/developers/graphql
 * @param {Object} input
 * @param {string} input.id Issue id or identifier such as BLA-123
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when id is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function issue(input) {
  const req = requireObjectInput(input);
  requireString(req.id, "id");
  return linearGraphql(
    "query Issue($id: String!) { issue(id: $id) { " + ISSUE_FIELDS + " } }",
    pickVariables(req, ["id"]),
  );
}
