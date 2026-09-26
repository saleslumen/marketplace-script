/**
 * @description Get the authenticated user. GET /v0/meta/whoami. email is present when the token has user.email:read. scopes are present for OAuth tokens.
 * @param {Object} [input]
 * @returns {Object} id, and email or scopes when Airtable includes them
 * @throws {Error} AIRTABLE_INVALID_INPUT when input is not an object
 * @throws {Error} AIRTABLE_REQUEST_FAILED: <status> <message> when Airtable rejects the request
 */
async function getUserInfo(input) {
  if (input !== undefined && input !== null) requireObjectInput(input);
  return airtableRequest("/meta/whoami", "GET");
}
