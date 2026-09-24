# Zapmail

Zapmail mailbox, domain, and DNS operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `zapmail`. The display label is `Zapmail`. Authorization mode is `USER`, and the connection is required.

Paste the Zapmail API key from Dashboard, Settings, Integrations, API. The app sends it as the `x-auth-zapmail` header. The app calls `https://api.zapmail.ai`.

## Configuration

This app has no installation settings. Workspace and domain are operation arguments.

## Operations

| Operation | What it does |
| --- | --- |
| `createWorkspace` | Create a workspace. |
| `listMailboxes` | List mailboxes in a workspace. |
| `listActiveGoogleMailboxes` | List active Google mailboxes. |
| `listDomains` | List domains in a workspace. |
| `getConnectNameservers` | Return the nameservers required before connecting a domain. |
| `connectDomains` | Connect domains. |
| `checkDns` | Check MX, SPF, DKIM, and DMARC for domains. |
| `ensureDomainsConnected` | Connect the requested domains and check Google mail DNS. |
| `assignMailboxes` | Assign mailboxes that are not already on the domain. |
| `ensureMailboxesOwned` | Assign any expected mailbox that is not already present. |
| `addGoogleClientId` | Add the Google OAuth client id to domains. |
| `initiateCustomOAuth` | Submit Google OAuth URLs for mailbox consent. |
| `listMailboxesNeedingConsent` | List active Google mailboxes that are not connected. |
| `initiateConsentsForMailboxes` | Submit one consent URL for each mailbox that still needs consent. |

The JSDoc on each function is the parameter and error contract.
