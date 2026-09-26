/**
 * PUT /restful/v2/domains/{domain_name}/clear_domain_setting
 * @see https://www.dynadot.com/domain/api-document#clear_domain_setting
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {string} input.service_type
 * @returns {Promise<Object>}
 */
async function clearDomainSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/clear_domain_setting",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "service_type", in: "body", required: true, type: "string" },
    ]
  }, input);
}
