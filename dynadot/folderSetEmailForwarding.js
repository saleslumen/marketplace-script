/**
 * PUT /restful/v2/folders/{folder_name}/email_forwarding
 * @see https://www.dynadot.com/domain/api-document#folder_set_email_forwarding
 * @param {Object} input
 * @param {string|number} input.folder_name
 * @param {string} input.email_forward_type
 * @param {Array} [input.email_alias_list]
 * @param {string} [input.email_alias_list.username]
 * @param {string} [input.email_alias_list.email]
 * @param {Array} [input.email_exchange_list]
 * @param {string} [input.email_exchange_list.host]
 * @param {string} [input.email_exchange_list.distance]
 * @param {boolean} [input.apply_for_future_domain]
 * @param {boolean} [input.sync_setting_to_existing_domains_in_this_folder]
 * @returns {Promise<Object>}
 */
async function folderSetEmailForwarding(input) {
  return dynadotRest({
    method: "PUT",
    path: "/folders/{folder_name}/email_forwarding",
    fields: [
      { name: "folder_name", in: "path", required: true, type: "path" },
      { name: "email_forward_type", in: "body", required: true, type: "string" },
      { name: "email_alias_list", in: "body", type: "list", item: "object", fields: [
        { name: "username", type: "string" },
        { name: "email", type: "string" },
      ] },
      { name: "email_exchange_list", in: "body", type: "list", item: "object", fields: [
        { name: "host", type: "string" },
        { name: "distance", type: "string" },
      ] },
      { name: "apply_for_future_domain", in: "body", type: "boolean" },
      { name: "sync_setting_to_existing_domains_in_this_folder", in: "body", type: "boolean" },
    ]
  }, input);
}
