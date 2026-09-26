/**
 * POST /restful/v2/folders
 * @see https://www.dynadot.com/domain/api-document#folder_create
 * @param {Object} input
 * @param {string} input.folder_name
 * @returns {Promise<Object>}
 */
async function folderCreate(input) {
  return dynadotRest({
    method: "POST",
    path: "/folders",
    fields: [
      { name: "folder_name", in: "body", required: true, type: "string" },
    ]
  }, input);
}
