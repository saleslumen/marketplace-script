/**
 * DELETE /restful/v2/folders/{folder_name}
 * @see https://www.dynadot.com/domain/api-document#folder_delete
 * @param {Object} input
 * @param {string|number} input.folder_name
 * @returns {Promise<Object>}
 */
async function folderDelete(input) {
  return dynadotRest({
    method: "DELETE",
    path: "/folders/{folder_name}",
    fields: [
      { name: "folder_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
