/**
 * PUT /restful/v2/accounts/default_parking
 * @see https://www.dynadot.com/domain/api-document#set_default_parking
 * @param {Object} [input]
 * @param {boolean} [input.with_ads]
 * @returns {Promise<Object>}
 */
async function setDefaultParking(input) {
  return dynadotRest({
    method: "PUT",
    path: "/accounts/default_parking",
    fields: [
      { name: "with_ads", in: "body", type: "boolean" },
    ]
  }, input);
}
