# Linear

Linear GraphQL API. Each operation is one query or mutation and returns Linear's `data` object. `http.js` is shared request code.

The endpoint is `https://api.linear.app/graphql`. Argument names and input types follow the public schema.

## Connection

The connection kind is `API_KEY`. The connection key is `linear`. The display label is `Linear`. Authorization mode is `USER`, and the connection is required.

Paste the Linear personal API key from Settings, API. The app sends it as the Authorization header. The app calls `https://api.linear.app`.

## Configuration

This app has no installation settings.

## Operations

| Operation | What it does |
| --- | --- |
| `issueCreate` | Create an issue. `issueCreate(input: IssueCreateInput!)`. `input.teamId` is required. |
| `issueUpdate` | Update an issue. `issueUpdate(id, input: IssueUpdateInput!)`. |
| `issue` | Read one issue. `issue(id)`. |
| `issues` | List issues. Accepts `after`, `before`, `filter`, `first`, `includeArchived`, `last`, and `orderBy`. |
| `searchIssues` | Search issues. `term` is required. Also accepts pagination, `filter`, `includeArchived`, `includeComments`, `orderBy`, and `teamId`. |
| `issueDelete` | Delete an issue. `issueDelete(id, permanentlyDelete)`. |
| `issueArchive` | Archive an issue. `issueArchive(id, trash)`. |
| `issueUnarchive` | Unarchive an issue. `issueUnarchive(id)`. |
| `commentCreate` | Create a comment. `commentCreate(input: CommentCreateInput!)`. |
| `commentUpdate` | Update a comment. `commentUpdate(id, input: CommentUpdateInput!)`. |
| `commentDelete` | Delete a comment. `commentDelete(id)`. |
| `comments` | List comments. Accepts `after`, `before`, `filter`, `first`, `includeArchived`, `last`, and `orderBy`. |
| `teams` | List teams. Accepts `after`, `before`, `filter`, `first`, `includeArchived`, `last`, and `orderBy`. |
| `team` | Read one team. `team(id)`. |
| `workflowStates` | List workflow states. Accepts `after`, `before`, `filter`, `first`, `includeArchived`, `last`, and `orderBy`. |
| `issueLabels` | List issue labels. Accepts `after`, `before`, `filter`, `first`, `includeArchived`, `last`, and `orderBy`. |
| `projects` | List projects. Accepts `after`, `before`, `filter`, `first`, `includeArchived`, `last`, and `orderBy`. |
| `viewer` | Read the authenticated user. `viewer`. |
| `users` | List users. Accepts `after`, `before`, `filter`, `first`, `includeArchived`, `includeDisabled`, `last`, and `orderBy`. |
| `attachmentCreate` | Create an attachment. `attachmentCreate(input: AttachmentCreateInput!)`. `input.issueId`, `input.title`, and `input.url` are required. |
| `attachmentDelete` | Delete an attachment. `attachmentDelete(id)`. |
| `webhookCreate` | Create a webhook. `webhookCreate(input: WebhookCreateInput!)`. `input.url`, `input.resourceTypes`, and either `input.teamId` or `input.allPublicTeams: true` are required. |
| `webhooks` | List webhooks. Accepts `after`, `before`, `first`, `includeArchived`, `last`, and `orderBy`. |
| `webhookUpdate` | Update a webhook. `webhookUpdate(id, input: WebhookUpdateInput!)`. |
| `webhookDelete` | Delete a webhook. `webhookDelete(id)`. |
| `graphql` | Send a GraphQL `query` and optional `variables` to `https://api.linear.app/graphql`. |

Each function returns the GraphQL `data` object. List selections return `nodes` and `pageInfo`. Mutation selections return `success`, `lastSyncId`, and the mutated entity. Named queries select the public fields used in Linear's guides, including webhook `secret`. Use `graphql` to request other fields. The JSDoc on each function is the parameter and error contract.

## Errors

Invalid input throws `LINEAR_INVALID_INPUT: <reason>`. A non-2xx response or a GraphQL `errors` entry throws `LINEAR_REQUEST_FAILED: <status> <message>`. The API key is not included in either error.

## Reference

- https://linear.app/developers/graphql
- https://linear.app/developers/pagination
- https://linear.app/developers/filtering
- https://linear.app/developers/webhooks
- https://github.com/linear/linear/blob/master/packages/sdk/src/schema.graphql
