# EmailGuard

EmailGuard operations for a Saleslumen Marketplace app. Each operation is one function. `http.js` is shared request code.

## Connection

The connection kind is `API_KEY`. The connection key is `emailguard`. The display label is `EmailGuard`. Authorization mode is `USER`, and the connection is required.

Paste the EmailGuard API token from Generate API token. The app sends it as a bearer token. The app calls `https://app.emailguard.io`.

## Configuration

This app has no installation settings.

## Operations

| Operation | What it does |
| --- | --- |
| `getUser` | Retrieve the authenticated user account details. |
| `updateProfile` | Update the authenticated user's profile name. |
| `updatePassword` | Update the authenticated user's password. |
| `logout` | Invalidate the current authentication token. |
| `listWorkspaces` | List workspaces for the authenticated user. |
| `createWorkspace` | Create a workspace. |
| `getCurrentWorkspace` | Get the authenticated user's current workspace. |
| `switchWorkspace` | Switch the current workspace by team uuid. |
| `updateWorkspace` | Update a workspace name. |
| `inviteWorkspaceMember` | Invite a member to the current workspace. |
| `acceptWorkspaceInvitation` | Accept a workspace invitation by invitation uuid. |
| `updateWorkspaceMember` | Update a workspace member role. |
| `deleteWorkspaceMember` | Remove a workspace member. |
| `listDomains` | List domains for the authenticated user. |
| `createDomain` | Create a domain. |
| `getDomain` | Get one domain by uuid. |
| `updateDomainSpfRecords` | Update SPF records for a connected domain. |
| `updateDomainDkimRecords` | Update DKIM records for a connected domain. |
| `updateDomainDmarcRecord` | Update the DMARC record for a connected domain. |
| `deleteDomain` | Delete a domain. |
| `listEmailAccounts` | List email accounts for the authenticated workspace. |
| `getEmailAccount` | Get one email account by id. |
| `createImapSmtpEmailAccount` | Create an IMAP/SMTP email account. |
| `testImapConnection` | Test IMAP credentials. |
| `testSmtpConnection` | Test SMTP credentials. |
| `deleteEmailAccount` | Delete an IMAP/SMTP email account. |
| `getRandomReputationBuilderAccount` | Get a random reputation-builder email account. |
| `listContactLists` | List contact verification lists. |
| `createContactVerification` | Create a contact verification from a CSV that includes an email field. |
| `getContactList` | Get one contact list by uuid. |
| `downloadContactList` | Download a completed contact list. |
| `listDomainBlacklists` | List domain blacklist checks. |
| `listEmailAccountBlacklists` | List email-account blacklist checks. |
| `createAdHocBlacklistCheck` | Create an ad-hoc blacklist check for a domain or IPv4 address. |
| `getBlacklistCheck` | Get one blacklist check by id. |
| `listDmarcReportDomains` | List domains that have DMARC reports in the current workspace. |
| `getDmarcReportStatistics` | Get DMARC report statistics for a domain between two dates. |
| `getDmarcReportSources` | Get DMARC report sources for a domain between two dates. |
| `getDmarcReportFailures` | Get DMARC report failures for a domain between two dates. |
| `lookupSpf` | Look up and validate SPF records for a domain. |
| `generateSpfWizard` | Generate an SPF record from selected providers. |
| `generateSpfRaw` | Generate a raw SPF record. |
| `lookupDkim` | Look up and validate DKIM records for a domain and selector. |
| `generateDkimRaw` | Generate a raw DKIM record. |
| `lookupDmarc` | Look up and validate DMARC records for a domain. |
| `generateDmarcForConnectedDomain` | Generate a DMARC record for a connected domain with a random DMARC inbox name. |
| `generateDmarcForAnotherDomain` | Generate a DMARC record for another domain with a specified reporting address. |
| `checkContentForSpam` | Check content for spam. |
| `getHostedDomainRedirectIp` | Get the IP of the current workspace hosted domain redirect. |
| `listHostedDomainRedirects` | List hosted domain redirects for the authenticated workspace. |
| `createHostedDomainRedirect` | Create a hosted domain redirect. |
| `getHostedDomainRedirect` | Get one hosted domain redirect by id. |
| `deleteHostedDomainRedirect` | Delete a hosted domain redirect. |
| `lookupDomainHost` | Look up the domain host or corporate spam filter for a domain. |
| `getDomainMaskingProxyIp` | Get the IP of the current workspace domain masking proxy. |
| `listDomainMaskingProxies` | List domain masking proxies for the authenticated workspace. |
| `createDomainMaskingProxy` | Create a domain masking proxy. |
| `getDomainMaskingProxy` | Get one domain masking proxy. |
| `deleteDomainMaskingProxy` | Delete a domain masking proxy. |
| `lookupEmailHost` | Look up the email host or corporate spam filter for an email address. |
| `listInboxPlacementTests` | List inbox placement tests. |
| `createInboxPlacementTest` | Create an inbox placement test by name. |
| `getInboxPlacementTest` | Get one inbox placement test, including filter_phrase and seed test email addresses. |
| `listSurblBlacklists` | List SURBL blacklist checks for domains. |
| `getSurblBlacklistCheck` | Get one SURBL blacklist check. |
| `createSurblBlacklistCheck` | Create a SURBL blacklist check for a domain. |
| `listSpamFilterTests` | List spam filter tests for the authenticated workspace. |
| `createSpamFilterTest` | Create a spam filter test. |
| `getSpamFilterTest` | Get one spam filter test. |
| `listARecordReputationChecks` | List Spamhaus A-record reputation checks. |
| `createARecordReputationCheck` | Queue a Spamhaus A-record reputation check. |
| `getARecordReputationCheck` | Get one Spamhaus A-record reputation check. |
| `listDomainContextChecks` | List Spamhaus domain context checks. |
| `createDomainContextCheck` | Queue a Spamhaus domain context check. |
| `getDomainContextCheck` | Get one Spamhaus domain context check. |
| `listDomainReputationChecks` | List Spamhaus domain reputation checks. |
| `createDomainReputationCheck` | Queue a Spamhaus domain reputation check. |
| `getDomainReputationCheck` | Get one Spamhaus domain reputation check. |
| `listDomainSenderChecks` | List Spamhaus domain sender checks. |
| `createDomainSenderCheck` | Queue a Spamhaus domain sender check. |
| `getDomainSenderCheck` | Get one Spamhaus domain sender check. |
| `listNameserverReputationChecks` | List Spamhaus nameserver reputation checks. |
| `createNameserverReputationCheck` | Queue a Spamhaus nameserver reputation check. |
| `getNameserverReputationCheck` | Get one Spamhaus nameserver reputation check. |
| `listTags` | List tags for the authenticated user. |
| `createTag` | Create a tag. |
| `getTag` | Get one tag by uuid. |
| `deleteTag` | Delete a tag. |

The JSDoc on each function is the parameter and error contract.
