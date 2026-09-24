/**
 * @description Look up the email host or corporate spam filter for an email address.
 * @param {Object} input
 * @returns {Object}
 */
async function lookupEmailHost(input) {
  const req = input && typeof input === "object" ? input : {};
  const email = asString(firstPresent(req, ["email"]));
  if (!email) return missingInput("email");
  const body = {};
  body.email = email;
  return runAuthed("/api/v1/email-host-lookup", "POST", body, "EMAIL_HOST", "EMAIL_HOST_FAILED");
}
