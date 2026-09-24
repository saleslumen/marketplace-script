# Saleslumen Campaigns

Saleslumen Campaigns operations for a Saleslumen Marketplace app. Each operation is one function and calls the matching Campaigns platform method.

## Connection

This app has no connection. It calls the Saleslumen Campaigns service.

Scopes:

- `campaigns.campaigns.execute`
- `campaigns.campaigns.read`
- `campaigns.campaigns.write`
- `campaigns.campaignschedules.read`
- `campaigns.campaignschedules.write`
- `campaigns.deliveries.execute`
- `campaigns.deliveries.read`
- `campaigns.metrics.read`
- `campaigns.operations.read`
- `campaigns.people.execute`
- `campaigns.people.read`
- `campaigns.people.write`
- `campaigns.sequences.execute`
- `campaigns.sequences.read`
- `campaigns.sequences.write`
- `campaigns.suppressions.read`
- `campaigns.suppressions.write`
- `campaigns.tasks.read`

## Configuration

This app has no installation settings. Path, query, and body fields are operation arguments.

## Operations

| Operation | What it does |
| --- | --- |
| `listCampaigns` | List campaigns newest first. |
| `createCampaign` | Create a draft campaign and its automatic main sequence. |
| `getCampaign` | Return a campaign regardless of archive visibility. |
| `updateCampaign` | Patch a campaign with an update mask and etag. |
| `deleteCampaign` | Hard-delete a draft campaign. |
| `activateCampaign` | Activate a campaign when readiness succeeds. |
| `resumeCampaign` | Resume a campaign when readiness succeeds. |
| `pauseCampaign` | Pause a campaign and return a long-running operation. |
| `completeCampaign` | Complete a campaign from draft, or from paused with no in-flight work. |
| `archiveCampaign` | Archive a draft, paused, or completed campaign. |
| `unarchiveCampaign` | Clear a campaign archive. |
| `setCampaignVariables` | Replace the ordered campaign variable list. |
| `setCampaignSenderAccounts` | Replace campaign sender account membership. |
| `listCampaignSchedules` | List campaign schedules. |
| `createCampaignSchedule` | Create a reusable campaign schedule. |
| `getCampaignSchedule` | Get one campaign schedule. |
| `updateCampaignSchedule` | Patch a campaign schedule. |
| `deleteCampaignSchedule` | Delete a campaign schedule that no campaign references. |
| `listCampaignPeople` | List people in a campaign. |
| `createCampaignPerson` | Create one campaign person. |
| `getCampaignPerson` | Get one campaign person. |
| `updateCampaignPerson` | Patch person variables. |
| `deleteCampaignPerson` | Delete a campaign person with no execution history. |
| `importCampaignPeople` | Enqueue a people import. |
| `batchDeleteCampaignPeople` | Delete a batch of campaign people. |
| `runCampaignPeopleScript` | Enqueue a people script run. |
| `pauseCampaignPerson` | Pause one campaign person. |
| `resumeCampaignPerson` | Resume one campaign person. |
| `unsubscribeCampaignPerson` | Unsubscribe one campaign person. |
| `listCampaignPersonActivity` | List person activity in chronological order. |
| `getCampaignTask` | Get one campaign task. |
| `streamCampaignTask` | Stream task progress as server-sent events. |
| `listSequences` | List sequences in a campaign. |
| `createSequence` | Create a triggered sequence. |
| `getSequence` | Get a sequence tree. |
| `updateSequence` | Replace a sequence tree. |
| `deleteSequence` | Delete an unused triggered sequence. |
| `previewSequence` | Preview a sequence variant. |
| `listCampaignDeliveries` | List deliveries in a campaign. |
| `getDelivery` | Get one delivery. |
| `resolveUnknownDelivery` | Resolve an unknown send as sent or retry. |
| `getCampaignMetrics` | Get campaign metrics. |
| `listSuppressions` | List suppressions. |
| `createSuppression` | Create a suppression. |
| `deleteSuppression` | Delete a suppression. |
| `getOperation` | Get one operation in the caller organization. |

The JSDoc on each function is the parameter and error contract.
