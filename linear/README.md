# Linear

Linear issue operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `linear`. The display label is `Linear`. Authorization mode is `USER`, and the connection is required.

Paste the Linear personal API key from Settings, API. The app sends it as the Authorization header. The app calls `https://api.linear.app`.

## Configuration

| Key | Type | Required |
| --- | --- | --- |
| `teamId` | string | no |

When `teamId` is omitted, operations that resolve team id from configuration require `teamId` on the input. When both are set, the operation value is used.

## Operations

| Operation | What it does |
| --- | --- |
| `findIssueByCorrelation` | Find an existing issue by its correlation id. |
| `createIssue` | Create an issue. |
| `getIssue` | Get an issue, including its state and team. |
| `evaluateWebhookIssueUpdate` | Check a webhook payload and completed-issue claims. |
| `updateIssue` | Update an issue and optionally add a comment. |

The JSDoc on each function is the parameter and error contract.
