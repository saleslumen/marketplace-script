/**
 * @description Read one team. query team(id: String!). https://linear.app/developers/graphql
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when id is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function team(input) {
  const req = requireObjectInput(input);
  requireString(req.id, "id");
  return linearGraphql(
    "query Team($id: String!) { team(id: $id) { " + TEAM_FIELDS + " } }",
    pickVariables(req, ["id"]),
  );
}
