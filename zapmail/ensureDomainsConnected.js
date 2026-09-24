/**
 * @description Connect requested domains and prove Google mail DNS. NS must already be Zapmail CloudNS.
 * @param {Object} input
 * @param {string} input.workspaceId
 * @param {string|string[]} input.domains
 * @returns {Object}
 */
async function ensureDomainsConnected(input) {
  const req = input && typeof input === "object" ? input : {};
  const workspaceId = asString(req.workspaceId);
  const domains = asCsvList(req.domains || req.domainNames).map((domain) => domain.toLowerCase());
  if (!workspaceId) {
    return { ok: false, outcome: "MISSING_WORKSPACE", failure: "workspaceId is required", retryable: false };
  }
  if (!domains.length) {
    return { ok: false, outcome: "MISSING_DOMAINS", failure: "domains is required", retryable: false };
  }
  let connected;
  try {
    connected = await connectDomains({ workspaceId, domains });
  } catch (error) {
    return {
      ok: false,
      outcome: "CONNECT_FAILED",
      failure: asString(error && error.message) || "Zapmail connect-domain failed",
      retryable: isRetryableRequestError(error),
      nameServers: ZAPMAIL_CONNECT_NAMESERVERS.slice(),
    };
  }
  const failed = (connected.results || []).filter((row) => connectStatusClass(row.status) === "FAILED");
  if (failed.length) {
    return {
      ok: false,
      outcome: "CONNECT_TERMINAL",
      failure: failed.map((row) => `${row.domainName}:${row.status}`).join(", "),
      retryable: false,
      results: connected.results,
      nameServers: ZAPMAIL_CONNECT_NAMESERVERS.slice(),
    };
  }
  const pending = (connected.results || []).filter((row) => connectStatusClass(row.status) === "RETRY");
  if (pending.length) {
    return {
      ok: false,
      outcome: "CONNECT_PENDING",
      failure: pending.map((row) => `${row.domainName}:${row.status}`).join(", "),
      retryable: true,
      results: connected.results,
      nameServers: ZAPMAIL_CONNECT_NAMESERVERS.slice(),
    };
  }
  const unknown = (connected.results || []).filter((row) => connectStatusClass(row.status) === "UNKNOWN");
  if (unknown.length) {
    return {
      ok: false,
      outcome: "CONNECT_UNKNOWN",
      failure: unknown.map((row) => `${row.domainName}:${row.status || "MISSING"}`).join(", "),
      retryable: false,
      results: connected.results,
      nameServers: ZAPMAIL_CONNECT_NAMESERVERS.slice(),
    };
  }
  let listed;
  try {
    listed = await listDomains({ workspaceId });
  } catch (error) {
    return {
      ok: false,
      outcome: "LIST_DOMAINS_FAILED",
      failure: asString(error && error.message) || "Failed to list Zapmail domains",
      retryable: true,
      nameServers: ZAPMAIL_CONNECT_NAMESERVERS.slice(),
    };
  }
  const byName = new Map((listed.domains || []).map((domain) => [domain.domainName, domain]));
  const missing = domains.filter((domain) => !byName.has(domain));
  if (missing.length) {
    return {
      ok: false,
      outcome: "DOMAINS_NOT_LISTED",
      failure: `Zapmail has not listed: ${missing.join(", ")}`,
      retryable: true,
      nameServers: ZAPMAIL_CONNECT_NAMESERVERS.slice(),
    };
  }
  const domainIds = domains.map((domain) => byName.get(domain).domainId);
  let dns;
  try {
    dns = await checkDns({ workspaceId, domainIds });
  } catch (error) {
    return {
      ok: false,
      outcome: "DNS_CHECK_FAILED",
      failure: asString(error && error.message) || "Zapmail DNS check failed",
      retryable: true,
      nameServers: ZAPMAIL_CONNECT_NAMESERVERS.slice(),
    };
  }
  const checkedByName = new Map((dns.domains || []).map((row) => [row.domainName, row]));
  const missingCheck = domains.filter((domain) => !checkedByName.has(domain));
  if (missingCheck.length) {
    return {
      ok: false,
      outcome: "DNS_INCOMPLETE",
      failure: `DNS check missing rows for: ${missingCheck.join(", ")}`,
      retryable: true,
      domains: dns.domains,
      nameServers: ZAPMAIL_CONNECT_NAMESERVERS.slice(),
    };
  }
  const unhealthy = domains.map((domain) => checkedByName.get(domain)).filter((row) => row && !row.healthy);
  if (unhealthy.length) {
    return {
      ok: false,
      outcome: "DNS_UNHEALTHY",
      failure: unhealthy.map((row) => `${row.domainName} mx=${row.mx} spf=${row.spf} dkim=${row.dkim} dmarc=${row.dmarc}`).join("; "),
      retryable: true,
      domains: dns.domains,
      nameServers: ZAPMAIL_CONNECT_NAMESERVERS.slice(),
    };
  }
  return {
    ok: true,
    outcome: "DNS_HEALTHY",
    failure: "",
    retryable: false,
    domains: domains.map((domain) => checkedByName.get(domain)),
    nameServers: ZAPMAIL_CONNECT_NAMESERVERS.slice(),
  };
}
