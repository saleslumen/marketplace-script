# Dynadot

Dynadot REST v2 operations for a Saleslumen Marketplace app. Each catalog command is one function. `http.js` signs every request and returns the Dynadot JSON body unchanged.

The operation list comes from the REST v2 catalog [`apiVersion=2.0.0`](https://www.dynadot.com/domain/api-document?getCommandInfoData=1&apiVersion=2.0.0). The reference page is [Dynadot API](https://www.dynadot.com/domain/api-document). Each command is that page anchored by its command name, for example [`search`](https://www.dynadot.com/domain/api-document#search).

## Connection

Both connections are `API_KEY`, authorization mode `USER`, and required. The API key connection key is `dynadot`. The signing secret connection key is `dynadotSecret`.

REST calls send the key as `Authorization: Bearer <key>`. They send `X-Request-ID` and `X-Signature`. The signature is HMAC-SHA256 over `apiKey + newline + fullPathAndQuery + newline + X-Request-ID + newline + requestBody`, using the secret as the key, UTF-8, then Base64. The signed path includes `/restful/v2` and the query string. GET bodies are empty. The key and secret are not query parameters.

`apiBase` selects the host. `sandbox`, or an http(s) URL that contains `sandbox`, uses `https://api-sandbox.dynadot.com`. Every other value uses `https://api.dynadot.com`.

## Operations

| Function | Method | Path | Required inputs |
| --- | --- | --- | --- |
| `searchDomain` | GET | `/restful/v2/domains/{domain_name}/search` | `domain_name` |
| `bulkSearch` | GET | `/restful/v2/domains/bulk_search` | `domain_name_list` |
| `powerSearch` | GET | `/restful/v2/domains/{domain_name}/power_search_new` | `domain_name` |
| `suggestionSearch` | GET | `/restful/v2/domains/{domain_name}/suggestion_search` | `domain_name`, `tlds` |
| `getPendingPushAcceptRequest` | GET | `/restful/v2/domains/pending_accept_pushes` | none |
| `postGraceDelete` | DELETE | `/restful/v2/domains/{domain_name}/post_grace_delete` | `domain_name` |
| `getDnssec` | GET | `/restful/v2/domains/{domain_name}/dnssec` | `domain_name` |
| `listDomains` | GET | `/restful/v2/domains` | none |
| `getDomainInfo` | GET | `/restful/v2/domains/{domain_name}` | `domain_name` |
| `restoreDomain` | POST | `/restful/v2/domains/{domain_name}/restore` | `domain_name` |
| `getDomainAppraisal` | GET | `/restful/v2/domains/{domain_name}/appraisal` | `domain_name` |
| `getTldPrice` | GET | `/restful/v2/domains/get_tld_price` | `currency` |
| `setDomainForwarding` | PUT | `/restful/v2/domains/{domain_name}/domain_forwarding` | `domain_name`, `forward_url` |
| `registerDomain` | POST | `/restful/v2/domains/{domain_name}/register` | `domain_name`, `domain`, `domain.duration`, `domain.privacy` |
| `renewDomain` | POST | `/restful/v2/domains/{domain_name}/renew` | `domain_name`, `duration`, `year` |
| `transferIn` | POST | `/restful/v2/domains/{domain_name}/transfer_in` | `domain_name`, `domain`, `domain.duration`, `domain.privacy` |
| `graceDelete` | DELETE | `/restful/v2/domains/{domain_name}/grace_delete` | `domain_name` |
| `setFolder` | PUT | `/restful/v2/domains/{domain_name}/folders/{folder_name}` | `domain_name`, `folder_name` |
| `setStealthForwarding` | PUT | `/restful/v2/domains/{domain_name}/stealth_forwarding` | `domain_name`, `stealth_url`, `stealth_title` |
| `setEmailForwarding` | PUT | `/restful/v2/domains/{domain_name}/email_forwarding` | `domain_name`, `email_forward_type` |
| `setRenewOption` | PUT | `/restful/v2/domains/{domain_name}/renew_option` | `domain_name`, `renew_option` |
| `setContacts` | PUT | `/restful/v2/domains/{domain_name}/contacts` | `domain_name`, `registrant_contact_id`, `admin_contact_id`, `technical_contact_id`, `billing_contact_id` |
| `getTransferStatus` | GET | `/restful/v2/domains/{domain_name}/transfer_status` | `domain_name`, `transfer_type` |
| `getNameservers` | GET | `/restful/v2/domains/{domain_name}/nameservers` | `domain_name` |
| `setNameservers` | PUT | `/restful/v2/domains/{domain_name}/nameservers` | `domain_name`, `nameserver_list` |
| `setHosting` | PUT | `/restful/v2/domains/{domain_name}/hosts` | `domain_name`, `hosting_type`, `is_model_view` |
| `setParking` | PUT | `/restful/v2/domains/{domain_name}/parking` | `domain_name` |
| `setPrivacy` | PUT | `/restful/v2/domains/{domain_name}/privacy` | `domain_name`, `privacy_level` |
| `setDnssec` | PUT | `/restful/v2/domains/{domain_name}/dnssec` | `domain_name`, `algorithm` |
| `clearDnssec` | DELETE | `/restful/v2/domains/{domain_name}/dnssec` | `domain_name` |
| `clearDomainSetting` | PUT | `/restful/v2/domains/{domain_name}/clear_domain_setting` | `domain_name`, `service_type` |
| `setDomainLockStatus` | PUT | `/restful/v2/domains/{domain_name}/domain_lock` | `domain_name`, `lock` |
| `pushDomain` | POST | `/restful/v2/domains/{domain_name}/push` | `domain_name`, `receiver_push_username` |
| `acceptPush` | POST | `/restful/v2/domains/{domain_name}/accept_push` | `domain_name`, `push_action` |
| `getDns` | GET | `/restful/v2/domains/{domain_name}/records` | `domain_name` |
| `setDns` | POST | `/restful/v2/domains/{domain_name}/records` | `domain_name` |
| `removeDns` | DELETE | `/restful/v2/domains/{domain_name}/records` | `domain_name` |
| `setNote` | PUT | `/restful/v2/domains/{domain_name}/notes` | `domain_name`, `note` |
| `getTransferAuthCode` | GET | `/restful/v2/domains/{domain_name}/transfer_auth_code` | `domain_name` |
| `createCnnicPrivacy` | POST | `/restful/v2/domains/{domain_name}/cnnic_privacy` | `domain_name`, `display_email`, `duration` |
| `listCnnicPrivacy` | GET | `/restful/v2/domains/cnnic_privacy` | none |
| `setCnnicPrivacy` | PUT | `/restful/v2/domains/{domain_name}/cnnic_privacy` | `domain_name`, `display_email` |
| `removeCnnicPrivacy` | DELETE | `/restful/v2/domains/{domain_name}/cnnic_privacy` | `domain_name` |
| `getContact` | GET | `/restful/v2/contacts/{contact_id}` | `contact_id` |
| `listContacts` | GET | `/restful/v2/contacts` | none |
| `createContact` | POST | `/restful/v2/contacts` | `contact`, `contact.name`, `contact.email`, `contact.phone_number`, `contact.phone_cc`, `contact.address1`, `contact.city`, `contact.zip`, `contact.country` |
| `updateContact` | PUT | `/restful/v2/contacts/{contact_id}` | `contact_id`, `contact`, `contact.name`, `contact.email`, `contact.phone_number`, `contact.phone_cc`, `contact.address1`, `contact.city`, `contact.zip`, `contact.country` |
| `deleteContact` | DELETE | `/restful/v2/contacts/{contact_id}` | `contact_id` |
| `createCnAudit` | POST | `/restful/v2/contacts/{contact_id}/create_cn_audit` | `contact_id`, `contact_type`, `individual_id_type`, `individual_url`, `individual_license_id` |
| `getCnAuditStatus` | GET | `/restful/v2/contacts/{contact_id}/get_cn_audit_status` | `contact_id`, `is_gtld` |
| `getContactAeroSetting` | GET | `/restful/v2/contacts/{contact_id}/get_aero_setting` | `contact_id` |
| `setContactAeroSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_aero_setting` | `contact_id`, `contact_extension`, `contact_extension.membership_id`, `contact_extension.membership_auth`, `contact_extension.tld` |
| `getContactCaSetting` | GET | `/restful/v2/contacts/{contact_id}/get_ca_setting` | `contact_id` |
| `setContactCaSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_ca_setting` | `contact_id`, `contact_extension`, `contact_extension.whois_type`, `contact_extension.cira_language`, `contact_extension.accept_cira_agreement`, `contact_extension.tld` |
| `getContactEuSetting` | GET | `/restful/v2/contacts/{contact_id}/get_eu_setting` | `contact_id` |
| `setContactEuSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_eu_setting` | `contact_id`, `contact_extension`, `contact_extension.country_of_citizenship`, `contact_extension.tld` |
| `getContactFrSetting` | GET | `/restful/v2/contacts/{contact_id}/get_fr_setting` | `contact_id` |
| `setContactFrSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_fr_setting` | `contact_id`, `contact_extension`, `contact_extension.contact_category`, `contact_extension.tld` |
| `getContactHkSetting` | GET | `/restful/v2/contacts/{contact_id}/get_hk_setting` | `contact_id` |
| `setContactHkSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_hk_setting` | `contact_id`, `contact_extension`, `contact_extension.contact_category`, `contact_extension.contact_document_number`, `contact_extension.document_origin_country`, `contact_extension.registrant_industry_type`, `contact_extension.is_over_18`, `contact_extension.tld` |
| `getContactIeSetting` | GET | `/restful/v2/contacts/{contact_id}/get_ie_setting` | `contact_id` |
| `setContactIeSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_ie_setting` | `contact_id`, `contact_extension`, `contact_extension.contact_type`, `contact_extension.contact_number`, `contact_extension.tld` |
| `getContactItSetting` | GET | `/restful/v2/contacts/{contact_id}/get_it_setting` | `contact_id` |
| `setContactItSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_it_setting` | `contact_id`, `contact_extension`, `contact_extension.country_of_citizenship`, `contact_extension.codice_doc_number`, `contact_extension.tld` |
| `getContactLtSetting` | GET | `/restful/v2/contacts/{contact_id}/get_lt_setting` | `contact_id` |
| `setContactLtSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_lt_setting` | `contact_id`, `contact_extension`, `contact_extension.organization_code`, `contact_extension.tld` |
| `getContactLvSetting` | GET | `/restful/v2/contacts/{contact_id}/get_lv_setting` | `contact_id` |
| `setContactLvSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_lv_setting` | `contact_id`, `contact_extension`, `contact_extension.registration_number`, `contact_extension.vat_number`, `contact_extension.tld` |
| `getContactMusicSetting` | GET | `/restful/v2/contacts/{contact_id}/get_music_setting` | `contact_id` |
| `setContactMusicSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_music_setting` | `contact_id`, `contact_extension`, `contact_extension.music_nexus_attestation_accept`, `contact_extension.tld` |
| `getContactNoSetting` | GET | `/restful/v2/contacts/{contact_id}/get_no_setting` | `contact_id` |
| `setContactNoSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_no_setting` | `contact_id`, `contact_extension`, `contact_extension.contact_type`, `contact_extension.national_or_organization_number`, `contact_extension.tld` |
| `getContactPtSetting` | GET | `/restful/v2/contacts/{contact_id}/get_pt_setting` | `contact_id` |
| `setContactPtSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_pt_setting` | `contact_id`, `contact_extension`, `contact_extension.vat_or_identity`, `contact_extension.has_registry_whois_privacy`, `contact_extension.tld` |
| `getContactRoSetting` | GET | `/restful/v2/contacts/{contact_id}/get_ro_setting` | `contact_id` |
| `setContactRoSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_ro_setting` | `contact_id`, `contact_extension`, `contact_extension.registrant_type`, `contact_extension.fiscal_code`, `contact_extension.registration_code`, `contact_extension.tld` |
| `getContactUsSetting` | GET | `/restful/v2/contacts/{contact_id}/get_us_setting` | `contact_id` |
| `setContactUsSetting` | PUT | `/restful/v2/contacts/{contact_id}/set_us_setting` | `contact_id`, `contact_extension`, `contact_extension.intended_usage`, `contact_extension.registrant_type`, `contact_extension.tld` |
| `getNameserver` | GET | `/restful/v2/nameservers/{nameserver}` | `nameserver` |
| `listNameservers` | GET | `/restful/v2/nameservers` | none |
| `registerNameserver` | POST | `/restful/v2/nameservers/register` | `nameserver`, `nameserver.server_name`, `nameserver.ip` |
| `addExternalNameserver` | POST | `/restful/v2/nameservers/{nameserver}/add_external` | `nameserver` |
| `setNameserverIp` | PUT | `/restful/v2/nameservers/{nameserver}/set_ip` | `nameserver`, `ip_list` |
| `deleteNameserver` | DELETE | `/restful/v2/nameservers/{nameserver}` | `nameserver` |
| `getOrderStatus` | GET | `/restful/v2/orders/{order_id}` | `order_id` |
| `getOrderHistory` | GET | `/restful/v2/orders` | `search_type` |
| `cancelTransfer` | POST | `/restful/v2/orders/{order_id}/cancel_transfer` | `order_id`, `domain_name` |
| `authorizeTransferAway` | POST | `/restful/v2/orders/{order_id}/authorize_transfer_away` | `order_id`, `domain_name`, `approve` |
| `setTransferAuthCode` | POST | `/restful/v2/orders/{order_id}/update_transfer_auth_code` | `order_id`, `domain_name`, `auth_code` |
| `getAccountInfo` | GET | `/restful/v2/accounts/info` | none |
| `setDefaultNameservers` | PUT | `/restful/v2/accounts/default_nameservers` | `nameserver_list` |
| `setDefaultDomainForwarding` | PUT | `/restful/v2/accounts/default_domain_forwarding` | `forward_url` |
| `setDefaultStealthForwarding` | PUT | `/restful/v2/accounts/default_stealth_forwarding` | `stealth_url` |
| `setDefaultEmailForwarding` | PUT | `/restful/v2/accounts/default_email_forwarding` | `email_forward_type` |
| `setDefaultContacts` | PUT | `/restful/v2/accounts/default_contacts` | `registrant_contact_id`, `admin_contact_id`, `technical_contact_id`, `billing_contact_id` |
| `setDefaultParking` | PUT | `/restful/v2/accounts/default_parking` | none |
| `setDefaultHosting` | PUT | `/restful/v2/accounts/default_hosts` | `hosting_type` |
| `setDefaultRenewOption` | PUT | `/restful/v2/accounts/default_renew_option` | `renew_option` |
| `setDefaultDns` | PUT | `/restful/v2/default_records` | `dns_main_list` |
| `clearDefaultSetting` | PUT | `/restful/v2/accounts/clear_default_setting` | `service_type` |
| `setAccountLockStatus` | PUT | `/restful/v2/accounts/account_lock` | `lock` |
| `folderList` | GET | `/restful/v2/folders` | none |
| `folderCreate` | POST | `/restful/v2/folders` | `folder_name` |
| `folderDelete` | DELETE | `/restful/v2/folders/{folder_name}` | `folder_name` |
| `folderSetName` | PUT | `/restful/v2/folders/{folder_name}/name` | `folder_name`, `new_folder_name` |
| `folderSetDns` | PUT | `/restful/v2/folders/{folder_name}/records` | `folder_name`, `dns_main_list` |
| `folderSetNameserver` | PUT | `/restful/v2/folders/{folder_name}/nameservers` | `folder_name`, `nameserver_list` |
| `folderSetContacts` | PUT | `/restful/v2/folders/{folder_name}/contacts` | `folder_name`, `registrant_contact_id`, `admin_contact_id`, `technical_contact_id`, `billing_contact_id` |
| `folderSetParking` | PUT | `/restful/v2/folders/{folder_name}/parking` | `folder_name` |
| `folderSetDomainForwarding` | PUT | `/restful/v2/folders/{folder_name}/domain_forwarding` | `folder_name`, `forward_url` |
| `folderSetStealthForwarding` | PUT | `/restful/v2/folders/{folder_name}/stealth_forwarding` | `folder_name`, `stealth_url` |
| `folderSetEmailForwarding` | PUT | `/restful/v2/folders/{folder_name}/email_forwarding` | `folder_name`, `email_forward_type` |
| `folderSetHosting` | PUT | `/restful/v2/folders/{folder_name}/hosts` | `folder_name`, `hosting_type` |
| `folderSetRenewOption` | PUT | `/restful/v2/folders/{folder_name}/renew_option` | `folder_name`, `renew_option` |
| `folderClearSetting` | PUT | `/restful/v2/folders/{folder_name}/clear_setting` | `folder_name`, `service_type` |
| `setForSale` | PUT | `/restful/v2/aftermarkets/domains/{domain_name}/for_sales` | `domain_name`, `for_sale_type`, `listing_type`, `description` |
| `setOtherPlatformConfirmAction` | POST | `/restful/v2/aftermarket/domains/{domain_name}/opt_in_fast_transfer` | `domain_name`, `action`, `platform_type` |
| `getListingItem` | GET | `/restful/v2/aftermarket/listings/{domain_name}` | `domain_name`, `currency` |
| `buyItNow` | POST | `/restful/v2/aftermarket/listings/{domain_name}/buy_it_now` | `domain_name` |
| `buyExpiredCloseoutDomain` | POST | `/restful/v2/aftermarket/expired_closeouts/{domain_name}/purchase` | `domain_name` |
| `addBackorderRequest` | POST | `/restful/v2/aftermarket/backorders/requests/{domain_name}` | `domain_name` |
| `deleteBackorderRequest` | DELETE | `/restful/v2/aftermarket/backorders/requests/{domain_name}` | `domain_name` |
| `getClosedAuctions` | GET | `/restful/v2/aftermarket/auctions/closed` | `currency`, `start_time`, `end_time` |
| `getAuctionDetails` | GET | `/restful/v2/aftermarket/auctions/{domain_name}` | `domain_name`, `currency` |
| `getWhoisStats` | GET | `/restful/v2/aftermarket/whois_stats` | `domain_name`, `date_type` |
| `backorderRequestList` | GET | `/restful/v2/aftermarket/backorders/requests` | `start_time`, `end_time` |
| `placeAuctionBid` | POST | `/restful/v2/aftermarket/auctions/bids/{domain_name}` | `domain_name`, `currency`, `bid_amount` |
| `getAuctionBids` | GET | `/restful/v2/aftermarket/auctions/bids` | `currency`, `page_size`, `page` |
| `setAuctionInstallmentPlan` | POST | `/restful/v2/aftermarket/auctions/{domain_name}/installment_plan` | `domain_name`, `installment_status` |
| `getAuctionInstallmentPlan` | GET | `/restful/v2/aftermarket/auctions/{domain_name}/installment_plan` | `domain_name` |
| `getOpenAuctions` | GET | `/restful/v2/aftermarket/auctions/open` | `currency`, `page_size`, `page` |
| `addUserAuction` | POST | `/restful/v2/aftermarket/auctions/{domain_name}` | `domain_name`, `starting_price` |
| `closeAuction` | POST | `/restful/v2/aftermarket/auctions/{auction_id}/close` | `auction_id` |
| `createExpressPayLink` | POST | `/restful/v2/aftermarket/pay_links` | `currency`, `domain_name`, `price`, `installment_enabled`, `link_expiration` |
| `getExpressPayLink` | GET | `/restful/v2/aftermarket/pay_links/{domain_name}` | `domain_name` |
| `listExpressPayLink` | GET | `/restful/v2/aftermarket/pay_links` | none |
| `deleteExpressPayLink` | DELETE | `/restful/v2/aftermarket/pay_links/{domain_name}` | `domain_name` |
| `getListings` | GET | `/restful/v2/aftermarket/listings` | `currency`, `page_size`, `page` |
| `getExpiredCloseoutDomains` | GET | `/restful/v2/aftermarket/get_expired_closeout_domains` | none |
| `getAfternicDomain` | GET | `/restful/v2/aftermarket/get_afternic_domain` | `domain_name`, `max_result` |
| `getSedoDomain` | GET | `/restful/v2/aftermarket/get_sedo_domain` | `domain_name`, `max_result` |
| `listingOnAfternic` | POST | `/restful/v2/aftermarket/listing_on_afternic` | `domain_name`, `usd_price` |
| `listingOnSedo` | POST | `/restful/v2/aftermarket/listing_on_sedo` | `domain_name`, `price`, `currency`, `accept_sedo_agreement` |
| `buyAfternicDomain` | POST | `/restful/v2/aftermarket/buy_afternic_domain` | `domain_name` |
| `buySedoDomain` | POST | `/restful/v2/aftermarket/buy_sedo_domain` | `domain_name` |
| `otherRegistrarDomainVerification` | GET | `/restful/v2/aftermarket/other_registrar/{domain_name}/verification` | `domain_name` |
| `verifyOtherRegistrarDomain` | POST | `/restful/v2/aftermarket/other_registrar/verify` | `domain_name_list` |
| `otherRegistrarDomainList` | GET | `/restful/v2/aftermarket/other_registrar/domains` | none |
| `addOtherRegistrarDomain` | POST | `/restful/v2/aftermarket/other_registrar/domains` | `domain_name_list` |
| `listingOtherRegistrarDomain` | POST | `/restful/v2/aftermarket/{domain_name}/listing_other_registrar_domain` | `domain_name`, `for_sale_type` |
| `backorderList` | GET | `/restful/v2/aftermarket/backorders` | none |
| `getSiteBuilder` | GET | `/restful/v2/sitebuilders/{domain_name}` | `domain_name` |
| `listSiteBuilder` | GET | `/restful/v2/sitebuilders` | none |
| `createSiteBuilder` | POST | `/restful/v2/sitebuilders/{domain_name}` | `domain_name` |
| `upgradeSiteBuilder` | POST | `/restful/v2/sitebuilders/{domain_name}/upgrade` | `domain_name` |
| `deleteEmailHosting` | DELETE | `/restful/v2/email_hosting/{domain_name}` | `domain_name` |
| `listEmailHosting` | GET | `/restful/v2/email_hosting` | none |
| `createEmailHosting` | POST | `/restful/v2/email_hosting` | `domain_name`, `email_name`, `username`, `password` |
| `upgradeEmailHosting` | POST | `/restful/v2/email_hosting/{domain_name}/upgrade` | `domain_name` |
| `listCoupons` | GET | `/restful/v2/orders/coupons` | `coupon_type` |

## Coverage

Account balance is `account_info.account_balance` on `getAccountInfo` (`GET /restful/v2/accounts/info`). REST v2 has no separate balance command.

The same catalog lists webhook event payloads. They are inbound notifications and have no HTTP method or path, so they are not operations: `order_completed`, `domain_transfer_away`, `domain_expiring`, `account_balance_reminder`, `whois_verification_required`, `whois_verification_notification`, `order_payment_required`, `domain_status_changed`, `domain_suspension_status_changed`, `maintenance_notice`, `contact_kyc_status_changed`.
