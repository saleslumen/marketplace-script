/**
 * GET /restful/v2/folders
 * @see https://www.dynadot.com/domain/api-document#folder_list
 * @param {Object} [input]
 * @returns {Promise<Object>}
 */
async function folderList(input) {
  return dynadotRest({
    method: "GET",
    path: "/folders",
    fields: []
  }, input);
}
