/**
 * @description Generate a raw DKIM record.
 * @param {Object} input
 * @returns {Object}
 */
async function generateDkimRaw(input) {
  const req = input && typeof input === "object" ? input : {};
  const keyLengthRaw = firstPresent(req, ["keyLength", "key_length"]);
  const keyLength = asNumber(keyLengthRaw, NaN);
  if (!Number.isFinite(keyLength)) return missingInput("keyLength");
  const body = {};
  body.keyLength = keyLength;
  return runAuthed("/api/v1/email-authentication/dkim-raw-generator", "POST", body, "DKIM_RAW", "DKIM_RAW_FAILED");
}
