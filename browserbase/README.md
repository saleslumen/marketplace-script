# Browserbase

Browserbase session operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `browserbase`. The display label is `Browserbase`. Authorization mode is `USER`, and the connection is required.

Paste the Browserbase API key. The app sends it as the `X-BB-API-Key` header. The app calls `https://api.browserbase.com`.

## Configuration

| Key | Type | Required |
| --- | --- | --- |
| `projectId` | string | no |

When `projectId` is omitted, `createSession` does not send a project id unless the operation input includes `projectId`. When `projectId` is set, `createSession` uses it as the default.

## Operations

| Operation | What it does |
| --- | --- |
| `createSession` | Create a session. |
| `getSession` | Get one session. |
| `endSession` | End a session. |

The JSDoc on each function is the parameter and error contract.
