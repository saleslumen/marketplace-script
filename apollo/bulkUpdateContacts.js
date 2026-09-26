/**
 * @description Bulk update contacts. POST /contacts/bulk_update. https://docs.apollo.io/reference/bulk-update-contacts
 * @param {Object} input
 * @param {string[]} [input.contact_ids]
 * @param {Object[]} [input.contact_attributes] Each object requires id.
 * @param {string} [input.owner_id]
 * @param {string} [input.email]
 * @param {string} [input.organization_name]
 * @param {string} [input.title]
 * @param {string} [input.first_name]
 * @param {string} [input.last_name]
 * @param {string} [input.account_id]
 * @param {string} [input.present_raw_address]
 * @param {string} [input.linkedin_url]
 * @param {Object} [input.typed_custom_fields]
 * @param {boolean} [input.async]
 * @param {string[]} [input.visible_entity_ids]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when contact_ids and contact_attributes are both missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function bulkUpdateContacts(input) {
  const req = requireObject(input);
  const idsPresent = req.contact_ids !== undefined;
  const attributesPresent = req.contact_attributes !== undefined;
  if (!idsPresent && !attributesPresent) invalid("contact_ids or contact_attributes is required");
  const body = {};
  if (idsPresent) {
    const contactIds = checkValue("contact_ids", req.contact_ids, "string[]");
    if (!contactIds.length) invalid("contact_ids is required");
    body.contact_ids = contactIds;
  }
  if (attributesPresent) body.contact_attributes = requireIdObjects(req.contact_attributes, "contact_attributes");
  Object.assign(body, pickFields(req, [["owner_id", "string"], ["email", "string"], ["organization_name", "string"], ["title", "string"], ["first_name", "string"], ["last_name", "string"], ["account_id", "string"], ["present_raw_address", "string"], ["linkedin_url", "string"], ["typed_custom_fields", "object"], ["async", "boolean"], ["visible_entity_ids", "string[]"]]));
  return apolloRequest("/contacts/bulk_update", "POST", body);
}
