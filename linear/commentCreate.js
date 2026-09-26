/**
 * @description Create a comment. mutation commentCreate(input: CommentCreateInput!). https://github.com/linear/linear/blob/master/packages/sdk/src/schema.graphql
 * @param {Object} input
 * @param {Object} input.input CommentCreateInput
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when input is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function commentCreate(input) {
  const req = requireObjectInput(input);
  const created = requireObject(req.input, "input");
  return linearGraphql(
    "mutation CommentCreate($input: CommentCreateInput!) { commentCreate(input: $input) { " + COMMENT_PAYLOAD + " } }",
    { input: created },
  );
}
