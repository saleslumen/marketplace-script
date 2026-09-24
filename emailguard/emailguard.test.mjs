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
    "success": "LOGIN",
    "pathParams": [],
    "requiredBody": [
      "email",
      "password"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getUser",
    "method": "GET",
    "path": "/api/v1/user",
    "auth": true,
    "success": "USER",
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
    "success": "PROFILE_UPDATED",
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
    "success": "PASSWORD_UPDATED",
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
    "success": "LOGGED_OUT",
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "listWorkspaces",
    "method": "GET",
    "path": "/api/v1/workspaces",
    "auth": true,
    "success": "WORKSPACES",
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
    "success": "WORKSPACE_CREATED",
    "pathParams": [],
    "requiredBody": [
      "name"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getCurrentWorkspace",
    "method": "GET",
    "path": "/api/v1/workspaces/current",
    "auth": true,
    "success": "CURRENT_WORKSPACE",
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
    "success": "WORKSPACE_SWITCHED",
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
    "success": "WORKSPACE_UPDATED",
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
    "fn": "inviteWorkspaceMember",
    "method": "POST",
    "path": "/api/v1/workspaces/invite-members",
    "auth": true,
    "success": "MEMBER_INVITED",
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
    "success": "INVITATION_ACCEPTED",
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
    "success": "MEMBER_UPDATED",
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
    "success": "MEMBER_DELETED",
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
    "success": "DOMAINS",
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
    "success": "DOMAIN_CREATED",
    "pathParams": [],
    "requiredBody": [
      "name"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getDomain",
    "method": "GET",
    "path": "/api/v1/domains/{uuid}",
    "auth": true,
    "success": "DOMAIN",
    "pathParams": [
      "uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "updateDomainSpfRecords",
    "method": "PATCH",
    "path": "/api/v1/domains/spf-record/{domain_uuid}",
    "auth": true,
    "success": "SPF_UPDATED",
    "pathParams": [
      "domain_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "updateDomainDkimRecords",
    "method": "PATCH",
    "path": "/api/v1/domains/dkim-records/{domain_uuid}",
    "auth": true,
    "success": "DKIM_UPDATED",
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
    "fn": "updateDomainDmarcRecord",
    "method": "PATCH",
    "path": "/api/v1/domains/dmarc-record/{domain_uuid}",
    "auth": true,
    "success": "DMARC_UPDATED",
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
    "success": "DOMAIN_DELETED",
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
    "success": "EMAIL_ACCOUNTS",
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getEmailAccount",
    "method": "GET",
    "path": "/api/v1/email-accounts/{id}",
    "auth": true,
    "success": "EMAIL_ACCOUNT",
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
    "success": "EMAIL_ACCOUNT_CREATED",
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
    "success": "IMAP_TESTED",
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
    "success": "SMTP_TESTED",
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
    "success": "EMAIL_ACCOUNT_DELETED",
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
    "success": "REPUTATION_BUILDER_ACCOUNT",
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
    "success": "CONTACT_LISTS",
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
    "success": "CONTACT_VERIFICATION_CREATED",
    "pathParams": [],
    "requiredBody": [
      "csv",
      "name"
    ],
    "optionalBody": [],
    "multipart": true
  },
  {
    "fn": "getContactList",
    "method": "GET",
    "path": "/api/v1/contact-verification/show/{contact_list_uuid}",
    "auth": true,
    "success": "CONTACT_LIST",
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
    "success": "CONTACT_LIST_DOWNLOADED",
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
    "success": "DOMAIN_BLACKLISTS",
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
    "success": "EMAIL_ACCOUNT_BLACKLISTS",
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
    "success": "BLACKLIST_CHECK_CREATED",
    "pathParams": [],
    "requiredBody": [
      "domain_or_ip"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getBlacklistCheck",
    "method": "GET",
    "path": "/api/v1/blacklist-checks/{id}",
    "auth": true,
    "success": "BLACKLIST_CHECK",
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
    "success": "DMARC_REPORT_DOMAINS",
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
    "success": "DMARC_STATISTICS",
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
    "success": "DMARC_SOURCES",
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
    "success": "DMARC_FAILURES",
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
    "fn": "lookupSpf",
    "method": "GET",
    "path": "/api/v1/email-authentication/spf-lookup",
    "auth": true,
    "success": "SPF_LOOKUP",
    "pathParams": [],
    "requiredBody": [],
    "queryParams": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "generateSpfWizard",
    "method": "POST",
    "path": "/api/v1/email-authentication/spf-generator-wizard",
    "auth": true,
    "success": "SPF_WIZARD",
    "pathParams": [],
    "requiredBody": [
      "providers"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "generateSpfRaw",
    "method": "POST",
    "path": "/api/v1/email-authentication/spf-raw-generator",
    "auth": true,
    "success": "SPF_RAW",
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
    "fn": "lookupDkim",
    "method": "GET",
    "path": "/api/v1/email-authentication/dkim-lookup",
    "auth": true,
    "success": "DKIM_LOOKUP",
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
    "fn": "generateDkimRaw",
    "method": "POST",
    "path": "/api/v1/email-authentication/dkim-raw-generator",
    "auth": true,
    "success": "DKIM_RAW",
    "pathParams": [],
    "requiredBody": [
      "keyLength"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "lookupDmarc",
    "method": "GET",
    "path": "/api/v1/email-authentication/dmarc-lookup",
    "auth": true,
    "success": "DMARC_LOOKUP",
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
    "success": "DMARC_CONNECTED",
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
    "success": "DMARC_ANOTHER",
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
    "success": "CONTENT_SPAM_CHECKED",
    "pathParams": [],
    "requiredBody": [
      "content"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getHostedDomainRedirectIp",
    "method": "GET",
    "path": "/api/v1/hosted-domain-redirects/ip",
    "auth": true,
    "success": "HOSTED_DOMAIN_REDIRECT_IP",
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
    "success": "HOSTED_DOMAIN_REDIRECTS",
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
    "success": "HOSTED_DOMAIN_REDIRECT_CREATED",
    "pathParams": [],
    "requiredBody": [
      "domain",
      "redirect"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getHostedDomainRedirect",
    "method": "GET",
    "path": "/api/v1/hosted-domain-redirects/{id}",
    "auth": true,
    "success": "HOSTED_DOMAIN_REDIRECT",
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
    "success": "HOSTED_DOMAIN_REDIRECT_DELETED",
    "pathParams": [
      "hosted_domain_redirect_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "lookupDomainHost",
    "method": "POST",
    "path": "/api/v1/domain-host-lookup",
    "auth": true,
    "success": "DOMAIN_HOST",
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getDomainMaskingProxyIp",
    "method": "GET",
    "path": "/api/v1/domain-masking-proxies/ip",
    "auth": true,
    "success": "DOMAIN_MASKING_PROXY_IP",
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
    "success": "DOMAIN_MASKING_PROXIES",
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
    "success": "DOMAIN_MASKING_PROXY_CREATED",
    "pathParams": [],
    "requiredBody": [
      "masking_domain",
      "primary_domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getDomainMaskingProxy",
    "method": "GET",
    "path": "/api/v1/domain-masking-proxies/{hosted_domain_redirect_uuid}",
    "auth": true,
    "success": "DOMAIN_MASKING_PROXY",
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
    "success": "DOMAIN_MASKING_PROXY_DELETED",
    "pathParams": [
      "hosted_domain_redirect_uuid"
    ],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "lookupEmailHost",
    "method": "POST",
    "path": "/api/v1/email-host-lookup",
    "auth": true,
    "success": "EMAIL_HOST",
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
    "success": "INBOX_PLACEMENT_TESTS",
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
    "success": "INBOX_PLACEMENT_TEST_CREATED",
    "pathParams": [],
    "requiredBody": [
      "name"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getInboxPlacementTest",
    "method": "GET",
    "path": "/api/v1/inbox-placement-tests/{id}",
    "auth": true,
    "success": "INBOX_PLACEMENT_TEST",
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
    "success": "SURBL_BLACKLISTS",
    "pathParams": [],
    "requiredBody": [],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getSurblBlacklistCheck",
    "method": "GET",
    "path": "/api/v1/surbl-blacklist-checks/{surblBlacklistCheck_uuid}",
    "auth": true,
    "success": "SURBL_BLACKLIST_CHECK",
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
    "success": "SURBL_BLACKLIST_CHECK_CREATED",
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
    "success": "SPAM_FILTER_TESTS",
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
    "success": "SPAM_FILTER_TEST_CREATED",
    "pathParams": [],
    "requiredBody": [
      "name"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getSpamFilterTest",
    "method": "GET",
    "path": "/api/v1/spam-filter-tests/{email_test_uuid}",
    "auth": true,
    "success": "SPAM_FILTER_TEST",
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
    "success": "A_RECORD_REPUTATION_CHECKS",
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
    "success": "A_RECORD_REPUTATION_CHECK_CREATED",
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getARecordReputationCheck",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/a-record-reputation/{spamhausARecordReputationCheck_uuid}",
    "auth": true,
    "success": "A_RECORD_REPUTATION_CHECK",
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
    "success": "DOMAIN_CONTEXT_CHECKS",
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
    "success": "DOMAIN_CONTEXT_CHECK_CREATED",
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getDomainContextCheck",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/domain-contexts/{spamhausDomainContextCheck_uuid}",
    "auth": true,
    "success": "DOMAIN_CONTEXT_CHECK",
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
    "success": "DOMAIN_REPUTATION_CHECKS",
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
    "success": "DOMAIN_REPUTATION_CHECK_CREATED",
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getDomainReputationCheck",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/domain-reputation/{spamhausDomainReputationCheck_uuid}",
    "auth": true,
    "success": "DOMAIN_REPUTATION_CHECK",
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
    "success": "DOMAIN_SENDER_CHECKS",
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
    "success": "DOMAIN_SENDER_CHECK_CREATED",
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getDomainSenderCheck",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/domain-senders/{spamhausDomainSenderCheck_uuid}",
    "auth": true,
    "success": "DOMAIN_SENDER_CHECK",
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
    "success": "NAMESERVER_REPUTATION_CHECKS",
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
    "success": "NAMESERVER_REPUTATION_CHECK_CREATED",
    "pathParams": [],
    "requiredBody": [
      "domain"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getNameserverReputationCheck",
    "method": "GET",
    "path": "/api/v1/spamhaus-intelligence/nameserver-reputation/{spamhausNsReputationCheck_uuid}",
    "auth": true,
    "success": "NAMESERVER_REPUTATION_CHECK",
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
    "success": "TAGS",
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
    "success": "TAG_CREATED",
    "pathParams": [],
    "requiredBody": [
      "name",
      "color"
    ],
    "optionalBody": [],
    "multipart": false
  },
  {
    "fn": "getTag",
    "method": "GET",
    "path": "/api/v1/tags/{uuid}",
    "auth": true,
    "success": "TAG",
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
    "success": "TAG_DELETED",
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
    assert.equal(result.ok, true, `${op.fn} should succeed`);
    assert.equal(result.outcome, op.success, `${op.fn} outcome`);
    assert.equal(result.retryable, false);
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
  const user = await api.getUser();
  assert.equal(user.ok, true);
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
  assert.equal(created.ok, true);
  assert.equal(created.outcome, "INBOX_PLACEMENT_TEST_CREATED");
  assert.equal(created.data.filter_phrase, "egipt_uniquePhrase");
  assert.equal(created.data.comma_separated_test_email_addresses, "jake@emailguardalpha.com,cody@emailguardalpha.com");
  assert.equal(lastCall(calls).method, "POST");
  assert.equal(pathOf(lastCall(calls).url), "/api/v1/inbox-placement-tests");
  assert.deepEqual(lastCall(calls).payload, { name: "sample" });
  const listed = await api.listInboxPlacementTests();
  assert.equal(listed.ok, true);
  assert.equal(lastCall(calls).method, "GET");
  assert.equal(pathOf(lastCall(calls).url), "/api/v1/inbox-placement-tests");
  const shown = await api.getInboxPlacementTest({ id: "test-1" });
  assert.equal(shown.ok, true);
  assert.equal(shown.data.filter_phrase, "egipt_uniquePhrase");
  assert.equal(lastCall(calls).method, "GET");
  assert.equal(pathOf(lastCall(calls).url), "/api/v1/inbox-placement-tests/test-1");
});

test("401 is unauthorized and 429 is retryable", async () => {
  const { api } = loadScript({
    handler: ({ url }) => {
      if (url.endsWith("/api/v1/user")) return { status: 401, body: { message: "Unauthenticated." } };
      return { status: 429, body: { message: "Too many requests" } };
    },
  });
  const unauthorized = await api.getUser();
  assert.equal(unauthorized.ok, false);
  assert.equal(unauthorized.outcome, "UNAUTHORIZED");
  assert.equal(unauthorized.retryable, false);
  assert.equal(unauthorized.status, 401);
  const limited = await api.listInboxPlacementTests();
  assert.equal(limited.ok, false);
  assert.equal(limited.outcome, "RATE_LIMITED");
  assert.equal(limited.retryable, true);
  assert.equal(limited.status, 429);
});

test("classifiedResult keeps the script envelope over a colliding vendor body", async () => {
  const { api } = loadScript({
    handler: () => ({
      status: 200,
      body: { ok: false, outcome: "nope", data: { filter_phrase: "egipt_x" } },
    }),
  });
  const created = await api.createInboxPlacementTest({ name: "sample" });
  assert.equal(created.ok, true);
  assert.equal(created.outcome, "INBOX_PLACEMENT_TEST_CREATED");
  assert.equal(created.retryable, false);
  assert.equal(created.failure, "");
  assert.equal(created.data.filter_phrase, "egipt_x");
  assert.equal(created.data.ok, undefined);
  assert.equal(created.data.outcome, undefined);
});

test("login and SMTP/IMAP functions never return passwords", async () => {
  const { api, calls } = loadScript({
    handler: ({ url }) => {
      if (url.endsWith("/api/v1/login")) {
        return { status: 200, body: { data: { token: "5|returned-login-token", password: "echo-password" } } };
      }
      return { status: 200, body: { data: { connected: true, imap_password: "echo-imap", smtp_password: "echo-smtp" } } };
    },
  });
  const loggedIn = await api.login({ email: "user@example.com", password: "login-password-secret" });
  assert.equal(loggedIn.ok, true);
  assert.equal(loggedIn.data.token, "5|returned-login-token");
  assert.equal(JSON.stringify(loggedIn).includes("login-password-secret"), false);
  assert.equal(JSON.stringify(loggedIn).includes("echo-password"), false);
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
  assert.equal(created.ok, true);
  assert.equal(JSON.stringify(created).includes("secret-imap"), false);
  assert.equal(JSON.stringify(created).includes("secret-smtp"), false);
  assert.equal(created.data.imap_password, undefined);
  assert.equal(created.data.smtp_password, undefined);
  assert.deepEqual(lastCall(calls).payload.imap_password, "secret-imap");
  const imap = await api.testImapConnection({
    imap_username: "user@example.com",
    imap_password: "secret-imap",
    imap_host: "imap.example.com",
    imap_port: "993",
  });
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
});
