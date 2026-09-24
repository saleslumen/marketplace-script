# InboxKit

InboxKit mailbox, consent, and domain DNS operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `cloudflare`. The display label is `Cloudflare API token`. Authorization mode is `USER`, and the connection is not required.

Paste the Cloudflare API token used when connecting domains in InboxKit. The app sends that token to InboxKit with the connect request.

The connection kind is `API_KEY`. The connection key is `inboxkit`. The display label is `InboxKit`. Authorization mode is `USER`, and the connection is required.

Paste the InboxKit API key from Settings, API and Integrations. The app sends it as a bearer token. The app calls `https://api.inboxkit.com`.

## Configuration

This app has no installation settings. Workspace id and domain are operation arguments.

## Operations

| Operation | What it does |
| --- | --- |
| `buyMailboxes` | Buy mailboxes on a domain in the workspace. |
| `connectCloudflareDomains` | Connect domains with the Cloudflare API token. |
| `createWorkspace` | Create a workspace. |
| `ensureCloudflareDomainsConnected` | Connect any requested domain that is not already connected. |
| `ensureGoogleEmailDns` | Verify Google email DNS, repair it, and verify it again. |
| `ensureMailboxesOwned` | Buy any expected mailbox that is not already active or pending. |
| `getActiveAdminMailbox` | Get one active Google admin mailbox. |
| `getConsentStatus` | Read one consent request. |
| `initiateConsentForMailboxes` | Start consent for mailboxes. |
| `initiateConsentRequest` | Start a mailbox consent request with a supplied consent URL. |
| `initiateConsentSafe` | Start consent without marking the mailboxes connected. |
| `initiateConsentsForMailboxes` | Start consent for each mailbox with its own consent URL. |
| `listActiveGoogleMailboxes` | List active Google mailboxes. |
| `listConnectedCloudflareDomains` | List Cloudflare-connected domains in a workspace. |
| `listDnsRecords` | List DNS records for one domain. |
| `listDomains` | List domains in a workspace. |
| `listGoogleMailboxes` | List Google mailboxes. |
| `listMailboxesNeedingConsent` | List active Google mailboxes that are not connected. |
| `readConsentStatus` | Read one consent status. |
| `repairDns` | Repair Google email DNS for a domain. |
| `verifyDns` | Check Google or Microsoft email DNS for domains. |

The JSDoc on each function is the parameter and error contract.
