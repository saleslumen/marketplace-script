/**
 * @description List users. query users(after, before, filter, first, includeArchived, includeDisabled, last, orderBy). https://linear.app/developers/graphql
 * @param {Object} input
 * @param {string} [input.after]
 * @param {string} [input.before]
 * @param {Object} [input.filter] UserFilter
 * @param {number} [input.first]
 * @param {boolean} [input.includeArchived]
 * @param {boolean} [input.includeDisabled]
 * @param {number} [input.last]
 * @param {string} [input.orderBy] PaginationOrderBy: createdAt or updatedAt
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when input is not an object
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function users(input) {
  const req = requireObjectInput(input);
  return linearGraphql(
    "query Users($after: String, $before: String, $filter: UserFilter, $first: Int, $includeArchived: Boolean, $includeDisabled: Boolean, $last: Int, $orderBy: PaginationOrderBy) { users(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, includeDisabled: $includeDisabled, last: $last, orderBy: $orderBy) { " + linearConnection(USER_FIELDS) + " } }",
    pickVariables(req, ["after", "before", "filter", "first", "includeArchived", "includeDisabled", "last", "orderBy"]),
  );
}
