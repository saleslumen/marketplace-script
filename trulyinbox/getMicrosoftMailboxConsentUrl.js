/**
 * @description Get a single-use Microsoft mailbox OAuth consent URL. email is required and must match the Microsoft account that consents. Link expires in 30 minutes.
 * @param {Object} input
 * @param {string} input.email
 * @returns {Object}
 */
async function getMicrosoftMailboxConsentUrl(input) {
  const req = input && typeof input === "object" ? input : {};
  const email = asString(req.email || req.fromEmail).toLowerCase();
  if (!email) {
    return { ok: false, outcome: "MISSING_EMAIL", retryable: false, failure: "email is required" };
  }
  const query = buildQuery({ email });
  const classified = classifyHttp(await trulyinboxRequestRaw(`/email-accounts/microsoft/consent-url${query}`, "GET"));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { email });
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "CONSENT_URL_FAILED",
      retryable: false,
      email,
      failure: classified.message || `Microsoft mailbox consent URL failed (${classified.status})`,
    };
  }
  const url = asString(classified.body.url);
  if (!url) {
    return { ok: false, outcome: "CONSENT_URL_UNPROVEN", retryable: false, email, failure: "Consent URL response omitted url" };
  }
  return {
    ok: true,
    outcome: "CONSENT_URL",
    retryable: false,
    email,
    url,
    expiresAt: asString(classified.body.expiresAt),
    failure: "",
  };
}
