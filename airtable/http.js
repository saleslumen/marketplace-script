const AIRTABLE_API_BASE = "https://api.airtable.com/v0";
const AIRTABLE_CONTENT_BASE = "https://content.airtable.com/v0";
const RECORD_BATCH_LIMIT = 10;
const LIST_URL_LIMIT = 16000;
const DESCRIPTION_LIMIT = 20000;
const CSV_BYTE_LIMIT = 2 * 1024 * 1024;
const CSV_ROW_LIMIT = 10000;
const CSV_COLUMN_LIMIT = 500;
const ATTACHMENT_BYTE_LIMIT = 5 * 1024 * 1024;
const CONNECTION_KEY = "airtable";
const asString = (value) => (value === undefined || value === null ? "" : String(value).trim());
const getAirtablePat = async () => ConnectionApp.getApiKey(CONNECTION_KEY);
const airtableFailureMessage = (text) => {
  const raw = typeof text === "string" ? text.trim() : "";
  if (!raw) return "request failed";
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      if (typeof parsed.error === "string" && parsed.error.trim()) return parsed.error.trim();
      if (parsed.error && typeof parsed.error === "object") {
        const message = asString(parsed.error.message);
        if (message) return message;
        const type = asString(parsed.error.type);
        if (type) return type;
      }
      const message = asString(parsed.message);
      if (message) return message;
    }
  } catch (_error) {
    // The failure body is not JSON.
  }
  const redacted = raw.replace(/Bearer\s+\S+/gi, "Bearer [redacted]");
  return redacted.length > 500 ? redacted.slice(0, 500) : redacted;
};
const airtableRequest = async (path, method = "GET", body, request = {}) => {
  const token = await getAirtablePat();
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": (request && request.contentType) || "application/json",
      Accept: "application/json",
    },
  };
  if (body !== undefined) options.payload = request && request.raw ? String(body) : JSON.stringify(body);
  const origin = (request && request.origin) || AIRTABLE_API_BASE;
  const response = await UrlFetchApp.fetch(`${origin}${path}`, options);
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error(`AIRTABLE_REQUEST_FAILED: ${status} ${airtableFailureMessage(text)}`);
  return text.trim() ? JSON.parse(text) : {};
};
const tablePath = (baseId, tableName, suffix = "") =>
  `/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}${suffix}`;
