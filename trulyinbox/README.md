# TrulyInbox

TrulyInbox workspace, email account, warmup, deliverability, and billing operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code. A successful call returns the TrulyInbox response body. An empty body returns no value.

Documentation: [https://dev.trulyinbox.com/docs](https://dev.trulyinbox.com/docs)

## Connection

The connection kind is `API_KEY`. The connection key is `trulyinbox`. The display label is `TrulyInbox`. Authorization mode is `USER`, and the connection is required.

Paste a TrulyInbox API key from Settings, API keys. The app sends it as `Authorization: Bearer`. The app calls `https://lynx-api.trulyinbox.com`. `health` does not send the key.

## Configuration

This app has no installation settings. `workspaceId` is the numeric TrulyInbox workspace id and is an argument on every workspace route.

## Operations

| Function | Method and path | Required inputs |
| --- | --- | --- |
| `health` | `GET /v2/health` | none |
| `getRateLimitStatus` | `GET /v2/workspaces/{workspaceId}/rate-limit` | `workspaceId` |
| `getBulkEmailAccountStatus` | `POST /v2/workspaces/{workspaceId}/accounts/bulk-status` | `workspaceId`, `accountIds` |
| `bulkUpdateAccountTags` | `POST /v2/workspaces/{workspaceId}/accounts/bulk/tags` | `workspaceId`, `ids` |
| `listEmailAccounts` | `GET /v2/workspaces/{workspaceId}/accounts` | `workspaceId` |
| `connectEmailAccount` | `POST /v2/workspaces/{workspaceId}/accounts` | `workspaceId`, `emailAddress`, `smtpHost`, `smtpPort`, `smtpEncryption`, `imapHost`, `imapPort`, `imapEncryption`, `smtpUsername`, `password` |
| `getEmailAccountOauthUrl` | `POST /v2/workspaces/{workspaceId}/accounts/oauth-url` | `workspaceId`, `provider` |
| `connectPartnerOauthAccount` | `POST /v2/workspaces/{workspaceId}/accounts/oauth` | `workspaceId`, `provider`, `emailAddress`, `accessToken`, `expiresAt` |
| `getMicrosoftMailboxConsentUrl` | `GET /v2/workspaces/{workspaceId}/accounts/microsoft/consent-url` | `workspaceId`, `email` |
| `getEmailAccount` | `GET /v2/workspaces/{workspaceId}/accounts/{id}` | `workspaceId`, `id` |
| `deleteEmailAccount` | `DELETE /v2/workspaces/{workspaceId}/accounts/{id}` | `workspaceId`, `id` |
| `getEmailAccountOverview` | `GET /v2/workspaces/{workspaceId}/accounts/{id}/overview` | `workspaceId`, `id` |
| `disconnectEmailAccount` | `POST /v2/workspaces/{workspaceId}/accounts/{id}/disconnect` | `workspaceId`, `id` |
| `listTags` | `GET /v2/workspaces/{workspaceId}/tags` | `workspaceId` |
| `createTag` | `POST /v2/workspaces/{workspaceId}/tags` | `workspaceId`, `name` |
| `setAccountTags` | `PUT /v2/workspaces/{workspaceId}/accounts/{id}/tags` | `workspaceId`, `id`, `tags` |
| `getMicrosoftConsentUrl` | `GET /v2/workspaces/{workspaceId}/provider-workspaces/microsoft/consent-url` | `workspaceId` |
| `listProviderWorkspaces` | `GET /v2/workspaces/{workspaceId}/provider-workspaces` | `workspaceId` |
| `registerProviderWorkspace` | `POST /v2/workspaces/{workspaceId}/provider-workspaces` | `workspaceId`, `provider`; `adminEmail` when `provider` is `google`; `tenantId` and `state` when `provider` is `microsoft` |
| `previewProviderWorkspace` | `GET /v2/workspaces/{workspaceId}/provider-workspaces/{providerWorkspaceId}/preview` | `workspaceId`, `providerWorkspaceId` |
| `syncProviderWorkspace` | `POST /v2/workspaces/{workspaceId}/provider-workspaces/{providerWorkspaceId}/sync` | `workspaceId`, `providerWorkspaceId`, `selectAll`, `enableWarmup` |
| `getProviderWorkspaceSyncStatus` | `GET /v2/workspaces/{workspaceId}/provider-workspaces/{providerWorkspaceId}/sync-status` | `workspaceId`, `providerWorkspaceId`, `jobId` |
| `listWorkspaces` | `GET /v2/workspaces` | none |
| `createWorkspace` | `POST /v2/workspaces` | `name` |
| `listWorkspaceQuotas` | `GET /v2/workspaces/quotas` | none |
| `updateWorkspaceQuotas` | `PATCH /v2/workspaces/quotas` | `quotas` |
| `getWorkspace` | `GET /v2/workspaces/{workspaceId}` | `workspaceId` |
| `updateWorkspace` | `PATCH /v2/workspaces/{workspaceId}` | `workspaceId`, `name` |
| `listMembers` | `GET /v2/workspaces/{workspaceId}/members` | `workspaceId` |
| `inviteMember` | `POST /v2/workspaces/{workspaceId}/members/invite` | `workspaceId`, `email`, `role` |
| `updateMemberRole` | `PATCH /v2/workspaces/{workspaceId}/members/{userId}` | `workspaceId`, `userId`, `role` |
| `removeMember` | `DELETE /v2/workspaces/{workspaceId}/members/{userId}` | `workspaceId`, `userId` |
| `getBillingSummary` | `GET /v2/workspaces/{workspaceId}/billing/summary` | `workspaceId` |
| `getBillingCapabilities` | `GET /v2/workspaces/{workspaceId}/billing/capabilities` | `workspaceId` |
| `bulkEnableWarmup` | `POST /v2/workspaces/{workspaceId}/accounts/bulk/warmup/enable` | `workspaceId`, `ids` |
| `bulkPauseWarmup` | `POST /v2/workspaces/{workspaceId}/accounts/bulk/warmup/pause` | `workspaceId`, `ids` |
| `getWarmupStatus` | `GET /v2/workspaces/{workspaceId}/accounts/{id}/warmup` | `workspaceId`, `id` |
| `getWarmupActivity` | `GET /v2/workspaces/{workspaceId}/accounts/{id}/warmup/activity` | `workspaceId`, `id` |
| `getWarmupSettings` | `GET /v2/workspaces/{workspaceId}/accounts/{id}/warmup/settings` | `workspaceId`, `id` |
| `updateWarmupSettings` | `PATCH /v2/workspaces/{workspaceId}/accounts/{id}/warmup/settings` | `workspaceId`, `id` |
| `enableWarmup` | `POST /v2/workspaces/{workspaceId}/accounts/{id}/warmup/enable` | `workspaceId`, `id` |
| `pauseWarmup` | `POST /v2/workspaces/{workspaceId}/accounts/{id}/warmup/pause` | `workspaceId`, `id` |
| `resumeWarmup` | `POST /v2/workspaces/{workspaceId}/accounts/{id}/warmup/resume` | `workspaceId`, `id` |
| `getDnsHealth` | `GET /v2/workspaces/{workspaceId}/accounts/{id}/dns` | `workspaceId`, `id` |
| `getSetupScore` | `GET /v2/workspaces/{workspaceId}/accounts/{id}/setup-score` | `workspaceId`, `id` |
| `refreshSetupScore` | `POST /v2/workspaces/{workspaceId}/accounts/{id}/setup-score/refresh` | `workspaceId`, `id` |
| `getAccountDeliverability` | `GET /v2/workspaces/{workspaceId}/accounts/{id}/deliverability` | `workspaceId`, `id` |
| `getAccountStats` | `GET /v2/workspaces/{workspaceId}/accounts/{id}/analytics/stats` | `workspaceId`, `id` |
