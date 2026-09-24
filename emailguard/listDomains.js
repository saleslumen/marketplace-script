/**
 * @description List domains for the authenticated user.
 * @returns {Object}
 */
async function listDomains() {
  return runAuthed("/api/v1/domains", "GET", undefined, "DOMAINS", "DOMAINS_FAILED");
}
