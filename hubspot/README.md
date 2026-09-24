# HubSpot

HubSpot CRM operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `hubspot`. The display label is `HubSpot`. Authorization mode is `USER`, and the connection is required.

Paste the HubSpot private app access token from Settings, Integrations, Private Apps. The app sends it to HubSpot as a bearer token. The app calls `https://api.hubapi.com`.

## Configuration

| Key | Type | Required |
| --- | --- | --- |
| `apiVersion` | string | no |

When `apiVersion` is omitted, the operations use the API version built into the source.

## Operations

| Operation | What it does |
| --- | --- |
| `archiveAssociations` | Archive associations between two object types. |
| `archiveRecord` | Archive one CRM record. |
| `archiveRecords` | Archive up to 100 CRM records. |
| `createAssociations` | Create labeled associations. |
| `createRecord` | Create one CRM record. |
| `createRecords` | Create up to 100 CRM records. |
| `getAccount` | Return account details for the connected hub. |
| `getAssociationLabels` | List association labels for two object types. |
| `getAssociations` | Get one page of associations from a record. |
| `getRecord` | Get one CRM record. |
| `listProperties` | List property definitions for an object type. |
| `listRecords` | List one page of CRM records. |
| `readRecords` | Read up to 100 CRM records by id. |
| `request` | Call a HubSpot JSON path on `https://api.hubapi.com`. |
| `searchRecords` | Search CRM records. |
| `updateRecord` | Update one CRM record. |
| `updateRecords` | Update up to 100 CRM records. |
| `upsertRecords` | Upsert up to 100 CRM records by a unique property. |

The JSDoc on each function is the parameter and error contract.
