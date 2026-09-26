# OpenRouter

OpenRouter API. Each operation is one function and returns the OpenRouter response body. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `openrouter`. The display label is `OpenRouter`. Authorization mode is `USER`, and the connection is required.

Paste the OpenRouter API key. The app sends it as a bearer token. Calls use `https://openrouter.ai/api/v1`. `submitDecisionsRequest` uses `https://openrouter.ai/api/alpha/decisions`.

## Configuration

This app has no installation settings.

## Operations

| Operation | What it does |
| --- | --- |
| `chatCompletions` | Create a chat completion. POST /api/v1/chat/completions. `stream: true` is rejected. |
| `createMessages` | Create a message. POST /api/v1/messages. `stream: true` is rejected. |
| `createResponses` | Create a response. POST /api/v1/responses. `stream: true` is rejected. |
| `createEmbeddings` | Submit an embedding request. POST /api/v1/embeddings. |
| `createImages` | Generate an image. POST /api/v1/images. `stream: true` is rejected. |
| `createAudioSpeech` | Create speech. POST /api/v1/audio/speech. The success body is response text. |
| `createAudioTranscriptions` | Create a transcription. POST /api/v1/audio/transcriptions. Send JSON with `input_audio`, or multipart with `file`. `file` and `input_audio` cannot both be set. |
| `createVideos` | Submit a video generation request. POST /api/v1/videos. |
| `getVideos` | Poll video generation status. GET /api/v1/videos/{jobId}. |
| `listVideosContent` | Download generated video content. GET /api/v1/videos/{jobId}/content. The success body is response text. |
| `listVideosModels` | List all video generation models. GET /api/v1/videos/models. |
| `createRerank` | Submit a rerank request. POST /api/v1/rerank. |
| `submitDecisionsRequest` | Submit a Decisions request. POST https://openrouter.ai/api/alpha/decisions. |
| `submitSystemOneRequest` | Submit a System One request. POST /api/v1/systemone. |
| `listModels` | List all models and their properties. GET /api/v1/models. |
| `listModelsUser` | List models filtered by user provider preferences, privacy settings, and guardrails. GET /api/v1/models/user. |
| `getModel` | Get a model by its slug. GET /api/v1/model/{author}/{slug}. |
| `listModelsCount` | Get total count of available models. GET /api/v1/models/count. |
| `listEndpoints` | List all endpoints for a model. GET /api/v1/models/{author}/{slug}/endpoints. |
| `listEmbeddingsModels` | List all embeddings models. GET /api/v1/embeddings/models. |
| `listImageModels` | List image generation models. GET /api/v1/images/models. |
| `listImageModelEndpoints` | List endpoints for an image model. GET /api/v1/images/models/{author}/{slug}/endpoints. |
| `listEndpointsZdr` | Preview the impact of ZDR on the available endpoints. GET /api/v1/endpoints/zdr. |
| `getGeneration` | Get request & usage metadata for a generation. GET /api/v1/generation. |
| `listGenerationContent` | Get stored prompt, completion, and error content for a generation. GET /api/v1/generation/content. |
| `getCredits` | Get remaining credits. GET /api/v1/credits. OpenRouter documents this operation as requiring a management key. This app sends the connected API key. |
| `getCurrentKey` | Get current API key. GET /api/v1/key. |
| `listProviders` | List all providers. GET /api/v1/providers. |
| `copyVaultSecretsToIntern` | Copy workspace secrets to an intern. POST /api/v1/vault/interns/{internId}/secrets/copy. |
| `createAuthKeysCode` | Create authorization code. POST /api/v1/auth/keys/code. |
| `createBatches` | Create a batch. POST /api/v1/batches. |
| `createIntern` | Create an intern. POST /api/v1/interns. |
| `createOauthToken` | Exchange a workload identity token. POST /api/v1/oauth/token. |
| `createPresetsChatCompletions` | Create a preset from a chat-completions request body. POST /api/v1/presets/{slug}/chat/completions. `stream: true` is rejected. |
| `createPresetsMessages` | Create a preset from a messages request body. POST /api/v1/presets/{slug}/messages. `stream: true` is rejected. |
| `createPresetsResponses` | Create a preset from a responses request body. POST /api/v1/presets/{slug}/responses. `stream: true` is rejected. |
| `deleteBatch` | Delete a batch. DELETE /api/v1/batches/{id}. |
| `deleteFile` | Delete a file. DELETE /api/v1/files/{file_id}. |
| `deleteIntern` | Delete an intern. DELETE /api/v1/interns/{internId}. |
| `deleteInternVaultSecret` | Delete an intern secret. DELETE /api/v1/vault/interns/{internId}/secrets/{name}. An empty success body is returned as {}. |
| `deleteVaultSecret` | Delete a workspace secret. DELETE /api/v1/vault/secrets/{name}. An empty success body is returned as {}. |
| `downloadContainerFileContent` | Download container file content. GET /api/v1/containers/{container_id}/files/{file_id}/content. The success body is response text. |
| `downloadFileContent` | Download file content. GET /api/v1/files/{file_id}/content. The success body is response text. |
| `exchangeAuthCodeForAPIKey` | Exchange authorization code for API key. POST /api/v1/auth/keys. |
| `getAppRankings` | Top apps by token usage. GET /api/v1/datasets/app-rankings. |
| `getBatches` | Get a batch. GET /api/v1/batches/{id}. |
| `getBenchmarks` | List Benchmarks. GET /api/v1/benchmarks. |
| `getContainerFile` | Retrieve a container file. GET /api/v1/containers/{container_id}/files/{file_id}. |
| `getFileMetadata` | Get file metadata. GET /api/v1/files/{file_id}. |
| `getIntern` | Get an intern. GET /api/v1/interns/{internId}. |
| `getInternDaemonAccess` | Get an intern's daemon access. GET /api/v1/interns/{internId}/daemon-access. |
| `getPreset` | Get a preset. GET /api/v1/presets/{slug}. |
| `getPresetVersion` | Get a specific version of a preset. GET /api/v1/presets/{slug}/versions/{version}. |
| `getRankingsDaily` | Daily token totals for top 50 models. GET /api/v1/datasets/rankings-daily. |
| `getSessionCost` | Cost per session by harness and model. GET /api/v1/datasets/session-cost. |
| `getTaskClassifications` | Task classification market share. GET /api/v1/classifications/task. |
| `invokeIntern` | Start an intern run without waiting for it. POST /api/v1/interns/{internId}/invoke. |
| `listBatches` | List batches. GET /api/v1/batches. |
| `listContainerFiles` | List container files. GET /api/v1/containers/{container_id}/files. |
| `listFiles` | List files. GET /api/v1/files. |
| `listInternVaultSecrets` | List intern secrets. GET /api/v1/vault/interns/{internId}/secrets. |
| `listInterns` | List interns. GET /api/v1/interns. |
| `listOauthJwks` | OpenRouter access token signing keys. GET /api/v1/oauth/jwks. |
| `listPresetVersions` | List versions of a preset. GET /api/v1/presets/{slug}/versions. |
| `listPresets` | List presets. GET /api/v1/presets. |
| `listVaultSecrets` | List workspace secrets. GET /api/v1/vault/secrets. |
| `promoteContainerFile` | Promote a container file into workspace documents. POST /api/v1/containers/{container_id}/files/{file_id}/promote. |
| `provisionIntern` | Provision an intern. POST /api/v1/interns/{internId}/provision. |
| `storeInternVaultSecret` | Store an intern secret. PUT /api/v1/vault/interns/{internId}/secrets/{name}. |
| `storeVaultSecret` | Store a workspace secret. PUT /api/v1/vault/secrets/{name}. |
| `suspendIntern` | Suspend an intern. POST /api/v1/interns/{internId}/suspend. |
| `updateIntern` | Update an intern. PATCH /api/v1/interns/{internId}. |
| `uploadFile` | Upload a file. POST /api/v1/files. `file` is the file contents. |

