import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const origin = "https://sheets.googleapis.com";
const sheetBody = {
  spreadsheetId: "abc",
  tableRange: "A1:B2",
  updates: { updatedRange: "A3", updatedRows: 1 },
  values: [[null, "x"]],
  sheets: [{ properties: { sheetId: 0, title: "Q1", hidden: true } }],
  untouched: true,
};
const loadScript = (handler) => {
  const calls = [];
  const context = createContext({
    ConnectionApp: {
      getAccessToken: async (key) => {
        calls.push({ connectionKey: key });
        return "token";
      },
    },
    UrlFetchApp: {
      fetch: async (url, options = {}) => {
        const call = calls[calls.length - 1];
        call.url = url;
        call.method = String(options.method || "GET").toUpperCase();
        call.payload = options.payload;
        call.contentType = options.headers && options.headers["Content-Type"];
        call.authorization = options.headers && options.headers.Authorization;
        call.accept = options.headers && options.headers.Accept;
        const result = await handler({ url, method: call.method });
        const body = result.body === undefined ? {} : result.body;
        return {
          getResponseCode: () => Number(result.status) || 200,
          getContentText: () => (typeof body === "string" ? body : JSON.stringify(body)),
        };
      },
    },
  });
  runInContext(readFileSync(join(root, "http.js"), "utf8"), context);
  for (const fileName of readdirSync(root).filter((name) => name.endsWith(".js") && name !== "http.js").sort()) {
    runInContext(readFileSync(join(root, fileName), "utf8"), context);
  }
  return { api: context, calls };
};
const sheets = () => loadScript(() => ({ body: sheetBody }));
const encoded = (value) => encodeURIComponent(value);

