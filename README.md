# Saleslumen Apps Script

Saleslumen Apps Script is the source for a Saleslumen Marketplace app.

## Project

One directory is one project. The project `README.md` lists operations, configuration, and the connection.

`appsscript.json` sets `runtime` to `nodejs22` and `timeZone` to `UTC`.

| Field | Content |
| --- | --- |
| `permissions.saleslumenScopes` | Saleslumen scopes. Use `[]` for none. |
| `permissions.storage` | `INSTALLATION`, `USER`, or both. |
| `permissions.externalDomains` | `https` origins. Use `[]` when the installation supplies the origin. |
| `connections` | OAuth or API key connections. |
| `configuration.fields` | Values supplied at installation. |

An OAuth connection has `kind` `OAUTH`, `key`, `authorizationMode` (`USER` or `INSTALLATION`), `required`, `displayLabel`, `helpText`, and `oauthScopes`.

An API key connection has `kind` `API_KEY`, `key`, `authorizationMode` (`USER` or `INSTALLATION`), `required`, `displayLabel`, and `helpText`. It does not include `oauthScopes`. Installed code reads the key with `ConnectionApp.getApiKey(connectionKey)`.

A configuration field has `key`, `type`, and `required`. The types are `string`, `number`, `boolean`, `secret`, and `outbound_origin`.

## Publish

```sh
sl auth login
sl script projects create --title "PROJECT TITLE"
sl script content update --project SCRIPT_ID --input content.json
```

```json
{
  "content": {
    "files": [
      {"name": "appsscript.json", "type": "JSON", "source": "{ }"},
      {"name": "operation.js", "type": "SERVER_JS", "source": "async function operation() { return {}; }\n"}
    ]
  }
}
```

`sl script projects create` prints `scriptId`. `sl script content update` lists the uploaded files.

Create a version in the Saleslumen console, create the Saleslumen Marketplace app, register an OAuth client when the connection kind is OAuth, and submit the app.
