/**
 * PUT /restful/v2/domains/{domain_name}/contacts
 * @see https://www.dynadot.com/domain/api-document#set_contacts
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {number} input.registrant_contact_id
 * @param {number} input.admin_contact_id
 * @param {number} input.technical_contact_id
 * @param {number} input.billing_contact_id
 * @returns {Promise<Object>}
 */
async function setContacts(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/contacts",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "registrant_contact_id", in: "body", required: true, type: "integer" },
      { name: "admin_contact_id", in: "body", required: true, type: "integer" },
      { name: "technical_contact_id", in: "body", required: true, type: "integer" },
      { name: "billing_contact_id", in: "body", required: true, type: "integer" },
    ]
  }, input);
}
