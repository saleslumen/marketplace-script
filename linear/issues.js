/**
 * @description List issues. query issues(after, before, filter, first, includeArchived, last, orderBy). https://linear.app/developers/pagination
 * @param {Object} input
 * @param {string} [input.after]
 * @param {string} [input.before]
 * @param {Object} [input.filter] IssueFilter
 * @param {number} [input.first]
 * @param {boolean} [input.includeArchived]
 * @param {number} [input.last]
 * @param {string} [input.orderBy] PaginationOrderBy: createdAt or updatedAt
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when input is not an object
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function issues(input) {
  const req = requireObjectInput(input);
  return linearGraphql(
    "query Issues($after: String, $before: String, $filter: IssueFilter, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) { issues(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, last: $last, orderBy: $orderBy) { " + linearConnection(ISSUE_FIELDS) + " } }",
    pickVariables(req, ["after", "before", "filter", "first", "includeArchived", "last", "orderBy"]),
  );
}
