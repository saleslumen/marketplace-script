/**
 * GET /restful/v2/domains/cnnic_privacy
 * @see https://www.dynadot.com/domain/api-document#list_cnnic_privacy
 * @param {Object} [input]
 * @param {string} [input.key_word]
 * @param {number} [input.page]
 * @param {number} [input.page_size]
 * @returns {Promise<Object>}
 */
async function listCnnicPrivacy(input) {
  return dynadotRest({
    method: "GET",
    path: "/domains/cnnic_privacy",
    fields: [
      { name: "key_word", in: "query", type: "string" },
      { name: "page", in: "query", type: "integer" },
      { name: "page_size", in: "query", type: "integer" },
    ]
  }, input);
}
