# AI Ark

AI Ark people search and export operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `aiark`. The display label is `AI Ark`. Authorization mode is `USER`, and the connection is required.

Paste the AI Ark API key from the API Management Dashboard. The app sends it as the `X-TOKEN` header. The app calls `https://api.ai-ark.com`.

## Configuration

This app has no installation settings.

## Operations

| Operation | What it does |
| --- | --- |
| `previewPeople` | Preview people that match a filter. |
| `searchPeople` | Search people. |
| `getExportStatus` | Read export status for one track id. |
| `listExportInquiries` | List one page of export inquiries. |
| `ensurePeopleExport` | Submit a people export, then read its status and inquiries. |

The JSDoc on each function is the parameter and error contract.
