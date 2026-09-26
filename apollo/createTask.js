/**
 * @description Create a task. POST /tasks. https://docs.apollo.io/reference/create-a-task
 * @param {Object} input
 * @param {string} input.user_id
 * @param {string} input.contact_id
 * @param {string} input.type
 * @param {string} input.status
 * @param {string} input.due_at
 * @param {"high"|"medium"|"low"} [input.priority]
 * @param {string} [input.title]
 * @param {string} [input.note]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when user_id, contact_id, type, status, or due_at is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function createTask(input) {
  const req = requireObject(input);
  const body = { user_id: requireString(req, "user_id"), contact_id: requireString(req, "contact_id"), type: requireString(req, "type"), status: requireString(req, "status"), due_at: requireString(req, "due_at") };
  if (req.priority !== undefined && req.priority !== "high" && req.priority !== "medium" && req.priority !== "low") invalid("priority must be high, medium, or low");
  Object.assign(body, pickFields(req, [["priority", "string"], ["title", "string"], ["note", "string"]]));
  return apolloRequest("/tasks", "POST", body);
}
