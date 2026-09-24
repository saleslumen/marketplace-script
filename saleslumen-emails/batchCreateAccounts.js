/**
 * @description Create email accounts in one batch.
 * @param {Object} input
 * @param {Object[]} input.body Accounts to create.
 * @param {string} input.body[].account_id Client-assigned identifier.
 * @param {string} input.body[].email_address Mailbox address.
 * @param {string} input.body[].display_name Sender display name.
 * @param {Object} [input.body[].sender_info] Nested sender identity.
 * @param {string} [input.body[].given_name] Given name.
 * @param {string} [input.body[].family_name] Family name.
 * @param {string} [input.body[].email_signature] Email signature.
 * @param {string} [input.body[].locale] Locale.
 * @param {string} [input.body[].time_zone] Time zone.
 * @param {*} [input.body[].has_logs] Account metadata.
 * @param {Object[]} [input.body[].webhooks] Webhook configuration.
 * @param {number} [input.body[].daily_email_limit] Daily send limit.
 * @param {number} [input.body[].min_wait_time_minutes] Minimum minutes between sends.
 * @param {string} [input.body[].reply_to_address] Reply-to address.
 * @param {boolean} [input.body[].tracking_domain_enabled] Whether a tracking domain is enabled.
 * @param {string} [input.body[].tracking_domain_name] Tracking domain name.
 * @param {Object} [input.body[].imap_config] IMAP settings: server_host, server_port, is_secure or is_tls, and auth_details.
 * @param {Object} [input.body[].smtp_config] SMTP settings: server_host, server_port, is_secure or is_tls, and auth_details.
 * @returns {Object} Batch create response.
 * @throws {Error} The Emails service returned status 400 or higher.
 */
async function batchCreateAccounts(input) {
  return Emails.batchCreateAccounts(input);
}
