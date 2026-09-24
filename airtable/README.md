# Airtable

Airtable registry operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `airtable`. The display label is `Airtable`. Authorization mode is `USER`, and the connection is required.

Paste the Airtable personal access token. The app sends it to Airtable as a bearer token. The app calls `https://api.airtable.com`.

## Configuration

This app has no installation settings.

## Operations

| Operation | What it does |
| --- | --- |
| `setRegistry` | Store the base and table ids and ensure the Clients and Operations schema. |
| `ensureRegistrySchema` | Ensure the Clients and Operations tables and fields. |
| `upsertClient` | Find or create one Clients row by namespace id. |
| `getClient` | Get one Clients row by record id, namespace id, Linear issue id, or correlation id. |
| `setNamespaceWorkflowIds` | Replace the namespace workflow id map on a Clients row. |
| `mergeNamespaceWorkflowIds` | Merge namespace workflow ids into a Clients row. |
| `reconcileClientGlance` | Recompute Clients glance fields from that client's Operations rows. |
| `writeStatus` | Upsert one Operations row and recompute Clients glance fields. |
| `reconcileExecutionFailure` | Record an unexpected execution failure on the matching operation. |
| `evaluateTrustAttemptLimit` | Compare the stored trust attempt count with a limit. |
| `evaluateWebhookDeliveryDedupe` | Check whether a webhook delivery id was already recorded. |
| `evaluateTrustOperationMatch` | Check that a webhook issue matches the Google Admin trust operation. |

The JSDoc on each function is the parameter and error contract.
