# Salesforce

Salesforce REST operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection key is `salesforce`. Authorization mode is `USER`, and the connection is required.

OAuth scopes:

- `full`
- `refresh_token`

Register an OAuth client that can issue those scopes. Copy the redirect URI from Saleslumen Marketplace onto that client before you submit the app. Each installation supplies its own instance origin.

## Configuration

| Key | Type | Required |
| --- | --- | --- |
| `instanceUrl` | outbound_origin | yes |
| `apiVersion` | string | no |

`instanceUrl` is the `https` origin of the Salesforce instance. When `apiVersion` is omitted, the operations use the API version built into the source.

## Operations

| Operation | What it does |
| --- | --- |
| `composite` | Run a composite request of up to 25 subrequests. |
| `compositeBatch` | Run a composite batch request of up to 25 subrequests. |
| `compositeGraph` | Run a composite graph request. |
| `createSObject` | Create one record. |
| `createSObjects` | Create up to 200 records. |
| `createSObjectTree` | Create nested parent-child records. |
| `deleteSObject` | Delete one record by id. |
| `deleteSObjects` | Delete up to 200 records. |
| `describeGlobal` | List sObjects available to the connected user. |
| `describeSObject` | Describe one sObject, including fields. |
| `getIdentity` | Return the connected user. |
| `getLimits` | Return org API limits. |
| `getOrganization` | Return the connected organization. |
| `getSObject` | Get one record by id. |
| `listResources` | List REST resources for the configured API version. |
| `listVersions` | List REST API versions on the configured instance. |
| `query` | Run a SOQL query. |
| `queryAll` | Run a SOQL query that can include deleted and archived records. |
| `queryMore` | Fetch the next page from `nextRecordsUrl`. |
| `request` | Call a REST path on the configured instance. |
| `search` | Run a SOSL search. |
| `updateSObject` | Update one record by id. |
| `updateSObjects` | Update up to 200 records. |
| `upsertSObject` | Insert or update one record by external id. |
| `upsertSObjects` | Upsert up to 200 records by external id. |

The JSDoc on each function is the parameter and error contract.
