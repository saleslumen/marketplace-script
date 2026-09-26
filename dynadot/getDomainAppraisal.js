/**
 * GET /restful/v2/domains/{domain_name}/appraisal
 * @see https://www.dynadot.com/domain/api-document#domain_appraisal
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @returns {Promise<Object>}
 */
async function getDomainAppraisal(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/{domain_name}/appraisal",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
    ]
  }, input);
}
