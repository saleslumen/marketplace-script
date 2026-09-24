# Spaceship

Spaceship domain check, registration, and nameserver operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `spaceship`. The display label is `Spaceship API key`. Authorization mode is `USER`, and the connection is required.

Paste the Spaceship API key. The app sends it as the `X-Api-Key` header.

The connection kind is `API_KEY`. The connection key is `spaceshipSecret`. The display label is `Spaceship API secret`. Authorization mode is `USER`, and the connection is required.

Paste the Spaceship API secret. The app sends it as the `X-Api-Secret` header.

The app calls `https://spaceship.dev`.

## Configuration

This app has no installation settings.

## Operations

| Operation | What it does |
| --- | --- |
| `checkAvailability` | Check whether domains are available. |
| `registerDomains` | Register domains and wait for each registration to finish. |
| `ensureDomainsOwned` | Register any requested domain the account does not already own. |
| `setNameservers` | Set custom nameservers on domains. |
| `setNameserversForZones` | Set nameservers for each zone. |

The JSDoc on each function is the parameter and error contract.
