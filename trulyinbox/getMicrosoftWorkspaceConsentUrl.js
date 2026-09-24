/**
 * @description Get the Microsoft admin-consent URL for tenant-wide bulk connect. Optional domain pins the tenant and may return tenantId.
 * @param {Object} input
 * @param {string} [input.domain]
 * @returns {Object}
 */
async function getMicrosoftWorkspaceConsentUrl(input) {
  const req = input && typeof input === "object" ? input : {};
  const domain = asString(req.domain);
  const query = buildQuery({ domain });
  const classified = classifyHttp(await trulyinboxRequestRaw(`/workspaces/microsoft/consent-url${query}`, "GET"));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, { domain });
  }
  if (classified.status === 422) {
    return {
      ok: false,
      outcome: "CONSENT_DOMAIN_INVALID",
      retryable: false,
      human: true,
      domain,
      failure: classified.message || "Supplied domain is not backed by a Microsoft tenant",
    };
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "CONSENT_URL_FAILED",
      retryable: false,
      domain,
      failure: classified.message || `Microsoft workspace consent URL failed (${classified.status})`,
    };
  }
  const url = asString(classified.body.url);
  if (!url) {
    return { ok: false, outcome: "CONSENT_URL_UNPROVEN", retryable: false, domain, failure: "Consent URL response omitted url" };
  }
  return {
    ok: true,
    outcome: "CONSENT_URL",
    retryable: false,
    domain,
    url,
    tenantId: asString(classified.body.tenantId),
    failure: "",
  };
}
