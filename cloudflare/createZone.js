/**
 * @description Create a zone. POST /zones. account and name are required. type is optional and is not defaulted.
 * @param {Object} input
 * @param {Object} input.account
 * @param {string} [input.account.id]
 * @param {string} input.name
 * @param {"full"|"partial"|"secondary"|"internal"} [input.type]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function createZone(input) {
  const req = inputObject(input);
  requiredObject(req, "account");
  requiredString(req, "name");
  return cloudflareRequest("/zones", "POST", { body: pick(req, ["account", "name", "type"]) });
}
