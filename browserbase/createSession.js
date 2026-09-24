/**
 * @description Create a Browserbase session with managed proxies (optional country). Returns only the safe operator URL—never connectUrl or proxy secrets.
 * @param {Object} input
 * @param {string} [input.country] - ISO country for Browserbase geolocation (default US)
 * @param {string} [input.state] - Optional US state code
 * @param {string} [input.city] - Optional city (underscored, e.g. NEW_YORK)
 * @param {string} [input.projectId]
 * @param {string|number} [input.timeout]
 * @param {string} [input.sessionId] - When provided and still RUNNING/PENDING, reuse instead of creating
 * @returns {Object}
 * @property {string} sessionId
 * @property {string} operatorUrl
 * @property {string} status
 * @property {boolean} created
 * @property {boolean} reused
 */
async function createSession(input) {
  const req = input && typeof input === "object" ? input : {};
  const existingSessionId = asString(req.sessionId || req.browserbaseSessionId);
  if (existingSessionId) {
    const existing = await getSession({ sessionId: existingSessionId });
    if (existing.found && ["RUNNING", "PENDING"].includes(existing.status)) {
      return {
        sessionId: existing.sessionId,
        operatorUrl: existing.operatorUrl,
        status: existing.status,
        country: asString(req.country || req.proxyCountry || "US").toUpperCase() || "US",
        created: false,
        reused: true,
      };
    }
  }
  const country = asString(req.country || req.proxyCountry || req.geolocationCountry || "US").toUpperCase() || "US";
  const geolocation = { country };
  const state = asString(req.state || req.geolocationState).toUpperCase();
  const city = asString(req.city || req.geolocationCity).toUpperCase().replace(/\s+/g, "_");
  if (state) geolocation.state = state;
  if (city) geolocation.city = city;
  const body = {
    proxies: [{ type: "browserbase", geolocation }],
  };
  const projectId = await getBrowserbaseProjectId(req.projectId);
  if (projectId) body.projectId = projectId;
  const timeout = Number(asString(req.timeout));
  if (Number.isFinite(timeout) && timeout >= 60) body.timeout = timeout;
  if (asString(req.region)) body.region = asString(req.region);
  const created = await browserbaseRequest("/v1/sessions", "POST", body);
  const sessionId = asString(created.id);
  if (!sessionId) throw new Error("BROWSERBASE_REQUEST_FAILED: session id missing");
  return {
    sessionId,
    operatorUrl: operatorSessionUrl(sessionId),
    status: asString(created.status) || "RUNNING",
    projectId: asString(created.projectId || projectId),
    country,
    created: true,
    reused: false,
  };
}
