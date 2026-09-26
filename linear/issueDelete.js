/**
 * @description Delete an issue. mutation issueDelete(id: String!, permanentlyDelete: Boolean). https://github.com/linear/linear/blob/master/packages/sdk/src/schema.graphql
 * @param {Object} input
 * @param {string} input.id Issue id or identifier such as BLA-123
 * @param {boolean} [input.permanentlyDelete]
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when id is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function issueDelete(input) {
  const req = requireObjectInput(input);
  requireString(req.id, "id");
  return linearGraphql(
    "mutation IssueDelete($id: String!, $permanentlyDelete: Boolean) { issueDelete(id: $id, permanentlyDelete: $permanentlyDelete) { " + ISSUE_ARCHIVE_PAYLOAD + " } }",
    pickVariables(req, ["id", "permanentlyDelete"]),
  );
}
