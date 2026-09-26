/**
 * @description Update a contact. PATCH /contacts/{contact_id}. https://docs.apollo.io/reference/update-a-contact
 * @param {Object} input
 * @param {string} input.contact_id
 * @param {string} [input.first_name]
 * @param {string} [input.last_name]
 * @param {string} [input.organization_name]
 * @param {string} [input.title]
 * @param {string} [input.account_id]
 * @param {string} [input.email]
 * @param {string} [input.website_url]
 * @param {string[]} [input.label_names]
 * @param {string} [input.contact_stage_id]
 * @param {string} [input.present_raw_address]
 * @param {string} [input.direct_phone]
 * @param {string} [input.corporate_phone]
 * @param {string} [input.mobile_phone]
 * @param {string} [input.home_phone]
 * @param {string} [input.other_phone]
 * @param {Object} [input.typed_custom_fields]
 * @returns {Object} Apollo response body, including contact.
 * @throws {Error} APOLLO_INVALID_INPUT when contact_id is missing or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function updateContact(input) {
  const req = requireObject(input);
  const contactId = requireString(req, "contact_id");
  const body = pickFields(req, [
    ["first_name", "string"],
    ["last_name", "string"],
    ["organization_name", "string"],
    ["title", "string"],
    ["account_id", "string"],
    ["email", "string"],
    ["website_url", "string"],
    ["label_names", "string[]"],
    ["contact_stage_id", "string"],
    ["present_raw_address", "string"],
    ["direct_phone", "string"],
    ["corporate_phone", "string"],
    ["mobile_phone", "string"],
    ["home_phone", "string"],
    ["other_phone", "string"],
    ["typed_custom_fields", "object"],
  ]);
  return apolloRequest(`/contacts/${encodeURIComponent(contactId)}`, "PATCH", body);
}