test("each method returns the Sheets body and sends one documented request", async () => {
  const script = sheets();
  const seen = await script.api.spreadsheetsGet({
    spreadsheetId: "abc",
    ranges: ["A1:B2", "Sheet 1!C1"],
    includeGridData: false,
    excludeTablesInBandedRanges: true,
    commentsViewMode: "COMMENTS_VIEW_MODE_OMITTED",
    fields: "sheets.properties",
  });
  assert.equal(JSON.stringify(seen), JSON.stringify(sheetBody));
  assert.equal(script.calls[0].connectionKey, "google_sheets");
  assert.equal(script.calls[0].authorization, "Bearer token");
  assert.equal(script.calls[0].accept, "application/json");
  assert.equal(script.calls[0].method, "GET");
  assert.equal(script.calls[0].payload, undefined);
  assert.equal(script.calls[0].contentType, undefined);
  assert.equal(script.calls[0].url, `${origin}/v4/spreadsheets/abc?ranges=${encoded("A1:B2")}&ranges=${encoded("Sheet 1!C1")}&includeGridData=false&excludeTablesInBandedRanges=true&commentsViewMode=COMMENTS_VIEW_MODE_OMITTED&fields=${encoded("sheets.properties")}`);
  const created = await script.api.spreadsheetsCreate({
    title: "Ignored",
    properties: { title: "Budget" },
    sheets: [{ properties: { title: "Q1" } }],
    namedRanges: [{ name: "Total", range: { sheetId: 0 } }],
    developerMetadata: [{ metadataKey: "source", metadataValue: "import" }],
    dataSources: [{ dataSourceId: "ds1" }],
  });
  assert.equal(JSON.stringify(created), JSON.stringify(sheetBody));
  assert.equal(script.calls[1].method, "POST");
  assert.equal(script.calls[1].url, `${origin}/v4/spreadsheets`);
  assert.deepEqual(JSON.parse(script.calls[1].payload), {
    properties: { title: "Budget" },
    sheets: [{ properties: { title: "Q1" } }],
    namedRanges: [{ name: "Total", range: { sheetId: 0 } }],
    developerMetadata: [{ metadataKey: "source", metadataValue: "import" }],
    dataSources: [{ dataSourceId: "ds1" }],
  });
  const requests = [{ addSheet: { properties: { title: "Q2" } } }];
  await script.api.spreadsheetsBatchUpdate({
    spreadsheetId: "abc",
    requests,
    includeSpreadsheetInResponse: false,
    responseRanges: ["A1:B2"],
    responseIncludeGridData: true,
    commentsViewMode: "COMMENTS_VIEW_MODE_INCLUDED",
    fields: "replies",
  });
  assert.equal(script.calls[2].method, "POST");
  assert.equal(script.calls[2].url, `${origin}/v4/spreadsheets/abc:batchUpdate?fields=${encoded("replies")}`);
  assert.deepEqual(JSON.parse(script.calls[2].payload), {
    requests,
    includeSpreadsheetInResponse: false,
    responseRanges: ["A1:B2"],
    responseIncludeGridData: true,
    commentsViewMode: "COMMENTS_VIEW_MODE_INCLUDED",
  });
  const dataFilters = [{ a1Range: "A1:B2" }, { gridRange: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 } }];
  await script.api.spreadsheetsGetByDataFilter({
    spreadsheetId: "abc",
    fields: "properties.title",
    dataFilters,
    includeGridData: true,
    excludeTablesInBandedRanges: false,
    commentsViewMode: "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS",
  });
  assert.equal(script.calls[3].method, "POST");
  assert.equal(script.calls[3].url, `${origin}/v4/spreadsheets/abc:getByDataFilter?fields=${encoded("properties.title")}`);
  assert.deepEqual(JSON.parse(script.calls[3].payload), {
    dataFilters,
    includeGridData: true,
    excludeTablesInBandedRanges: false,
    commentsViewMode: "COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS",
  });
  await script.api.spreadsheetsDeveloperMetadataGet({ spreadsheetId: "abc", metadataId: 0 });
  assert.equal(script.calls[4].method, "GET");
  assert.equal(script.calls[4].url, `${origin}/v4/spreadsheets/abc/developerMetadata/0`);
  assert.equal(script.calls[4].payload, undefined);
  await script.api.spreadsheetsDeveloperMetadataSearch({
    spreadsheetId: "abc",
    dataFilters: [{ developerMetadataLookup: { metadataKey: "source" } }],
  });
  assert.equal(script.calls[5].method, "POST");
  assert.equal(script.calls[5].url, `${origin}/v4/spreadsheets/abc/developerMetadata:search`);
  assert.deepEqual(JSON.parse(script.calls[5].payload), { dataFilters: [{ developerMetadataLookup: { metadataKey: "source" } }] });
  await script.api.spreadsheetsSheetsCopyTo({ spreadsheetId: "abc", sheetId: 0, destinationSpreadsheetId: "dest" });
  assert.equal(script.calls[6].method, "POST");
  assert.equal(script.calls[6].url, `${origin}/v4/spreadsheets/abc/sheets/0:copyTo`);
  assert.deepEqual(JSON.parse(script.calls[6].payload), { destinationSpreadsheetId: "dest" });
  await script.api.spreadsheetsValuesGet({
    spreadsheetId: "abc",
    range: "Sheet1!A1:B2",
    majorDimension: "COLUMNS",
    valueRenderOption: "FORMULA",
    dateTimeRenderOption: "SERIAL_NUMBER",
  });
  assert.equal(script.calls[7].method, "GET");
  assert.equal(script.calls[7].url, `${origin}/v4/spreadsheets/abc/values/${encoded("Sheet1!A1:B2")}?majorDimension=COLUMNS&valueRenderOption=FORMULA&dateTimeRenderOption=SERIAL_NUMBER`);
  await script.api.spreadsheetsValuesUpdate({
    spreadsheetId: "abc",
    range: "A1:B2",
    valueInputOption: "RAW",
    includeValuesInResponse: false,
    responseValueRenderOption: "UNFORMATTED_VALUE",
    responseDateTimeRenderOption: "FORMATTED_STRING",
    values: [[1, null, false]],
  });
  assert.equal(script.calls[8].method, "PUT");
  assert.equal(script.calls[8].url, `${origin}/v4/spreadsheets/abc/values/${encoded("A1:B2")}?valueInputOption=RAW&includeValuesInResponse=false&responseValueRenderOption=UNFORMATTED_VALUE&responseDateTimeRenderOption=FORMATTED_STRING`);
  assert.deepEqual(JSON.parse(script.calls[8].payload), { range: "A1:B2", values: [[1, null, false]] });
  await script.api.spreadsheetsValuesAppend({
    spreadsheetId: "abc",
    range: "A1:B2",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "OVERWRITE",
    includeValuesInResponse: true,
    responseValueRenderOption: "FORMULA",
    responseDateTimeRenderOption: "SERIAL_NUMBER",
    majorDimension: "ROWS",
    values: [["a"]],
  });
  assert.equal(script.calls[9].method, "POST");
  assert.equal(script.calls[9].url, `${origin}/v4/spreadsheets/abc/values/${encoded("A1:B2")}:append?valueInputOption=USER_ENTERED&insertDataOption=OVERWRITE&includeValuesInResponse=true&responseValueRenderOption=FORMULA&responseDateTimeRenderOption=SERIAL_NUMBER`);
  assert.deepEqual(JSON.parse(script.calls[9].payload), { range: "A1:B2", majorDimension: "ROWS", values: [["a"]] });
  await script.api.spreadsheetsValuesClear({ spreadsheetId: "abc", range: "A1:B2" });
  assert.equal(script.calls[10].method, "POST");
  assert.equal(script.calls[10].url, `${origin}/v4/spreadsheets/abc/values/${encoded("A1:B2")}:clear`);
  assert.equal(script.calls[10].payload, "{}");
  assert.equal(script.calls[10].contentType, "application/json");
  const manyRanges = Array.from({ length: 51 }, (_, index) => `A${index + 1}`);
  await script.api.spreadsheetsValuesBatchGet({
    spreadsheetId: "abc",
    ranges: manyRanges,
    majorDimension: "ROWS",
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });
  assert.equal(script.calls[11].method, "GET");
  assert.equal(script.calls[11].url, `${origin}/v4/spreadsheets/abc/values:batchGet?${manyRanges.map((range) => `ranges=${encoded(range)}`).join("&")}&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`);
  const data = [{ range: "A1", values: [[1, null, false]], note: "kept" }];
  await script.api.spreadsheetsValuesBatchUpdate({
    spreadsheetId: "abc",
    valueInputOption: "RAW",
    data,
    includeValuesInResponse: false,
    responseValueRenderOption: "UNFORMATTED_VALUE",
    responseDateTimeRenderOption: "FORMATTED_STRING",
  });
  assert.equal(script.calls[12].method, "POST");
  assert.equal(script.calls[12].url, `${origin}/v4/spreadsheets/abc/values:batchUpdate`);
  assert.deepEqual(JSON.parse(script.calls[12].payload), {
    valueInputOption: "RAW",
    data,
    includeValuesInResponse: false,
    responseValueRenderOption: "UNFORMATTED_VALUE",
    responseDateTimeRenderOption: "FORMATTED_STRING",
  });
  await script.api.spreadsheetsValuesBatchClear({ spreadsheetId: "abc", ranges: ["A1", "B2"] });
  assert.equal(script.calls[13].method, "POST");
  assert.equal(script.calls[13].url, `${origin}/v4/spreadsheets/abc/values:batchClear`);
  assert.deepEqual(JSON.parse(script.calls[13].payload), { ranges: ["A1", "B2"] });
  await script.api.spreadsheetsValuesBatchGetByDataFilter({
    spreadsheetId: "abc",
    dataFilters,
    majorDimension: "COLUMNS",
    valueRenderOption: "FORMULA",
    dateTimeRenderOption: "SERIAL_NUMBER",
  });
  assert.equal(script.calls[14].method, "POST");
  assert.equal(script.calls[14].url, `${origin}/v4/spreadsheets/abc/values:batchGetByDataFilter`);
  assert.deepEqual(JSON.parse(script.calls[14].payload), {
    dataFilters,
    majorDimension: "COLUMNS",
    valueRenderOption: "FORMULA",
    dateTimeRenderOption: "SERIAL_NUMBER",
  });
  const filterData = [{ dataFilter: { a1Range: "A1:B2" }, majorDimension: "ROWS", values: [[null, "a"]] }];
  await script.api.spreadsheetsValuesBatchUpdateByDataFilter({
    spreadsheetId: "abc",
    valueInputOption: "USER_ENTERED",
    data: filterData,
    includeValuesInResponse: true,
    responseValueRenderOption: "FORMATTED_VALUE",
    responseDateTimeRenderOption: "SERIAL_NUMBER",
  });
  assert.equal(script.calls[15].method, "POST");
  assert.equal(script.calls[15].url, `${origin}/v4/spreadsheets/abc/values:batchUpdateByDataFilter`);
  assert.deepEqual(JSON.parse(script.calls[15].payload), {
    valueInputOption: "USER_ENTERED",
    data: filterData,
    includeValuesInResponse: true,
    responseValueRenderOption: "FORMATTED_VALUE",
    responseDateTimeRenderOption: "SERIAL_NUMBER",
  });
  await script.api.spreadsheetsValuesBatchClearByDataFilter({ spreadsheetId: "abc", dataFilters });
  assert.equal(script.calls[16].method, "POST");
  assert.equal(script.calls[16].url, `${origin}/v4/spreadsheets/abc/values:batchClearByDataFilter`);
  assert.deepEqual(JSON.parse(script.calls[16].payload), { dataFilters });
  assert.equal(script.calls.length, 17);
  assert.equal(script.api.getSpreadsheet, undefined);
  assert.equal(script.api.getValues, undefined);
  assert.equal(script.api.updateValues, undefined);
  assert.equal(script.api.appendValues, undefined);
  assert.equal(script.api.clearValues, undefined);
  assert.equal(script.api.batchGetValues, undefined);
  assert.equal(script.api.batchUpdateValues, undefined);
});

