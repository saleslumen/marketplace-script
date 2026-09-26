# HubSpot

HubSpot CRM objects, associations, properties, pipelines, owners, schemas, imports, exports, and search for a Saleslumen Marketplace app. Each operation is one HubSpot endpoint and returns the HubSpot response body. `http.js` is shared request code.

`objectType` is the HubSpot object type path, such as `contacts` or `0-1`. An empty 2xx body is returned as `{}`. Custom object records use the objects operations. Schema associations are `associatedObjects` on create and `includeAssociationDefinitions` on read.

## Connection

The connection kind is `API_KEY`. The connection key is `hubspot`. The display label is `HubSpot`. Authorization mode is `USER`, and the connection is required.

Paste the HubSpot private app access token from Settings, Integrations, Private Apps. The app sends it to HubSpot as a bearer token. The app calls `https://api.hubapi.com`.

## Configuration

| Key | Type | Required |
| --- | --- | --- |
| `apiVersion` | string | no |

When `apiVersion` is omitted, the operations use the API version built into the source.

## Operations

| Function | Method + path | Required inputs |
| --- | --- | --- |
| `archiveObject` | DELETE /crm/objects/{apiVersion}/{objectType}/{objectId} | `objectType`, `objectId` |
| `archiveProperty` | DELETE /crm/properties/{apiVersion}/{objectType}/{propertyName} | `objectType`, `propertyName` |
| `archivePropertyGroup` | DELETE /crm/properties/{apiVersion}/{objectType}/groups/{groupName} | `objectType`, `groupName` |
| `associateRecordsDefault` | PUT /crm/objects/{apiVersion}/{fromObjectType}/{fromObjectId}/associations/default/{toObjectType}/{toObjectId} | `fromObjectType`, `fromObjectId`, `toObjectType`, `toObjectId` |
| `associateRecordsLabeled` | PUT /crm/objects/{apiVersion}/{objectType}/{objectId}/associations/{toObjectType}/{toObjectId} | `objectType`, `objectId`, `toObjectType`, `toObjectId`, `associationSpec` |
| `batchArchiveObjects` | POST /crm/objects/{apiVersion}/{objectType}/batch/archive | `objectType`, `inputs` |
| `batchArchiveProperties` | POST /crm/properties/{apiVersion}/{objectType}/batch/archive | `objectType`, `inputs` |
| `batchAssociateRecordsDefault` | POST /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/batch/associate/default | `fromObjectType`, `toObjectType`, `inputs` |
| `batchAssociateRecordsLabeled` | POST /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/batch/create | `fromObjectType`, `toObjectType`, `inputs` |
| `batchCreateLabels` | POST /crm/associations/{apiVersion}/definitions/configurations/{fromObjectType}/{toObjectType}/batch/create | `fromObjectType`, `toObjectType`, `inputs` |
| `batchCreateObjects` | POST /crm/objects/{apiVersion}/{objectType}/batch/create | `objectType`, `inputs` |
| `batchCreateProperties` | POST /crm/properties/{apiVersion}/{objectType}/batch/create | `objectType`, `inputs` |
| `batchReadObjects` | POST /crm/objects/{apiVersion}/{objectType}/batch/read | `objectType`, `inputs` |
| `batchReadProperties` | POST /crm/properties/{apiVersion}/{objectType}/batch/read | `objectType`, `inputs` |
| `batchReadSchemas` | POST /crm-object-schemas/{apiVersion}/schemas/batch/read | `includeAssociationDefinitions`, `includeAuditMetadata`, `includePropertyDefinitions`, `inputs` |
| `batchUpdateObjects` | POST /crm/objects/{apiVersion}/{objectType}/batch/update | `objectType`, `inputs` |
| `batchUpsertObjects` | POST /crm/objects/{apiVersion}/{objectType}/batch/upsert | `objectType`, `inputs` |
| `cancelImport` | POST /crm/imports/{apiVersion}/{importId}/cancel | `importId` |
| `createAssociationLabel` | POST /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/labels | `fromObjectType`, `toObjectType`, `label`, `name` |
| `createObject` | POST /crm/objects/{apiVersion}/{objectType} | `objectType`, `properties` |
| `createPipeline` | POST /crm/pipelines/{apiVersion}/{objectType} | `objectType`, `displayOrder`, `label`, `stages` |
| `createPipelineStage` | POST /crm/pipelines/{apiVersion}/{objectType}/{pipelineId}/stages | `objectType`, `pipelineId`, `displayOrder`, `label`, `metadata` |
| `createProperty` | POST /crm/properties/{apiVersion}/{objectType} | `objectType`, `fieldType`, `groupName`, `label`, `name`, `type` |
| `createPropertyGroup` | POST /crm/properties/{apiVersion}/{objectType}/groups | `objectType`, `label`, `name` |
| `createSchema` | POST /crm-object-schemas/{apiVersion}/schemas | `allowsSensitiveProperties`, `associatedObjects`, `labels`, `name`, `properties`, `requiredProperties`, `searchableProperties`, `secondaryDisplayProperties`, `shouldCreateSameObjectAssociation` |
| `deleteAssociationLabel` | DELETE /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/labels/{associationTypeId} | `fromObjectType`, `toObjectType`, `associationTypeId` |
| `deleteAssociationLabels` | POST /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/batch/labels/archive | `fromObjectType`, `toObjectType`, `inputs` |
| `deletePipeline` | DELETE /crm/pipelines/{apiVersion}/{objectType}/{pipelineId} | `objectType`, `pipelineId` |
| `deletePipelineStage` | DELETE /crm/pipelines/{apiVersion}/{objectType}/{pipelineId}/stages/{stageId} | `objectType`, `pipelineId`, `stageId` |
| `deleteSchema` | DELETE /crm-object-schemas/{apiVersion}/schemas/{objectType} | `objectType` |
| `getImport` | GET /crm/imports/{apiVersion}/{importId} | `importId` |
| `listAssociations` | GET /crm/objects/{apiVersion}/{fromObjectType}/{objectId}/associations/{toObjectType} | `fromObjectType`, `objectId`, `toObjectType` |
| `listObjects` | GET /crm/objects/{apiVersion}/{objectType} | `objectType` |
| `partiallyUpdatePipeline` | PATCH /crm/pipelines/{apiVersion}/{objectType}/{pipelineId} | `objectType`, `pipelineId` |
| `readAllProperties` | GET /crm/properties/{apiVersion}/{objectType} | `objectType` |
| `readAllPropertyGroups` | GET /crm/properties/{apiVersion}/{objectType}/groups | `objectType` |
| `readAllPropertyValidations` | GET /crm/property-validations/{apiVersion}/{objectTypeId} | `objectTypeId` |
| `readObject` | GET /crm/objects/{apiVersion}/{objectType}/{objectId} | `objectType`, `objectId` |
| `readProperty` | GET /crm/properties/{apiVersion}/{objectType}/{propertyName} | `objectType`, `propertyName` |
| `readPropertyGroup` | GET /crm/properties/{apiVersion}/{objectType}/groups/{groupName} | `objectType`, `groupName` |
| `readPropertyValidation` | GET /crm/property-validations/{apiVersion}/{objectTypeId}/{propertyName} | `objectTypeId`, `propertyName` |
| `removeAssociation` | DELETE /crm/objects/{apiVersion}/{objectType}/{objectId}/associations/{toObjectType}/{toObjectId} | `objectType`, `objectId`, `toObjectType`, `toObjectId` |
| `removeAssociationLimits` | POST /crm/associations/{apiVersion}/definitions/configurations/{fromObjectType}/{toObjectType}/batch/purge | `fromObjectType`, `toObjectType`, `inputs` |
| `removeAssociations` | POST /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/batch/archive | `fromObjectType`, `toObjectType`, `inputs` |
| `replacePipeline` | PUT /crm/pipelines/{apiVersion}/{objectType}/{pipelineId} | `objectType`, `pipelineId`, `displayOrder`, `label`, `stages` |
| `reportHighUsage` | POST /crm/associations/{apiVersion}/usage/high-usage-report/{userId} | `userId` |
| `request` | Caller path on `https://api.hubapi.com` | `path` |
| `retrieveAccountDetails` | GET /account-info/{apiVersion}/details | none |
| `retrieveAllAssociationLimits` | GET /crm/associations/{apiVersion}/definitions/configurations/all | none |
| `retrieveAllOwners` | GET /crm/owners/{apiVersion} | none |
| `retrieveAssociationLabels` | GET /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/labels | `fromObjectType`, `toObjectType` |
| `retrieveAssociationLimits` | GET /crm/associations/{apiVersion}/definitions/configurations/{fromObjectType}/{toObjectType} | `fromObjectType`, `toObjectType` |
| `retrieveAssociations` | POST /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/batch/read | `fromObjectType`, `toObjectType`, `inputs` |
| `retrieveExportDetails` | GET /crm/exports/{apiVersion}/export/{exportId} | `exportId` |
| `retrieveExportStatus` | GET /crm/exports/{apiVersion}/export/async/tasks/{taskId}/status | `taskId` |
| `retrieveImportErrors` | GET /crm/imports/{apiVersion}/{importId}/errors | `importId` |
| `retrieveImports` | GET /crm/imports/{apiVersion} | none |
| `retrieveOwner` | GET /crm/owners/{apiVersion}/{ownerId} | `ownerId` |
| `retrievePipeline` | GET /crm/pipelines/{apiVersion}/{objectType}/{pipelineId} | `objectType`, `pipelineId` |
| `retrievePipelineAudit` | GET /crm/pipelines/{apiVersion}/{objectType}/{pipelineId}/audit | `objectType`, `pipelineId` |
| `retrievePipelineStage` | GET /crm/pipelines/{apiVersion}/{objectType}/{pipelineId}/stages/{stageId} | `objectType`, `pipelineId`, `stageId` |
| `retrievePipelines` | GET /crm/pipelines/{apiVersion}/{objectType} | `objectType` |
| `retrievePropertyValidationRule` | GET /crm/property-validations/{apiVersion}/{objectTypeId}/{propertyName}/rule-type/{ruleType} | `objectTypeId`, `propertyName`, `ruleType` |
| `retrieveSchema` | GET /crm-object-schemas/{apiVersion}/schemas/{objectType} | `objectType` |
| `retrieveSchemas` | GET /crm-object-schemas/{apiVersion}/schemas | none |
| `retrieveStageAudit` | GET /crm/pipelines/{apiVersion}/{objectType}/{pipelineId}/stages/{stageId}/audit | `objectType`, `pipelineId`, `stageId` |
| `searchRecords` | POST /crm/objects/{apiVersion}/{objectType}/search | `objectType` |
| `startExport` | POST /crm/exports/{apiVersion}/export/async | `associatedObjectType`, `exportInternalValuesOptions`, `exportName`, `exportType`, `format`, `includeLabeledAssociations`, `includePrimaryDisplayPropertyForAssociatedObjects`, `language`, `objectProperties`, `objectType`, `overrideAssociatedObjectsPerDefinitionPerRowLimit` |
| `startImport` | POST /crm/imports/{apiVersion} | `files`, `importRequest` |
| `updateAssociationLabel` | PUT /crm/associations/{apiVersion}/{fromObjectType}/{toObjectType}/labels | `fromObjectType`, `toObjectType`, `associationTypeId`, `label` |
| `updateAssociationLimits` | POST /crm/associations/{apiVersion}/definitions/configurations/{fromObjectType}/{toObjectType}/batch/update | `fromObjectType`, `toObjectType`, `inputs` |
| `updateObject` | PATCH /crm/objects/{apiVersion}/{objectType}/{objectId} | `objectType`, `objectId`, `properties` |
| `updatePipelineStage` | PUT /crm/pipelines/{apiVersion}/{objectType}/{pipelineId}/stages/{stageId} | `objectType`, `pipelineId`, `stageId`, `displayOrder`, `label`, `metadata` |
| `updateProperty` | PATCH /crm/properties/{apiVersion}/{objectType}/{propertyName} | `objectType`, `propertyName` |
| `updatePropertyGroup` | PATCH /crm/properties/{apiVersion}/{objectType}/groups/{groupName} | `objectType`, `groupName` |
| `updatePropertyValidationRule` | PUT /crm/property-validations/{apiVersion}/{objectTypeId}/{propertyName}/rule-type/{ruleType} | `objectTypeId`, `propertyName`, `ruleType`, `ruleArguments` |
| `updateSchema` | PATCH /crm-object-schemas/{apiVersion}/schemas/{objectType} | `objectType`, `clearDescription` |

`batchCreateLabels` is HubSpot's batch create for association limits. The docs page title is "Batch create labels".

`associateRecordsLabeled` sends `associationSpec` as the JSON array body. Each item uses `associationCategory` and `associationTypeId`.

`retrievePipelineAudit` is the docs operation "Retrieve audit logs".

`startImport` sends `files` and `importRequest` as `multipart/form-data`. `files` is the file contents. `importRequest` is the JSON text.

`startExport` also sends `listId` for a LIST export and `publicCrmSearchRequest` for a VIEW export when those fields are present.

The JSDoc on each function is the parameter and error contract.
