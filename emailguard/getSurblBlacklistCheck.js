/**
 * @description Get one SURBL blacklist check.
 * @param {Object} input
 * @returns {Object}
 */
async function getSurblBlacklistCheck(input) {
  const req = input && typeof input === "object" ? input : {};
  const surblBlacklistCheck_uuid = asString(firstPresent(req, ["surblBlacklistCheck_uuid", "surblBlacklistCheckUuid", "uuid", "id"]));
  if (!surblBlacklistCheck_uuid) return missingInput("surblBlacklistCheck_uuid");
  let path = "/api/v1/surbl-blacklist-checks/{surblBlacklistCheck_uuid}";
  path = path.replace("{surblBlacklistCheck_uuid}", encodeURIComponent(surblBlacklistCheck_uuid));
  return runAuthed(path, "GET", undefined, "SURBL_BLACKLIST_CHECK", "SURBL_BLACKLIST_CHECK_FAILED");
}
