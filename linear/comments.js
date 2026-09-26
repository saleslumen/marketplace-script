/**
 * @description List comments. query comments(after, before, filter, first, includeArchived, last, orderBy). https://linear.app/developers/pagination
 * @param {Object} input
 * @param {string} [input.after]
 * @param {string} [input.before]
 * @param {Object} [input.filter] CommentFilter
 * @param {number} [input.first]
 * @param {boolean} [input.includeArchived]
 * @param {number} [input.last]
 * @param {string} [input.orderBy] PaginationOrderBy: createdAt or updatedAt
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when input is not an object
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function comments(input) {
  const req = requireObjectInput(input);
  return linearGraphql(
    "query Comments($after: String, $before: String, $filter: CommentFilter, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) { comments(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, last: $last, orderBy: $orderBy) { " + linearConnection(COMMENT_FIELDS) + " } }",
    pickVariables(req, ["after", "before", "filter", "first", "includeArchived", "last", "orderBy"]),
  );
}
