# Zapmail

Zapmail API. Each function is one documented API call. `http.js` is shared request code.

The function returns the Zapmail response body unchanged. An empty 2xx body returns `{}`. A non-JSON body is returned as text.

Input keys are the documented path, query, header, and body names. `serviceProvider` is `GOOGLE` or `MICROSOFT` and is sent as `x-service-provider` on operations that document that header. `x-workspace-key` and `x-workspace-id` are sent as those headers on operations that document them. Fields other than path, query, and those headers are sent in the JSON body when the operation has a body.

## Connection

The connection kind is `API_KEY`. The connection key is `zapmail`. The display label is `Zapmail`. Authorization mode is `USER`, and the connection is required.

Paste the Zapmail API key from Dashboard, Settings, Integrations, API. The app sends it as the `x-auth-zapmail` header. The app calls `https://api.zapmail.ai/api`.

## Configuration

This app has no installation settings.

## Operations

Required inputs have no suffix. Optional inputs end with `?`.

### users

| Function | Method + path | Inputs |
| --- | --- | --- |
| `getUser` | GET /v2/users | x-workspace-key?, serviceProvider? |

### quick setup

| Function | Method + path | Inputs |
| --- | --- | --- |
| `quickSetup` | POST /v2/quick-setup | x-workspace-key?, serviceProvider?, domains, mailboxes, exportApp?, enableDnsShield |

### workspaces

| Function | Method + path | Inputs |
| --- | --- | --- |
| `listWorkspaces` | GET /v2/workspaces | page, limit, contains?, x-workspace-key?, serviceProvider? |
| `createWorkspace` | POST /v2/workspaces | x-workspace-key?, serviceProvider?, name, billingDetails? |
| `updateWorkspace` | PUT /v2/workspaces | x-workspace-key?, serviceProvider?, id, name |
| `listWorkspaceMembers` | GET /v2/workspaces/members | limit, page, x-workspace-key |
| `updateWorkspaceMember` | PUT /v2/workspaces/members | memberId, x-workspace-key?, role |
| `revokeWorkspaceMember` | DELETE /v2/workspaces/members | memberId, x-workspace-key? |
| `createWorkspaceInvitation` | POST /v2/workspaces/invitations | x-workspace-key?, email, role, workspaceId |
| `listWorkspaceInvitations` | GET /v2/workspaces/invitations | limit, page, status, x-workspace-key? |
| `revokeWorkspaceInvitation` | DELETE /v2/workspaces/invitations | invitationId, x-workspace-key? |
| `updateDomainRenewalSettings` | POST /v2/workspaces/update-domain-renewal-settings | x-workspace-key, domainRenewalSettings |

### billing

| Function | Method + path | Inputs |
| --- | --- | --- |
| `createBillingDetails` | POST /v2/billing | x-workspace-key?, serviceProvider?, firstName, lastName, company, addressLineOne, addressLineTwo, addressLineThree, city, state, country, postalCode, phoneCc, phone, workspaceId |
| `updateBillingDetails` | PUT /v2/billing | x-workspace-key?, serviceProvider?, firstName, lastName, company, addressLineOne, addressLineTwo, addressLineThree, city, state, country, postalCode, phoneCc, phone, workspaceId |

### mailbox

| Function | Method + path | Inputs |
| --- | --- | --- |
| `listMailboxes` | GET /v2/mailboxes/list | page?, limit?, contains?, x-workspace-key?, serviceProvider? |
| `getMailbox` | GET /v2/mailboxes | id, x-workspace-key?, serviceProvider? |
| `assignMailboxes` | POST /v2/mailboxes | x-workspace-key?, serviceProvider?, domain id keys mapping to mailbox arrays |
| `updateMailbox` | PUT /v2/mailboxes | x-workspace-key?, serviceProvider?, mailboxData |
| `scheduleMailboxRemoval` | PUT /v2/mailboxes/scheduled-removal | x-workspace-key?, serviceProvider?, remove, status?, contains?, domainIds |
| `getMailboxAuthenticatorCode` | GET /v2/mailboxes/authenticator-code | mailboxId?, domainId?, x-workspace-key?, serviceProvider? |
| `createCustomOAuth` | POST /v2/mailboxes/custom-oauth | x-workspace-key?, serviceProvider?, google?, microsoft? |
| `scheduleMailboxCreation` | POST /v2/mailboxes/schedule (deprecated) | serviceProvider, domain id keys mapping to mailbox arrays |
| `retryFailedMailboxes` | PUT /v2/mailboxes/retry-failed | serviceProvider, domainIds |

### payments & wallet

