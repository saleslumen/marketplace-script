const AIARK_API_BASE = "https://api.ai-ark.com/api/developer-portal";
const CONNECTION_KEY = "aiark";
const requireObjectInput = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("AIARK_INVALID_INPUT: input must be an object");
  return input;
};
const integerRange = (name, min, max) => {
  const range = max === undefined ? `an integer greater than or equal to ${min}` : `an integer from ${min} to ${max}`;
  return `AIARK_INVALID_INPUT: ${name} must be ${range}`;
};
const requireInteger = (input, name, min, max) => {
  if (!Object.prototype.hasOwnProperty.call(input, name) || input[name] === undefined || input[name] === null) {
    throw new Error(`AIARK_INVALID_INPUT: ${name} is required`);
  }
  const value = input[name];
  const aboveMax = max !== undefined && value > max;
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || aboveMax) throw new Error(integerRange(name, min, max));
  return value;
};
const optionalInteger = (input, name, min, max) => {
  if (!Object.prototype.hasOwnProperty.call(input, name) || input[name] === undefined) return undefined;
  if (input[name] === null) throw new Error(integerRange(name, min, max));
  return requireInteger(input, name, min, max);
};
const requireText = (input, name) => {
  const value = input[name];
  if (typeof value !== "string" || !value.trim()) throw new Error(`AIARK_INVALID_INPUT: ${name} is required`);
  return value.trim();
};
const optionalEnum = (input, name, allowed) => {
  if (!Object.prototype.hasOwnProperty.call(input, name) || input[name] === undefined) return undefined;
  if (!allowed.includes(input[name])) throw new Error(`AIARK_INVALID_INPUT: ${name} must be ${allowed.join(" or ")}`);
  return input[name];
};
const optionalBoolean = (input, name) => {
  if (!Object.prototype.hasOwnProperty.call(input, name) || input[name] === undefined) return undefined;
  if (typeof input[name] !== "boolean") throw new Error(`AIARK_INVALID_INPUT: ${name} must be a boolean`);
  return input[name];
};
const optionalStringList = (input, name) => {
  if (!Object.prototype.hasOwnProperty.call(input, name) || input[name] === undefined) return undefined;
  const value = input[name];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !item.trim())) {
    throw new Error(`AIARK_INVALID_INPUT: ${name} must be an array of strings`);
  }
  return value;
};
const pushQuery = (parts, key, value) => {
  parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
};
const inquiriesQuery = (input) => {
  const parts = [];
  const page = optionalInteger(input, "page", 0);
  if (page !== undefined) pushQuery(parts, "page", page);
  const size = optionalInteger(input, "size", 1, 100);
  if (size !== undefined) pushQuery(parts, "size", size);
  return parts.length ? `?${parts.join("&")}` : "";
};
const submissionsQuery = (input) => {
  const req = requireObjectInput(input);
  const parts = [];
  const state = optionalEnum(req, "state", ["PENDING", "SETTLED"]);
  if (state !== undefined) pushQuery(parts, "state", state);
  const fullyRefunded = optionalBoolean(req, "fullyRefunded");
  if (fullyRefunded !== undefined) pushQuery(parts, "fullyRefunded", fullyRefunded);
  const page = optionalInteger(req, "page", 0);
  if (page !== undefined) pushQuery(parts, "page", page);
  const size = optionalInteger(req, "size", 1, 100);
  if (size !== undefined) pushQuery(parts, "size", size);
  const sort = optionalStringList(req, "sort");
  if (sort) sort.forEach((item) => pushQuery(parts, "sort", item));
  return parts.length ? `?${parts.join("&")}` : "";
};
const requireSearchBody = (input, sizeMin, sizeMax) => {
  const body = requireObjectInput(input);
  requireInteger(body, "page", 0);
  requireInteger(body, "size", sizeMin, sizeMax);
  return body;
};
const requireCompanyBody = (input) => {
  const body = requireSearchBody(input, 0, 100);
  if (body.lookalikeDomains !== undefined && body.lookalikeDomains !== null) {
    const seeds = body.lookalikeDomains;
    if (!Array.isArray(seeds) || seeds.length > 5 || seeds.some((item) => typeof item !== "string")) {
      throw new Error("AIARK_INVALID_INPUT: lookalikeDomains must be an array of at most 5 strings");
    }
  }
  return body;
};
const requireExportBody = (input) => {
  const body = requireSearchBody(input, 1, 10000);
  requireText(body, "webhook");
  return body;
};
const requireTrackWebhook = (input) => {
  const body = requireObjectInput(input);
  requireText(body, "trackId");
  requireText(body, "webhook");
  return body;
};
const requireIdOrUrl = (input) => {
  const body = requireObjectInput(input);
  const id = typeof body.id === "string" && body.id.trim();
  const url = typeof body.url === "string" && body.url.trim();
  if (!id && !url) throw new Error("AIARK_INVALID_INPUT: id or url is required");
  return body;
};
const requireMobilePhone = (input) => {
  const body = requireObjectInput(input);
  const linkedin = typeof body.linkedin === "string" && body.linkedin.trim();
  const domain = typeof body.domain === "string" && body.domain.trim();
  const name = typeof body.name === "string" && body.name.trim();
  if (linkedin || (domain && name)) return body;
  throw new Error("AIARK_INVALID_INPUT: linkedin or domain and name is required");
};
const requireListBody = (input) => {
  const body = requireObjectInput(input);
  if (!Array.isArray(body.values)) throw new Error("AIARK_INVALID_INPUT: values is required");
  if (body.values.length > 10000) throw new Error("AIARK_INVALID_INPUT: values must contain at most 10000 items");
  if (body.values.some((item) => typeof item !== "string")) throw new Error("AIARK_INVALID_INPUT: values must be an array of strings");
  const creating = !(typeof body.id === "string" && body.id.trim());
  if (creating && (body.type === undefined || body.type === null || body.type === "")) throw new Error("AIARK_INVALID_INPUT: type is required");
  if (body.type !== undefined && body.type !== null && body.type !== "" && body.type !== "people_id" && body.type !== "company_id") {
    throw new Error("AIARK_INVALID_INPUT: type must be people_id or company_id");
  }
  if (body.mode !== undefined && body.mode !== null && body.mode !== "" && body.mode !== "APPEND" && body.mode !== "REPLACE") {
    throw new Error("AIARK_INVALID_INPUT: mode must be APPEND or REPLACE");
  }
  return body;
};
const requireProfileUrl = (input) => {
  const body = requireObjectInput(input);
  requireText(body, "url");
  return body;
};
const requireReverseLookup = (input) => {
  const body = requireObjectInput(input);
  requireText(body, "search");
  return body;
};
const redactSecret = (message, apiKey) => {
  const text = message === undefined || message === null ? "" : String(message);
  if (!apiKey) return text;
  return text.split(String(apiKey)).join("[redacted]");
};
const aiarkFailureMessage = (text, apiKey) => {
  const raw = typeof text === "string" ? text.trim() : "";
  let message = "request failed";
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        if (typeof parsed.error === "string" && parsed.error.trim()) message = parsed.error.trim();
        else if (parsed.error && typeof parsed.error === "object") {
          const nested = typeof parsed.error.message === "string" ? parsed.error.message.trim() : "";
          const type = typeof parsed.error.type === "string" ? parsed.error.type.trim() : "";
          message = nested || type || (raw.length > 500 ? raw.slice(0, 500) : raw);
        } else if (typeof parsed.message === "string" && parsed.message.trim()) message = parsed.message.trim();
        else message = raw.length > 500 ? raw.slice(0, 500) : raw;
      } else message = raw.length > 500 ? raw.slice(0, 500) : raw;
    } catch (_error) {
      message = raw.length > 500 ? raw.slice(0, 500) : raw;
    }
  }
  return redactSecret(message, apiKey);
};
const aiarkRequest = async (path, method = "GET", body) => {
  const apiKey = await ConnectionApp.getApiKey(CONNECTION_KEY);
  const headers = {
    "X-TOKEN": apiKey,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const options = { method, headers, muteHttpExceptions: true };
  if (body !== undefined) options.payload = JSON.stringify(body);
  const response = await UrlFetchApp.fetch(`${AIARK_API_BASE}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`AIARK_REQUEST_FAILED: ${status} ${aiarkFailureMessage(text, apiKey)}`);
  if (!text || !String(text).trim()) return {};
  try {
    return JSON.parse(text);
  } catch (_error) {
    throw new Error(`AIARK_REQUEST_FAILED: ${status} invalid JSON`);
  }
};
