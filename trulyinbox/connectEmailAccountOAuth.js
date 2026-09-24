/**
 * @description Partner OAuth connect. Documented as coming soon: POST /v1/email-accounts/oauth with no body, currently 501 not_implemented. No success fields are documented.
 * @returns {Object}
 */
async function connectEmailAccountOAuth() {
  const classified = classifyHttp(await trulyinboxRequestRaw("/email-accounts/oauth", "POST"));
  if (classified.status === 501) {
    return {
      ok: false,
      outcome: "NOT_IMPLEMENTED",
      retryable: false,
      failure: classified.message || "OAuth connect is not implemented",
    };
  }
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified);
  }
  if (classified.status >= 200 && classified.status < 300) {
    return {
      ok: false,
      outcome: "OAUTH_UNPROVEN",
      retryable: false,
      failure: "OAuth connect 2xx has no documented response fields",
    };
  }
  return {
    ok: false,
    outcome: "OAUTH_CONNECT_FAILED",
    retryable: false,
    failure: classified.message || `OAuth connect failed (${classified.status})`,
  };
}
