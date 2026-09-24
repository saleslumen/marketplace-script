/**
 * @description Get one contact list by uuid.
 * @param {Object} input
 * @returns {Object}
 */
async function getContactList(input) {
  const req = input && typeof input === "object" ? input : {};
  const contact_list_uuid = asString(firstPresent(req, ["contact_list_uuid", "contactListUuid", "uuid", "id"]));
  if (!contact_list_uuid) return missingInput("contact_list_uuid");
  let path = "/api/v1/contact-verification/show/{contact_list_uuid}";
  path = path.replace("{contact_list_uuid}", encodeURIComponent(contact_list_uuid));
  return runAuthed(path, "GET", undefined, "CONTACT_LIST", "CONTACT_LIST_FAILED");
}
