/**
 * @description Unarchive an issue. mutation issueUnarchive(id: String!). https://github.com/linear/linear/blob/master/packages/sdk/src/schema.graphql
 * @param {Object} input
 * @param {string} input.id Issue id or identifier such as BLA-123
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when id is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function issueUnarchive(input) {
  const req = requireObjectInput(input);
  requireString(req.id, "id");
  return linearGraphql(
    "mutation IssueUnarchive($id: String!) { issueUnarchive(id: $id) { " + ISSUE_ARCHIVE_PAYLOAD + " } }",
    pickVariables(req, ["id"]),
  );
}