test("omitted Sheets parameters are not defaulted", async () => {
  const script = sheets();
  await script.api.spreadsheetsGet({ spreadsheetId: " abc " });
  assert.equal(script.calls[0].url, `${origin}/v4/spreadsheets/abc`);
  await script.api.spreadsheetsValuesAppend({ spreadsheetId: "abc", range: "A1:B2", valueInputOption: "RAW", values: [["a"]] });
  assert.equal(script.calls[1].url, `${origin}/v4/spreadsheets/abc/values/${encoded("A1:B2")}:append?valueInputOption=RAW`);
  assert.deepEqual(JSON.parse(script.calls[1].payload), { range: "A1:B2", values: [["a"]] });
  await script.api.spreadsheetsCreate({});
  assert.deepEqual(JSON.parse(script.calls[2].payload), {});
});

test("invalid Sheets input is rejected before the request", async () => {
  const script = sheets();
  await assert.rejects(() => script.api.spreadsheetsGet(), /SHEETS_INVALID_INPUT: input is required/);
  await assert.rejects(() => script.api.spreadsheetsValuesGet({ spreadsheet_id: "abc", range: "A1" }), /SHEETS_INVALID_INPUT: spreadsheetId is required/);
  await assert.rejects(() => script.api.spreadsheetsValuesUpdate({ spreadsheetId: "abc", range: "A1", values: [[1]] }), /SHEETS_INVALID_INPUT: valueInputOption must be /);
  await assert.rejects(() => script.api.spreadsheetsValuesAppend({ spreadsheetId: "abc", range: "A1", valueInputOption: "PASTE", values: [[1]] }), /SHEETS_INVALID_INPUT: valueInputOption must be /);
  await assert.rejects(() => script.api.spreadsheetsGet({ spreadsheetId: "abc", includeGridData: "true" }), /SHEETS_INVALID_INPUT: includeGridData must be a boolean/);
  await assert.rejects(() => script.api.spreadsheetsGet({ spreadsheetId: "abc", commentsViewMode: "omit" }), /SHEETS_INVALID_INPUT: commentsViewMode must be /);
  await assert.rejects(() => script.api.spreadsheetsSheetsCopyTo({ spreadsheetId: "abc", sheetId: "0", destinationSpreadsheetId: "dest" }), /SHEETS_INVALID_INPUT: sheetId must be an int32/);
  await assert.rejects(() => script.api.spreadsheetsDeveloperMetadataGet({ spreadsheetId: "abc", metadataId: 2147483648 }), /SHEETS_INVALID_INPUT: metadataId must be an int32/);
  await assert.rejects(() => script.api.spreadsheetsValuesUpdate({ spreadsheetId: "abc", range: "A1", valueInputOption: "RAW", values: [1] }), /SHEETS_INVALID_INPUT: values\[0\] must be an array/);
  await assert.rejects(() => script.api.spreadsheetsValuesBatchGet({ spreadsheetId: "abc", ranges: "A1" }), /SHEETS_INVALID_INPUT: ranges must contain at least one string/);
  await assert.rejects(() => script.api.spreadsheetsValuesBatchGetByDataFilter({ spreadsheetId: "abc", dataFilters: [{ a1Range: 1 }] }), /SHEETS_INVALID_INPUT: dataFilters\[0\].a1Range must be a string/);
  assert.equal(script.calls.length, 0);
});

test("Sheets failures keep the status and message", async () => {
  const missing = loadScript(() => ({ status: 404, body: { error: { code: 404, message: "Requested entity was not found." } } }));
  await assert.rejects(() => missing.api.spreadsheetsGet({ spreadsheetId: "abc" }), /SHEETS_REQUEST_FAILED \(404\): Requested entity was not found\./);
  const bare = loadScript(() => ({ status: 500, body: {} }));
  await assert.rejects(() => bare.api.spreadsheetsValuesGet({ spreadsheetId: "abc", range: "A1" }), (error) => {
    assert.equal(error.message, "SHEETS_REQUEST_FAILED (500)");
    assert.equal(error.message.includes("Bearer"), false);
    assert.equal(error.message.includes("token"), false);
    return true;
  });
  const text = loadScript(() => ({ status: 200, body: "not-json" }));
  await assert.rejects(() => text.api.spreadsheetsValuesClear({ spreadsheetId: "abc", range: "A1" }), /SHEETS_INVALID_RESPONSE: expected JSON/);
  const empty = loadScript(() => ({ status: 200, body: "  " }));
  await assert.rejects(() => empty.api.spreadsheetsCreate({}), /SHEETS_INVALID_RESPONSE: expected JSON/);
});
