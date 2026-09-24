/**
 * @description Enrich one person with Apollo and return contact fields including email when available.
 * @param {Object} input - Match fields for Apollo people/match.
 * @param {string} [input.firstName] - Person first name.
 * @param {string} [input.lastName] - Person last name.
 * @param {string} [input.domain] - Company domain without protocol, for example acme.com.
 * @param {string} [input.linkedinUrl] - LinkedIn profile URL when known.
 * @param {string} [input.personId] - Apollo person id from searchPeople when known.
 * @returns {Object} Enriched person fields.
 * @property {string} id - Apollo person id, or an empty string.
 * @property {string} email - Work email when Apollo returns one, otherwise empty.
 * @property {string} emailStatus - Apollo email status, or an empty string.
 * @property {string} firstName - First name, or an empty string.
 * @property {string} lastName - Last name, or an empty string.
 * @property {string} name - Full name, or an empty string.
 * @property {string} title - Job title, or an empty string.
 * @property {string} linkedinUrl - LinkedIn URL, or an empty string.
 * @property {string} company - Company name, or an empty string.
 * @property {string} website - Company website or primary domain, or an empty string.
 * @property {string} city - City, or an empty string.
 * @property {string} state - State, or an empty string.
 * @property {string} country - Country, or an empty string.
 * @throws {APOLLO_API_KEY_MISSING} When no Apollo API key is stored.
 * @throws {APOLLO_REQUEST_FAILED} When Apollo rejects or cannot complete the request.
 */
async function enrichPerson(input) {
  const req = input && typeof input === "object" ? input : {};
  const body = {};
  if (asString(req.personId)) body.id = asString(req.personId);
  if (asString(req.firstName)) body.first_name = asString(req.firstName);
  if (asString(req.lastName)) body.last_name = asString(req.lastName);
  if (asString(req.domain)) {
    body.domain = asString(req.domain).replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
  if (asString(req.linkedinUrl)) body.linkedin_url = asString(req.linkedinUrl);
  if (!body.id && !body.linkedin_url && !(body.first_name && body.domain)) {
    throw new Error("APOLLO_REQUEST_FAILED: provide personId, linkedinUrl, or firstName with domain");
  }
  const response = await apolloRequest("/people/match", "POST", body);
  return personResult(response.person || {});
}
