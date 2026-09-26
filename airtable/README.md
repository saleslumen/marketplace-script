# Airtable

Airtable Web API. Each operation is one function and returns the Airtable response body. `http.js` is shared request code.

Every call takes the base, table, and record ids on its input. This app does not store a base, a table, or a record.

## Connection

The connection kind is `API_KEY`. The connection key is `airtable`. The display label is `Airtable`. Authorization mode is `USER`, and the connection is required.

Paste the Airtable personal access token. The app sends it to Airtable as a bearer token. Record, schema, comment, and webhook calls use `https://api.airtable.com`. `uploadAttachment` uses `https://content.airtable.com`.

## Configuration

This app has no installation settings.

## Operations

| Operation | What it does |
| --- | --- |
| `listRecords` | List one page of records. A URL of 16000 characters or more is sent as POST `/{baseId}/{tableIdOrName}/listRecords`. |
| `getRecord` | Get one record. |
| `createRecords` | Create up to 10 records. |
| `updateRecords` | PATCH up to 10 records, or upsert them when `performUpsert.fieldsToMergeOn` is set. |
| `replaceRecords` | PUT up to 10 records. Clears omitted fields. Also supports `performUpsert`. |
| `updateRecord` | PATCH one record. |
| `replaceRecord` | PUT one record. Clears omitted fields. |
| `deleteRecord` | Delete one record. |
| `deleteRecords` | Delete up to 10 records. |
| `uploadAttachment` | Upload one attachment up to 5 MB to `content.airtable.com`. |
| `syncCsvData` | POST raw CSV to a Sync API table. |
| `listBases` | List bases the token can access. |
| `getBaseSchema` | Return the tables, fields, and views in a base. |
| `createBase` | Create a base and its tables. |
| `createTable` | Create a table. |
| `updateTable` | Update a table name, description, or date dependency settings. |
| `createField` | Create a field. |
| `updateField` | Update a field name, description, or options. |
| `listViews` | List views in a base. |
| `getViewMetadata` | Get one view. |
| `getBaseCollaborators` | Get base metadata, and collaborators, invites, interfaces, or packages when `include` asks for them. |
| `getInterface` | Get one interface. |
| `getWorkspaceCollaborators` | Get workspace metadata, and collaborators or invite links when `include` asks for them. |
| `listBlockInstallations` | List block installations in a base. |
| `listComments` | List comments on a record, newest first. |
| `createComment` | Create a comment. |
| `updateComment` | Update a comment. |
| `deleteComment` | Delete a comment. |
| `listWebhooks` | List webhooks on a base. |
| `createWebhook` | Create a webhook. |
| `deleteWebhook` | Delete a webhook. |
| `refreshWebhook` | Extend a webhook expiration by 7 days. |
| `enableWebhookNotifications` | Enable or disable webhook notification pings. |
| `listWebhookPayloads` | List webhook payloads. `limit` is at most 50. |
| `getUserInfo` | Return the token user from `/meta/whoami`. |

The JSDoc on each function is the parameter contract.

## Errors

Invalid input throws `AIRTABLE_INVALID_INPUT: <reason>`. A non-2xx Airtable response throws `AIRTABLE_REQUEST_FAILED: <status> <message>`. The token is not included in either error.

## Personal access token scopes

| Functions | Scope |
| --- | --- |
| `listRecords`, `getRecord` | `data.records:read` |
| `createRecords`, `updateRecords`, `replaceRecords`, `updateRecord`, `replaceRecord`, `deleteRecord`, `deleteRecords`, `uploadAttachment` | `data.records:write` |
| `syncCsvData` | `data.records:write` and `schema.bases:write` |
| `listComments` | `data.recordComments:read` |
| `createComment`, `updateComment`, `deleteComment` | `data.recordComments:write` |
| `listBases`, `getBaseSchema` | `schema.bases:read` |
| `getBaseCollaborators` | `schema.bases:read` and `workspacesAndBases:read` |
| `createBase`, `createTable`, `updateTable`, `createField`, `updateField` | `schema.bases:write` |
| `listViews`, `getViewMetadata`, `getInterface`, `getWorkspaceCollaborators`, `listBlockInstallations` | `workspacesAndBases:read` |
| `listWebhooks`, `deleteWebhook`, `refreshWebhook`, `enableWebhookNotifications` | `webhook:manage` |
| `createWebhook`, `listWebhookPayloads` | Scopes depend on the webhook `dataTypes`. `webhook:manage` covers managing the webhook. |
| `getUserInfo` | No scope. `email` is returned only when the token also has `user.email:read`. |

`syncCsvData` is available on the Pro, legacy Enterprise, and Enterprise Scale plans. The other operations above are available on all plans. Enterprise admin, HyperDB, and SCIM endpoints are not in this app.
