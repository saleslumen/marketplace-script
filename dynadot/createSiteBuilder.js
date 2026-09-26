/**
 * POST /restful/v2/sitebuilders/{domain_name}
 * @see https://www.dynadot.com/domain/api-document#create_site_builder
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {boolean} [input.set_domain_dns]
 * @returns {Promise<Object>}
 */
async function createSiteBuilder(input) {
  return dynadotRest({
    method: "POST",
    path: "/sitebuilders/{domain_name}",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "set_domain_dns", in: "body", type: "boolean" },
    ]
  }, input);
}
