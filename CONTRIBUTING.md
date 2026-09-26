# Contributing

This repository uses the MIT License in `LICENSE`.

Add a project directory with `appsscript.json`, the source, and `README.md`. Leave client secrets, access tokens, refresh tokens, and authorization codes out of the pull request.

## Vendor apps

Each vendor directory is that vendor's API, written as the vendor's own engineers would publish it:

- One function per documented endpoint, named after the documented operation.
- Inputs use the vendor's documented field names. No aliases or fallback names.
- A successful call returns the vendor's response body unchanged. Never strip, redact, rename, or reshape response fields, including fields that hold passwords or tokens.
- Error messages may remove the connection's own credential (API key, bearer token, signing secret) when the vendor echoes it.
- No operation combines several endpoints, applies workflow policy, or names another vendor or a Saleslumen concept. Workflows compose vendor calls.
