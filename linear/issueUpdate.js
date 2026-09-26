/**
 * @description Update an issue. mutation issueUpdate(id: String!, input: IssueUpdateInput!). https://linear.app/developers/graphql
 * @param {Object} input
 * @param {string} input.id Issue id or identifier such as BLA-123
 * @param {Object} input.input IssueUpdateInput
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when id or input is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function issueUpdate(input) {
  const req = requireObjectInput(input);
  requireString(req.id, "id");
  requireObject(req.input, "input");
  return linearGraphql(
    "mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { " + ISSUE_PAYLOAD + " } }",
    pickVariables(req, ["id", "input"]),
  );
}
