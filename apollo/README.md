# Apollo

Apollo people search and enrichment operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `apollo`. The display label is `Apollo`. Authorization mode is `USER`, and the connection is required.

Paste the Apollo API key from Settings, Integrations, API. The app sends it as the `X-Api-Key` header. The app calls `https://api.apollo.io`.

## Configuration

This app has no installation settings. Search filters and match fields are operation arguments.

## Operations

| Operation | What it does |
| --- | --- |
| `enrichPerson` | Enrich one person and return contact fields, including email when available. |
| `searchAndEnrichPeople` | Search for people, then enrich each result. |
| `searchPeople` | Search for people. |

The JSDoc on each function is the parameter and error contract.
