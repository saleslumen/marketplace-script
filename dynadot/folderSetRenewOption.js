/**
 * PUT /restful/v2/folders/{folder_name}/renew_option
 * @see https://www.dynadot.com/domain/api-document#folder_set_renew_option
 * @param {Object} input
 * @param {string|number} input.folder_name
 * @param {string} input.renew_option
 * @param {boolean} [input.apply_for_future_domain]
 * @param {boolean} [input.sync_setting_to_existing_domains_in_this_folder]
 * @returns {Promise<Object>}
 */
async function folderSetRenewOption(input) {
  return dynadotRest({
    method: "PUT",
    path: "/folders/{folder_name}/renew_option",
    fields: [
      { name: "folder_name", in: "path", required: true, type: "path" },
      { name: "renew_option", in: "body", required: true, type: "string" },
      { name: "apply_for_future_domain", in: "body", type: "boolean" },
      { name: "sync_setting_to_existing_domains_in_this_folder", in: "body", type: "boolean" },
    ]
  }, input);
}