The JSDoc on each function names the documented parameters. Path, query, and header values are taken from `input` by those names. Every other field is the request body and is sent unchanged. Each `@see` link is that operation's API reference page.

## Errors

Invalid input throws `OPENROUTER_INVALID_INPUT: <reason>`. A non-2xx OpenRouter response throws `OPENROUTER_REQUEST_FAILED: <status> <message>`. The API key is not included in either error.

A JSON success body is parsed and returned. Any other success body is returned as response text. An empty success body is returned as `{}`.

## Streaming

`stream: true` is not supported in Apps Script. Operations that document `stream` throw `OPENROUTER_INVALID_INPUT: stream is not supported` and do not call OpenRouter. `stream: false` is sent through.

`POST /interns/{internId}/chat/completions` only streams, so this app does not include it.

## Outside this app

A standard API key does not call management-key operations: activity, analytics, BYOK, generation feedback, guardrails, API key management other than `getCurrentKey`, observability, organization members, SCIM, and workspaces. `POST /credits/coinbase` is removed. The current API reference has no `POST /completions` text-completions operation.

`getCredits` sends the connected API key. OpenRouter's page says that operation requires a management key.

## API reference

Index: https://openrouter.ai/docs/api_reference/overview

OpenAPI: https://openrouter.ai/docs/openapi/openapi.yaml
