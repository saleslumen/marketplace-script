/**
 * PUT /restful/v2/folders/{folder_name}/parking
 * @see https://www.dynadot.com/domain/api-document#folder_set_parking
 * @param {Object} input
 * @param {string|number} input.folder_name
 * @param {boolean} [input.with_ads]
 * @param {boolean} [input.apply_for_future_domain]
 * @param {boolean} [input.sync_setting_to_existing_domains_in_this_folder]
 * @returns {Promise<Object>}
 */
async function folderSetParking(input) {
  return dynadotRest({
    method: "PUT",
    path: "/folders/{folder_name}/parking",
    fields: [
      { name: "folder_name", in: "path", required: true, type: "path" },
      { name: "with_ads", in: "body", type: "boolean" },
      { name: "apply_for_future_domain", in: "body", type: "boolean" },
      { name: "sync_setting_to_existing_domains_in_this_folder", in: "body", type: "boolean" },
    ]
  }, input);
}
