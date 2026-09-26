# Browserbase

Browserbase API. Each operation is one function and returns the Browserbase response body. `http.js` is shared request code.

The contract is https://docs.browserbase.com/reference/api.

## Connection

The connection kind is `API_KEY`. The connection key is `browserbase`. The display label is `Browserbase`. Authorization mode is `USER`, and the connection is required.

Paste the Browserbase API key. The app sends it as the `X-BB-API-Key` header. The app calls `https://api.browserbase.com`.

## Configuration

This app has no installation settings. Project id, when needed, is an operation argument. Browserbase infers the project from the API key when `projectId` is omitted.

## Operations

| Operation | What it does |
| --- | --- |
| `createSession` | Create a session. POST `/v1/sessions`. |
| `listSessions` | List sessions. GET `/v1/sessions`. |
| `getSession` | Get a session. GET `/v1/sessions/{id}`. |
| `updateSession` | Update a session. POST `/v1/sessions/{id}` with `status` `REQUEST_RELEASE`. |
| `sessionLiveUrls` | Session live URLs. GET `/v1/sessions/{id}/debug`. |
| `sessionLogs` | Session logs. GET `/v1/sessions/{id}/logs`. |
| `getSessionReplay` | Get session replay page metadata. GET `/v1/sessions/{id}/replays`. |
| `getReplayPage` | Get one replay page as an HLS playlist. GET `/v1/sessions/{id}/replays/{pageId}`. |
| `createSessionRecordingDownloads` | Request MP4 downloads for a session recording. POST `/v1/sessions/{id}/recording/downloads`. |
| `listSessionRecordingDownloads` | List recording download status. GET `/v1/sessions/{id}/recording/downloads`. |
| `createSessionUploads` | Upload a file to a session. POST `/v1/sessions/{id}/uploads` with multipart field `file`. |
| `listDownloads` | List downloads for a session. GET `/v1/downloads`. |
| `getDownload` | Get download metadata, or the file body when `Accept` is `application/octet-stream`. GET `/v1/downloads/{id}`. |
| `deleteDownload` | Delete a download. DELETE `/v1/downloads/{id}`. |
| `createContext` | Create a context. POST `/v1/contexts`. |
| `getContext` | Get a context. GET `/v1/contexts/{id}`. |
| `deleteContext` | Delete a context. DELETE `/v1/contexts/{id}`. |
| `uploadExtension` | Upload an extension. POST `/v1/extensions` with multipart field `file`. |
| `getExtension` | Get an extension. GET `/v1/extensions/{id}`. |
| `deleteExtension` | Delete an extension. DELETE `/v1/extensions/{id}`. |
| `listProjects` | List projects. GET `/v1/projects`. |
| `getProject` | Get a project. GET `/v1/projects/{id}`. |
| `getProjectUsage` | Get project usage. GET `/v1/projects/{id}/usage`. |

The JSDoc on each function is the parameter contract.

## Errors

Invalid input throws `BROWSERBASE_REQUEST_FAILED: <reason>`. A non-2xx Browserbase response throws `BROWSERBASE_REQUEST_FAILED (<status>): <body>`. The API key is not included in either error. An empty 2xx body returns `null`.
