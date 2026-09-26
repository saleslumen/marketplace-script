/**
 * POST /restful/v2/email_hosting/{domain_name}/upgrade
 * @see https://www.dynadot.com/domain/api-document#upgrade_email_hosting
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} [input.domain_name]
 * @param {string} [input.currency]
 * @returns {Promise<Object>}
 */
async function upgradeEmailHosting(input) {
  return dynadotRest({
    method: "POST",
    path: "/email_hosting/{domain_name}/upgrade",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "domain_name", in: "body", type: "string" },
      { name: "currency", in: "body", type: "string" },
    ]
  }, input);
}
