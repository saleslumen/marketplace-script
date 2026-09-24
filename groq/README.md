# Groq

Groq chat operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `groq`. The display label is `Groq`. Authorization mode is `USER`, and the connection is required.

Paste the Groq API key from the Groq console. The app sends it as a bearer token. The app calls `https://api.groq.com`.

## Configuration

This app has no installation settings.

## Operations

| Operation | What it does |
| --- | --- |
| `chatCompletions` | Create a chat completion. |
| `listModels` | List models available to the API key. |

The JSDoc on each function is the parameter and error contract.
