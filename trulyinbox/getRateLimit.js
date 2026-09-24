/**
 * @description Current rate-limit window from documented X-RateLimit-* headers. GET /v1/rate-limit does not consume quota. Vendor body keys are not copied.
 * @returns {Object}
 */
async function getRateLimit() {
  const classified = classifyHttp(await trulyinboxRequestRaw("/rate-limit", "GET"));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified, {
      limit: classified.rateLimitLimit,
      remaining: classified.rateLimitRemaining,
      reset: classified.rateLimitReset,
    });
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "RATE_LIMIT_FAILED",
      retryable: false,
      failure: classified.message || `Rate-limit status failed (${classified.status})`,
    };
  }
  return {
    ok: true,
    outcome: "RATE_LIMIT",
    retryable: false,
    failure: "",
    limit: classified.rateLimitLimit,
    remaining: classified.rateLimitRemaining,
    reset: classified.rateLimitReset,
  };
}
