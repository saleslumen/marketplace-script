/**
 * @description Register domains and poll each Spaceship async operation to success/failure before listing as registered.
 * Prefer ensureDomainsOwned for retry-safe full-set ownership.
 * @param {Object} input
 * @param {string|string[]} input.domains
 * @param {Object} [input.contacts]
 * @returns {Object}
 */
async function registerDomains(input) {
  const domains = asCsvList(input && input.domains);
  if (!domains.length) throw new Error("SPACESHIP_REQUEST_FAILED: domains is required");
  const contacts = (input && input.contacts) || {};
  const operations = [];
  const registered = [];
  const failed = [];
  const pending = [];
  for (const domain of domains) {
    const raw = await spaceshipRequestRaw(`/domains/${encodeURIComponent(domain)}`, "POST", { contacts });
    if (raw.status === 202 || raw.operationId) {
      const polled = await pollAsyncOperation(raw.operationId);
      operations.push({ domain, operationId: polled.operationId, status: polled.status, detail: polled.detail });
      if (polled.status === "success") registered.push(domain);
      else if (polled.status === "pending") pending.push(domain);
      else failed.push({ domain, failure: polled.failure });
      continue;
    }
    if (raw.status >= 200 && raw.status < 300) {
      operations.push({ domain, status: "success", detail: raw.body });
      registered.push(domain);
      continue;
    }
    failed.push({ domain, failure: `register failed (${raw.status}): ${raw.text}` });
    operations.push({ domain, status: "failed", detail: raw.body });
  }
  const ok = failed.length === 0 && pending.length === 0 && registered.length === domains.length;
  return {
    ok,
    outcome: ok ? "REGISTERED" : pending.length ? "REGISTRATION_PENDING" : "REGISTRATION_FAILED",
    registered,
    pending,
    failed,
    operations,
    failure: ok ? "" : `registered=${registered.length} pending=${pending.length} failed=${failed.length}`,
  };
}
