/**
 * POST /restful/v2/email_hosting
 * @see https://www.dynadot.com/domain/api-document#create_email_hosting
 * @param {Object} input
 * @param {string} input.domain_name
 * @param {string} input.email_name
 * @param {string} input.username
 * @param {string} input.password
 * @param {boolean} [input.advanced_plan]
 * @returns {Promise<Object>}
 */
async function createEmailHosting(input) {
  return dynadotRest({
    method: "POST",
    path: "/email_hosting",
    fields: [
      { name: "domain_name", in: "body", required: true, type: "string" },
      { name: "email_name", in: "body", required: true, type: "string" },
      { name: "username", in: "body", required: true, type: "string" },
      { name: "password", in: "body", required: true, type: "string" },
      { name: "advanced_plan", in: "body", type: "boolean" },
    ]
  }, input);
}
