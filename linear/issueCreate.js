/**
 * @description Create an issue. mutation issueCreate(input: IssueCreateInput!). https://linear.app/developers/graphql
 * @param {Object} input
 * @param {Object} input.input IssueCreateInput. teamId is required. title is optional when a template supplies it.
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when input or input.teamId is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function issueCreate(input) {
  const req = requireObjectInput(input);
  const created = requireObject(req.input, "input");
  requireString(created.teamId, "input.teamId");
  return linearGraphql(
    "mutation IssueCreate($input: IssueCreateInput!) { issueCreate(input: $input) { " + ISSUE_PAYLOAD + " } }",
    { input: created },
  );
}