| Function | Method + path | Inputs |
| --- | --- | --- |
| `addWalletBalance` | POST /v2/wallet/balance | x-workspace-key?, serviceProvider?, amount |
| `getWalletBalance` | GET /v2/wallet/balance | x-workspace-key?, serviceProvider? |
| `enableWalletAutoRecharge` | POST /v2/wallet/enable-auto-recharge | x-workspace-key?, serviceProvider?, enable, threshold, minimumRechargeAmount |
| `purchaseAddonMailboxes` | POST /v2/wallet/buy-addon-mailboxes | quantity, x-workspace-key?, serviceProvider? |
| `getSubscriptionInvoices` | POST /v2/payment/invoices | subscriptionId |

### export

| Function | Method + path | Inputs |
| --- | --- | --- |
| `exportMailboxes` | POST /v2/exports/mailboxes | x-workspace-key?, serviceProvider?, apps, ids, excludeIds, tagIds, status, contains, thirdPartyAccountId? |
| `createThirdPartyAccount` | POST /v2/exports/accounts/third-party | x-workspace-key?, serviceProvider?, email, password, app |
| `updateThirdPartyAccount` | PUT /v2/exports/accounts/third-party | x-workspace-key?, serviceProvider?, email, password, app, accountId? |
| `getExportStatus` | GET /v2/exports/status | exportId, x-workspace-key |
| `listExportWorkspaces` | GET /v2/exports/fetch-workspaces | app, accountId? |
| `listThirdPartyAccounts` | GET /v2/exports/accounts/third-party | app, x-workspace-key?, serviceProvider? |

### subscriptions

| Function | Method + path | Inputs |
| --- | --- | --- |
| `listSubscriptions` | GET /v2/subscriptions | status?, contains?, x-workspace-key?, serviceProvider? |
| `cancelSubscription` | POST /v2/subscriptions/cancel | x-workspace-key?, serviceProvider?, subscriptionId, revertCancellation |
| `upgradeSubscription` | POST /v2/subscriptions/upgrade | x-workspace-key?, serviceProvider?, lookupKey, subscriptionId |
| `purchaseSubscription` | POST /v2/subscriptions/purchase | planName, billingCycle?, x-workspace-key?, serviceProvider |
| `listSubscriptionMailboxes` | POST /v2/subscriptions/mailboxes | serviceProvider?, subscriptionId |

### domains

| Function | Method + path | Inputs |
| --- | --- | --- |
| `listDomains` | GET /v2/domains | contains?, page?, limit?, x-workspace-key?, serviceProvider? |
| `listAssignableDomains` | GET /v2/domains/assignable | contains?, page?, limit?, x-workspace-key?, serviceProvider? |
| `addDmarcRecord` | POST /v2/domains/dmarc | x-workspace-key?, serviceProvider?, domainIds, email, contains, status, tagIds |
| `addDomainForwarding` | POST /v2/domains/forwarding | x-workspace-key?, serviceProvider?, domainIds, forwardTo, contains, tagIds |
| `getNameServers` | POST /v2/domains/name-servers (deprecated) | domainName?, maskForwarding? |
| `verifyNameServers` | POST /v2/domains/name-servers/verify (deprecated) | domainName? |
| `enableEmailForwarding` | POST /v2/domains/email-forwarding | x-workspace-key?, serviceProvider?, domainIds, email, contains, status, tagIds |
| `removeEmailForwarding` | DELETE /v2/domains/email-forwarding | x-workspace-key?, serviceProvider?, domainIds, contains, status, tagIds |
| `enableCatchAllEmails` | POST /v2/domains/catch-all | x-workspace-key?, serviceProvider?, domainIds, email, contains, tagIds, status |
| `removeCatchAllEmails` | DELETE /v2/domains/catch-all | x-workspace-key?, serviceProvider?, domainIds, contains, tagIds, status |
| `checkDns` | POST /v2/domains/dns/check (deprecated) | domainIds? |
| `removeUnusedDomains` | DELETE /v2/domains | x-workspace-key?, serviceProvider?, ids |
| `listAvailableDomains` | POST /v2/domains/available | x-workspace-key?, serviceProvider?, domainName, tlds?, years? |
| `getDomainPurchaseLink` | POST /v2/domains/buy | x-workspace-key?, serviceProvider?, domains, useWallet, enableDnsShield |
| `listDomainConnectionRequests` | GET /v2/domains/connection-requests | page?, limit?, status?, contains?, cloudflareCredentialsId?, x-workspace-key, serviceProvider? |
| `removeDomainConnectionRequests` | DELETE /v2/domains/connection-requests | x-workspace-key?, serviceProvider?, domainNames, cloudflareCredentialsId?, status?, contains? |
| `connectDomains` | POST /v2/domains/connect-domain | x-workspace-key?, serviceProvider?, domainNames |
| `addGoogleClientId` | POST /v2/domains/add-client-id | x-workspace-key?, serviceProvider?, domainIds, clientId, app |
| `checkDomainAvailability` | POST /v2/domains/available-bulk | x-workspace-key?, serviceProvider?, domainNames |
| `getDomainHealthScore` | GET /v2/domains/health-score | domainId?, x-workspace-key? |
| `listDomainsWithFilters` | POST /v2/domains | status?, contains?, tagIds?, sortBy? |
| `findAiDomains` | POST /v2/domains/ai-finder | serviceProvider, keywords, tlds, desiredCount |
| `moveDomains` | POST /v2/domains/move-workspace | x-workspace-key, serviceProvider, domainIds, workspaceId |
| `assignDomainTags` | POST /v2/domains/assign-tag | x-workspace-key?, serviceProvider?, tagIds, domainIds |
| `listDomainTags` | GET /v2/domains/tags | x-workspace-id?, serviceProvider? |
| `createDomainTags` | POST /v2/domains/tags | array of { name, tagColor }, x-workspace-key? |
| `removeDomainForwarding` | POST /v2/domains/remove-forwarding | x-workspace-id?, serviceProvider?, domainId |
| `listRenewableDomains` | POST /v2/domains/renewal-soon | page?, limit?, x-workspace-key?, serviceProvider?, contains?, tagIds? |
| `getRenewalPrice` | POST /v2/domains/get-renewal-price | x-workspace-key?, serviceProvider?, domainIds, contains?, tagIds? |
| `renewDomains` | POST /v2/domains/renew | x-workspace-key?, serviceProvider?, domainIds?, contains?, tagIds? |
| `deleteDomainTag` | POST /v2/domains/tags/delete | x-workspace-key?, serviceProvider?, tagId |
| `removeDomainTags` | POST /v2/domains/tags/remove | x-workspace-key?, serviceProvider?, tagIds, domainIds, contains, status |
| `updateAutoRenew` | POST /v2/domains/update-auto-renew | x-workspace-key?, serviceProvider?, domainIds, autoRenew, contains?, tagIds? |

