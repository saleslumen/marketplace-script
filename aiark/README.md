# AI Ark

AI Ark API. Each operation is one function and returns the AI Ark response body. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `aiark`. The display label is `AI Ark`. Authorization mode is `USER`, and the connection is required.

Paste the AI Ark API key from the API Management Dashboard. The app sends it as the `X-TOKEN` header. The app calls `https://api.ai-ark.com`.

## Configuration

This app has no installation settings.

## Operations

| Operation | What it does |
| --- | --- |
| `searchPeople` | Search people. |
| `previewPeople` | Preview people that match a filter. |
| `searchCompanies` | Search companies, including lookalike seeds. |
| `createOrUpdateList` | Create or update a list of people or company ids. |
| `exportSinglePerson` | Export one person with email by id or profile url. |
| `exportSinglePersonV2` | Export one person with email. A miss returns HTTP 200 and `data` null. |
| `exportPeople` | Submit an export of people with email. |
| `listExportInquiries` | List one page of export results for a trackId. |
| `getExportStatus` | Read export statistics for a trackId. |
| `listExportSubmissions` | List export submissions. |
| `resendExportPeopleWebhook` | Resend an export completion webhook. |
| `findEmailsByTrackId` | Start email finding for a people-search trackId. |
| `listEmailFinderResults` | List one page of email-finder results for a trackId. |
| `getEmailFinderStatistics` | Read email-finder statistics for a trackId. |
| `listEmailFinderSubmissions` | List email-finder submissions. |
| `resendEmailFinderWebhook` | Resend an email-finder completion webhook. |
| `findMobilePhone` | Find a mobile phone by profile url, or by domain and name. |
| `findMobilePhoneV2` | Find a mobile phone. A miss returns HTTP 200 and `data` null. |
| `analyzePersonality` | Return a personality analysis for a profile url. |
| `reversePeopleLookup` | Look up a person from an email address. |
| `fetchCredit` | Read the remaining credit balance. |

The JSDoc on each function is the parameter and error contract.

## Errors

Invalid input throws `AIARK_INVALID_INPUT: <reason>`. A non-2xx AI Ark response throws `AIARK_REQUEST_FAILED: <status> <message>`. The API key is not included in either error.
