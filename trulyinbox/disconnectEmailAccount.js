/**
 * @description Temporarily disconnect an email account without deleting it. Preserves configuration and history. 409 is already disconnected.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @returns {Object}
 */
async function disconnectEmailAccount(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = accountIdFrom(req);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw(`/email-accounts/${encodeURIComponent(emailAccountId)}/disconnect`, "POST"));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { emailAccountId });
  }
  if (classified.status === 404) {
    return { ok: false, outcome: "EMAIL_ACCOUNT_MISSING", retryable: false, emailAccountId, failure: classified.message || "Email account not found" };
  }
  if (classified.status === 409) {
    return {
      ok: true,
      outcome: "ALREADY_DISCONNECTED",
      retryable: false,
      emailAccountId,
      status: "disconnected",
      failure: "",
    };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "DISCONNECT_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `Disconnect failed (${classified.status})`,
    };
  }
  return {
    ok: true,
    outcome: "DISCONNECTED",
    retryable: false,
    emailAccountId: asString(classified.body.emailAccountId || emailAccountId),
    status: asString(classified.body.status || "disconnected").toLowerCase(),
    failure: "",
  };
}
