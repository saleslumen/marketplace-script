/**
 * @description Download a completed contact list.
 * @param {Object} input
 * @returns {Object}
 */
async function downloadContactList(input) {
  const req = input && typeof input === "object" ? input : {};
  const contact_list_uuid = asString(firstPresent(req, ["contact_list_uuid", "contactListUuid", "uuid", "id"]));
  if (!contact_list_uuid) return missingInput("contact_list_uuid");
  let path = "/api/v1/contact-verification/download/{contact_list_uuid}";
  path = path.replace("{contact_list_uuid}", encodeURIComponent(contact_list_uuid));
  return runAuthed(path, "GET", undefined, "CONTACT_LIST_DOWNLOADED", "CONTACT_LIST_DOWNLOAD_FAILED");
}
