# Salesforce

Salesforce REST API. Each operation is one documented endpoint and returns the Salesforce response body. `http.js` is shared request code.

An empty 2xx body is returned as `{}`. A non-JSON 2xx body is returned as the response text.

## Connection

The connection kind is `OAUTH`. The connection key is `salesforce`. The display label is `Salesforce`. Authorization mode is `USER`, and the connection is required.

Connect the Salesforce user this app calls. The installation supplies the instance origin.

Scopes:

- `full`
- `refresh_token`

Register the OAuth client, then copy the redirect URI from Saleslumen Marketplace onto that client.

## Configuration

| Key | Type | Required |
| --- | --- | --- |
| `instanceUrl` | outbound_origin | yes |
| `apiVersion` | string | no |

`instanceUrl` is the `https` origin of the Salesforce instance. `apiVersion` must look like `v68.0`. When `apiVersion` is omitted, the operations use `v68.0`.

## Operations

| Operation | What it does |
| --- | --- |
| `compactLayouts` | List compact layouts for the objects in `q`. |
| `composite` | Run up to 25 composite subrequests. |
| `compositeBatch` | Run up to 25 composite batch subrequests. |
| `compositeGraph` | Run a composite graph request. |
| `createSObject` | Create one record. |
| `createSObjectByExternalId` | Create one record with POST `/sobjects/sObject/Id`. |
| `createSObjects` | Create up to 200 records. Each record includes `attributes.type`. |
| `createSObjectTree` | Create sObject trees, up to 200 records. |
| `deleteSObject` | Delete one record by id. |
| `deleteSObjectByExternalId` | Delete one record by external id. |
| `deleteSObjectRelationship` | Delete the record at a relationship URL. |
| `deleteSObjects` | Delete up to 200 records. |
| `describeApprovalLayouts` | List approval layouts for one sObject. |
| `describeCompactLayouts` | List compact layouts for one sObject. |
| `describeGlobal` | List sObjects available to the connected user. |
| `describeLayouts` | List layouts for one sObject. `sObject` may be `Global`. |
| `describeNamedLayouts` | Describe one named layout. |
| `describeRecordTypeLayouts` | Describe layouts for one record type. |
| `describeSObject` | Describe one sObject. |
| `getCompositeResources` | List composite resource URIs. |
| `getDeleted` | List records deleted between `start` and `end`. |
| `getLimits` | List org limits. |
| `getSObject` | Get one record by id. |
| `getSObjectBasicInformation` | Get basic metadata for one sObject. |
| `getSObjectByExternalId` | Get one record by external id. |
| `getSObjectCollection` | Get records of one sObject by a comma-separated `ids` list. |
| `getSObjectCollectionWithBody` | Get up to 2000 records with `recordIds` and `fieldNames`. |
| `getSObjectRelationship` | Get the records at a relationship URL. |
| `getUpdated` | List records created or updated between `start` and `end`. |
| `listResources` | List REST resources for the configured API version. |
| `listVersions` | List REST API versions on the configured instance. |
| `parameterizedSearch` | Search with URI parameters. |
| `parameterizedSearchInBody` | Search with a JSON body. |
| `query` | Run a SOQL query. |
| `queryAll` | Run a SOQL query that can include deleted and archived records. |
| `queryMore` | Fetch the next SOQL page for a `queryLocator`. |
| `recordCount` | List cached record counts. |
| `request` | Call a REST path on the configured instance. |
| `search` | Run a SOSL search. |
| `searchScopeOrder` | List the connected user's default search scope. |
| `updateSObject` | Update one record by id. |
| `updateSObjectRelationship` | Update the record at a relationship URL. |
| `updateSObjects` | Update up to 200 records. |
| `upsertSObject` | Upsert one record by external id. |
| `upsertSObjects` | Upsert up to 200 records by external id. |

The JSDoc on each function is the parameter and error contract.
