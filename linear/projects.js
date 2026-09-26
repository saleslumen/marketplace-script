/**
 * @description List projects. query projects(after, before, filter, first, includeArchived, last, orderBy). https://linear.app/developers/pagination
 * @param {Object} input
 * @param {string} [input.after]
 * @param {string} [input.before]
 * @param {Object} [input.filter] ProjectFilter
 * @param {number} [input.first]
 * @param {boolean} [input.includeArchived]
 * @param {number} [input.last]
 * @param {string} [input.orderBy] PaginationOrderBy: createdAt or updatedAt
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when input is not an object
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function projects(input) {
  const req = requireObjectInput(input);
  return linearGraphql(
    "query Projects($after: String, $before: String, $filter: ProjectFilter, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) { projects(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, last: $last, orderBy: $orderBy) { " + linearConnection(PROJECT_FIELDS) + " } }",
    pickVariables(req, ["after", "before", "filter", "first", "includeArchived", "last", "orderBy"]),
  );
}
