/**
 * PUT /restful/v2/folders/{folder_name}/name
 * @see https://www.dynadot.com/domain/api-document#folder_set_name
 * @param {Object} input
 * @param {string|number} input.folder_name
 * @param {string} input.new_folder_name
 * @returns {Promise<Object>}
 */
async function folderSetName(input) {
  return dynadotRest({
    method: "PUT",
    path: "/folders/{folder_name}/name",
    fields: [
      { name: "folder_name", in: "path", required: true, type: "path" },
      { name: "new_folder_name", in: "body", required: true, type: "string" },
    ]
  }, input);
}
