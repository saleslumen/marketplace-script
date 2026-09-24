# Microsoft Azure OpenAI

Azure OpenAI operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `OAUTH`. The connection key is `azure`. The display label is `Azure OpenAI`. Authorization mode is `USER`, and the connection is required.

Connect the Microsoft user this app uses for Azure OpenAI. The installation supplies the resource endpoint.

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

`endpoint` is the Azure OpenAI `https` origin. `deployment` is the default deployment for `generate`. When `apiVersion` is omitted, the operations use the API version built into the source.

## Operations

| Operation | What it does |
| --- | --- |
| `generate` | Generate a chat completion. Pass a deployment name to override the configured deployment. |
| `listDeployments` | List deployments on the configured resource. |

The JSDoc on each function is the parameter and error contract.
