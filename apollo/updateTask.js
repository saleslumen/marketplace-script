/**
 * @description Update a task. PATCH /tasks/{id}. https://docs.apollo.io/reference/update-a-task
 * @param {Object} input
 * @param {string} input.id
 * @param {string} [input.user_id]
 * @param {string} [input.creator_id]
 * @param {string} [input.contact_id]
 * @param {string} [input.note]
 * @param {string} [input.type]
 * @param {string} [input.priority]
 * @param {*} [input.priority_cd]
 * @param {string} [input.status]
 * @param {string} [input.due_at]
 * @param {string} [input.title]
 * @param {string} [input.call_script]
 * @param {string[]} [input.relevant_fields]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function updateTask(input) {
  const req = requireObject(input);
  const id = requireString(req, "id");
  const body = pickFields(req, [["user_id", "string"], ["creator_id", "string"], ["contact_id", "string"], ["note", "string"], ["type", "string"], ["priority", "string"], ["priority_cd", "json"], ["status", "string"], ["due_at", "string"], ["title", "string"], ["call_script", "string"], ["relevant_fields", "string[]"]]);
  return apolloRequest(`/tasks/${encodeURIComponent(id)}`, "PATCH", Object.keys(body).length ? body : undefined);
}
