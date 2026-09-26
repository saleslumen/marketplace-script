/**
 * @description Add contacts to a sequence. POST /emailer_campaigns/{sequence_id}/add_contact_ids. https://docs.apollo.io/reference/add-contacts-to-sequence
 * @param {Object} input
 * @param {string} input.sequence_id
 * @param {string} input.emailer_campaign_id Same id as sequence_id.
 * @param {string[]} [input.contact_ids[]] Required unless label_names[] is set.
 * @param {string[]} [input.label_names[]] Required unless contact_ids[] is set.
 * @param {string|string[]} input.send_email_from_email_account_id
 * @param {string} [input.send_email_from_email_address]
 * @param {boolean} [input.sequence_no_email]
 * @param {boolean} [input.sequence_unverified_email]
 * @param {boolean} [input.sequence_job_change]
 * @param {boolean} [input.sequence_active_in_other_campaigns]
 * @param {boolean} [input.sequence_finished_in_other_campaigns]
 * @param {boolean} [input.sequence_same_company_in_same_campaign]
 * @param {boolean} [input.contacts_without_ownership_permission]
 * @param {boolean} [input.add_if_in_queue]
 * @param {boolean} [input.contact_verification_skipped]
 * @param {string} [input.user_id]
 * @param {string} [input.status]
 * @param {string} [input.auto_unpause_at] Requires status paused.
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when a required parameter is missing, neither contact_ids[] nor label_names[] is set, or auto_unpause_at is set without status paused.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function addContactsToSequence(input) {
  const req = requireObject(input);
  const sequenceId = requireString(req, "sequence_id");
  const emailerCampaignId = requireString(req, "emailer_campaign_id");
  const sendFrom = req.send_email_from_email_account_id;
  const sendFromMissing = sendFrom === undefined || sendFrom === null || sendFrom === "" || (Array.isArray(sendFrom) && sendFrom.length < 1);
  if (sendFromMissing) invalid("send_email_from_email_account_id is required");
  const contactIds = req["contact_ids[]"];
  const labelNames = req["label_names[]"];
  const hasContactIds = Array.isArray(contactIds) && contactIds.length > 0;
  const hasLabelNames = Array.isArray(labelNames) && labelNames.length > 0;
  if (!hasContactIds && !hasLabelNames) invalid("contact_ids[] or label_names[] is required");
  if (req.auto_unpause_at !== undefined && req.status !== "paused") invalid("auto_unpause_at requires status paused");
  const query = pickFields(req, [
    ["emailer_campaign_id", "string"],
    ["contact_ids[]", "string[]"],
    ["label_names[]", "string[]"],
    ["send_email_from_email_account_id", "string|string[]"],
    ["send_email_from_email_address", "string"],
    ["sequence_no_email", "boolean"],
    ["sequence_unverified_email", "boolean"],
    ["sequence_job_change", "boolean"],
    ["sequence_active_in_other_campaigns", "boolean"],
    ["sequence_finished_in_other_campaigns", "boolean"],
    ["sequence_same_company_in_same_campaign", "boolean"],
    ["contacts_without_ownership_permission", "boolean"],
    ["add_if_in_queue", "boolean"],
    ["contact_verification_skipped", "boolean"],
    ["user_id", "string"],
    ["status", "string"],
    ["auto_unpause_at", "string"],
  ]);
  query.emailer_campaign_id = emailerCampaignId;
  return apolloRequest(`/emailer_campaigns/${encodeURIComponent(sequenceId)}/add_contact_ids${buildQuery(query)}`, "POST");
}
