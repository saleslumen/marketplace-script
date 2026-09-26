/**
 * @description List bases the token can access. GET /v0/meta/bases.
 * @param {Object} [input]
 * @param {string} [input.offset]
 * @returns {Object} bases, and offset when another page exists
 * @throws {Error} AIRTABLE_INVALID_INPUT when input is not an object
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function listBases(input) {
  const req = input === undefined || input === null ? {} : requireObjectInput(input);
  const offset = optionalText(req.offset, "offset");
  const path = offset ? `/meta/bases?offset=${encodeURIComponent(offset)}` : "/meta/bases";
  return airtableRequest(path, "GET");
}
