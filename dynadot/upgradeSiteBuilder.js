/**
 * POST /restful/v2/sitebuilders/{domain_name}/upgrade
 * @see https://www.dynadot.com/domain/api-document#upgrade_site_builder
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {boolean} [input.set_domain_dns]
 * @returns {Promise<Object>}
 */
async function upgradeSiteBuilder(input) {
  return dynadotRest({
    method: "POST",
    path: "/sitebuilders/{domain_name}/upgrade",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "set_domain_dns", in: "body", type: "boolean" },
    ]
  }, input);
}
