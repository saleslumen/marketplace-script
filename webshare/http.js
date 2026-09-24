const WEBSHARE_API_BASE = "https://proxy.webshare.io/api/v2";
const CONNECTION_KEY = "webshare";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const getWebshareApiKey = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const webshareRequest = async (path, method = "GET", body) => {
  const apiKey = await getWebshareApiKey();
  const options = {
    method,
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(`${WEBSHARE_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`WEBSHARE_REQUEST_FAILED (${status}): ${text}`);
  return text.trim() ? JSON.parse(text) : {};
};
