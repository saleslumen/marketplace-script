# Google Sheets

Google Sheets API v4 for a Saleslumen Marketplace app. Each operation is one documented method on `spreadsheets`, `spreadsheets.values`, `spreadsheets.sheets`, or `spreadsheets.developerMetadata`. Arguments use the Sheets parameter names. The return value is the Sheets response body. `http.js` is shared request code.

## Connection

The connection kind is `OAUTH`. The connection key is `google_sheets`. The display label is `Google Sheets`. Authorization mode is `USER`, and the connection is required.

Connect the Google account this app uses to read and write spreadsheets. The app calls `https://sheets.googleapis.com`.

Scopes:

- `https://www.googleapis.com/auth/spreadsheets`

Register the OAuth client, then copy the redirect URI from Saleslumen Marketplace onto that client.

| Setting | Value |
| --- | --- |
| Authorization URL | `https://accounts.google.com/o/oauth2/v2/auth` |
| Token URL | `https://oauth2.googleapis.com/token` |
| Revoke URL | `https://oauth2.googleapis.com/revoke` |
| Token authentication | `CLIENT_SECRET_POST` |

The revoke URL is optional.

Additional authorization parameters:

| Parameter | Value |
| --- | --- |
| `access_type` | `offline` |
| `prompt` | `consent` |

`access_type` `offline` makes Google return a refresh token. `prompt` `consent` makes a reconnect return one again. The broker rejects a first token response that has no refresh token.

## Configuration

This app has no installation settings. Spreadsheet id and the other method parameters are operation arguments.

## Operations

| Operation | What it does |
| --- | --- |
| `spreadsheetsBatchUpdate` | Apply one or more updates to a spreadsheet. |
| `spreadsheetsCreate` | Create a spreadsheet. |
| `spreadsheetsGet` | Return the spreadsheet at the given id. |
| `spreadsheetsGetByDataFilter` | Return the spreadsheet subsets that match the data filters. |
| `spreadsheetsDeveloperMetadataGet` | Return the developer metadata with the given metadata id. |
| `spreadsheetsDeveloperMetadataSearch` | Return developer metadata matching the data filters. |
| `spreadsheetsSheetsCopyTo` | Copy one sheet to another spreadsheet. |
| `spreadsheetsValuesAppend` | Append values to a spreadsheet. |
| `spreadsheetsValuesBatchClear` | Clear one or more ranges of values. |
| `spreadsheetsValuesBatchClearByDataFilter` | Clear ranges matched by data filters. |
| `spreadsheetsValuesBatchGet` | Return one or more ranges of values. |
| `spreadsheetsValuesBatchGetByDataFilter` | Return ranges of values matched by data filters. |
| `spreadsheetsValuesBatchUpdate` | Set values in one or more ranges. |
| `spreadsheetsValuesBatchUpdateByDataFilter` | Set values in ranges matched by data filters. |
| `spreadsheetsValuesClear` | Clear values from one range. |
| `spreadsheetsValuesGet` | Return one range of values. |
| `spreadsheetsValuesUpdate` | Set values in one range. |

The JSDoc on each function is the parameter and error contract.

## Errors

Invalid input throws `SHEETS_INVALID_INPUT: <reason>`. A non-2xx Sheets response throws `SHEETS_REQUEST_FAILED (<status>): <message>` when Sheets sends an error message, or `SHEETS_REQUEST_FAILED (<status>)` when it does not. An unreadable body throws `SHEETS_INVALID_RESPONSE: expected JSON`. The access token is not included in these errors.
