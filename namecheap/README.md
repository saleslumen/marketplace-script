# Namecheap

Namecheap domain check, registration, and nameserver operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `namecheap`. The display label is `Namecheap API key`. Authorization mode is `USER`, and the connection is required.

Paste the Namecheap API key from Profile, Tools, API Access. The app sends it as the ApiKey query parameter. Whitelist the client IP in Namecheap before calling. The app calls `https://api.namecheap.com` and `https://api.sandbox.namecheap.com`.

## Configuration

| Key | Type | Required |
| --- | --- | --- |
| `apiBase` | string | no |
| `apiUser` | string | yes |
| `clientIp` | string | yes |
| `userName` | string | yes |

`apiUser` is the Namecheap API user. The app sends it as the `ApiUser` query parameter.

`userName` is the Namecheap account username. The app sends it as the `UserName` query parameter.

`clientIp` is the public IPv4 address whitelisted in Namecheap. The app sends it as the `ClientIp` query parameter.

When `apiBase` is omitted, the app uses `https://api.namecheap.com/xml.response`. `sandbox` selects `https://api.sandbox.namecheap.com/xml.response`. Any other `https` URL is the API base.

## Operations

| Operation | What it does |
| --- | --- |
| `listDomains` | List domains in the account. |
| `checkAvailability` | Check whether domains are available. |
| `registerDomains` | Register domains. |
| `ensureDomainsOwned` | Register any requested domain the account does not already own. |
| `setNameservers` | Set custom nameservers on domains. |
| `setNameserversForZones` | Set nameservers for each zone. |

The JSDoc on each function is the parameter and error contract.
