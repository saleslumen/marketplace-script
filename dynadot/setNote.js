/**
 * PUT /restful/v2/domains/{domain_name}/notes
 * @see https://www.dynadot.com/domain/api-document#set_note
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.note
 * @returns {Promise<Object>}
 */
async function setNote(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/notes",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "note", in: "body", required: true, type: "string" },
    ]
  }, input);
}
