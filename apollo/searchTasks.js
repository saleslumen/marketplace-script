/**
 * @description Search for tasks. POST /tasks/search. https://docs.apollo.io/reference/search-tasks
 * @param {Object} input
 * @param {string} [input.sort_by_field]
 * @param {string[]} [input.open_factor_names[]]
 * @param {number} [input.page]
 * @param {number} [input.per_page]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when a required input is missing or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function searchTasks(input) {
  const req = requireObject(input);
  const query = pickFields(req, [["sort_by_field", "string"], ["open_factor_names[]", "string[]"], ["page", "integer"], ["per_page", "integer"]]);
  return apolloRequest(`/tasks/search${buildQuery(query)}`, "POST");
}
