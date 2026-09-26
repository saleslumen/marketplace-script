/**
 * @description Update a list. PATCH /labels/{id}. https://docs.apollo.io/reference/update-a-list
 * @param {Object} input
 * @param {string} input.id
 * @param {string} input.name
 * @param {boolean} [input.book_of_business]
 * @returns {Object} Apollo response body, including label.
 * @throws {Error} APOLLO_INVALID_INPUT when id or name is missing.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function updateLabel(input) {
  const req = requireObject(input);
  const id = requireString(req, "id");
  const body = { name: requireString(req, "name") };
  if (req.book_of_business !== undefined) body.book_of_business = checkValue("book_of_business", req.book_of_business, "boolean");
  return apolloRequest(`/labels/${encodeURIComponent(id)}`, "PATCH", body);
}
