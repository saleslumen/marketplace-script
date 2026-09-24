const LINEAR_API_BASE = "https://api.linear.app/graphql";
const CONNECTION_KEY = "linear";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const configValue = (key) => {
  const configuration = (ScriptContext && ScriptContext.configuration) || {};
  const value = configuration[key];
  return typeof value === "string" ? value.trim() : "";
};
const getLinearApiKey = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const configuredLinearTeamId = () => configValue("teamId");
const linearGraphql = async (query, variables) => {
  const apiKey = await getLinearApiKey();
  const response = await UrlFetchApp.fetch(LINEAR_API_BASE, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    payload: JSON.stringify({ query, variables: variables || {} }),
  });
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`LINEAR_REQUEST_FAILED (${status}): ${text}`);
  const parsed = JSON.parse(text);
  if (parsed.errors && parsed.errors.length) {
    throw new Error(`LINEAR_REQUEST_FAILED: ${JSON.stringify(parsed.errors)}`);
  }
  return parsed.data || {};
};
const CORRELATION_MARKER_PREFIX = "sl-correlation:";
const extractCorrelationId = (description) => {
  const text = asString(description);
  if (!text) return "";
  const match = text.match(new RegExp(`${CORRELATION_MARKER_PREFIX}([^\\s\\n]+)`, "i"));
  return match ? asString(match[1]) : "";
};
