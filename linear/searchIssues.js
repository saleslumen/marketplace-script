/**
 * @description Search issues. query searchIssues(term: String!, ...). term is required. https://github.com/linear/linear/blob/master/packages/sdk/src/schema.graphql
 * @param {Object} input
 * @param {string} input.term
 * @param {string} [input.after]
 * @param {string} [input.before]
 * @param {Object} [input.filter] IssueFilter
 * @param {number} [input.first]
 * @param {boolean} [input.includeArchived]
 * @param {boolean} [input.includeComments]
 * @param {number} [input.last]
 * @param {string} [input.orderBy] PaginationOrderBy: createdAt or updatedAt
 * @param {string} [input.teamId] Team UUID used to boost results
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when term is missing
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function searchIssues(input) {
  const req = requireObjectInput(input);
  requireString(req.term, "term");
  return linearGraphql(
    "query SearchIssues($after: String, $before: String, $filter: IssueFilter, $first: Int, $includeArchived: Boolean, $includeComments: Boolean, $last: Int, $orderBy: PaginationOrderBy, $teamId: String, $term: String!) { searchIssues(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, includeComments: $includeComments, last: $last, orderBy: $orderBy, teamId: $teamId, term: $term) { totalCount " + linearConnection(ISSUE_FIELDS + " metadata") + " } }",
    pickVariables(req, ["after", "before", "filter", "first", "includeArchived", "includeComments", "last", "orderBy", "teamId", "term"]),
  );
}
