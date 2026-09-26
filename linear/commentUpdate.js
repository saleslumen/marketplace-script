/**
 * @description Update a comment. mutation commentUpdate(id: String!, input: CommentUpdateInput!). https://github.com/linear/linear/blob/master/packages/sdk/src/schema.graphql
 * @param {Object} input
 * @param {string} input.id
 * @param {Object} input.input CommentUpdateInput
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when id or input is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function commentUpdate(input) {
  const req = requireObjectInput(input);
  requireString(req.id, "id");
  requireObject(req.input, "input");
  return linearGraphql(
    "mutation CommentUpdate($id: String!, $input: CommentUpdateInput!) { commentUpdate(id: $id, input: $input) { " + COMMENT_PAYLOAD + " } }",
    pickVariables(req, ["id", "input"]),
  );
}
