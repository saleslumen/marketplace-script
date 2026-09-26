/**
 * @description Skip a task. POST /tasks/{id}/skip. https://docs.apollo.io/reference/skip-a-task
 * @param {Object} input
 * @param {string} input.id
 * @param {string} [input.note]
 * @param {boolean} [input.on_task_page]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function skipTask(input) {
  const req = requireObject(input);
  const id = requireString(req, "id");
  const body = pickFields(req, [["note", "string"], ["on_task_page", "boolean"]]);
  return apolloRequest(`/tasks/${encodeURIComponent(id)}/skip`, "POST", Object.keys(body).length ? body : undefined);
}
