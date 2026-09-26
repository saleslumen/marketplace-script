/**
 * GET /restful/v2/sitebuilders/{domain_name}
 * @see https://www.dynadot.com/domain/api-document#get_site_builder
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function getSiteBuilder(input) {
  return dynadotRest({
    method: "GET",
    path: "/sitebuilders/{domain_name}",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
