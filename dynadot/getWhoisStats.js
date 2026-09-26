/**
 * GET /restful/v2/aftermarket/whois_stats
 * @see https://www.dynadot.com/domain/api-document#get_whois_stats
 * @param {Object} input
 * @param {string} input.domain_name
 * @param {string} input.date_type
 * @returns {Promise<Object>}
 */
async function getWhoisStats(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/whois_stats",
    fields: [
      { name: "domain_name", in: "query", required: true, type: "string" },
      { name: "date_type", in: "query", required: true, type: "string" },
    ]
  }, input);
}
