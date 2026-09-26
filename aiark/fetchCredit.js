/**
 * @description Read the remaining credit balance. GET /v1/payments/credits.
 * @param {Object} [input]
 * @returns {Object} AI Ark response body
 * @throws {Error} AIARK_INVALID_INPUT when input is not an object
 * @throws {Error} AIARK_REQUEST_FAILED: <status> <message> when AI Ark rejects the request
 */
async function fetchCredit(input) {
  if (input !== undefined && input !== null) requireObjectInput(input);
  return aiarkRequest("/v1/payments/credits", "GET");
}
