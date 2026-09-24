/**
 * @description List SURBL blacklist checks for domains.
 * @returns {Object}
 */
async function listSurblBlacklists() {
  return runAuthed("/api/v1/surbl-blacklist-checks/domains", "GET", undefined, "SURBL_BLACKLISTS", "SURBL_BLACKLISTS_FAILED");
}
