/**
 * PUT /restful/v2/folders/{folder_name}/stealth_forwarding
 * @see https://www.dynadot.com/domain/api-document#folder_set_stealth_forwarding
 * @param {Object} input
 * @param {string|number} input.folder_name
 * @param {string} input.stealth_url
 * @param {string} [input.stealth_title]
 * @param {boolean} [input.apply_for_future_domain]
 * @param {boolean} [input.sync_setting_to_existing_domains_in_this_folder]
 * @returns {Promise<Object>}
 */
async function folderSetStealthForwarding(input) {
  return dynadotRest({
    method: "PUT",
    path: "/folders/{folder_name}/stealth_forwarding",
    fields: [
      { name: "folder_name", in: "path", required: true, type: "path" },
      { name: "stealth_url", in: "body", required: true, type: "string" },
      { name: "stealth_title", in: "body", type: "string" },
      { name: "apply_for_future_domain", in: "body", type: "boolean" },
      { name: "sync_setting_to_existing_domains_in_this_folder", in: "body", type: "boolean" },
    ]
  }, input);
}
