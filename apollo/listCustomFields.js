/**
 * @description Get a list of all custom fields. GET /typed_custom_fields. https://docs.apollo.io/reference/get-a-list-of-all-custom-fields
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function listCustomFields() {
  return apolloRequest("/typed_custom_fields", "GET");
}
