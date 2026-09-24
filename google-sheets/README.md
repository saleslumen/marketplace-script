# Google Sheets

Google Sheets operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

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

This app has no installation settings. Spreadsheet id and range are operation arguments.

## Operations

| Operation | What it does |
| --- | --- |
| `getSpreadsheet` | Read the spreadsheet id, title, locale, time zone, and sheet list. |
| `getValues` | Read one range. |
| `updateValues` | Write rows to one range. |
| `appendValues` | Append rows to a table. |
| `clearValues` | Clear one range. |
| `batchGetValues` | Read 1 to 50 ranges. |
| `batchUpdateValues` | Write 1 to 50 ranges. |

The JSDoc on each function is the parameter and error contract.
