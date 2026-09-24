const CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4";
const CONNECTION_KEY = "cloudflare";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const asCsvList = (value) => {
  if (Array.isArray(value)) return value.map(asString).filter(Boolean);
  return asString(value).split(",").map((item) => item.trim()).filter(Boolean);
};
const getCloudflareApiToken = async (accountId) => {
  const id = asString(accountId);
  if (!id) throw new Error("CLOUDFLARE_ACCOUNT_ID_MISSING: accountId is required");
  return ConnectionApp.getApiKey(CONNECTION_KEY);
};
const cloudflareRequest = async (path, method = "GET", body, accountId) => {
  const token = await getCloudflareApiToken(accountId);
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(`${CLOUDFLARE_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  const parsed = text.trim() ? JSON.parse(text) : {};
  if (status < 200 || status >= 300 || parsed.success === false) {
    const errors = Array.isArray(parsed.errors) ? JSON.stringify(parsed.errors) : text;
    throw new Error(`CLOUDFLARE_REQUEST_FAILED (${status}): ${errors}`);
  }
  return parsed.result !== undefined ? parsed.result : parsed;
};
const normalizeDnsHost = (host, zoneName) => {
  const raw = asString(host);
  const zone = asString(zoneName).toLowerCase();
  if (!raw || raw === "@") return zone;
  const lower = raw.toLowerCase();
  if (zone && (lower === zone || lower.endsWith(`.${zone}`))) return lower;
  if (zone && !lower.includes(".")) return `${lower}.${zone}`;
  return lower;
};
const mapZone = (result, fallbackName) => ({
  domain: asString(result.name || fallbackName),
  zoneId: asString(result.id),
  nameServers: Array.isArray(result.name_servers) ? result.name_servers.map(asString).filter(Boolean) : [],
  status: asString(result.status),
  existing: false,
});
const findExistingZone = async (name, accountId) => {
  const query = `/zones?name=${encodeURIComponent(name)}&account.id=${encodeURIComponent(accountId)}&per_page=50`;
  const result = await cloudflareRequest(query, "GET", undefined, accountId);
  const zones = Array.isArray(result) ? result : [];
  const exact = zones.find((zone) => asString(zone.name).toLowerCase() === name.toLowerCase());
  return exact || null;
};
