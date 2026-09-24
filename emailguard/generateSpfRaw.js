/**
 * @description Generate a raw SPF record from documented redirect and tag fields.
 * @param {Object} input
 * @returns {Object}
 */
async function generateSpfRaw(input) {
  const req = input && typeof input === "object" ? input : {};
  const redirectRaw = firstPresent(req, ["redirect"]);
  const redirect = redirectRaw === undefined ? undefined : asBoolean(redirectRaw, false);
  const redirect_url = asString(firstPresent(req, ["redirect_url", "redirectUrl"]));
  const failure_policy = asString(firstPresent(req, ["failure_policy", "failurePolicy"]));
  const tag = asString(firstPresent(req, ["tag"]));
  const value = asString(firstPresent(req, ["value"]));
  const body = {};
  if (redirect !== undefined) body.redirect = redirect;
  if (redirect_url) body.redirect_url = redirect_url;
  if (failure_policy) body.failure_policy = failure_policy;
  if (tag) body.tag = tag;
  if (value) body.value = value;
  return runAuthed("/api/v1/email-authentication/spf-raw-generator", "POST", body, "SPF_RAW", "SPF_RAW_FAILED");
}
