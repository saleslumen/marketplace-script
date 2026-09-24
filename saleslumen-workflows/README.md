# Saleslumen Workflows

Saleslumen Workflows operations for a Saleslumen Marketplace app. Each operation is one function and calls the matching Workflows platform method.

## Connection

This app has no connection. It calls the Saleslumen Workflows service.

Scopes:

- `workflows.executions.execute`
- `workflows.executions.read`
- `workflows.history.read`
- `workflows.triggereventtypes.read`
- `workflows.triggers.execute`
- `workflows.triggers.read`
- `workflows.triggers.write`
- `workflows.versions.execute`
- `workflows.versions.read`
- `workflows.workflows.execute`
- `workflows.workflows.read`
- `workflows.workflows.write`

## Configuration

This app has no installation settings. Path, query, and body fields are operation arguments.

## Operations

| Operation | What it does |
| --- | --- |
| `listSupportedTriggerEventTypes` | List supported trigger event types. |
| `listWorkflows` | List workflows. |
| `createWorkflow` | Create an unpublished draft workflow. |
| `getWorkflow` | Get one workflow. |
| `deleteWorkflow` | Delete a workflow. |
| `updateWorkflow` | Append a draft workflow version. |
| `listExecutions` | List executions for a workflow. |
| `getExecution` | Get one execution. |
| `cancelExecution` | Cancel an active or paused execution. |
| `resumeExecution` | Resume a paused execution. |
| `startExecution` | Start a workflow execution. |
| `getWorkflowHistory` | List all versions of a workflow. |
| `listWorkflowTriggers` | List workflow triggers. |
| `createWorkflowTrigger` | Create a workflow trigger. |
| `getWorkflowTrigger` | Get one workflow trigger. |
| `deleteWorkflowTrigger` | Delete a workflow trigger. |
| `updateWorkflowTrigger` | Update a workflow trigger. |
| `rotateWorkflowTriggerWebhookToken` | Rotate a webhook token. |
| `getWorkflowVersion` | Get one workflow version. |
| `revertWorkflowVersion` | Copy a published version into a new draft. |
| `activateWorkflow` | Activate a workflow. |
| `deactivateWorkflow` | Deactivate a workflow. |
| `publishWorkflowVersion` | Publish the latest draft. |

The JSDoc on each function is the parameter and error contract.
