/**
 * DELETE /restful/v2/contacts/{contact_id}
 * @see https://www.dynadot.com/domain/api-document#contact_delete
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @returns {Promise<Object>}
 */
async function deleteContact(input) {
  return dynadotRest({
    method: "DELETE",
    path: "/contacts/{contact_id}",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
    ]
  }, input);
}
