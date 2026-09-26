# Apollo

Apollo API. Each operation is one function and returns the Apollo response body. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `apollo`. The display label is `Apollo`. Authorization mode is `USER`, and the connection is required.

Paste the Apollo API key from Settings, Integrations, API. The app sends it as the `X-Api-Key` header. The app calls `https://api.apollo.io/api/v1`.

## Configuration

This app has no installation settings.

## Operations

| Operation | What it does |
| --- | --- |
| `searchPeople` | People API search. POST `/mixed_people/api_search`. https://docs.apollo.io/reference/people-api-search |
| `enrichPerson` | People enrichment. POST `/people/match`. https://docs.apollo.io/reference/people-enrichment |
| `bulkEnrichPeople` | Bulk people enrichment. POST `/people/bulk_match`. https://docs.apollo.io/reference/bulk-people-enrichment |
| `getPerson` | Get complete person info. GET `/people/{id}`. https://docs.apollo.io/reference/get-complete-person-info |
| `searchOrganizations` | Organization search. POST `/mixed_companies/search`. https://docs.apollo.io/reference/organization-search |
| `enrichOrganization` | Organization enrichment. GET `/organizations/enrich`. https://docs.apollo.io/reference/organization-enrichment |
| `bulkEnrichOrganizations` | Bulk organization enrichment. POST `/organizations/bulk_enrich`. https://docs.apollo.io/reference/bulk-organization-enrichment |
| `getOrganization` | Get complete organization info. GET `/organizations/{id}`. https://docs.apollo.io/reference/get-complete-organization-info |
| `listOrganizationJobPostings` | Organization job postings. GET `/organizations/{organization_id}/job_postings`. https://docs.apollo.io/reference/organization-jobs-postings |
| `searchNewsArticles` | News articles search. POST `/news_articles/search`. https://docs.apollo.io/reference/news-articles-search |
| `createAccount` | Create an account. POST `/accounts`. https://docs.apollo.io/reference/create-an-account |
| `updateAccount` | Update an account. PATCH `/accounts/{account_id}`. https://docs.apollo.io/reference/update-an-account |
| `getAccount` | View an account. GET `/accounts/{id}`. https://docs.apollo.io/reference/view-an-account |
| `searchAccounts` | Search for accounts. POST `/accounts/search`. https://docs.apollo.io/reference/search-for-accounts |
| `bulkCreateAccounts` | Bulk create accounts. POST `/accounts/bulk_create`. https://docs.apollo.io/reference/bulk-create-accounts |
| `bulkUpdateAccounts` | Bulk update accounts. POST `/accounts/bulk_update`. https://docs.apollo.io/reference/bulk-update-accounts |
| `updateAccountOwners` | Update account owner for multiple accounts. POST `/accounts/update_owners`. https://docs.apollo.io/reference/update-account-ownership |
| `listAccountStages` | List account stages. GET `/account_stages`. https://docs.apollo.io/reference/list-account-stages |
| `createContact` | Create a contact. POST `/contacts`. https://docs.apollo.io/reference/create-a-contact |
| `updateContact` | Update a contact. PATCH `/contacts/{contact_id}`. https://docs.apollo.io/reference/update-a-contact |
| `getContact` | View a contact. GET `/contacts/{contact_id}`. https://docs.apollo.io/reference/view-a-contact |
| `searchContacts` | Search for contacts. POST `/contacts/search`. https://docs.apollo.io/reference/search-for-contacts |
| `bulkCreateContacts` | Bulk create contacts. POST `/contacts/bulk_create`. https://docs.apollo.io/reference/bulk-create-contacts |
| `bulkUpdateContacts` | Bulk update contacts. POST `/contacts/bulk_update`. https://docs.apollo.io/reference/bulk-update-contacts |
| `updateContactStages` | Update contact stage for multiple contacts. POST `/contacts/update_stages`. https://docs.apollo.io/reference/update-contact-stage |
| `updateContactOwners` | Update contact owner for multiple contacts. POST `/contacts/update_owners`. https://docs.apollo.io/reference/update-contact-ownership |
| `listContactStages` | List contact stages. GET `/contact_stages`. https://docs.apollo.io/reference/list-contact-stages |
| `listContactDeals` | View associated deals. POST `/contacts/{contact_id}/opportunities`. https://docs.apollo.io/reference/view-associated-deals |
| `listLabels` | Get a list of all lists. GET `/labels`. https://docs.apollo.io/reference/get-a-list-of-all-lists |
| `createLabel` | Create a list. POST `/labels`. https://docs.apollo.io/reference/create-a-list |
| `updateLabel` | Update a list. PATCH `/labels/{id}`. https://docs.apollo.io/reference/update-a-list |
| `addToLabels` | Add records to a list. POST `/labels/add_entity_ids_to_label_names`. https://docs.apollo.io/reference/add-records-to-a-list |
| `removeFromLabels` | Remove records from a list. POST `/labels/remove_entity_ids_from_label_names`. https://docs.apollo.io/reference/remove-records-from-a-list |
| `searchSequences` | Search for sequences. POST `/emailer_campaigns/search`. https://docs.apollo.io/reference/search-for-sequences |
| `createSequence` | Create a sequence. POST `/sequences`. https://docs.apollo.io/reference/create-sequence |
| `updateSequence` | Update a sequence. PUT `/sequences/{id}`. https://docs.apollo.io/reference/update-sequence |
| `addContactsToSequence` | Add contacts to a sequence. POST `/emailer_campaigns/{sequence_id}/add_contact_ids`. https://docs.apollo.io/reference/add-contacts-to-sequence |
| `updateSequenceContactStatus` | Update contact status in a sequence. POST `/emailer_campaigns/remove_or_stop_contact_ids`. https://docs.apollo.io/reference/update-contact-status-sequence |
| `activateSequence` | Activate a sequence. POST `/emailer_campaigns/{sequence_id}/approve`. https://docs.apollo.io/reference/activate-sequence |
| `deactivateSequence` | Deactivate a sequence. POST `/emailer_campaigns/{sequence_id}/abort`. https://docs.apollo.io/reference/deactivate-sequence |
| `archiveSequence` | Archive a sequence. POST `/emailer_campaigns/{sequence_id}/archive`. https://docs.apollo.io/reference/archive-sequence |
| `getSequenceActivity` | Get contact sequence activity. POST `/emailer_campaigns/activity_feed`. https://docs.apollo.io/reference/get-contact-sequence-activity |
| `listEmailSchedules` | List email schedules. GET `/emailer_schedules`. https://docs.apollo.io/reference/list-email-schedules |
| `createTask` | Create a task. POST `/tasks`. https://docs.apollo.io/reference/create-a-task |
| `bulkCreateTasks` | Bulk create tasks. POST `/tasks/bulk_create`. https://docs.apollo.io/reference/bulk-create-tasks |
| `getTask` | Get a task. GET `/tasks/{id}`. https://docs.apollo.io/reference/get-a-task |
| `updateTask` | Update a task. PATCH `/tasks/{id}`. https://docs.apollo.io/reference/update-a-task |
| `completeTask` | Complete a task. POST `/tasks/{id}/complete`. https://docs.apollo.io/reference/complete-a-task |
| `skipTask` | Skip a task. POST `/tasks/{id}/skip`. https://docs.apollo.io/reference/skip-a-task |
| `searchTasks` | Search for tasks. POST `/tasks/search`. https://docs.apollo.io/reference/search-tasks |
| `createCall` | Create call records. POST `/phone_calls`. https://docs.apollo.io/reference/create-call-records |
| `updateCall` | Update call records. PUT `/phone_calls/{id}`. https://docs.apollo.io/reference/update-call-records |
| `searchCalls` | Search for calls. GET `/phone_calls/search`. https://docs.apollo.io/reference/search-for-calls |
| `createEmailDraft` | Create an email draft. POST `/emailer_messages`. https://docs.apollo.io/reference/create-an-email-draft |
| `sendEmail` | Send email now. POST `/emailer_messages/{id}/send_now`. https://docs.apollo.io/reference/send-email-now |
| `getEmailContent` | Get email content. POST `/emailer_messages/get_content`. https://docs.apollo.io/reference/get-email-content |
| `getEmailSendStatus` | Check email send status. POST `/emailer_messages/email_send_status`. https://docs.apollo.io/reference/check-email-send-status |
| `searchEmails` | Search for outreach emails. GET `/emailer_messages/search`. https://docs.apollo.io/reference/search-for-outreach-emails |
| `getEmailStats` | Check email stats. GET `/emailer_messages/{id}/activities`. https://docs.apollo.io/reference/check-email-stats |
| `listEmailAccounts` | Get a list of email accounts. GET `/email_accounts`. https://docs.apollo.io/reference/get-a-list-of-email-accounts |
| `searchConversations` | Search conversations. POST `/conversations/search`. https://docs.apollo.io/reference/search-conversations |
| `getConversation` | Get conversations info. GET `/conversations/{id}`. https://docs.apollo.io/reference/get-conversations-info |
| `exportConversations` | Export conversations. POST `/conversations/export`. https://docs.apollo.io/reference/export-conversations |
| `getConversationExport` | Get conversations export. GET `/conversations/export/{id}`. https://docs.apollo.io/reference/get-conversations-export |
| `createDeal` | Create deal. POST `/opportunities`. https://docs.apollo.io/reference/create-deal |
| `listDeals` | List all deals. GET `/opportunities/search`. https://docs.apollo.io/reference/list-all-deals |
| `getDeal` | View deal. GET `/opportunities/{opportunity_id}`. https://docs.apollo.io/reference/view-deal |
| `updateDeal` | Update deal. PATCH `/opportunities/{opportunity_id}`. https://docs.apollo.io/reference/update-deal |
| `listDealStages` | List deal stages. GET `/opportunity_stages`. https://docs.apollo.io/reference/list-deal-stages |
| `listNotes` | Get a list of notes. GET `/notes`. https://docs.apollo.io/reference/get-a-list-of-notes |
| `listFields` | Get a list of fields. GET `/fields`. https://docs.apollo.io/reference/get-a-list-of-fields |
| `createField` | Create a custom field. POST `/fields`. https://docs.apollo.io/reference/create-a-custom-field |
| `updateFields` | Update a custom field. PATCH `/fields`. https://docs.apollo.io/reference/update-a-custom-field |
| `listCustomFields` | Get a list of all custom fields. GET `/typed_custom_fields`. https://docs.apollo.io/reference/get-a-list-of-all-custom-fields |
| `listUsers` | Get a list of users. GET `/users/search`. https://docs.apollo.io/reference/get-a-list-of-users |
| `getCurrentUser` | Get current user profile. GET `/users/api_profile`. https://docs.apollo.io/reference/get-current-user-profile |
| `getApiUsageStats` | View API usage stats and rate limits. POST `/usage_stats/api_usage_stats`. https://docs.apollo.io/reference/view-api-usage-stats |
| `getCreditUsageStats` | View credit usage stats. POST `/usage_stats/credit_usage_stats`. https://docs.apollo.io/reference/view-credit-usage-stats |
| `pollWebhookResult` | Poll webhook result. GET `/webhook_result/{request_id}`. `request_id` is a decimal string. https://docs.apollo.io/reference/poll-webhook-result |
| `queryReport` | Query analytics report. POST `/reports/sync_report`. https://docs.apollo.io/reference/sync-report |

The JSDoc on each function is the parameter contract.

## Errors

Invalid input throws `APOLLO_INVALID_INPUT: <reason>`. A non-2xx Apollo response throws `APOLLO_REQUEST_FAILED: <status> <message>`. The API key is not included in either error.
