/**
 * PUT /restful/v2/folders/{folder_name}/domain_forwarding
 * @see https://www.dynadot.com/domain/api-document#folder_set_domain_forwarding
 * @param {Object} input
 * @param {string|number} input.folder_name
 * @param {string} input.forward_url
 * @param {boolean} [input.is_temporary]
 * @param {boolean} [input.apply_for_future_domain]
 * @param {boolean} [input.sync_setting_to_existing_domains_in_this_folder]
 * @returns {Promise<Object>}
 */
async function folderSetDomainForwarding(input) {
  return dynadotRest({
    method: "PUT",
    path: "/folders/{folder_name}/domain_forwarding",
    fields: [
      { name: "folder_name", in: "path", required: true, type: "path" },
      { name: "forward_url", in: "body", required: true, type: "string" },
      { name: "is_temporary", in: "body", type: "boolean" },
      { name: "apply_for_future_domain", in: "body", type: "boolean" },
      { name: "sync_setting_to_existing_domains_in_this_folder", in: "body", type: "boolean" },
    ]
  }, input);
}
