const CONNECTION_KEY = "google_sheets";
const SHEETS_ORIGIN = "https://sheets.googleapis.com";
const MAX_ROWS = 1000;
const MAX_COLUMNS = 100;
const MAX_RANGES = 50;
const inputObject = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("SHEETS_INVALID_INPUT: input is required");
  return input;
};
const requireSpreadsheetId = (value) => {
  const spreadsheetId = typeof value === "string" ? value.trim() : "";
  if (!spreadsheetId || /[\s/]/.test(spreadsheetId)) throw new Error("SHEETS_INVALID_INPUT: spreadsheetId is required");
  return spreadsheetId;
};
const requireRange = (value) => {
  if (typeof value !== "string" || /[\r\n]/.test(value)) throw new Error("SHEETS_INVALID_INPUT: range is required");
  const range = value.trim();
  if (!range || /^https?:/i.test(range)) throw new Error("SHEETS_INVALID_INPUT: range is required");
  return range;
};
const requireCell = (value, label) => {
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  throw new Error(`SHEETS_INVALID_INPUT: ${label} must be a string, number, or boolean`);
};
const requireValues = (value, label) => {
  const name = label || "values";
  if (!Array.isArray(value)) throw new Error(`SHEETS_INVALID_INPUT: ${name} must be an array of rows`);
  if (!value.length) throw new Error(`SHEETS_INVALID_INPUT: ${name} is required`);
  if (value.length > MAX_ROWS) throw new Error(`SHEETS_INVALID_INPUT: ${name} allows at most ${MAX_ROWS} rows`);
  return value.map((row, rowIndex) => {
    if (!Array.isArray(row)) throw new Error(`SHEETS_INVALID_INPUT: ${name}[${rowIndex}] must be an array`);
    if (row.length > MAX_COLUMNS) throw new Error(`SHEETS_INVALID_INPUT: ${name}[${rowIndex}] allows at most ${MAX_COLUMNS} columns`);
    return row.map((cell, columnIndex) => requireCell(cell, `${name}[${rowIndex}][${columnIndex}]`));
  });
};
const requireRanges = (value) => {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_RANGES) {
    throw new Error(`SHEETS_INVALID_INPUT: ranges must contain 1 to ${MAX_RANGES} ranges`);
  }
  return value.map((range) => requireRange(range));
};
const requireBatchData = (value) => {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_RANGES) {
    throw new Error(`SHEETS_INVALID_INPUT: data must contain 1 to ${MAX_RANGES} entries`);
  }
  return value.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw new Error(`SHEETS_INVALID_INPUT: data[${index}] must be an object`);
    return {
      range: requireRange(entry.range),
      majorDimension: "ROWS",
      values: requireValues(entry.values, `data[${index}].values`),
    };
  });
};
const queryString = (values = {}) => {
  const query = [];
  Object.entries(values).forEach(([key, value]) => {
    const items = Array.isArray(value) ? value : [value];
    items.forEach((item) => {
      if (item === undefined || item === null || item === "") return;
      query.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
    });
  });
  const encoded = query.join("&");
  return encoded ? `?${encoded}` : "";
};
const sheetsPath = (spreadsheetId, suffix) => `/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}${suffix}`;
const errorDetail = (text) => {
  const raw = typeof text === "string" ? text.trim() : "";
  if (!raw) return "";
  let body;
  try {
    body = JSON.parse(raw);
  } catch (_error) {
    return "";
  }
  const message = body && body.error && typeof body.error.message === "string" ? body.error.message : "";
  const short = message.replace(/\s+/g, " ").trim();
  return short ? short.slice(0, 200) : "";
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
const responseObject = (value, label) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`SHEETS_INVALID_RESPONSE: expected ${label}`);
  return value;
};
const responseId = (value) => {
  if (typeof value !== "string" || !value.trim()) throw new Error("SHEETS_INVALID_RESPONSE: expected a spreadsheet id");
  return value;
};
const responseText = (value, label) => {
  if (typeof value !== "string" || !value) throw new Error(`SHEETS_INVALID_RESPONSE: expected ${label}`);
  return value;
};
const responseCount = (value) => {
  if (value === undefined || value === null) return 0;
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("SHEETS_INVALID_RESPONSE: expected a count");
  return value;
};
const optionalText = (value) => (typeof value === "string" ? value : "");
const valueRows = (value) => {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error("SHEETS_INVALID_RESPONSE: expected values");
  return value.map((row) => {
    if (!Array.isArray(row)) throw new Error("SHEETS_INVALID_RESPONSE: expected values");
    return row;
  });
};
const valueRange = (entry) => {
  const range = responseObject(entry, "a value range");
  const majorDimension = range.majorDimension === undefined ? "ROWS" : range.majorDimension;
  if (majorDimension !== "ROWS" && majorDimension !== "COLUMNS") throw new Error("SHEETS_INVALID_RESPONSE: expected a major dimension");
  return {
    range: responseText(range.range, "a range"),
    majorDimension,
    values: valueRows(range.values),
  };
};
const spreadsheetResult = (response) => {
  const spreadsheet = responseObject(response, "a spreadsheet");
  const properties = responseObject(spreadsheet.properties, "spreadsheet properties");
  const sheets = spreadsheet.sheets === undefined ? [] : spreadsheet.sheets;
  if (!Array.isArray(sheets)) throw new Error("SHEETS_INVALID_RESPONSE: expected sheets");
  return {
    spreadsheetId: responseId(spreadsheet.spreadsheetId),
    title: optionalText(properties.title),
    locale: optionalText(properties.locale),
    timeZone: optionalText(properties.timeZone),
    sheets: sheets.map((sheet) => {
      const props = responseObject(sheet && sheet.properties, "sheet properties");
      return {
        sheetId: responseCount(props.sheetId),
        title: optionalText(props.title),
        index: responseCount(props.index),
      };
    }),
  };
};
const valuesResult = (spreadsheetId, response) => {
  const range = valueRange(response);
  return {
    spreadsheetId,
    range: range.range,
    majorDimension: range.majorDimension,
    values: range.values,
  };
};
const updateResult = (response) => {
  const updated = responseObject(response, "an update");
  return {
    spreadsheetId: responseId(updated.spreadsheetId),
    updatedRange: responseText(updated.updatedRange, "an updated range"),
    updatedRows: responseCount(updated.updatedRows),
    updatedColumns: responseCount(updated.updatedColumns),
    updatedCells: responseCount(updated.updatedCells),
  };
};
const appendResult = (response) => {
  const appended = responseObject(response, "an append");
  const updates = responseObject(appended.updates, "updates");
  const result = { spreadsheetId: responseId(appended.spreadsheetId) };
  if (appended.tableRange !== undefined && appended.tableRange !== null && appended.tableRange !== "") {
    result.tableRange = responseText(appended.tableRange, "a table range");
  }
  result.updatedRange = responseText(updates.updatedRange, "an updated range");
  return result;
};
const clearResult = (response) => {
  const cleared = responseObject(response, "a clear");
  return {
    spreadsheetId: responseId(cleared.spreadsheetId),
    clearedRange: responseText(cleared.clearedRange, "a cleared range"),
  };
};
const batchGetResult = (response, count) => {
  const batch = responseObject(response, "a batch get");
  if (!Array.isArray(batch.valueRanges) || batch.valueRanges.length !== count) throw new Error("SHEETS_INVALID_RESPONSE: expected value ranges");
  return {
    spreadsheetId: responseId(batch.spreadsheetId),
    valueRanges: batch.valueRanges.map((entry) => valueRange(entry)),
  };
};
const batchUpdateResult = (response, count) => {
  const batch = responseObject(response, "a batch update");
  if (!Array.isArray(batch.responses) || batch.responses.length !== count) throw new Error("SHEETS_INVALID_RESPONSE: expected updates");
  return {
    spreadsheetId: responseId(batch.spreadsheetId),
    totalUpdatedRows: responseCount(batch.totalUpdatedRows),
    totalUpdatedColumns: responseCount(batch.totalUpdatedColumns),
    totalUpdatedCells: responseCount(batch.totalUpdatedCells),
    updatedRanges: batch.responses.map((entry) => responseText(responseObject(entry, "an update").updatedRange, "an updated range")),
  };
};
