const CONNECTION_KEY = "google_sheets";
const SHEETS_ORIGIN = "https://sheets.googleapis.com";
const VALUE_INPUT_OPTIONS = ["INPUT_VALUE_OPTION_UNSPECIFIED", "RAW", "USER_ENTERED"];
const INSERT_DATA_OPTIONS = ["OVERWRITE", "INSERT_ROWS"];
const VALUE_RENDER_OPTIONS = ["FORMATTED_VALUE", "UNFORMATTED_VALUE", "FORMULA"];
const DATE_TIME_RENDER_OPTIONS = ["SERIAL_NUMBER", "FORMATTED_STRING"];
const MAJOR_DIMENSIONS = ["DIMENSION_UNSPECIFIED", "ROWS", "COLUMNS"];
const COMMENTS_VIEW_MODES = ["COMMENTS_VIEW_MODE_UNSPECIFIED", "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS", "COMMENTS_VIEW_MODE_OMITTED", "COMMENTS_VIEW_MODE_INCLUDED"];
const inputObject = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("SHEETS_INVALID_INPUT: input is required");
  return input;
};
const requireString = (value, name) => {
  if (typeof value !== "string" || !value.trim()) throw new Error(`SHEETS_INVALID_INPUT: ${name} is required`);
  return value.trim();
};
const requireInt32 = (value, name) => {
  if (typeof value !== "number" || !Number.isInteger(value) || value < -2147483648 || value > 2147483647) throw new Error(`SHEETS_INVALID_INPUT: ${name} must be an int32`);
  return value;
};
const requireEnum = (value, name, allowed) => {
  if (typeof value !== "string" || !allowed.includes(value)) throw new Error(`SHEETS_INVALID_INPUT: ${name} must be ${allowed.join(" or ")}`);
  return value;
};
const optionalEnum = (value, name, allowed) => {
  if (value === undefined) return undefined;
  return requireEnum(value, name, allowed);
};
const optionalBoolean = (value, name) => {
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") throw new Error(`SHEETS_INVALID_INPUT: ${name} must be a boolean`);
  return value;
};
const optionalString = (value, name) => {
  if (value === undefined) return undefined;
  if (typeof value !== "string") throw new Error(`SHEETS_INVALID_INPUT: ${name} must be a string`);
  return value;
};
const requireStringList = (value, name) => {
  if (!Array.isArray(value) || value.length < 1) throw new Error(`SHEETS_INVALID_INPUT: ${name} must contain at least one string`);
  return value.map((item, index) => requireString(item, `${name}[${index}]`));
};
const optionalStringList = (value, name) => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error(`SHEETS_INVALID_INPUT: ${name} must be an array`);
  return value.map((item, index) => requireString(item, `${name}[${index}]`));
};
const requirePlainObject = (value, name) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`SHEETS_INVALID_INPUT: ${name} must be an object`);
  return value;
};
const optionalPlainObject = (value, name) => {
  if (value === undefined) return undefined;
  return requirePlainObject(value, name);
};
const requireObjectList = (value, name) => {
  if (!Array.isArray(value) || value.length < 1) throw new Error(`SHEETS_INVALID_INPUT: ${name} must contain at least one object`);
  return value.map((item, index) => requirePlainObject(item, `${name}[${index}]`));
};
const optionalObjectList = (value, name) => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error(`SHEETS_INVALID_INPUT: ${name} must be an array`);
  return value.map((item, index) => requirePlainObject(item, `${name}[${index}]`));
};
const requireMatrix = (value, name) => {
  if (!Array.isArray(value)) throw new Error(`SHEETS_INVALID_INPUT: ${name} must be an array`);
  value.forEach((row, index) => {
    if (!Array.isArray(row)) throw new Error(`SHEETS_INVALID_INPUT: ${name}[${index}] must be an array`);
  });
  return value;
};
const validateDataFilter = (entry, name) => {
  requirePlainObject(entry, name);
  if (entry.a1Range !== undefined && typeof entry.a1Range !== "string") throw new Error(`SHEETS_INVALID_INPUT: ${name}.a1Range must be a string`);
  if (entry.gridRange !== undefined) requirePlainObject(entry.gridRange, `${name}.gridRange`);
  if (entry.developerMetadataLookup !== undefined) requirePlainObject(entry.developerMetadataLookup, `${name}.developerMetadataLookup`);
  return entry;
};
const requireDataFilters = (value, name) => {
  if (!Array.isArray(value) || value.length < 1) throw new Error(`SHEETS_INVALID_INPUT: ${name} must contain at least one data filter`);
  return value.map((item, index) => validateDataFilter(item, `${name}[${index}]`));
};
const optionalDataFilters = (value, name) => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error(`SHEETS_INVALID_INPUT: ${name} must be an array`);
  return value.map((item, index) => validateDataFilter(item, `${name}[${index}]`));
};
const requireValueRanges = (value, name) => {
  const ranges = requireObjectList(value, name);
  ranges.forEach((entry, index) => {
    const label = `${name}[${index}]`;
    if (typeof entry.range !== "string" || !entry.range.trim()) throw new Error(`SHEETS_INVALID_INPUT: ${label}.range is required`);
    if (entry.majorDimension !== undefined) requireEnum(entry.majorDimension, `${label}.majorDimension`, MAJOR_DIMENSIONS);
    requireMatrix(entry.values, `${label}.values`);
  });
  return ranges;
};
const requireDataFilterValueRanges = (value, name) => {
  const ranges = requireObjectList(value, name);
  ranges.forEach((entry, index) => {
    const label = `${name}[${index}]`;
    validateDataFilter(entry.dataFilter, `${label}.dataFilter`);
    if (entry.majorDimension !== undefined) requireEnum(entry.majorDimension, `${label}.majorDimension`, MAJOR_DIMENSIONS);
    requireMatrix(entry.values, `${label}.values`);
  });
  return ranges;
};
const bodyFrom = (entries) => {
  const body = {};
  entries.forEach(([key, value]) => {
    if (value !== undefined) body[key] = value;
  });
  return body;
};
const queryString = (values = {}) => {
  const query = [];
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined) return;
    const items = Array.isArray(value) ? value : [value];
    items.forEach((item) => {
      if (item === undefined) return;
      query.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
    });
  });
  const encoded = query.join("&");
  return encoded ? `?${encoded}` : "";
};
const spreadsheetPath = (spreadsheetId) => `/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}`;
const errorDetail = (text) => {
  const raw = typeof text === "string" ? text.trim() : "";
  if (!raw) return "";
  let body;
  try {
    body = JSON.parse(raw);
  } catch (_error) {
    return "";
  }
  const message = typeof body?.error?.message === "string" ? body.error.message : "";
  const short = message.replace(/\s+/g, " ").trim();
  return short ? short.slice(0, 200) : "";
};
const requestJson = async (path, method, body) => {
  const token = await ConnectionApp.getAccessToken(CONNECTION_KEY);
  const options = { method, headers: { Authorization: "Bearer " + token, Accept: "application/json" } };
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.payload = JSON.stringify(body);
  }
  const response = await UrlFetchApp.fetch(SHEETS_ORIGIN + path, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) {
    const detail = errorDetail(text);
    throw new Error(detail ? `SHEETS_REQUEST_FAILED (${status}): ${detail}` : `SHEETS_REQUEST_FAILED (${status})`);
  }
  if (!text || !String(text).trim()) throw new Error("SHEETS_INVALID_RESPONSE: expected JSON");
  try {
    return JSON.parse(text);
  } catch (_error) {
    throw new Error("SHEETS_INVALID_RESPONSE: expected JSON");
  }
};
