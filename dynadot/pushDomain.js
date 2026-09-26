/**
 * POST /restful/v2/domains/{domain_name}/push
 * @see https://www.dynadot.com/domain/api-document#push
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.receiver_push_username
 * @param {string} [input.receiver_email]
 * @returns {Promise<Object>}
 */
async function pushDomain(input) {
  return dynadotRest({
    method: "POST",
    path: "/domains/{domain_name}/push",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "receiver_push_username", in: "body", required: true, type: "string" },
      { name: "receiver_email", in: "body", type: "string" },
    ]
  }, input);
}
