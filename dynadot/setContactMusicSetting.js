/**
 * PUT /restful/v2/contacts/{contact_id}/set_music_setting
 * @see https://www.dynadot.com/domain/api-document#set_contact_music_setting
 * @param {Object} input
 * @param {string|number} input.contact_id
 * @param {Object} input.contact_extension
 * @param {boolean} input.contact_extension.music_nexus_attestation_accept
 * @param {string} input.contact_extension.tld
 * @returns {Promise<Object>}
 */
async function setContactMusicSetting(input) {
  return dynadotRest({
    method: "PUT",
    path: "/contacts/{contact_id}/set_music_setting",
    fields: [
      { name: "contact_id", in: "path", required: true, type: "path" },
      { name: "contact_extension", in: "body", required: true, type: "object", fields: [
        { name: "music_nexus_attestation_accept", required: true, type: "boolean" },
        { name: "tld", required: true, type: "string" },
      ] },
    ]
  }, input);
}
