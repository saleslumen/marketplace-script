/**
 * @description Permanently delete one email account and its warmup history.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @returns {Object}
 */
async function deleteEmailAccount(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = accountIdFrom(req);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw(`/email-accounts/${encodeURIComponent(emailAccountId)}`, "DELETE"));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { emailAccountId });
  }
  if (classified.status === 404) {
    return { ok: false, outcome: "EMAIL_ACCOUNT_MISSING", retryable: false, emailAccountId, failure: classified.message || "Email account not found" };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "DELETE_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `Delete failed (${classified.status})`,
    };
  }
  return { ok: true, outcome: "DELETED", retryable: false, emailAccountId, failure: "" };
}
