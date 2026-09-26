/**
 * GET /restful/v2/aftermarket/get_expired_closeout_domains
 * @see https://www.dynadot.com/domain/api-document#get_expired_closeout_domains
 * @param {Object} [input]
 * @param {string} [input.tld_type]
 * @param {string} [input.currency]
 * @param {number} [input.page]
 * @param {number} [input.page_size]
 * @returns {Promise<Object>}
 */
async function getExpiredCloseoutDomains(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/get_expired_closeout_domains",
    fields: [
      { name: "tld_type", in: "query", type: "string" },
      { name: "currency", in: "query", type: "string" },
      { name: "page", in: "query", type: "integer" },
      { name: "page_size", in: "query", type: "integer" },
    ]
  }, input);
}
