/**
 * PUT /restful/v2/domains/{domain_name}/folders/{folder_name}
 * @see https://www.dynadot.com/domain/api-document#set_folder
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string|number} input.folder_name
 * @returns {Promise<Object>}
 */
async function setFolder(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/folders/{folder_name}",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "folder_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