### dns

| Function | Method + path | Inputs |
| --- | --- | --- |
| `listDnsRecords` | GET /v2/dns/ | id, x-workspace-key?, serviceProvider? |
| `addDnsRecords` | POST /v2/dns | x-workspace-key?, serviceProvider?, assignedDomainId, records |
| `updateDnsRecords` | PUT /v2/dns | x-workspace-key?, serviceProvider?, assignedDomainId?, host?, value?, recordType?, dnsRecordId?, zoneId? |
| `deleteDnsRecords` | DELETE /v2/dns | id, assignedDomainId, x-workspace-key?, serviceProvider? |

### High Reputation Domains

| Function | Method + path | Inputs |
| --- | --- | --- |
| `listAgedDomains` | GET /v2/aged-domains/available-domains | page?, limit?, x-workspace-key?, serviceProvider? |
| `purchaseAgedDomains` | POST /v2/aged-domains/purchase | x-workspace-key?, serviceProvider, domains |

### prewarmed domains

| Function | Method + path | Inputs |
| --- | --- | --- |
| `listPrewarmedDomains` | GET /v2/prewarmed-domains/get-domains | page, limit, contains?, x-workspace-key?, serviceProvider? |
| `purchasePrewarmedSubscription` | POST /v2/prewarmed-domains/purchase | planType, x-workspace-key?, serviceProvider |
| `assignPrewarmedMailboxes` | POST /v2/prewarmed-domains/assign | x-workspace-key?, domainIds |
| `getPrewarmedDomainCount` | GET /v2/prewarmed-domains/count | none |
| `listPrewarmedSubscriptions` | GET /v2/prewarmed-domains/subscriptions | status?, page?, limit? |

### placement test

| Function | Method + path | Inputs |
| --- | --- | --- |
| `listPlacementTestSubscriptions` | GET /v2/placement-tests/subscriptions | x-workspace-key? |
| `getPlacementTestReport` | GET /v2/placement-tests/overall-report | x-workspace-key?, serviceProvider? |
| `listPlacementTestOrders` | GET /v2/placement-tests/orders | page?, limit?, x-workspace-key?, serviceProvider? |
| `getPlacementTestOrderReport` | GET /v2/placement-tests/report | cartOrderId?, x-workspace-key?, serviceProvider? |
| `listPlacementTestMailboxes` | POST /v2/placement-tests/eligible-mailboxes | page, limit, status?, x-workspace-key?, serviceProvider |
| `getPlacementTestCredits` | GET /v2/placement-tests/available-slots | x-workspace-key?, serviceProvider? |
| `purchasePlacementTest` | POST /v2/placement-tests/purchase | x-workspace-key?, serviceProvider?, placementType, testName, mailboxIds, seedAccounts |
| `purchasePlacementTestPlan` | POST /v2/placement-tests/purchase-plan | x-workspace-key?, serviceProvider, planName |
| `cancelPlacementTestSubscription` | POST /v2/placement-tests/cancel-subscription | x-workspace-key?, serviceProvider?, subscriptionId, revertCancellation |

