/**
 * POST /restful/v2/aftermarket/other_registrar/verify
 * @see https://www.dynadot.com/domain/api-document#verify_other_registrar_domain
 * @param {Object} input
 * @param {Array} input.domain_name_list
 * @returns {Promise<Object>}
 */
async function verifyOtherRegistrarDomain(input) {
  return dynadotRest({
    method: "POST",
    path: "/aftermarket/other_registrar/verify",
    fields: [
      { name: "domain_name_list", in: "body", required: true, type: "list", item: "string" },
    ]
  }, input);
}
