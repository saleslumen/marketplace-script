/**
 * @description Delete a comment. mutation commentDelete(id: String!). https://github.com/linear/linear/blob/master/packages/sdk/src/schema.graphql
 * @param {Object} input
 * @param {string} input.id
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when id is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function commentDelete(input) {
  const req = requireObjectInput(input);
  requireString(req.id, "id");
  return linearGraphql(
    "mutation CommentDelete($id: String!) { commentDelete(id: $id) { " + DELETE_PAYLOAD + " } }",
    pickVariables(req, ["id"]),
  );
}
