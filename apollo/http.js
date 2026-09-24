const APOLLO_API_BASE = "https://api.apollo.io/api/v1";
const CONNECTION_KEY = "apollo";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const asCsvList = (value) => {
  if (Array.isArray(value)) return value.map(asString).filter(Boolean);
  return asString(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};
const asNumber = (value) => {
  const text = asString(value);
  if (!text) return undefined;
  const number = Number(text);
  return Number.isFinite(number) ? number : undefined;
};
const setCsv = (body, key, value) => {
  const list = asCsvList(value);
  if (list.length) body[key] = list;
};
const getApolloApiKey = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const apolloRequest = async (path, method = "GET", body) => {
  const apiKey = await getApolloApiKey();
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "X-Api-Key": apiKey,
    },
  };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(`${APOLLO_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`APOLLO_REQUEST_FAILED (${status}): ${text}`);
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch (_error) {
    throw new Error("APOLLO_INVALID_RESPONSE: expected JSON");
  }
};
const personResult = (person = {}) => {
  const organization = person.organization || {};
  return {
    id: asString(person.id),
    email: asString(person.email),
    emailStatus: asString(person.email_status),
    firstName: asString(person.first_name),
    lastName: asString(person.last_name),
    name: asString(person.name),
    title: asString(person.title),
    linkedinUrl: asString(person.linkedin_url),
    company: asString(organization.name || person.organization_name),
    website: asString(organization.primary_domain || organization.website_url),
    city: asString(person.city),
    state: asString(person.state),
    country: asString(person.country),
  };
};
