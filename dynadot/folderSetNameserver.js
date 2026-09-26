/**
 * PUT /restful/v2/folders/{folder_name}/nameservers
 * @see https://www.dynadot.com/domain/api-document#folder_set_nameserver
 * @param {Object} input
 * @param {string|number} input.folder_name
 * @param {Array} input.nameserver_list
 * @param {boolean} [input.apply_for_future_domain]
 * @param {boolean} [input.sync_setting_to_existing_domains_in_this_folder]
 * @returns {Promise<Object>}
 */
async function folderSetNameserver(input) {
  return dynadotRest({
    method: "PUT",
    path: "/folders/{folder_name}/nameservers",
    fields: [
      { name: "folder_name", in: "path", required: true, type: "path" },
      { name: "nameserver_list", in: "body", required: true, type: "list", item: "string" },
      { name: "apply_for_future_domain", in: "body", type: "boolean" },
      { name: "sync_setting_to_existing_domains_in_this_folder", in: "body", type: "boolean" },
    ]
  }, input);
}
