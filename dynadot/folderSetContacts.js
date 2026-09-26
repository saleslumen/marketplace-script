/**
 * PUT /restful/v2/folders/{folder_name}/contacts
 * @see https://www.dynadot.com/domain/api-document#folder_set_contacts
 * @param {Object} input
 * @param {string|number} input.folder_name
 * @param {number} input.registrant_contact_id
 * @param {number} input.admin_contact_id
 * @param {number} input.technical_contact_id
 * @param {number} input.billing_contact_id
 * @param {boolean} [input.apply_for_future_domain]
 * @param {boolean} [input.sync_setting_to_existing_domains_in_this_folder]
 * @returns {Promise<Object>}
 */
async function folderSetContacts(input) {
  return dynadotRest({
    method: "PUT",
    path: "/folders/{folder_name}/contacts",
    fields: [
      { name: "folder_name", in: "path", required: true, type: "path" },
      { name: "registrant_contact_id", in: "body", required: true, type: "integer" },
      { name: "admin_contact_id", in: "body", required: true, type: "integer" },
      { name: "technical_contact_id", in: "body", required: true, type: "integer" },
      { name: "billing_contact_id", in: "body", required: true, type: "integer" },
      { name: "apply_for_future_domain", in: "body", type: "boolean" },
      { name: "sync_setting_to_existing_domains_in_this_folder", in: "body", type: "boolean" },
    ]
  }, input);
}
