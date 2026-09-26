import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const OPERATIONS = [
  {
    "fn": "login",
    "method": "POST",
    "path": "/api/v1/login",
    "auth": false,
    "pathParams": [],
    "requiredBody": [
      "email",
      "password"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "accountDetails",
    "method": "GET",
    "path": "/api/v1/user",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "updateProfile",
    "method": "PUT",
    "path": "/api/v1/user/profile",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "name"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "updatePassword",
    "method": "PUT",
    "path": "/api/v1/user/password",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "current_password",
      "password",
      "password_confirmation"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "logout",
    "method": "POST",
    "path": "/api/v1/user/logout",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "userWorkspaces",
    "method": "GET",
    "path": "/api/v1/workspaces",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createWorkspace",
    "method": "POST",
    "path": "/api/v1/workspaces",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "name"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "workspaceDetails",
    "method": "GET",
    "path": "/api/v1/workspaces/current",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "switchWorkspace",
    "method": "POST",
    "path": "/api/v1/workspaces/switch-workspace",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "uuid"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "updateWorkspace",
    "method": "PUT",
    "path": "/api/v1/workspaces/{team_id}",
    "auth": true,
    "pathParams": [
      "team_id"
    ],
    "requiredBody": [
      "name"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "inviteTeamMember",
    "method": "POST",
    "path": "/api/v1/workspaces/invite-members",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "email",
      "role"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "acceptWorkspaceInvitation",
    "method": "GET",
    "path": "/api/v1/workspaces/accept/{team_invitation_uuid}",
    "auth": true,
    "pathParams": [
      "team_invitation_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "updateWorkspaceMember",
    "method": "PUT",
    "path": "/api/v1/workspaces/members/{user_id}",
    "auth": true,
    "pathParams": [
      "user_id"
    ],
    "requiredBody": [
      "role"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "deleteWorkspaceMember",
    "method": "DELETE",
    "path": "/api/v1/workspaces/members/{user_id}",
    "auth": true,
    "pathParams": [
      "user_id"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listDomains",
    "method": "GET",
    "path": "/api/v1/domains",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createDomain",
    "method": "POST",
    "path": "/api/v1/domains",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "name"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showDomainDetails",
    "method": "GET",
    "path": "/api/v1/domains/{uuid}",
    "auth": true,
    "pathParams": [
      "uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "updateSpfRecords",
    "method": "PATCH",
    "path": "/api/v1/domains/spf-record/{domain_uuid}",
    "auth": true,
    "pathParams": [
      "domain_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "updateDkimRecords",
    "method": "PATCH",
    "path": "/api/v1/domains/dkim-records/{domain_uuid}",
    "auth": true,
    "pathParams": [
      "domain_uuid"
    ],
    "requiredBody": [
      "dkim_selectors"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "updateDmarcRecord",
    "method": "PATCH",
    "path": "/api/v1/domains/dmarc-record/{domain_uuid}",
    "auth": true,
    "pathParams": [
      "domain_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "deleteDomain",
    "method": "DELETE",
    "path": "/api/v1/domains/delete/{domain_uuid}",
    "auth": true,
    "pathParams": [
      "domain_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listEmailAccounts",
    "method": "GET",
    "path": "/api/v1/email-accounts",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showEmailAccountDetails",
    "method": "GET",
    "path": "/api/v1/email-accounts/{id}",
    "auth": true,
    "pathParams": [
      "id"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createImapSmtpEmailAccount",
    "method": "POST",
    "path": "/api/v1/email-accounts/imap-smtp",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "name",
      "provider",
      "imap_username",
      "imap_password",
      "imap_host",
      "imap_port",
      "smtp_username",
      "smtp_password",
      "smtp_host",
      "smtp_port",
      "smtp_tls"
    ],
    "optionalBody": [
      "imap_tls"
    ],
    "multipart": false
  },
  {
    "fn": "testImapConnection",
    "method": "POST",
    "path": "/api/v1/email-accounts/test-imap-connection",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "imap_username",
      "imap_password",
      "imap_host",
      "imap_port"
    ],
    "optionalBody": [
      "imap_tls"
    ],
    "multipart": false
  },
  {
    "fn": "testSmtpConnection",
    "method": "POST",
    "path": "/api/v1/email-accounts/test-smtp-connection",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "smtp_username",
      "smtp_password",
      "smtp_host",
      "smtp_port",
      "smtp_tls"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "deleteEmailAccount",
    "method": "DELETE",
    "path": "/api/v1/email-accounts/delete/{email_account_uuid}",
    "auth": true,
    "pathParams": [
      "email_account_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getRandomReputationBuilderAccount",
    "method": "GET",
    "path": "/api/v1/email-accounts/reputation-builder-accounts/random",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listContactLists",
    "method": "GET",
    "path": "/api/v1/contact-verification",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createContactVerification",
    "method": "POST",
    "path": "/api/v1/contact-verification",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "csv",
      "name"
    ],
    "optionalBody": [],
    "multipart": true
  },
  {
    "fn": "showContactListDetails",
    "method": "GET",
    "path": "/api/v1/contact-verification/show/{contact_list_uuid}",
    "auth": true,
    "pathParams": [
      "contact_list_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "downloadContactList",
    "method": "GET",
    "path": "/api/v1/contact-verification/download/{contact_list_uuid}",
    "auth": true,
    "pathParams": [
      "contact_list_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listDomainBlacklists",
    "method": "GET",
    "path": "/api/v1/blacklist-checks/domains",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listEmailAccountBlacklists",
    "method": "GET",
    "path": "/api/v1/blacklist-checks/email-accounts",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createAdHocBlacklistCheck",
    "method": "POST",
    "path": "/api/v1/blacklist-checks/ad-hoc",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "domain_or_ip"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showBlacklistCheckDetails",
    "method": "GET",
    "path": "/api/v1/blacklist-checks/{id}",
    "auth": true,
    "pathParams": [
      "id"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listDmarcReportDomains",
    "method": "GET",
    "path": "/api/v1/dmarc-reports",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getDmarcReportStatistics",
    "method": "GET",
    "path": "/api/v1/dmarc-reports/domains/{domain_uuid}/insights",
    "auth": true,
    "pathParams": [
      "domain_uuid"
    ],
    "requiredBody": [],
    "queryParams": [
      "start_date",
      "end_date"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getDmarcReportSources",
    "method": "GET",
    "path": "/api/v1/dmarc-reports/domains/{domain_uuid}/dmarc-sources",
    "auth": true,
    "pathParams": [
      "domain_uuid"
    ],
    "requiredBody": [],
    "queryParams": [
      "start_date",
      "end_date"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getDmarcReportFailures",
    "method": "GET",
    "path": "/api/v1/dmarc-reports/domains/{domain_uuid}/dmarc-failures",
    "auth": true,
    "pathParams": [
      "domain_uuid"
    ],
    "requiredBody": [],
    "queryParams": [
      "start_date",
      "end_date"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "spfLookup",
    "method": "GET",
    "path": "/api/v1/email-authentication/spf-lookup",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "queryParams": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "spfGeneratorWizard",
    "method": "POST",
    "path": "/api/v1/email-authentication/spf-generator-wizard",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "providers"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "spfRawGenerator",
    "method": "POST",
    "path": "/api/v1/email-authentication/spf-raw-generator",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [
      "redirect",
      "redirect_url",
      "failure_policy",
      "tag",
      "value"
    ],
    "multipart": false
  },
  {
    "fn": "dkimLookup",
    "method": "GET",
    "path": "/api/v1/email-authentication/dkim-lookup",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "queryParams": [
      "domain",
      "selector"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "dkimRawGenerator",
    "method": "POST",
    "path": "/api/v1/email-authentication/dkim-raw-generator",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "keyLength"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "dmarcLookup",
    "method": "GET",
    "path": "/api/v1/email-authentication/dmarc-lookup",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "queryParams": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "generateDmarcForConnectedDomain",
    "method": "POST",
    "path": "/api/v1/email-authentication/dmarc-connected-domain",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "domain_uuid",
      "policy"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "generateDmarcForAnotherDomain",
    "method": "POST",
    "path": "/api/v1/email-authentication/dmarc-another-domain",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "domain",
      "policy",
      "rua"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "checkContentForSpam",
    "method": "POST",
    "path": "/api/v1/content-spam-check",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "content"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "ipOfHostedDomainRedirect",
    "method": "GET",
    "path": "/api/v1/hosted-domain-redirects/ip",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listHostedDomainRedirects",
    "method": "GET",
    "path": "/api/v1/hosted-domain-redirects",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createHostedDomainRedirect",
    "method": "POST",
    "path": "/api/v1/hosted-domain-redirects",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "domain",
      "redirect"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showHostedDomainRedirect",
    "method": "GET",
    "path": "/api/v1/hosted-domain-redirects/{id}",
    "auth": true,
    "pathParams": [
      "id"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "deleteHostedDomainRedirect",
    "method": "DELETE",
    "path": "/api/v1/hosted-domain-redirects/{hosted_domain_redirect_uuid}",
    "auth": true,
    "pathParams": [
      "hosted_domain_redirect_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "domainHostLookup",
    "method": "POST",
    "path": "/api/v1/domain-host-lookup",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "ipOfDomainMaskingProxy",
    "method": "GET",
    "path": "/api/v1/domain-masking-proxies/ip",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listDomainMaskingProxies",
    "method": "GET",
    "path": "/api/v1/domain-masking-proxies",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createDomainMaskingProxy",
    "method": "POST",
    "path": "/api/v1/domain-masking-proxies",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "masking_domain",
      "primary_domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showDomainMaskingProxy",
    "method": "GET",
    "path": "/api/v1/domain-masking-proxies/{hosted_domain_redirect_uuid}",
    "auth": true,
    "pathParams": [
      "hosted_domain_redirect_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "deleteDomainMaskingProxy",
    "method": "DELETE",
    "path": "/api/v1/domain-masking-proxies/{hosted_domain_redirect_uuid}",
    "auth": true,
    "pathParams": [
      "hosted_domain_redirect_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "emailHostLookup",
    "method": "POST",
    "path": "/api/v1/email-host-lookup",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "email"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listInboxPlacementTests",
    "method": "GET",
    "path": "/api/v1/inbox-placement-tests",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createInboxPlacementTest",
    "method": "POST",
    "path": "/api/v1/inbox-placement-tests",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "name"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showInboxPlacementTest",
    "method": "GET",
    "path": "/api/v1/inbox-placement-tests/{id}",
    "auth": true,
    "pathParams": [
      "id"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listSurblBlacklists",
    "method": "GET",
    "path": "/api/v1/surbl-blacklist-checks/domains",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showSurblBlacklistCheck",
    "method": "GET",
    "path": "/api/v1/surbl-blacklist-checks/{surblBlacklistCheck_uuid}",
    "auth": true,
    "pathParams": [
      "surblBlacklistCheck_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createSurblBlacklistCheck",
    "method": "POST",
    "path": "/api/v1/surbl-blacklist-checks",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listSpamFilterTests",
    "method": "GET",
    "path": "/api/v1/spam-filter-tests",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createSpamFilterTest",
    "method": "POST",
    "path": "/api/v1/spam-filter-tests",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "name"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showSpamFilterTestDetails",
    "method": "GET",
    "path": "/api/v1/spam-filter-tests/{email_test_uuid}",
    "auth": true,
    "pathParams": [
      "email_test_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listARecordReputationChecks",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/a-record-reputation",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createARecordReputationCheck",
    "method": "POST",
    "path": "/api/v1/spamhaus-intelligence/a-record-reputation/create",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showARecordReputationCheck",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/a-record-reputation/{spamhausARecordReputationCheck_uuid}",
    "auth": true,
    "pathParams": [
      "spamhausARecordReputationCheck_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listDomainContextChecks",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/domain-contexts",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createDomainContextCheck",
    "method": "POST",
    "path": "/api/v1/spamhaus-intelligence/domain-contexts/create",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showDomainContextCheck",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/domain-contexts/{spamhausDomainContextCheck_uuid}",
    "auth": true,
    "pathParams": [
      "spamhausDomainContextCheck_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listDomainReputationChecks",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/domain-reputation",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createDomainReputationCheck",
    "method": "POST",
    "path": "/api/v1/spamhaus-intelligence/domain-reputation/create",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showDomainReputationCheck",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/domain-reputation/{spamhausDomainReputationCheck_uuid}",
    "auth": true,
    "pathParams": [
      "spamhausDomainReputationCheck_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listDomainSenderChecks",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/domain-senders",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createDomainSenderCheck",
    "method": "POST",
    "path": "/api/v1/spamhaus-intelligence/domain-senders/create",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showDomainSenderCheck",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/domain-senders/{spamhausDomainSenderCheck_uuid}",
    "auth": true,
    "pathParams": [
      "spamhausDomainSenderCheck_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listNameserverReputationChecks",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/nameserver-reputation",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createNameserverReputationCheck",
    "method": "POST",
    "path": "/api/v1/spamhaus-intelligence/nameserver-reputation/create",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showNameserverReputationCheck",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/nameserver-reputation/{spamhausNsReputationCheck_uuid}",
    "auth": true,
    "pathParams": [
      "spamhausNsReputationCheck_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listTags",
    "method": "GET",
    "path": "/api/v1/tags",
    "auth": true,
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "createTag",
    "method": "POST",
    "path": "/api/v1/tags",
    "auth": true,
    "pathParams": [],
    "requiredBody": [
      "name",
      "color"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "showTag",
    "method": "GET",
    "path": "/api/v1/tags/{uuid}",
    "auth": true,
    "pathParams": [
      "uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "deleteTag",
    "method": "DELETE",
    "path": "/api/v1/tags/{tag_uuid}",
    "auth": true,
    "pathParams": [
      "tag_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  }
];
const loadScript = ({ handler } = {}) => {
  const calls = [];
  const context = createContext({
    ConnectionApp: {
      getApiKey: async () => "vault-key-secret",
    },
    UrlFetchApp: {
      fetch: async (url, options = {}) => {
        const contentType = String((options.headers && options.headers["Content-Type"]) || "");
        let payload;
        if (options.payload !== undefined) {
          payload = contentType.includes("multipart/form-data") ? options.payload : JSON.parse(options.payload);
        }
        const authorization = options.headers && options.headers.Authorization;
        calls.push({
          url,
          method: String(options.method || "GET").toUpperCase(),
          payload,
          contentType,
          muteHttpExceptions: options.muteHttpExceptions === true,
          hasBearer: Boolean(authorization && String(authorization).startsWith("Bearer ")),
          bearerToken: authorization && String(authorization).startsWith("Bearer ")
            ? String(authorization).slice("Bearer ".length)
            : "",
        });
        const result = handler ? await handler({ url, method: String(options.method || "GET").toUpperCase(), payload, contentType }) : {};
        const status = Number(result.status) || 200;
        const body = result.body === undefined ? { data: { ok: true } } : result.body;
        return {
          getResponseCode: () => status,
          getContentText: () => (typeof body === "string" ? body : JSON.stringify(body)),
        };
      },
    },
  });
  runInContext(readFileSync(join(root, "http.js"), "utf8"), context);
  const operationFiles = readdirSync(root).filter((name) => name.endsWith(".js") && name !== "http.js").sort();
  for (const name of operationFiles) runInContext(readFileSync(join(root, name), "utf8"), context);
  return { api: context, calls };
};
const lastCall = (calls) => calls[calls.length - 1];
const sameJson = (actual, expected) => assert.equal(JSON.stringify(actual), JSON.stringify(expected));
const pathOf = (url) => String(url).replace("https://app.emailguard.io", "");
const sampleField = (name) => {
  if (name === "provider" || name === "keyLength") return 2048;
  if (name === "dkim_selectors" || name === "providers") return ["google"];
  if (name === "csv") return "email\nuser@example.com";
  if (name.includes("password")) return "secret-password";
  if (name === "smtp_tls" || name === "imap_tls") return "true";
  if (name === "email") return "user@example.com";
  if (name === "color") return "#374151";
  if (name === "start_date" || name === "end_date") return "2026-01-01";
  if (name === "selector") return "sample";
  return "sample";
};
const sampleInput = (op) => {
  const input = {};
  op.pathParams.forEach((name) => {
    input[name] = "id-1";
  });
  op.requiredBody.forEach((name) => {
    input[name] = sampleField(name);
  });
  (op.queryParams || []).forEach((name) => {
    input[name] = sampleField(name);
  });
  return input;
};
const expectedPath = (op) => {
  let path = op.path;
  op.pathParams.forEach((name) => {
    path = path.replace(`{${name}}`, encodeURIComponent("id-1"));
  });
  const query = (op.queryParams || []).map((name) => (
    `${encodeURIComponent(name)}=${encodeURIComponent(String(sampleField(name)))}`
  ));
  return query.length ? `${path}?${query.join("&")}` : path;
};

test("documented methods and paths are called without live network", async () => {
  const { api, calls } = loadScript();
  for (const op of OPERATIONS) {
    const started = calls.length;
    const result = await api[op.fn](sampleInput(op));
    assert.equal(JSON.stringify(result), JSON.stringify({ data: { ok: true } }), `${op.fn} returns the EmailGuard body`);
    const call = lastCall(calls);
    assert.equal(calls.length, started + 1, `${op.fn} one HTTP call`);
    assert.equal(call.method, op.method, `${op.fn} method`);
    assert.equal(pathOf(call.url), expectedPath(op), `${op.fn} path`);
    if (op.method === "GET") {
      assert.equal(call.payload, undefined, `${op.fn} GET must not set payload`);
      assert.equal(call.contentType.includes("application/json"), false, `${op.fn} GET must not set JSON Content-Type`);
    }
    assert.equal(call.muteHttpExceptions, true);
    assert.equal(call.hasBearer, op.auth, `${op.fn} bearer`);
    if (op.auth) assert.equal(call.bearerToken, "vault-key-secret");
    if (op.multipart) assert.match(call.contentType, /multipart\/form-data/);
    assert.equal(JSON.stringify(result).includes("vault-key-secret"), false, `${op.fn} must not leak vault token`);
  }
  assert.equal(OPERATIONS.length, 89);
});

test("Bearer header is sent and the vault token is not returned", async () => {
  const { api, calls } = loadScript();
  const user = await api.accountDetails();
  sameJson(user, { data: { ok: true } });
  assert.equal(lastCall(calls).hasBearer, true);
  assert.equal(lastCall(calls).bearerToken, "vault-key-secret");
  assert.equal(JSON.stringify(user).includes("vault-key-secret"), false);
  assert.equal(JSON.stringify(user).includes("Bearer"), false);
});

test("inbox placement create and get use documented paths and unique-phrase fields", async () => {
  const { api, calls } = loadScript({
    handler: ({ url, method }) => {
      if (method === "POST" && url.endsWith("/api/v1/inbox-placement-tests")) {
        return {
          status: 200,
          body: {
            data: {
              uuid: "test-1",
              name: "sample",
              status: "created",
              filter_phrase: "egipt_uniquePhrase",
              comma_separated_test_email_addresses: "jake@emailguardalpha.com,cody@emailguardalpha.com",
              inbox_placement_test_emails: [
                { email: "jake@emailguardalpha.com", status: "waiting_for_email" },
              ],
            },
          },
        };
      }
      if (method === "GET" && url.endsWith("/api/v1/inbox-placement-tests/test-1")) {
        return {
          status: 200,
          body: {
            data: {
              uuid: "test-1",
              status: "created",
              filter_phrase: "egipt_uniquePhrase",
              comma_separated_test_email_addresses: "jake@emailguardalpha.com,cody@emailguardalpha.com",
            },
          },
        };
      }
      return { status: 200, body: { data: [] } };
    },
  });
  const created = await api.createInboxPlacementTest({ name: "sample" });
  assert.equal(created.data.filter_phrase, "egipt_uniquePhrase");
  assert.equal(created.data.comma_separated_test_email_addresses, "jake@emailguardalpha.com,cody@emailguardalpha.com");
  assert.equal(lastCall(calls).method, "POST");
  assert.equal(pathOf(lastCall(calls).url), "/api/v1/inbox-placement-tests");
  assert.deepEqual(lastCall(calls).payload, { name: "sample" });
  const listed = await api.listInboxPlacementTests();
  sameJson(listed, { data: [] });
  assert.equal(lastCall(calls).method, "GET");
  assert.equal(pathOf(lastCall(calls).url), "/api/v1/inbox-placement-tests");
  const shown = await api.showInboxPlacementTest({ id: "test-1" });
  assert.equal(shown.data.filter_phrase, "egipt_uniquePhrase");
  assert.equal(lastCall(calls).method, "GET");
  assert.equal(pathOf(lastCall(calls).url), "/api/v1/inbox-placement-tests/test-1");
});

test("HTTP failures throw EMAILGUARD_REQUEST_FAILED", async () => {
  const { api } = loadScript({
    handler: ({ url }) => {
      if (url.endsWith("/api/v1/user")) return { status: 401, body: { message: "Unauthenticated." } };
      return { status: 429, body: { message: "Too many requests" } };
    },
  });
  await assert.rejects(() => api.accountDetails(), (error) => {
    assert.equal(error.message, "EMAILGUARD_REQUEST_FAILED: 401 Unauthenticated.");
    return true;
  });
  await assert.rejects(() => api.listInboxPlacementTests(), (error) => {
    assert.equal(error.message, "EMAILGUARD_REQUEST_FAILED: 429 Too many requests");
    return true;
  });
});

test("EMAILGUARD_REQUEST_FAILED redacts the bearer token and passwords and clips the message", async () => {
  const { api, calls } = loadScript({
    handler: () => ({
      status: 422,
      body: { message: `password secret-imap token vault-key-secret Bearer vault-key-secret ${"y".repeat(600)}` },
    }),
  });
  await assert.rejects(() => api.testImapConnection({
    imap_username: "user@example.com",
    imap_password: "secret-imap",
    imap_host: "imap.example.com",
    imap_port: "993",
  }), (error) => {
    assert.equal(error.message.includes("secret-imap"), false);
    assert.equal(error.message.includes("vault-key-secret"), false);
    assert.match(error.message, /^EMAILGUARD_REQUEST_FAILED: 422 password \[redacted\] token \[redacted\] Bearer \[redacted\] /);
    assert.equal(error.message.slice("EMAILGUARD_REQUEST_FAILED: 422 ".length).length, 500);
    return true;
  });
  assert.equal(calls.length, 1);
});

test("the EmailGuard response body is returned unchanged", async () => {
  const { api, calls } = loadScript({
    handler: () => ({
      status: 200,
      body: { ok: false, outcome: "nope", data: { filter_phrase: "egipt_x" } },
    }),
  });
  const created = await api.createInboxPlacementTest({ name: "sample" });
  assert.equal(created.ok, false);
  assert.equal(created.outcome, "nope");
  assert.equal(created.data.filter_phrase, "egipt_x");
  assert.equal(calls.length, 1);
});

test("only documented field names are accepted", async () => {
  const { api, calls } = loadScript();
  await assert.rejects(() => api.showDomainDetails({ domain_uuid: "id-1" }), /EMAILGUARD_INVALID_INPUT: uuid is required/);
  await assert.rejects(() => api.spfGeneratorWizard({ providers: "google,outlook" }), /EMAILGUARD_INVALID_INPUT: providers must be an array/);
  await assert.rejects(() => api.spfRawGenerator({ redirect: "yes" }), /EMAILGUARD_INVALID_INPUT: redirect must be a boolean/);
  assert.equal(calls.length, 0);
  const raw = await api.spfRawGenerator({ redirect: false, failure_policy: "softfail" });
  sameJson(raw, { data: { ok: true } });
  assert.deepEqual(lastCall(calls).payload, { redirect: false, failure_policy: "softfail" });
  const wizard = await api.spfGeneratorWizard({ providers: ["google"] });
  sameJson(wizard, { data: { ok: true } });
  assert.deepEqual(lastCall(calls).payload, { providers: ["google"] });
});

test("non-JSON success text is returned unchanged", async () => {
  const { api } = loadScript({
    handler: () => ({ status: 200, body: "email,status\nuser@example.com,valid\n" }),
  });
  const downloaded = await api.downloadContactList({ contact_list_uuid: "id-1" });
  assert.equal(downloaded, "email,status\nuser@example.com,valid\n");
});

test("login and mailbox calls send credentials and return the EmailGuard body", async () => {
  const { api, calls } = loadScript({
    handler: ({ url }) => {
      if (url.endsWith("/api/v1/login")) {
        return { status: 200, body: { data: { token: "5|returned-login-token", password: "echo-password" } } };
      }
      return { status: 200, body: { data: { connected: true, imap_password: "echo-imap", smtp_password: "echo-smtp" } } };
    },
  });
  const loggedIn = await api.login({ email: "user@example.com", password: "login-password-secret" });
  sameJson(loggedIn, { data: { token: "5|returned-login-token", password: "echo-password" } });
  assert.equal(JSON.stringify(loggedIn).includes("login-password-secret"), false);
  assert.equal(JSON.stringify(loggedIn).includes("vault-key-secret"), false);
  assert.equal(lastCall(calls).hasBearer, false);
  assert.deepEqual(lastCall(calls).payload, { email: "user@example.com", password: "login-password-secret" });
  const created = await api.createImapSmtpEmailAccount({
    name: "User",
    provider: 1,
    imap_username: "user@example.com",
    imap_password: "secret-imap",
    imap_host: "imap.example.com",
    imap_port: "993",
    smtp_username: "user@example.com",
    smtp_password: "secret-smtp",
    smtp_host: "smtp.example.com",
    smtp_port: "587",
    smtp_tls: "true",
  });
  sameJson(created, { data: { connected: true, imap_password: "echo-imap", smtp_password: "echo-smtp" } });
  assert.equal(JSON.stringify(created).includes("secret-imap"), false);
  assert.equal(JSON.stringify(created).includes("secret-smtp"), false);
  assert.deepEqual(lastCall(calls).payload.imap_password, "secret-imap");
  const imap = await api.testImapConnection({
    imap_username: "user@example.com",
    imap_password: "secret-imap",
    imap_host: "imap.example.com",
    imap_port: "993",
  });
  sameJson(imap, { data: { connected: true, imap_password: "echo-imap", smtp_password: "echo-smtp" } });
  assert.equal(JSON.stringify(imap).includes("secret-imap"), false);
  const smtp = await api.testSmtpConnection({
    smtp_username: "user@example.com",
    smtp_password: "secret-smtp",
    smtp_host: "smtp.example.com",
    smtp_port: "587",
    smtp_tls: "true",
  });
  assert.equal(JSON.stringify(smtp).includes("secret-smtp"), false);
  const updated = await api.updatePassword({
    current_password: "old-secret",
    password: "new-secret",
    password_confirmation: "new-secret",
  });
  assert.equal(JSON.stringify(updated).includes("old-secret"), false);
  assert.equal(JSON.stringify(updated).includes("new-secret"), false);
  assert.deepEqual(lastCall(calls).payload, {
    current_password: "old-secret",
    password: "new-secret",
    password_confirmation: "new-secret",
  });
});