const requireObjectInput = (input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("AIRTABLE_INVALID_INPUT: input must be an object");
  return input;
};
const requireId = (value, name) => {
  if (typeof value !== "string" || !value.trim()) throw new Error(`AIRTABLE_INVALID_INPUT: ${name} is required`);
  return value.trim();
};
const optionalText = (value, name) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") throw new Error(`AIRTABLE_INVALID_INPUT: ${name} must be a string`);
  const text = value.trim();
  return text || undefined;
};
const optionalBoolean = (value, name) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "boolean") throw new Error(`AIRTABLE_INVALID_INPUT: ${name} must be a boolean`);
  return value;
};
const optionalInt = (value, name, min, max) => {
  if (value === undefined || value === null || value === "") return undefined;
  const aboveMax = max !== undefined && value > max;
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || aboveMax) {
    const range = max === undefined ? `an integer greater than or equal to ${min}` : `an integer from ${min} to ${max}`;
    throw new Error(`AIRTABLE_INVALID_INPUT: ${name} must be ${range}`);
  }
  return value;
};
const optionalDescription = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string" || value.length < 1 || value.length > DESCRIPTION_LIMIT) {
    throw new Error("AIRTABLE_INVALID_INPUT: description must be a non-empty string no longer than 20000 characters");
  }
  return value;
};
const assignBoolean = (body, key, value) => {
  const parsed = optionalBoolean(value, key);
  if (parsed !== undefined) body[key] = parsed;
};
const pushQuery = (parts, key, value) => {
  parts.push(`${key}=${encodeURIComponent(String(value))}`);
};
const pushQueryList = (parts, key, values) => {
  values.forEach((value) => pushQuery(parts, `${key}[]`, value));
};
const optionalStringList = (value, name) => {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) throw new Error(`AIRTABLE_INVALID_INPUT: ${name} must be an array`);
  if (!value.length) return undefined;
  return value.map((item, index) => {
    if (typeof item !== "string" || !item.trim()) throw new Error(`AIRTABLE_INVALID_INPUT: ${name}[${index}] is required`);
    return item.trim();
  });
};
const optionalEnumList = (value, name, allowed) => {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) throw new Error(`AIRTABLE_INVALID_INPUT: ${name} must be an array`);
  if (!value.length) return undefined;
  return value.map((item, index) => {
    if (typeof item !== "string" || !allowed.includes(item)) {
      throw new Error(`AIRTABLE_INVALID_INPUT: ${name}[${index}] must be ${allowed.join(" or ")}`);
    }
    return item;
  });
};
const optionalSort = (value) => {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) throw new Error("AIRTABLE_INVALID_INPUT: sort must be an array");
  if (!value.length) return undefined;
  return value.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error(`AIRTABLE_INVALID_INPUT: sort[${index}] must be an object`);
    if (typeof item.field !== "string" || !item.field.trim()) throw new Error(`AIRTABLE_INVALID_INPUT: sort[${index}].field is required`);
    const field = item.field.trim();
    if (item.direction === undefined || item.direction === null || item.direction === "") return { field };
    if (item.direction !== "asc" && item.direction !== "desc") {
      throw new Error(`AIRTABLE_INVALID_INPUT: sort[${index}].direction must be asc or desc`);
    }
    return { field, direction: item.direction };
  });
};
const optionalCellFormat = (input) => {
  const cellFormat = optionalText(input.cellFormat, "cellFormat");
  const timeZone = optionalText(input.timeZone, "timeZone");
  const userLocale = optionalText(input.userLocale, "userLocale");
  if (cellFormat && cellFormat !== "json" && cellFormat !== "string") throw new Error("AIRTABLE_INVALID_INPUT: cellFormat must be json or string");
  if (cellFormat === "string" && (!timeZone || !userLocale)) {
    throw new Error("AIRTABLE_INVALID_INPUT: timeZone and userLocale are required when cellFormat is string");
  }
  return { cellFormat, timeZone, userLocale };
};
const optionalPerformUpsert = (value) => {
  if (value === undefined || value === null) return undefined;
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("AIRTABLE_INVALID_INPUT: performUpsert must be an object");
  if (!Array.isArray(value.fieldsToMergeOn) || value.fieldsToMergeOn.length < 1 || value.fieldsToMergeOn.length > 3) {
    throw new Error("AIRTABLE_INVALID_INPUT: fieldsToMergeOn must contain 1 to 3 fields");
  }
  const fieldsToMergeOn = value.fieldsToMergeOn.map((field, index) => {
    if (typeof field !== "string" || !field.trim()) throw new Error(`AIRTABLE_INVALID_INPUT: fieldsToMergeOn[${index}] is required`);
    return field.trim();
  });
  return { fieldsToMergeOn };
};
const requireRecordBatch = (value, mode) => {
  if (!Array.isArray(value) || value.length < 1) throw new Error("AIRTABLE_INVALID_INPUT: records is required");
  if (value.length > RECORD_BATCH_LIMIT) throw new Error("AIRTABLE_INVALID_INPUT: at most 10 records");
  return value.map((record, index) => {
    if (!record || typeof record !== "object" || Array.isArray(record)) throw new Error(`AIRTABLE_INVALID_INPUT: records[${index}] must be an object`);
    if (!record.fields || typeof record.fields !== "object" || Array.isArray(record.fields)) {
      throw new Error(`AIRTABLE_INVALID_INPUT: records[${index}].fields must be an object`);
    }
    const hasId = !(record.id === undefined || record.id === null || record.id === "");
    if (mode === "create" && hasId) throw new Error(`AIRTABLE_INVALID_INPUT: records[${index}].id is not allowed`);
    if (mode === "update" && !hasId) throw new Error(`AIRTABLE_INVALID_INPUT: records[${index}].id is required`);
    const next = { fields: record.fields };
    if (!hasId) return next;
    if (typeof record.id !== "string" || !record.id.trim()) throw new Error(`AIRTABLE_INVALID_INPUT: records[${index}].id is required`);
    next.id = record.id.trim();
    return next;
  });
};
const requireRecordIdList = (value) => {
  if (!Array.isArray(value) || value.length < 1) throw new Error("AIRTABLE_INVALID_INPUT: records is required");
  if (value.length > RECORD_BATCH_LIMIT) throw new Error("AIRTABLE_INVALID_INPUT: at most 10 records");
  return value.map((recordId, index) => {
    if (typeof recordId !== "string" || !recordId.trim()) throw new Error(`AIRTABLE_INVALID_INPUT: records[${index}] is required`);
    return recordId.trim();
  });
};
const buildCreateRecordsBody = (input) => {
  const hasRecords = input.records !== undefined && input.records !== null;
  const hasFields = input.fields !== undefined && input.fields !== null;
  if (hasRecords && hasFields) throw new Error("AIRTABLE_INVALID_INPUT: records and fields cannot both be set");
  const body = {};
  if (hasRecords) body.records = requireRecordBatch(input.records, "create");
  else if (hasFields) {
    if (typeof input.fields !== "object" || Array.isArray(input.fields)) throw new Error("AIRTABLE_INVALID_INPUT: fields must be an object");
    body.fields = input.fields;
  } else throw new Error("AIRTABLE_INVALID_INPUT: records is required");
  assignBoolean(body, "typecast", input.typecast);
  assignBoolean(body, "returnFieldsByFieldId", input.returnFieldsByFieldId);
  return body;
};
const buildBatchWriteBody = (input) => {
  const performUpsert = optionalPerformUpsert(input.performUpsert);
  const body = {};
  if (performUpsert) body.performUpsert = performUpsert;
  body.records = requireRecordBatch(input.records, performUpsert ? "upsert" : "update");
  assignBoolean(body, "typecast", input.typecast);
  assignBoolean(body, "returnFieldsByFieldId", input.returnFieldsByFieldId);
  return body;
};
const buildSingleWriteBody = (input) => {
  if (!input.fields || typeof input.fields !== "object" || Array.isArray(input.fields)) throw new Error("AIRTABLE_INVALID_INPUT: fields must be an object");
  const body = { fields: input.fields };
  assignBoolean(body, "typecast", input.typecast);
  assignBoolean(body, "returnFieldsByFieldId", input.returnFieldsByFieldId);
  return body;
};
const buildListRecordsQuery = (input) => {
  const parts = [];
  const body = {};
  const pageSize = optionalInt(input.pageSize, "pageSize", 1, 100);
  if (pageSize !== undefined) {
    pushQuery(parts, "pageSize", pageSize);
    body.pageSize = pageSize;
  }
  const maxRecords = optionalInt(input.maxRecords, "maxRecords", 1);
  if (maxRecords !== undefined) {
    pushQuery(parts, "maxRecords", maxRecords);
    body.maxRecords = maxRecords;
  }
  const offset = optionalText(input.offset, "offset");
  if (offset) {
    pushQuery(parts, "offset", offset);
    body.offset = offset;
  }
  const view = optionalText(input.view, "view");
  if (view) {
    pushQuery(parts, "view", view);
    body.view = view;
  }
  const sort = optionalSort(input.sort);
  if (sort) {
    sort.forEach((item, index) => {
      pushQuery(parts, `sort[${index}][field]`, item.field);
      if (item.direction) pushQuery(parts, `sort[${index}][direction]`, item.direction);
    });
    body.sort = sort;
  }
  const filterByFormula = optionalText(input.filterByFormula, "filterByFormula");
  if (filterByFormula) {
    pushQuery(parts, "filterByFormula", filterByFormula);
    body.filterByFormula = filterByFormula;
  }
  const format = optionalCellFormat(input);
  if (format.cellFormat) {
    pushQuery(parts, "cellFormat", format.cellFormat);
    body.cellFormat = format.cellFormat;
  }
  if (format.timeZone) {
    pushQuery(parts, "timeZone", format.timeZone);
    body.timeZone = format.timeZone;
  }
  if (format.userLocale) {
    pushQuery(parts, "userLocale", format.userLocale);
    body.userLocale = format.userLocale;
  }
  const fields = optionalStringList(input.fields, "fields");
  if (fields) {
    pushQueryList(parts, "fields", fields);
    body.fields = fields;
  }
  const returnFieldsByFieldId = optionalBoolean(input.returnFieldsByFieldId, "returnFieldsByFieldId");
  if (returnFieldsByFieldId !== undefined) {
    pushQuery(parts, "returnFieldsByFieldId", returnFieldsByFieldId);
    body.returnFieldsByFieldId = returnFieldsByFieldId;
  }
  const includeDateDependencyMetadata = optionalBoolean(input.includeDateDependencyMetadata, "includeDateDependencyMetadata");
  if (includeDateDependencyMetadata !== undefined) {
    pushQuery(parts, "includeDateDependencyMetadata", includeDateDependencyMetadata);
    body.includeDateDependencyMetadata = includeDateDependencyMetadata;
  }
  const recordMetadata = optionalEnumList(input.recordMetadata, "recordMetadata", ["commentCount"]);
  if (recordMetadata) {
    pushQueryList(parts, "recordMetadata", recordMetadata);
    body.recordMetadata = recordMetadata;
  }
  return { query: parts.length ? `?${parts.join("&")}` : "", body };
};
const buildRecordReadQuery = (input) => {
  const parts = [];
  const format = optionalCellFormat(input);
  if (format.cellFormat) pushQuery(parts, "cellFormat", format.cellFormat);
  if (format.timeZone) pushQuery(parts, "timeZone", format.timeZone);
  if (format.userLocale) pushQuery(parts, "userLocale", format.userLocale);
  const returnFieldsByFieldId = optionalBoolean(input.returnFieldsByFieldId, "returnFieldsByFieldId");
  if (returnFieldsByFieldId !== undefined) pushQuery(parts, "returnFieldsByFieldId", returnFieldsByFieldId);
  const includeDateDependencyMetadata = optionalBoolean(input.includeDateDependencyMetadata, "includeDateDependencyMetadata");
  if (includeDateDependencyMetadata !== undefined) pushQuery(parts, "includeDateDependencyMetadata", includeDateDependencyMetadata);
  return parts.length ? `?${parts.join("&")}` : "";
};
const includeQuery = (input, allowed) => {
  const include = optionalEnumList(input.include, "include", allowed);
  if (!include) return "";
  const parts = [];
  pushQueryList(parts, "include", include);
  return `?${parts.join("&")}`;
};
const requireBaseTable = (input) => {
  const req = requireObjectInput(input);
  return { req, baseId: requireId(req.baseId, "baseId"), tableIdOrName: requireId(req.tableIdOrName, "tableIdOrName") };
};
const commentsPath = (baseId, tableIdOrName, recordId, rowCommentId) => {
  const suffix = `/${encodeURIComponent(recordId)}/comments${rowCommentId ? `/${encodeURIComponent(rowCommentId)}` : ""}`;
  return tablePath(baseId, tableIdOrName, suffix);
};
const requireCommentLocation = (input, withCommentId) => {
  const located = requireBaseTable(input);
  const recordId = requireId(located.req.recordId, "recordId");
  const rowCommentId = withCommentId ? requireId(located.req.rowCommentId, "rowCommentId") : "";
  return { req: located.req, path: commentsPath(located.baseId, located.tableIdOrName, recordId, rowCommentId) };
};
const requireCommentText = (value) => {
  if (typeof value !== "string" || !value.length) throw new Error("AIRTABLE_INVALID_INPUT: text is required");
  return value;
};
const requireWebhook = (input, idRequired) => {
  const req = requireObjectInput(input);
  const baseId = requireId(req.baseId, "baseId");
  const webhookId = idRequired ? requireId(req.webhookId, "webhookId") : "";
  return { req, baseId, webhookId };
};
const requireFieldConfigs = (value, label) => {
  if (!Array.isArray(value) || value.length < 1) throw new Error(`AIRTABLE_INVALID_INPUT: ${label} is required`);
  value.forEach((field, index) => {
    if (!field || typeof field !== "object" || Array.isArray(field)) throw new Error(`AIRTABLE_INVALID_INPUT: ${label}[${index}] must be an object`);
    if (typeof field.name !== "string" || !field.name.trim()) throw new Error(`AIRTABLE_INVALID_INPUT: ${label}[${index}].name is required`);
    if (typeof field.type !== "string" || !field.type.trim()) throw new Error(`AIRTABLE_INVALID_INPUT: ${label}[${index}].type is required`);
  });
  return value;
};
const requireTables = (value) => {
  if (!Array.isArray(value) || value.length < 1) throw new Error("AIRTABLE_INVALID_INPUT: tables is required");
  value.forEach((table, index) => {
    if (!table || typeof table !== "object" || Array.isArray(table)) throw new Error(`AIRTABLE_INVALID_INPUT: tables[${index}] must be an object`);
    if (typeof table.name !== "string" || !table.name.trim()) throw new Error(`AIRTABLE_INVALID_INPUT: tables[${index}].name is required`);
    requireFieldConfigs(table.fields, `tables[${index}].fields`);
  });
  return value;
};
const buildUpdateTableBody = (input) => {
  const body = {};
  if (input.name !== undefined) {
    if (typeof input.name !== "string" || !input.name.trim()) throw new Error("AIRTABLE_INVALID_INPUT: name must be a non-empty string");
    body.name = input.name.trim();
  }
  if (input.description !== undefined) body.description = optionalDescription(input.description);
  if (input.dateDependencySettings !== undefined) {
    if (!input.dateDependencySettings || typeof input.dateDependencySettings !== "object" || Array.isArray(input.dateDependencySettings)) {
      throw new Error("AIRTABLE_INVALID_INPUT: dateDependencySettings must be an object");
    }
    body.dateDependencySettings = input.dateDependencySettings;
  }
  if (!Object.keys(body).length) throw new Error("AIRTABLE_INVALID_INPUT: name, description, or dateDependencySettings is required");
  return body;
};
const buildCreateFieldBody = (input) => {
  const body = { name: requireId(input.name, "name"), type: requireId(input.type, "type") };
  if (input.description !== undefined) body.description = optionalDescription(input.description);
  if (input.options !== undefined) {
    if (!input.options || typeof input.options !== "object" || Array.isArray(input.options)) throw new Error("AIRTABLE_INVALID_INPUT: options must be an object");
    body.options = input.options;
  }
  return body;
};
const buildUpdateFieldBody = (input) => {
  const body = {};
  if (input.name !== undefined) {
    if (typeof input.name !== "string" || !input.name.trim()) throw new Error("AIRTABLE_INVALID_INPUT: name must be a non-empty string");
    body.name = input.name.trim();
  }
  if (input.description !== undefined) body.description = optionalDescription(input.description);
  if (input.options !== undefined) {
    if (!input.options || typeof input.options !== "object" || Array.isArray(input.options)) throw new Error("AIRTABLE_INVALID_INPUT: options must be an object");
    body.options = input.options;
  }
  if (!Object.keys(body).length) throw new Error("AIRTABLE_INVALID_INPUT: name, description, or options is required");
  return body;
};
const utf8Bytes = (value) => {
  let bytes = 0;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code < 0x80) bytes += 1;
    else if (code < 0x800) bytes += 2;
    else if (code >= 0xd800 && code <= 0xdbff) {
      bytes += 4;
      index += 1;
    } else bytes += 3;
  }
  return bytes;
};
const csvColumnCount = (line) => {
  let count = 1;
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') index += 1;
      else quoted = !quoted;
    } else if (char === "," && !quoted) count += 1;
  }
  return count;
};
const requireCsv = (value) => {
  if (typeof value !== "string" || !value.length) throw new Error("AIRTABLE_INVALID_INPUT: csv is required");
  if (utf8Bytes(value) > CSV_BYTE_LIMIT) throw new Error("AIRTABLE_INVALID_INPUT: csv must be at most 2 MB");
  const lines = value.split(/\r\n|\n|\r/);
  if (lines.length && lines[lines.length - 1] === "") lines.pop();
  if (lines.length > CSV_ROW_LIMIT) throw new Error("AIRTABLE_INVALID_INPUT: csv must contain at most 10000 rows");
  lines.forEach((line, index) => {
    if (csvColumnCount(line) > CSV_COLUMN_LIMIT) throw new Error(`AIRTABLE_INVALID_INPUT: csv row ${index + 1} must contain at most 500 columns`);
  });
  return value;
};
const requireBase64File = (value) => {
  if (typeof value !== "string" || !value.length) throw new Error("AIRTABLE_INVALID_INPUT: file is required");
  const compact = value.replace(/\s/g, "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(compact) || compact.length % 4 !== 0) throw new Error("AIRTABLE_INVALID_INPUT: file must be a base64 string");
  const padding = compact.endsWith("==") ? 2 : compact.endsWith("=") ? 1 : 0;
  if ((compact.length / 4) * 3 - padding > ATTACHMENT_BYTE_LIMIT) throw new Error("AIRTABLE_INVALID_INPUT: file must be at most 5 MB");
  return value;
};
const requireContentType = (value) => {
  if (typeof value !== "string" || !value.length || value.length > 255) {
    throw new Error("AIRTABLE_INVALID_INPUT: contentType must be a non-empty string no longer than 255 characters");
  }
  return value;
};
