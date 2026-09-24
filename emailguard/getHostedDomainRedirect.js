/**
 * @description Get one hosted domain redirect by id.
 * @param {Object} input
 * @returns {Object}
 */
async function getHostedDomainRedirect(input) {
  const req = input && typeof input === "object" ? input : {};
  const id = asString(firstPresent(req, ["id", "uuid"]));
  if (!id) return missingInput("id");
  let path = "/api/v1/hosted-domain-redirects/{id}";
  path = path.replace("{id}", encodeURIComponent(id));
  return runAuthed(path, "GET", undefined, "HOSTED_DOMAIN_REDIRECT", "HOSTED_DOMAIN_REDIRECT_FAILED");
}
