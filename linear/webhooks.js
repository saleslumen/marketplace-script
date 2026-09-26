/**
 * @description List webhooks. query webhooks(after, before, first, includeArchived, last, orderBy). https://linear.app/developers/webhooks
 * @param {Object} input
 * @param {string} [input.after]
 * @param {string} [input.before]
 * @param {number} [input.first]
 * @param {boolean} [input.includeArchived]
 * @param {number} [input.last]
 * @param {string} [input.orderBy] PaginationOrderBy: createdAt or updatedAt
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when input is not an object
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function webhooks(input) {
  const req = requireObjectInput(input);
  return linearGraphql(
    "query Webhooks($after: String, $before: String, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) { webhooks(after: $after, before: $before, first: $first, includeArchived: $includeArchived, last: $last, orderBy: $orderBy) { " + linearConnection(WEBHOOK_FIELDS) + " } }",
    pickVariables(req, ["after", "before", "first", "includeArchived", "last", "orderBy"]),
  );
}
