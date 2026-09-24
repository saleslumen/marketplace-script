/**
 * @description Create a SURBL blacklist check for a domain.
 * @param {Object} input
 * @returns {Object}
 */
async function createSurblBlacklistCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(firstPresent(req, ["domain"]));
  if (!domain) return missingInput("domain");
  const body = {};
  body.domain = domain;
  return runAuthed("/api/v1/surbl-blacklist-checks", "POST", body, "SURBL_BLACKLIST_CHECK_CREATED", "SURBL_BLACKLIST_CHECK_CREATE_FAILED");
}
