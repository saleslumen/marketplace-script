/**
 * @description Archive an issue. mutation issueArchive(id: String!, trash: Boolean). https://github.com/linear/linear/blob/master/packages/sdk/src/schema.graphql
 * @param {Object} input
 * @param {string} input.id Issue id or identifier such as BLA-123
 * @param {boolean} [input.trash]
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when id is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function issueArchive(input) {
  const req = requireObjectInput(input);
  requireString(req.id, "id");
  return linearGraphql(
    "mutation IssueArchive($id: String!, $trash: Boolean) { issueArchive(id: $id, trash: $trash) { " + ISSUE_ARCHIVE_PAYLOAD + " } }",
    pickVariables(req, ["id", "trash"]),
  );
}
