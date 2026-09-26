/**
 * @description Create a sequence. POST /sequences. https://docs.apollo.io/reference/create-sequence
 * @param {Object} input
 * @param {Object} input Documented sequence fields, including name, active, emailer_schedule_id, label_names, folder_id, sequence rules, and emailer_steps.
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when a required input is missing or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function createSequence(input) {
  const req = requireObject(input);
  const body = pickFields(req, [["name", "string"], ["permissions", "string"], ["active", "boolean"], ["emailer_schedule_id", "string"], ["user_id", "string"], ["label_names", "string[]"], ["folder_id", "string"], ["sequence_by_exact_daytime", "boolean"], ["max_emails_per_day", "integer"], ["mark_finished_if_reply", "boolean"], ["mark_finished_if_click", "boolean"], ["mark_finished_if_interested", "boolean"], ["mark_paused_if_ooo", "boolean"], ["days_to_wait_before_mark_as_response", "integer"], ["create_task_if_email_open", "boolean"], ["email_open_trigger_task_threshold", "integer"], ["same_account_reply_delay_days", "integer"], ["excluded_account_stage_ids", "string[]"], ["excluded_contact_stage_ids", "string[]"], ["ignore_apollo_global_email_bounce_list", "boolean"], ["sequence_ruleset_id", "string"], ["emailer_steps", "object[]"]]);
  if (body.max_emails_per_day !== undefined && body.max_emails_per_day < 0) invalid("max_emails_per_day must not be negative");
  if (body.same_account_reply_delay_days !== undefined && (body.same_account_reply_delay_days < 0 || body.same_account_reply_delay_days > 1000)) invalid("same_account_reply_delay_days must be an integer from 0 to 1000");
  return apolloRequest("/sequences", "POST", body);
}
