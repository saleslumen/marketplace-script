# Dynadot

Dynadot domain check, registration, and nameserver operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `dynadot`. The display label is `Dynadot API key`. Authorization mode is `USER`, and the connection is required.

Paste the Dynadot API key from Tools, API. REST calls send it as a bearer token. API3 calls send it as the key query parameter.

The connection kind is `API_KEY`. The connection key is `dynadotSecret`. The display label is `Dynadot API secret`. Authorization mode is `USER`, and the connection is required.

Paste the Dynadot API secret from Tools, API. REST calls use it to sign each request.

The app calls `https://api.dynadot.com` and `https://api-sandbox.dynadot.com`.

## Configuration

| Key | Type | Required |
| --- | --- | --- |
| `apiBase` | string | no |

When `apiBase` is omitted, or when it is `prod`, `production`, or empty, the app uses `https://api.dynadot.com`. `sandbox` selects `https://api-sandbox.dynadot.com`. A URL that contains `sandbox` selects the sandbox host. Any other value uses production.

## Operations

| Operation | What it does |
| --- | --- |
| `checkAvailability` | Check whether a domain is available. |
| `listDomains` | List domains in the account. |
| `getDomain` | Get one owned domain. |
| `registerDomains` | Register domains. |
| `ensureDomainsOwned` | Register any requested domain the account does not already own. |
| `setNameservers` | Set nameservers on domains. |
| `setNameserversForZones` | Set nameservers for each zone and read them back. |

The JSDoc on each function is the parameter and error contract.
