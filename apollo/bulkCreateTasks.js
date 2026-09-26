/**
 * @description Bulk create tasks. POST /tasks/bulk_create. https://docs.apollo.io/reference/bulk-create-tasks
 * @param {Object} input
 * @param {string} input.user_id
 * @param {string[]} input.contact_ids
 * @param {string} input.type
 * @param {string} input.status
 * @param {string} input.due_at
 * @param {"high"|"medium"|"low"} [input.priority]
 * @param {string} [input.note]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when a required task field is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function bulkCreateTasks(input) {
  const req = requireObject(input);
  const body = { user_id: requireString(req, "user_id"), contact_ids: requireStringList(req, "contact_ids"), type: requireString(req, "type"), status: requireString(req, "status"), due_at: requireString(req, "due_at") };
  if (req.priority !== undefined && req.priority !== "high" && req.priority !== "medium" && req.priority !== "low") invalid("priority must be high, medium, or low");
  Object.assign(body, pickFields(req, [["priority", "string"], ["note", "string"]]));
  return apolloRequest("/tasks/bulk_create", "POST", body);
}
