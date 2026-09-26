/**
 * PUT /restful/v2/contacts/{contact_id}
 * @see https://www.dynadot.com/domain/api-document#contact_update
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {Object} input.contact
 * @param {string} [input.contact.organization]
 * @param {string} input.contact.name
 * @param {string} input.contact.email
 * @param {string} input.contact.phone_number
 * @param {string} input.contact.phone_cc
 * @param {string} [input.contact.fax_number]
 * @param {string} [input.contact.fax_cc]
 * @param {string} input.contact.address1
 * @param {string} [input.contact.address2]
 * @param {string} input.contact.city
 * @param {string} [input.contact.state]
 * @param {string} input.contact.zip
 * @param {string} input.contact.country
 * @returns {Promise<Object>}
 */
async function updateContact(input) {
  return dynadotRest({
    method: "PUT",
    path: "/contacts/{contact_id}",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "contact", in: "body", required: true, type: "object", fields: [
        { name: "organization", type: "string" },
        { name: "name", required: true, type: "string" },
        { name: "email", required: true, type: "string" },
        { name: "phone_number", required: true, type: "string" },
        { name: "phone_cc", required: true, type: "string" },
        { name: "fax_number", type: "string" },
        { name: "fax_cc", type: "string" },
        { name: "address1", required: true, type: "string" },
        { name: "address2", type: "string" },
        { name: "city", required: true, type: "string" },
        { name: "state", type: "string" },
        { name: "zip", required: true, type: "string" },
        { name: "country", required: true, type: "string" },
      ] },
    ]
  }, input);
}
