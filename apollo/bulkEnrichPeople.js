/**
 * @description Bulk people enrichment. POST /people/bulk_match. https://docs.apollo.io/reference/bulk-people-enrichment
 * @param {Object} input
 * @param {Object[]} input.details One to ten people. Each object uses first_name, last_name, name, email, hashed_email, organization_name, domain, id, and linkedin_url.
 * @param {boolean} [input.run_waterfall_email]
 * @param {boolean} [input.run_waterfall_phone]
 * @param {boolean} [input.reveal_personal_emails]
 * @param {boolean} [input.reveal_phone_number]
 * @param {string} [input.webhook_url] Required when reveal_phone_number is true and poll_only is not true.
 * @param {boolean} [input.poll_only]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when details is missing or invalid, or phone delivery parameters conflict.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function bulkEnrichPeople(input) {
  const req = requireObject(input);
  const details = requireDetails(req.details, "people");
  const query = pickFields(req, [
    ["run_waterfall_email", "boolean"],
    ["run_waterfall_phone", "boolean"],
    ["reveal_personal_emails", "boolean"],
    ["reveal_phone_number", "boolean"],
    ["webhook_url", "string"],
    ["poll_only", "boolean"],
  ]);
  assertPhoneDelivery(query);
  return apolloRequest(`/people/bulk_match${buildQuery(query)}`, "POST", { details });
}
