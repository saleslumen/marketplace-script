/**
 * @description List workflow states. query workflowStates(after, before, filter, first, includeArchived, last, orderBy). https://linear.app/developers/graphql
 * @param {Object} input
 * @param {string} [input.after]
 * @param {string} [input.before]
 * @param {Object} [input.filter] WorkflowStateFilter
 * @param {number} [input.first]
 * @param {boolean} [input.includeArchived]
 * @param {number} [input.last]
 * @param {string} [input.orderBy] PaginationOrderBy: createdAt or updatedAt
 * @returns {Object} GraphQL data
 * @throws {Error} LINEAR_INVALID_INPUT when input is not an object
 * @throws {Error} LINEAR_REQUEST_FAILED: <status> <message> when Linear rejects the request
 */
async function workflowStates(input) {
  const req = requireObjectInput(input);
  return linearGraphql(
    "query WorkflowStates($after: String, $before: String, $filter: WorkflowStateFilter, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) { workflowStates(after: $after, before: $before, filter: $filter, first: $first, includeArchived: $includeArchived, last: $last, orderBy: $orderBy) { " + linearConnection("id name type color position description archivedAt createdAt updatedAt team { " + TEAM_REF + " }") + " } }",
    pickVariables(req, ["after", "before", "filter", "first", "includeArchived", "last", "orderBy"]),
  );
}
