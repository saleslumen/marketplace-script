/**
 * @description Complete a task. POST /tasks/{id}/complete. https://docs.apollo.io/reference/complete-a-task
 * @param {Object} input
 * @param {string} input.id
 * @param {string} [input.note]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function completeTask(input) {
  const req = requireObject(input);
  const id = requireString(req, "id");
  const body = pickFields(req, [["note", "string"]]);
  return apolloRequest(`/tasks/${encodeURIComponent(id)}/complete`, "POST", Object.keys(body).length ? body : undefined);
}
