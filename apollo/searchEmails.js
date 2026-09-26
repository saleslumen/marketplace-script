/**
 * @description Search for outreach emails. GET /emailer_messages/search. https://docs.apollo.io/reference/search-for-outreach-emails
 * @param {Object} input
 * @param {Object} input Query names include emailer_message_stats[], emailer_campaign_ids[], emailer_message_date_range[min], emailer_message_date_range[max], q_keywords, page, and per_page.
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when a required input is missing or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function searchEmails(input) {
  const req = requireObject(input);
  const query = pickFields(req, [["emailer_message_stats[]", "string[]"], ["emailer_message_reply_classes[]", "string[]"], ["user_ids[]", "string[]"], ["email_account_id_and_aliases", "string"], ["emailer_campaign_ids[]", "string[]"], ["not_emailer_campaign_ids[]", "string[]"], ["emailer_message_date_range_mode", "string"], ["emailer_message_date_range[max]", "string"], ["emailer_message_date_range[min]", "string"], ["not_sent_reason_cds[]", "string[]"], ["q_keywords", "string"], ["page", "integer"], ["per_page", "integer"]]);
  return apolloRequest(`/emailer_messages/search${buildQuery(query)}`, "GET");
}
