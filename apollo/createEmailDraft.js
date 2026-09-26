/**
 * @description Create an email draft. POST /emailer_messages. https://docs.apollo.io/reference/create-an-email-draft
 * @param {Object} input
 * @param {string} [input.contact_id] Required unless in_response_to_emailer_message_id is set.
 * @param {string} [input.in_response_to_emailer_message_id]
 * @param {string} [input.subject]
 * @param {string} [input.body_html]
 * @param {Object[]} [input.recipients]
 * @param {string} [input.emailer_template_id]
 * @param {string[]} [input.attachment_ids]
 * @param {boolean} [input.enable_tracking]
 * @param {string} [input.outreach_task_id]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when contact_id is missing and in_response_to_emailer_message_id is not set.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function createEmailDraft(input) {
  const req = requireObject(input);
  const replyId = req.in_response_to_emailer_message_id;
  const hasReply = typeof replyId === "string" && replyId.trim() !== "";
  if (!hasReply) requireString(req, "contact_id");
  const body = pickFields(req, [["contact_id", "string"], ["subject", "string"], ["body_html", "string"], ["recipients", "object[]"], ["in_response_to_emailer_message_id", "string"], ["emailer_template_id", "string"], ["attachment_ids", "string[]"], ["enable_tracking", "boolean"], ["outreach_task_id", "string"]]);
  return apolloRequest("/emailer_messages", "POST", body);
}
