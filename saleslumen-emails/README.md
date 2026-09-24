# Saleslumen Emails

Saleslumen Emails operations for a Saleslumen Marketplace app. Each operation is one function and calls the matching Emails platform method.

## Connection

This app has no connection. It calls the Saleslumen Emails service.

Scopes:

- `emails.accounts.execute`
- `emails.accounts.read`
- `emails.accounts.write`
- `emails.attachments.read`
- `emails.connections.read`
- `emails.connections.write`
- `emails.drafts.execute`
- `emails.drafts.read`
- `emails.drafts.write`
- `emails.labels.read`
- `emails.labels.write`
- `emails.messages.execute`
- `emails.messages.read`
- `emails.messages.write`
- `emails.refresh.write`
- `emails.threads.execute`
- `emails.threads.read`
- `emails.threads.write`
- `emails.tools.execute`
- `emails.tools.read`

## Configuration

This app has no installation settings. Path, query, and body fields are operation arguments.

## Operations

| Operation | What it does |
| --- | --- |
| `listAccounts` | List email accounts. |
| `createAccount` | Create an email account. |
| `getAccount` | Get one email account. |
| `updateAccount` | Update an email account. |
| `deleteAccount` | Delete an email account. |
| `batchCreateAccounts` | Create email accounts in one batch. |
| `createOauthConnection` | Create an OAuth connection. |
| `getOauthConnection` | Get an OAuth connection. |
| `refreshToken` | Refresh OAuth tokens. |
| `listMessages` | List messages. |
| `getMessage` | Get one message. |
| `sendMessage` | Send a message. |
| `generateQuotedContent` | Generate quoted content for a reply or forward. |
| `trashMessage` | Move a message to trash. |
| `untrashMessage` | Restore a message from trash. |
| `deleteMessage` | Permanently delete a message. |
| `modifyMessage` | Modify message labels or scheduled time. |
| `batchDeleteMessages` | Permanently delete messages. |
| `batchModifyMessages` | Modify labels on messages. |
| `getAttachment` | Get one message attachment. |
| `listThreads` | List threads. |
| `getThread` | Get one thread. |
| `deleteThread` | Permanently delete a thread. |
| `modifyThread` | Modify labels on a thread. |
| `trashThread` | Move a thread to trash. |
| `untrashThread` | Restore a thread from trash. |
| `listLabels` | List labels. |
| `getLabel` | Get one label. |
| `createLabel` | Create a user label. |
| `updateLabel` | Rename a user label. |
| `deleteLabel` | Delete a user label. |
| `listDrafts` | List drafts. |
| `getDraft` | Get one draft. |
| `createDraft` | Create a draft. |
| `updateDraft` | Replace a draft. |
| `sendDraft` | Send a draft. |
| `deleteDraft` | Permanently delete a draft. |
| `findEmails` | Discover an email for a person at a domain. |
| `verifyEmails` | Verify email addresses. |
| `verifyImap` | Test an IMAP connection. |
| `verifySmtp` | Test an SMTP connection. |

The JSDoc on each function is the parameter and error contract.
