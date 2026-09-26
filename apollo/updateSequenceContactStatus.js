/**
 * @description Update contact status in a sequence. POST /emailer_campaigns/remove_or_stop_contact_ids. https://docs.apollo.io/reference/update-contact-status-sequence
 * @param {Object} input
 * @param {string[]} input.emailer_campaign_ids[]
 * @param {string[]} input.contact_ids[]
 * @param {"mark_as_finished"|"remove"|"stop"} input.mode
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when a required list is missing or mode is not mark_as_finished, remove, or stop.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function updateSequenceContactStatus(input) {
  const req = requireObject(input);
  requireStringList(req, "emailer_campaign_ids[]");
  requireStringList(req, "contact_ids[]");
  const mode = requireString(req, "mode");
  if (mode !== "mark_as_finished" && mode !== "remove" && mode !== "stop") invalid("mode must be mark_as_finished, remove, or stop");
  const query = pickFields(req, [["emailer_campaign_ids[]", "string[]"], ["contact_ids[]", "string[]"], ["mode", "string"]]);
  query.mode = mode;
  return apolloRequest(`/emailer_campaigns/remove_or_stop_contact_ids${buildQuery(query)}`, "POST");
}
