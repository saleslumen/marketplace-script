/**
 * @description List contact verification lists.
 * @returns {Object}
 */
async function listContactLists() {
  return runAuthed("/api/v1/contact-verification", "GET", undefined, "CONTACT_LISTS", "CONTACT_LISTS_FAILED");
}
