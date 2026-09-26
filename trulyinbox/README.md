# TrulyInbox

TrulyInbox email account, workspace, warmup, deliverability, and report operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code. A successful call returns the TrulyInbox response body.

Documentation: [https://developer.trulyinbox.com/api-reference/introduction](https://developer.trulyinbox.com/api-reference/introduction)

## Connection

The connection kind is `API_KEY`. The connection key is `trulyinbox`. The display label is `TrulyInbox`. Authorization mode is `USER`, and the connection is required.

Paste the TrulyInbox API key from Settings, API. The app sends it as the `X-Api-Key` header. The app calls `https://lupus-edge.trulyinbox.com`.

## Configuration

This app has no installation settings.

## Operations

| Function | Method and path | Required inputs |
| --- | --- | --- |
| `health` | `GET /v1/health` | none |
| `getRateLimitStatus` | `GET /v1/rate-limit` | none |
| `listEmailAccounts` | `GET /v1/email-accounts` | none |
| `connectSmtpImapAccount` | `POST /v1/email-accounts` | `emailServiceProvider`, `smtp.emailAddress`, `smtp.host`, `smtp.port`, `smtp.password`, `smtp.encryption`, `imap.host`, `imap.port`, `imap.password`, `imap.encryption` |
| `getMicrosoftSingleConsentUrl` | `GET /v1/email-accounts/microsoft/consent-url` | `email` |
| `disconnectEmailAccount` | `POST /v1/email-accounts/{emailAccountId}/disconnect` | `emailAccountId` |
| `deleteEmailAccount` | `DELETE /v1/email-accounts/{emailAccountId}` | `emailAccountId` |
| `deleteEmailAccountsBulk` | `POST /v1/email-accounts/bulk-delete` | `emailAccountIds` |
| `getEmailAccountStatus` | `GET /v1/email-accounts/{emailAccountId}/status` | `emailAccountId` |
| `getBulkEmailAccountStatus` | `POST /v1/email-accounts/bulk-status` | `emailAccountIds` |
| `assignEmailAccountTags` | `POST /v1/email-accounts/tags/assign` | `emailAccountIds`, `tags` |
| `unassignEmailAccountTags` | `POST /v1/email-accounts/tags/unassign` | `emailAccountIds`, `tags` |
| `getMicrosoftConsentUrl` | `GET /v1/workspaces/microsoft/consent-url` | none |
| `connectWorkspace` | `POST /v1/workspaces` | `provider`; `adminEmail` when `provider` is `google`; `tenantId` when `provider` is `microsoft` |
| `getWorkspaceSyncPreview` | `GET /v1/workspaces/{workspaceId}/preview` | `workspaceId` |
| `confirmWorkspaceSync` | `POST /v1/workspaces/{workspaceId}/sync` | `workspaceId`, `selectAll`, `enableWarmup` |
| `getWorkspaceSyncStatus` | `GET /v1/workspaces/{workspaceId}/sync-status` | `workspaceId`, `jobId` |
| `getWarmupSettings` | `GET /v1/warmup-settings/{emailAccountId}` | `emailAccountId` |
| `getWarmupStatus` | `GET /v1/warmup-status/{emailAccountId}` | `emailAccountId` |
| `updateWarmupSettings` | `PATCH /v1/warmup-settings/{emailAccountId}` | `emailAccountId` |
| `startWarmup` | `POST /v1/warmup-settings/{emailAccountId}/start` | `emailAccountId` |
| `stopWarmup` | `POST /v1/warmup-settings/{emailAccountId}/stop` | `emailAccountId` |
| `bulkWarmupAction` | `POST /v1/warmup-settings/bulk-action` | `action` |
| `getSetupScore` | `GET /v1/setup-score/{emailAccountId}` | `emailAccountId` |
| `refreshSetupScore` | `POST /v1/setup-score/{emailAccountId}/refresh` | `emailAccountId` |
| `getDnsHealth` | `GET /v1/dns-health/{emailAccountId}` | `emailAccountId` |
| `getDeliverabilityScore` | `POST /v1/deliverability-score/{emailAccountId}` | `emailAccountId`, `startDate`, `endDate` |
| `getDashboard` | `GET /v1/dashboard` | none |
| `getSingleReport` | `POST /v1/reports` | `emailAccountId` |
| `getBulkReport` | `POST /v1/reports/bulk` | `emailAccountIds` |
| `exportReport` | `POST /v1/reports/export` | `from`, `to` |

OAuth email-account connect is documented as unavailable and is therefore not exposed.

The JSDoc on each function is the parameter and error contract.
