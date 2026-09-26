/**
 * PUT /restful/v2/contacts/{contact_id}/set_it_setting
 * @see https://www.dynadot.com/domain/api-document#set_contact_it_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {Object} input.contact_extension
 * @param {string} input.contact_extension.country_of_citizenship
 * @param {string} input.contact_extension.codice_doc_number
 * @param {string} input.contact_extension.tld
 * @returns {Promise<Object>}
 */
async function setContactItSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/contacts/{contact_id}/set_it_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "contact_extension", in: "body", required: true, type: "object", fields: [
        { name: "country_of_citizenship", required: true, type: "string" },
        { name: "codice_doc_number", required: true, type: "string" },
        { name: "tld", required: true, type: "string" },
      ] },
    ]
  }, input);
}
