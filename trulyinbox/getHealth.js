/**
 * @description API health check. Requires the marketplace API key. HTTP 200 returns the script envelope only; undocumented body keys are not copied.
 * @returns {Object}
 */
async function getHealth() {
  const classified = classifyHttp(await trulyinboxRequestRaw("/health", "GET"));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified);
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "HEALTH_FAILED",
      retryable: false,
      failure: classified.message || `Health check failed (${classified.status})`,
    };
  }
  return { ok: true, outcome: "HEALTH", retryable: false, failure: "" };
}
