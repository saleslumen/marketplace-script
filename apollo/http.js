const APOLLO_API_BASE = "https://api.apollo.io/api/v1";
const CONNECTION_KEY = "apollo";
const invalid = (reason) => {
  throw new Error(`APOLLO_INVALID_INPUT: ${reason}`);
};
const requireObject = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) invalid("input must be an object");
  return input;
};
const checkValue = (name, value, type) => {
  if (type === "string") {
    if (typeof value !== "string") invalid(`${name} must be a string`);
    return value;
  }
  if (type === "boolean") {
    if (typeof value !== "boolean") invalid(`${name} must be a boolean`);
    return value;
  }
  if (type === "integer") {
    if (typeof value !== "number" || !Number.isInteger(value)) invalid(`${name} must be an integer`);
    return value;
  }
  if (type === "string[]") {
    if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) invalid(`${name} must be an array of strings`);
    return value;
  }
  if (type === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) invalid(`${name} must be a number`);
    return value;
  }
  if (type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) invalid(`${name} must be an object`);
    return value;
  }
  if (type === "object[]") {
    if (!Array.isArray(value) || value.some((item) => !item || typeof item !== "object" || Array.isArray(item))) invalid(`${name} must be an array of objects`);
    return value;
  }
  if (type === "string|string[]") {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && value.every((item) => typeof item === "string")) return value;
    invalid(`${name} must be a string or an array of strings`);
  }
  if (type === "json") return value;
  invalid(`${name} is invalid`);
};
const pickFields = (input, fields) => {
  const out = {};
  fields.forEach((field) => {
    const name = field[0];
    if (input[name] === undefined) return;
    out[name] = checkValue(name, input[name], field[1]);
  });
  return out;
};
const requireString = (input, name) => {
  const value = input[name];
  if (typeof value !== "string" || value.trim() === "") invalid(`${name} is required`);
  return value;
};
const requireStringList = (input, name) => {
  const value = input[name];
  if (!Array.isArray(value) || value.length < 1) invalid(`${name} is required`);
  if (value.some((item) => typeof item !== "string" || item.length < 1)) invalid(`${name} must be an array of non-empty strings`);
  return value;
};
const requireDecimalString = (input, name) => {
  const value = input[name];
  if (value === undefined || value === null || value === "") invalid(`${name} is required`);
  if (typeof value !== "string" || !/^-?\d+$/.test(value)) invalid(`${name} must be a decimal string`);
  return value;
};
const requireBooleanField = (input, name) => {
  if (typeof input[name] !== "boolean") invalid(`${name} is required`);
  return input[name];
};
const requirePlainObject = (input, name) => {
  const value = input[name];
  if (!value || typeof value !== "object" || Array.isArray(value)) invalid(`${name} is required`);
  return value;
};
const arraySizeMessage = (name, min, max) => {
  if (min === max) return `${name} must contain ${min} ${min === 1 ? "item" : "items"}`;
  if (max === undefined) return `${name} must contain at least ${min} ${min === 1 ? "item" : "items"}`;
  return `${name} must contain ${min} to ${max} items`;
};
const requireObjectArray = (value, name, min, max) => {
  if (!Array.isArray(value)) invalid(`${name} is required`);
  if (value.length < min || (max !== undefined && value.length > max)) invalid(arraySizeMessage(name, min, max));
  value.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) invalid(`${name}[${index}] must be an object`);
  });
  return value;
};
const requireIdObjects = (value, name, max) => {
  const rows = requireObjectArray(value, name, 1, max);
  rows.forEach((item, index) => {
    if (typeof item.id !== "string" || item.id.trim() === "") invalid(`${name}[${index}].id is required`);
  });
  return rows;
};
const requireModality = (input) => {
  const modality = requireString(input, "modality");
  if (modality !== "contacts" && modality !== "accounts") invalid("modality must be contacts or accounts");
  return modality;
};
const requireDetails = (value, noun) => {
  if (!Array.isArray(value) || value.length < 1 || value.length > 10) invalid(`details must contain 1 to 10 ${noun}`);
  value.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) invalid(`details[${index}] must be an object`);
  });
  return value;
};
const assertPhoneDelivery = (input) => {
  const revealPhone = input.reveal_phone_number === true;
  const pollOnly = input.poll_only === true;
  const webhook = input.webhook_url;
  const hasWebhook = typeof webhook === "string" && webhook.trim() !== "";
  if (pollOnly && hasWebhook) invalid("webhook_url cannot be set when poll_only is true");
  if (revealPhone && !pollOnly && !hasWebhook) invalid("webhook_url is required when reveal_phone_number is true");
};
const requireOrganizationIdentifier = (input) => {
  const domain = typeof input.domain === "string" && input.domain.trim();
  const linkedinUrl = typeof input.linkedin_url === "string" && input.linkedin_url.trim();
  const website = typeof input.website === "string" && input.website.trim();
  if (!domain && !linkedinUrl && !website) invalid("domain, linkedin_url, or website is required");
};
const appendQuery = (parts, key, value) => {
  parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
};
const buildQuery = (params) => {
  const parts = [];
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach((item) => appendQuery(parts, key, item));
      return;
    }
    if (typeof value === "boolean") {
      appendQuery(parts, key, value ? "true" : "false");
      return;
    }
    appendQuery(parts, key, value);
  });
  return parts.length ? `?${parts.join("&")}` : "";
};
const apolloFailureMessage = (text, apiKey) => {
  const raw = typeof text === "string" ? text.trim() : "";
  let message = "";
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const details = parsed.error_details;
        if (details && typeof details.message === "string" && details.message.trim()) message = details.message.trim();
        else if (typeof parsed.error === "string" && parsed.error.trim()) message = parsed.error.trim();
        else if (parsed.error && typeof parsed.error.message === "string" && parsed.error.message.trim()) message = parsed.error.message.trim();
        else if (typeof parsed.message === "string" && parsed.message.trim()) message = parsed.message.trim();
        else if (typeof parsed.error_message === "string" && parsed.error_message.trim()) message = parsed.error_message.trim();
        else if (typeof parsed.error_code === "string" && parsed.error_code.trim()) message = parsed.error_code.trim();
      }
    } catch (_error) {
      message = raw;
    }
  }
  if (!message) message = "request failed";
  const token = typeof apiKey === "string" ? apiKey : "";
  if (token) message = message.split(token).join("[redacted]");
  return message.length > 500 ? message.slice(0, 500) : message;
};
const apolloRequest = async (path, method = "GET", body) => {
  const apiKey = await ConnectionApp.getApiKey(CONNECTION_KEY);
  const headers = { Accept: "application/json", "Cache-Control": "no-cache", "X-Api-Key": apiKey };
  const options = { method, headers, muteHttpExceptions: true };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.payload = JSON.stringify(body);
  }
  const response = await UrlFetchApp.fetch(`${APOLLO_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`APOLLO_REQUEST_FAILED: ${status} ${apolloFailureMessage(text, apiKey)}`);
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch (_error) {
    throw new Error("APOLLO_INVALID_RESPONSE: expected JSON");
  }
};
