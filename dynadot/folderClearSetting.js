/**
 * PUT /restful/v2/folders/{folder_name}/clear_setting
 * @see https://www.dynadot.com/domain/api-document#folder_clear_setting
 * @param {Object} input
 * @param {string|number} input.folder_name
 * @param {string} input.service_type
 * @returns {Promise<Object>}
 */
async function folderClearSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/folders/{folder_name}/clear_setting",
    fields: [
      { name: "folder_name", in: "path", required: true, type: "path" },
      { name: "service_type", in: "body", required: true, type: "string" },
    ]
  }, input);
}
