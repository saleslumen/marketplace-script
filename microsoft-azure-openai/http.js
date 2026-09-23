const CONNECTION_KEY = "azure";
const DEFAULT_API_VERSION = "2024-10-21";
const configValue = (key) => {
  const configuration = (ScriptContext && ScriptContext.configuration) || {};
  const value = configuration[key];
  return typeof value === "string" ? value.trim() : "";
};
const configuredEndpoint = () => {
  const endpoint = configValue("endpoint").replace(/\/+$/, "");
  if (!endpoint) throw new Error("AZURE_NOT_CONFIGURED: endpoint is required");
  if (!/^https:\/\/[A-Za-z0-9.-]+$/.test(endpoint)) {
    throw new Error("AZURE_NOT_CONFIGURED: endpoint must be an https origin such as https://myresource.openai.azure.com");
  }
  return endpoint;
};
const configuredDeployment = () => {
  const deployment = configValue("deployment");
  if (!deployment) throw new Error("AZURE_NOT_CONFIGURED: deployment is required");
  return deployment;
};
const configuredApiVersion = () => configValue("apiVersion") || DEFAULT_API_VERSION;
const queryString = (values = {}) => {
  const query = [];
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  });
  const encoded = query.join("&");
  return encoded ? `?${encoded}` : "";
};
const requestJson = async (path, method, body) => {
  const token = await ConnectionApp.getAccessToken(CONNECTION_KEY);
  const options = {
    method,
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
    },
  };
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.payload = JSON.stringify(body);
  }
  const response = await UrlFetchApp.fetch(configuredEndpoint() + path, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`AZURE_REQUEST_FAILED (${status}): ${text}`);
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch (_error) {
    throw new Error("AZURE_INVALID_RESPONSE: expected JSON");
  }
};
