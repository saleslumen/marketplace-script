/**
 * POST /restful/v2/domains/{domain_name}/cnnic_privacy
 * @see https://www.dynadot.com/domain/api-document#create_cnnic_privacy
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.display_email
 * @param {number} input.duration
 * @returns {Promise<Object>}
 */
async function createCnnicPrivacy(input) {
  return dynadotRest({
    method: "POST",
    path: "/domains/{domain_name}/cnnic_privacy",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "display_email", in: "body", required: true, type: "string" },
      { name: "duration", in: "body", required: true, type: "integer" },
    ]
  }, input);
}
