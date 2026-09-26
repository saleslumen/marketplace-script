/**
 * @description Create Contact Verification. POST /api/v1/contact-verification.
 * @param {Object} input
 * @param {string|Object} input.csv
 * @param {string} input.name
 * @returns {Object} EmailGuard response body
 * @throws {Error} EMAILGUARD_INVALID_INPUT: csv is required when csv is missing
 * @throws {Error} EMAILGUARD_INVALID_INPUT: name is required when name is missing
 * @throws {Error} EMAILGUARD_REQUEST_FAILED: <status> <message> when EmailGuard rejects the request
 */
async function createContactVerification(input) {
  const req = inputObject(input);
  const csv = csvPart(req.csv);
  if (!csv || !asString(csv.content)) invalid("csv is required");
  const body = {};
  body.csv = csv;
  body.name = requireText(req, "name");
  return emailguardRequest("/api/v1/contact-verification", "POST", body, { multipart: true });
}
