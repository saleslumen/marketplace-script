/**
 * GET /restful/v2/aftermarket/other_registrar/{domain_name}/verification
 * @see https://www.dynadot.com/domain/api-document#other_registrar_domain_verification
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {boolean} [input.new_key]
 * @returns {Promise<Object>}
 */
async function otherRegistrarDomainVerification(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/other_registrar/{domain_name}/verification",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "new_key", in: "query", type: "boolean" },
    ]
  }, input);
}
