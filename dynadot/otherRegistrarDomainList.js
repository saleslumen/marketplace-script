/**
 * GET /restful/v2/aftermarket/other_registrar/domains
 * @see https://www.dynadot.com/domain/api-document#other_registrar_domain_list
 * @param {Object} [input]
 * @param {number} [input.page_size]
 * @param {number} [input.page]
 * @returns {Promise<Object>}
 */
async function otherRegistrarDomainList(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/other_registrar/domains",
    fields: [
      { name: "page_size", in: "query", type: "integer" },
      { name: "page", in: "query", type: "integer" },
    ]
  }, input);
}
