/**
 * GET /restful/v2/sitebuilders
 * @see https://www.dynadot.com/domain/api-document#list_site_builder
 * @param {Object} [input]
 * @returns {Promise<Object>}
 */
async function listSiteBuilder(input) {
  return dynadotRest({
    method: "GET",
    path: "/sitebuilders",
    fields: []
  }, input);
}
