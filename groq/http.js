const GROQ_API_BASE = "https://api.groq.com/openai/v1";
const CONNECTION_KEY = "groq";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const asNumber = (value, fallback) => {
  const text = asString(value);
  if (!text) return fallback;
  const number = Number(text);
  return Number.isFinite(number) ? number : fallback;
};
const getGroqApiKey = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const groqRequest = async (path, method, body) => {
  const apiKey = await getGroqApiKey();
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(`${GROQ_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`GROQ_REQUEST_FAILED (${status}): ${text}`);
  return text.trim() ? JSON.parse(text) : {};
};
