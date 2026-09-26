/**
 * @description Update a sequence. PUT /sequences/{id}. https://docs.apollo.io/reference/update-sequence
 * @param {Object} input
 * @param {string} input.id
 * @param {Object} input Documented sequence fields, including name, active, sharing_permission, label_names, and emailer_steps.
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when id is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function updateSequence(input) {
  const req = requireObject(input);
  const id = requireString(req, "id");
  const body = pickFields(req, [["name", "string"], ["active", "boolean"], ["creation_type", "string"], ["permissions", "string"], ["sharing_permission", "object"], ["user_id", "string"], ["emailer_schedule_id", "string"], ["label_names", "string[]"], ["max_emails_per_day", "integer"], ["same_account_reply_delay_days", "integer"], ["cc_emails", "string"], ["bcc_emails", "string"], ["emailer_steps", "object[]"]]);
  const payload = Object.keys(body).length ? body : undefined;
  return apolloRequest(`/sequences/${encodeURIComponent(id)}`, "PUT", payload);
}
