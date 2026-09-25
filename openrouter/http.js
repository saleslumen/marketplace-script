const OPENROUTER_API_BASE = "https://openrouter.ai/api/v1";
const OPENROUTER_DECISIONS_URL = "https://openrouter.ai/api/alpha/decisions";
const CONNECTION_KEY = "openrouter";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const asNumber = (value, fallback) => {
  const text = asString(value);
  if (!text) return fallback;
  const number = Number(text);
  return Number.isFinite(number) ? number : fallback;
};
const assistantContent = (message) => {
  if (!message) return "";
  const value = message.content;
  if (Array.isArray(value)) {
    return value
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object") return asString(part.text);
        return "";
      })
      .join("");
  }
  return asString(value);
};
const getOpenRouterApiKey = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const openrouterRequestUrl = async (url, method, body) => {
  const apiKey = await getOpenRouterApiKey();
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(url, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`OPENROUTER_REQUEST_FAILED (${status}): ${text}`);
  const parsed = text.trim() ? JSON.parse(text) : {};
  if (parsed && parsed.error) {
    throw new Error(`OPENROUTER_REQUEST_FAILED: ${asString(parsed.error.message || parsed.error)}`);
  }
  return parsed;
};
const openrouterRequest = async (path, method, body) => openrouterRequestUrl(`${OPENROUTER_API_BASE}${path}`, method, body);
const openrouterDecisionsRequest = async (body) => openrouterRequestUrl(OPENROUTER_DECISIONS_URL, "POST", body);
