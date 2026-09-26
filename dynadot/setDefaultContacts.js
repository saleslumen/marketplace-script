/**
 * PUT /restful/v2/accounts/default_contacts
 * @see https://www.dynadot.com/domain/api-document#set_default_contacts
 * @param {Object} input
 * @param {number} input.registrant_contact_id
 * @param {number} input.admin_contact_id
 * @param {number} input.technical_contact_id
 * @param {number} input.billing_contact_id
 * @returns {Promise<Object>}
 */
async function setDefaultContacts(input) {
  return dynadotRest({
    method: "PUT",
    path: "/accounts/default_contacts",
    fields: [
      { name: "registrant_contact_id", in: "body", required: true, type: "integer" },
      { name: "admin_contact_id", in: "body", required: true, type: "integer" },
      { name: "technical_contact_id", in: "body", required: true, type: "integer" },
      { name: "billing_contact_id", in: "body", required: true, type: "integer" },
    ]
  }, input);
}
