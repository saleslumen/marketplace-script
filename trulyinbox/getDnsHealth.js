/**
 * @description Live DNS health check for SPF, DKIM, DMARC, and MX.
 * @param {Object} input
 * @param {string} input.emailAccountId
 * @returns {Object}
 */
async function getDnsHealth(input) {
  const req = input && typeof input === "object" ? input : {};
  const emailAccountId = accountIdFrom(req);
  if (!emailAccountId) {
    return { ok: false, outcome: "MISSING_EMAIL_ACCOUNT", retryable: false, failure: "emailAccountId is required" };
  }
  const classified = classifyHttp(await trulyinboxRequestRaw(`/dns-health/${encodeURIComponent(emailAccountId)}`, "GET"));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { emailAccountId });
  }
  if (classified.status === 404) {
    return { ok: false, outcome: "DNS_HEALTH_MISSING", retryable: false, emailAccountId, failure: classified.message || "DNS health not found" };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "DNS_HEALTH_FAILED",
      retryable: false,
      emailAccountId,
      failure: classified.message || `DNS health failed (${classified.status})`,
    };
  }
  return { ok: true, outcome: "DNS_HEALTH", retryable: false, failure: "", ...mapDnsHealth(classified.body) };
}
