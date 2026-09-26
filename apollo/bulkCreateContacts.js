/**
 * @description Bulk create contacts. POST /contacts/bulk_create. https://docs.apollo.io/reference/bulk-create-contacts
 * @param {Object} input
 * @param {Object[]} input.contacts 1 to 100 contacts.
 * @param {string[]} [input.append_label_names]
 * @param {string} [input.owner_id]
 * @param {boolean} [input.run_dedupe]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when contacts is missing or longer than 100.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function bulkCreateContacts(input) {
  const req = requireObject(input);
  const body = { contacts: requireObjectArray(req.contacts, "contacts", 1, 100) };
  if (req.append_label_names !== undefined) body.append_label_names = checkValue("append_label_names", req.append_label_names, "string[]");
  if (req.owner_id !== undefined) body.owner_id = checkValue("owner_id", req.owner_id, "string");
  if (req.run_dedupe !== undefined) body.run_dedupe = checkValue("run_dedupe", req.run_dedupe, "boolean");
  return apolloRequest("/contacts/bulk_create", "POST", body);
}