### dns shield

| Function | Method + path | Inputs |
| --- | --- | --- |
| `listDnsShieldDomains` | GET /v2/dns-shield/eligible-domains | page, limit, tagIds?, contains?, status?, mailboxIds?, x-workspace-key?, serviceProvider? |
| `getDnsShieldSlots` | GET /v2/dns-shield/available-slots | x-workspace-key?, serviceProvider? |
| `listDnsShieldSubscriptions` | GET /v2/dns-shield/subscriptions | x-workspace-key?, serviceProvider? |
| `listDnsShieldAllocatedDomains` | GET /v2/dns-shield/allocated-domains | subscriptionId, x-workspace-key?, serviceProvider? |
| `allocateDnsShieldDomains` | POST /v2/dns-shield/allocate-domains | x-workspace-key?, serviceProvider?, domainIds |
| `purchaseDnsShield` | POST /v2/dns-shield/purchase | x-workspace-key?, serviceProvider, planType?, planName?, quantity?, domainNames?, domainIds? |
| `upgradeDnsShieldPlan` | POST /v2/dns-shield/upgrade-plan | x-workspace-key?, serviceProvider?, subscriptionId, newPlanName |
| `cancelDnsShieldSubscription` | POST /v2/dns-shield/cancel-subscription | x-workspace-key?, serviceProvider?, subscriptionId |

### Zapsites

| Function | Method + path | Inputs |
| --- | --- | --- |
| `scanZapSite` | GET /v2/zap-sites/scan | url |
| `createZapSite` | POST /v2/zap-sites | x-workspace-id, serviceProvider, destination_url, name?, campaign_context?, audience?, cta_label?, theme? |
| `getZapSite` | GET /v2/zap-sites/{id} | id, x-workspace-key, serviceProvider |
| `updateZapSite` | PATCH /v2/zap-sites/{id} | id, x-workspace-id, serviceProvider, name, notify_email, form_fields |
| `regenerateZapSite` | POST /v2/zap-sites/{id}/regenerate | id, x-workspace-id, serviceProvider, notes |
| `deployZapSite` | GET /v2/zap-sites/{id}/deploy | id, x-workspace-id, serviceProvider, domainIds, indexing, tracking, form_enabled |

### global

| Function | Method + path | Inputs |
| --- | --- | --- |
| `searchMailboxesAndDomains` | GET /v2/global/mailbox-domain-search | contains?, page, limit |

### zapbox

| Function | Method + path | Inputs |
| --- | --- | --- |
| `listConnectedAccounts` | GET /v2/onebox/connected-accounts | x-workspace-id?, serviceProvider? |
| `listEmails` | GET /v2/onebox/top-emails | account?, folder?, cursor?, limit?, includeWarmUp?, x-workspace-id?, serviceProvider? |
| `listThreadEmails` | GET /v2/onebox/thread-emails | threadId, x-workspace-id?, serviceProvider? |
| `searchEmails` | GET /v2/onebox/search-emails | x-workspace-id?, serviceProvider? |
| `sendEmail` | POST /v2/onebox/send-email | x-workspace-id?, serviceProvider?, account, to, subject, body, cc?, bcc?, messageId?, threadId? |
| `downloadAttachment` | POST /v2/onebox/download-attachment | x-workspace-id?, serviceProvider?, attachmentId, provider, messageId, account, filename |
| `createLabel` | POST /v2/onebox/create-new-label | x-workspace-id?, serviceProvider?, account, labelName, color |
| `deleteLabel` | POST /v2/onebox/delete-label | x-workspace-id?, serviceProvider?, account, labelName |
| `renameLabel` | POST /v2/onebox/rename-label | x-workspace-id?, serviceProvider?, account, oldLabelName, newLabelName, color |

### Webhooks

| Function | Method + path | Inputs |
| --- | --- | --- |
| `listWebhookEventTypes` | GET /v2/webhook/events | none |
| `listWebhookEndpoints` | GET /v2/webhooks/endpoints | none |
| `createWebhookEndpoint` | POST /v2/webhooks/endpoints | url, enabled_events |
| `updateWebhookEndpoint` | PATCH /v2/webhooks/endpoints/{id} | id, url, enabled_events, status |

The JSDoc on each function is the parameter and error contract.
