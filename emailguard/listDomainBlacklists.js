/**
 * @description List domain blacklist checks.
 * @returns {Object}
 */
async function listDomainBlacklists() {
  return runAuthed("/api/v1/blacklist-checks/domains", "GET", undefined, "DOMAIN_BLACKLISTS", "DOMAIN_BLACKLISTS_FAILED");
}
