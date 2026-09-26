/**
 * @description Update a custom field. PATCH /fields. https://docs.apollo.io/reference/update-a-custom-field
 * @param {Object} input
 * @param {Object[]} input.fields One field. id is required.
 * @returns {Object} Apollo response body.
 * @throws {Error} APOLLO_INVALID_INPUT when fields does not contain exactly one object with id.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function updateFields(input) {
  const req = requireObject(input);
  const fields = requireIdObjects(req.fields, "fields", 1);
  return apolloRequest("/fields", "PATCH", { fields });
}
