/**
 * @description Create a domain.
 * @param {Object} input
 * @returns {Object}
 */
async function createDomain(input) {
  const req = input && typeof input === "object" ? input : {};
  const name = asString(firstPresent(req, ["name"]));
  if (!name) return missingInput("name");
  const body = {};
  body.name = name;
  return runAuthed("/api/v1/domains", "POST", body, "DOMAIN_CREATED", "DOMAIN_CREATE_FAILED");
}
