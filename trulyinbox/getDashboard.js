/**
 * @description Account-wide warmup dashboard totals.
 * @returns {Object}
 */
async function getDashboard() {
  const classified = classifyHttp(await trulyinboxRequestRaw("/dashboard", "GET"));
  if (classified.status === 429 || classified.retryable) {
    return rateLimitedResult(classified);
  }
  if (classified.status < 200 || classified.status >= 300) {
    return {
      ok: false,
      outcome: "DASHBOARD_FAILED",
      retryable: false,
      failure: classified.message || `Dashboard failed (${classified.status})`,
    };
  }
  return {
    ok: true,
    outcome: "DASHBOARD",
    retryable: false,
    failure: "",
    totalAccounts: classified.body.totalAccounts,
    activeWarmups: classified.body.activeWarmups,
    pausedWarmups: classified.body.pausedWarmups,
    accountsWithErrors: classified.body.accountsWithErrors,
    avgSetupScore: classified.body.avgSetupScore,
  };
}
