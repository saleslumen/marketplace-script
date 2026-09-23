# Microsoft Azure OpenAI

Azure OpenAI operations for a Saleslumen Marketplace app. `http.js` is shared request code.

## Connection

Connection key `azure`. Authorization mode `USER`. Required.

Scopes:

- `https://cognitiveservices.azure.com/.default`
- `offline_access`

Register the OAuth client, then copy the redirect URI from Saleslumen Marketplace onto that client.

## Configuration

| Key | Type | Required |
| --- | --- | --- |
| `endpoint` | outbound_origin | yes |
| `deployment` | string | yes |
| `apiVersion` | string | no |

`endpoint` is the Azure OpenAI `https` origin. `deployment` is the default deployment for `generate`.

## Operations

| Operation | What it does |
| --- | --- |
| `generate` | Generate a chat completion. Pass a deployment name to override the configured deployment. |
| `listDeployments` | List deployments on the configured resource. |
