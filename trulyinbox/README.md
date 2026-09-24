# TrulyInbox

TrulyInbox workspace, mailbox, warmup, and DNS health operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `trulyinbox`. The display label is `TrulyInbox`. Authorization mode is `USER`, and the connection is required.

Paste the TrulyInbox API key from Settings, API. The app sends it as the `X-Api-Key` header. The app calls `https://lupus-edge.trulyinbox.com`.

## Configuration

This app has no installation settings.

## Operations

| Operation | What it does |
| --- | --- |
| `registerGoogleWorkspace` | Register a Google Workspace for bulk connect. |
| `previewWorkspaceMailboxes` | Preview mailboxes not yet connected. |
| `syncWorkspace` | Start bulk-connect sync. |
| `getWorkspaceSyncStatus` | Read one sync job. |
| `listEmailAccounts` | List connected email accounts. |
| `getEmailAccount` | Get one email account. |
| `startWarmup` | Start warmup for one connected email account. |
| `getWarmupSettings` | Get warmup settings for one email account. |
| `updateWarmupSettings` | Update warmup settings for one email account. |
| `getWarmupStatus` | Get warmup status for one email account. |
| `stopWarmup` | Stop warmup for one connected email account. |
| `bulkWarmupAction` | Start or stop warmup for many email accounts. |
| `getMicrosoftWorkspaceConsentUrl` | Get the Microsoft admin-consent URL for tenant-wide bulk connect. |
| `registerMicrosoftWorkspace` | Register a Microsoft tenant workspace after admin consent. |
| `getMicrosoftMailboxConsentUrl` | Get a single-use Microsoft mailbox OAuth consent URL. |
| `connectSmtpImapAccount` | Connect one mailbox with SMTP/IMAP credentials. |
| `connectEmailAccountOAuth` | Connect one mailbox with OAuth. |
| `disconnectEmailAccount` | Temporarily disconnect an email account without deleting it. |
| `deleteEmailAccount` | Permanently delete one email account and its warmup history. |
| `getEmailAccountsBulkStatus` | Get status for up to 50 email accounts. |
| `deleteEmailAccountsBulk` | Permanently delete up to 20 email accounts. |
| `assignEmailAccountTags` | Assign tags to email accounts. |
| `unassignEmailAccountTags` | Unassign tags from email accounts. |
| `getSetupScore` | Get the cached setup score. |
| `refreshSetupScore` | Refresh the setup score for one email account. |
| `getDnsHealth` | Check SPF, DKIM, DMARC, and MX. |
| `getDeliverabilityScore` | Get warmup deliverability rates for a date range. |
| `getAccountReport` | Daily warmup report for one email account. |
| `getBulkReport` | Daily warmup reports for up to 50 email accounts. |
| `exportReport` | Email a warmup report as CSV. |
| `getDashboard` | Get account-wide warmup totals. |
| `getHealth` | Check whether the API is available. |
| `getRateLimit` | Read the current rate-limit window. |
| `ensureGoogleWorkspaceWarmup` | Register or reuse a Google Workspace, sync the expected mailboxes, and start warmup. |

The JSDoc on each function is the parameter and error contract.
