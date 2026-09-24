# Webshare

Webshare proxy operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `webshare`. The display label is `Webshare`. Authorization mode is `USER`, and the connection is required.

Paste the Webshare API key. The app sends it as an Authorization Token header. The app calls `https://proxy.webshare.io`.

## Configuration

This app has no installation settings.

## Operations

| Operation | What it does |
| --- | --- |
| `selectResidentialProxy` | Select one valid residential backbone proxy. |

The JSDoc on each function is the parameter and error contract.
