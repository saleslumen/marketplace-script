/**
 * PUT /restful/v2/domains/{domain_name}/parking
 * @see https://www.dynadot.com/domain/api-document#set_parking
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {boolean} [input.with_ads]
 * @returns {Promise<Object>}
 */
async function setParking(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/parking",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "with_ads", in: "body", type: "boolean" },
    ]
  }, input);
}
