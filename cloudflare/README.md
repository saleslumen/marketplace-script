# Cloudflare

Cloudflare DNS zone and record operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `cloudflare`. The display label is `Cloudflare`. Authorization mode is `USER`, and the connection is required.

Paste the Cloudflare API token for this account. The app sends it to Cloudflare as a bearer token. Pass the account id on each operation. The app calls `https://api.cloudflare.com`.

## Configuration

This app has no installation settings. Account id is an operation argument.

## Operations

| Operation | What it does |
| --- | --- |
| `createZones` | Create a zone for each domain, or return the existing zone, and return its nameservers. |
| `ensureZonesActive` | Require every requested zone to be active. |
| `getZone` | Get one zone, including nameservers and status. |
| `listDnsRecords` | List DNS records for a zone. |
| `deleteDnsRecordsByMatch` | Delete DNS records that match type and host. |
| `cleanupDnsConflicts` | Delete DNS records that conflict with an InboxKit domain connect. |
| `exportDns` | Export a zone's DNS records as BIND text. |

The JSDoc on each function is the parameter and error contract.
