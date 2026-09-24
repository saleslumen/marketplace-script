const BROWSERBASE_API_BASE = "https://api.browserbase.com";
const CONNECTION_KEY = "browserbase";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const configValue = (key) => {
  const configuration = (ScriptContext && ScriptContext.configuration) || {};
  const value = configuration[key];
  return typeof value === "string" ? value.trim() : "";
};
const operatorSessionUrl = (sessionId) => `https://browserbase.com/sessions/${encodeURIComponent(sessionId)}`;
const getBrowserbaseApiKey = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const getBrowserbaseProjectId = async (inputProjectId) => {
  const fromInput = asString(inputProjectId);
  if (fromInput) return fromInput;
  return configValue("projectId");
};
const browserbaseRequest = async (path, method = "GET", body) => {
  const apiKey = await getBrowserbaseApiKey();
  const options = {
    method,
    headers: {
      "X-BB-API-Key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(`${BROWSERBASE_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`BROWSERBASE_REQUEST_FAILED (${status}): ${text}`);
  return text.trim() ? JSON.parse(text) : {};
};
