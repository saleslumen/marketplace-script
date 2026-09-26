/**
 * POST /restful/v2/domains/{domain_name}/register
 * @see https://www.dynadot.com/domain/api-document#register
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {Object} input.domain
 * @param {number} input.domain.duration
 * @param {string} [input.domain.auth_code]
 * @param {number} [input.domain.registrant_contact_id]
 * @param {number} [input.domain.admin_contact_id]
 * @param {number} [input.domain.tech_contact_id]
 * @param {number} [input.domain.billing_contact_id]
 * @param {Object} [input.domain.registrant_contact]
 * @param {string} [input.domain.registrant_contact.organization]
 * @param {string} [input.domain.registrant_contact.name]
 * @param {string} [input.domain.registrant_contact.email]
 * @param {string} [input.domain.registrant_contact.phone_number]
 * @param {string} [input.domain.registrant_contact.phone_cc]
 * @param {string} [input.domain.registrant_contact.fax_number]
 * @param {string} [input.domain.registrant_contact.fax_cc]
 * @param {string} [input.domain.registrant_contact.address1]
 * @param {string} [input.domain.registrant_contact.address2]
 * @param {string} [input.domain.registrant_contact.city]
 * @param {string} [input.domain.registrant_contact.state]
 * @param {string} [input.domain.registrant_contact.zip]
 * @param {string} [input.domain.registrant_contact.country]
 * @param {Object} [input.domain.admin_contact]
 * @param {string} [input.domain.admin_contact.organization]
 * @param {string} [input.domain.admin_contact.name]
 * @param {string} [input.domain.admin_contact.email]
 * @param {string} [input.domain.admin_contact.phone_number]
 * @param {string} [input.domain.admin_contact.phone_cc]
 * @param {string} [input.domain.admin_contact.fax_number]
 * @param {string} [input.domain.admin_contact.fax_cc]
 * @param {string} [input.domain.admin_contact.address1]
 * @param {string} [input.domain.admin_contact.address2]
 * @param {string} [input.domain.admin_contact.city]
 * @param {string} [input.domain.admin_contact.state]
 * @param {string} [input.domain.admin_contact.zip]
 * @param {string} [input.domain.admin_contact.country]
 * @param {Object} [input.domain.tech_contact]
 * @param {string} [input.domain.tech_contact.organization]
 * @param {string} [input.domain.tech_contact.name]
 * @param {string} [input.domain.tech_contact.email]
 * @param {string} [input.domain.tech_contact.phone_number]
 * @param {string} [input.domain.tech_contact.phone_cc]
 * @param {string} [input.domain.tech_contact.fax_number]
 * @param {string} [input.domain.tech_contact.fax_cc]
 * @param {string} [input.domain.tech_contact.address1]
 * @param {string} [input.domain.tech_contact.address2]
 * @param {string} [input.domain.tech_contact.city]
 * @param {string} [input.domain.tech_contact.state]
 * @param {string} [input.domain.tech_contact.zip]
 * @param {string} [input.domain.tech_contact.country]
 * @param {Object} [input.domain.billing_contact]
 * @param {string} [input.domain.billing_contact.organization]
 * @param {string} [input.domain.billing_contact.name]
 * @param {string} [input.domain.billing_contact.email]
 * @param {string} [input.domain.billing_contact.phone_number]
 * @param {string} [input.domain.billing_contact.phone_cc]
 * @param {string} [input.domain.billing_contact.fax_number]
 * @param {string} [input.domain.billing_contact.fax_cc]
 * @param {string} [input.domain.billing_contact.address1]
 * @param {string} [input.domain.billing_contact.address2]
 * @param {string} [input.domain.billing_contact.city]
 * @param {string} [input.domain.billing_contact.state]
 * @param {string} [input.domain.billing_contact.zip]
 * @param {string} [input.domain.billing_contact.country]
 * @param {number} [input.domain.customer_id]
 * @param {Array} [input.domain.name_server_list]
 * @param {string} input.domain.privacy
 * @param {string} [input.currency]
 * @param {boolean} [input.register_premium]
 * @param {string} [input.coupon_code]
 * @returns {Promise<Object>}
 */
async function registerDomain(input) {
  return dynadotRest({
    method: "POST",
    path: "/domains/{domain_name}/register",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "domain", in: "body", required: true, type: "object", fields: [
        { name: "duration", required: true, type: "integer" },
        { name: "auth_code", type: "string" },
        { name: "registrant_contact_id", type: "integer" },
        { name: "admin_contact_id", type: "integer" },
        { name: "tech_contact_id", type: "integer" },
        { name: "billing_contact_id", type: "integer" },
        { name: "registrant_contact", type: "object", fields: [
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
        { name: "admin_contact", type: "object", fields: [
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
        { name: "tech_contact", type: "object", fields: [
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
        { name: "billing_contact", type: "object", fields: [
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
        { name: "customer_id", type: "integer" },
        { name: "name_server_list", type: "list", item: "string" },
        { name: "privacy", required: true, type: "string" },
      ] },
      { name: "currency", in: "body", type: "string" },
      { name: "register_premium", in: "body", type: "boolean" },
      { name: "coupon_code", in: "body", type: "string" },
    ]
  }, input);
}
