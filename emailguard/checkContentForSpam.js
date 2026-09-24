/**
 * @description Check content for spam and return the documented spam score and words.
 * @param {Object} input
 * @returns {Object}
 */
async function checkContentForSpam(input) {
  const req = input && typeof input === "object" ? input : {};
  const content = asString(firstPresent(req, ["content"]));
  if (!content) return missingInput("content");
  const body = {};
  body.content = content;
  return runAuthed("/api/v1/content-spam-check", "POST", body, "CONTENT_SPAM_CHECKED", "CONTENT_SPAM_CHECK_FAILED");
}
