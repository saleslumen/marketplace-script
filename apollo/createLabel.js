/**
 * @description Create a list. POST /labels. https://docs.apollo.io/reference/create-a-list
 * @param {Object} input
 * @param {string} input.name
 * @param {"contacts"|"accounts"} input.modality
 * @param {boolean} [input.book_of_business]
 * @returns {Object} Apollo response body, including label.
 * @throws {Error} APOLLO_INVALID_INPUT when name or modality is missing, or modality is not contacts or accounts.
 * @throws {Error} APOLLO_REQUEST_FAILED: <status> <message> when Apollo returns a non-2xx response.
 */
async function createLabel(input) {
  const req = requireObject(input);
  const body = { name: requireString(req, "name"), modality: requireModality(req) };
  if (req.book_of_business !== undefined) body.book_of_business = checkValue("book_of_business", req.book_of_business, "boolean");
  return apolloRequest("/labels", "POST", body);
}
