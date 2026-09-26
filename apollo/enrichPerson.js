/**
 * @description People enrichment. POST /people/match. https://docs.apollo.io/reference/people-enrichment
 * @param {Object} input Query parameters use Apollo's names: first_name (string), last_name (string), name (string), email (string), hashed_email (string), organization_name (string), domain (string), id (string), linkedin_url (string), run_waterfall_email (boolean), run_waterfall_phone (boolean), reveal_personal_emails (boolean), reveal_phone_number (boolean), webhook_url (string), poll_only (boolean).
 * @returns {Object} Apollo response body, including person.
 * @throws {Error} APOLLO_INVALID_INPUT when input is not an object, a provided value has the wrong type, reveal_phone_number is true without webhook_url or poll_only, or poll_only is true with webhook_url.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function enrichPerson(input) {
  const req = requireObject(input);
  const query = pickFields(req, [
    ["first_name", "string"],
    ["last_name", "string"],
    ["name", "string"],
    ["email", "string"],
    ["hashed_email", "string"],
    ["organization_name", "string"],
    ["domain", "string"],
    ["id", "string"],
    ["linkedin_url", "string"],
    ["run_waterfall_email", "boolean"],
    ["run_waterfall_phone", "boolean"],
    ["reveal_personal_emails", "boolean"],
    ["reveal_phone_number", "boolean"],
    ["webhook_url", "string"],
    ["poll_only", "boolean"],
  ]);
  assertPhoneDelivery(query);
  return apolloRequest(`/people/match${buildQuery(query)}`, "POST");
}
