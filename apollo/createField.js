/**
 * @description Create a custom field. POST /fields. https://docs.apollo.io/reference/create-a-custom-field
 * @param {Object} input
 * @param {string} [input.label]
 * @param {string} [input.modality]
 * @param {string} [input.type]
 * @param {Object} [input.meta]
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when a required input is missing or a provided value has the wrong type.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function createField(input) {
  const req = requireObject(input);
  const body = pickFields(req, [["label", "string"], ["modality", "string"], ["type", "string"], ["meta", "object"]]);
  return apolloRequest("/fields", "POST", body);
}
