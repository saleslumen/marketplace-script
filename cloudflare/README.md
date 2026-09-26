# Cloudflare

Cloudflare Zones and DNS operations for a Saleslumen Marketplace app. Each operation is one Cloudflare API call. `http.js` is shared request code.

The function returns the Cloudflare response body unchanged. JSON calls return the `{ success, errors, messages, result, result_info }` envelope. Export returns the BIND zone file as text.

Input keys are the documented path, query, and body parameter names. Nested query objects are sent with dotted keys, for example `account.id` and `name.exact`.

## Connection

The connection kind is `API_KEY`. The connection key is `cloudflare`. The display label is `Cloudflare`. Authorization mode is `USER`, and the connection is required.

Paste the Cloudflare API token. The app sends it to Cloudflare as a bearer token. The app calls `https://api.cloudflare.com/client/v4`.

## Configuration

This app has no installation settings.

## Surfaces

Covered:

- Zones: list, details, create, edit, delete, and rerun the activation check.
- Zone settings: get all, get one, edit one, and edit multiple. The DNS-relevant setting id is `cname_flattening`. Cloudflare documents that setting as deprecated in favor of `flatten_all_cnames` on DNS settings. These endpoints are the generic zone settings API, so `setting_id` is not limited to `cname_flattening`.
- DNS records: list, details, create, update, overwrite, delete, batch, export, import, scan, trigger scan, review scanned records, and list scanned records. Scan (`POST /dns_records/scan`) is documented as deprecated in favor of trigger and review.
- DNSSEC: details, edit status, delete, and list zone signing keys.
- DNS settings: show and update for a zone, show and update for an account, and internal DNS views.

Omitted from the Zones and DNS products: DNS analytics, secondary DNS, DNS record usage, zone subscriptions, holds, custom nameservers, plans, rate plans, entitlements, environments, observability, and the NEL and transformations setting routes.

## Operations

| Function | Method + path | Required inputs |
| --- | --- | --- |
| `listZones` | GET /zones | none |
| `getZone` | GET /zones/{zone_id} | `zone_id` |
| `createZone` | POST /zones | `account`, `name` |
| `editZone` | PATCH /zones/{zone_id} | `zone_id` |
| `deleteZone` | DELETE /zones/{zone_id} | `zone_id` |
| `rerunZoneActivationCheck` | PUT /zones/{zone_id}/activation_check | `zone_id` |
| `getAllZoneSettings` | GET /zones/{zone_id}/settings | `zone_id` |
| `getZoneSetting` | GET /zones/{zone_id}/settings/{setting_id} | `zone_id`, `setting_id` |
| `editZoneSetting` | PATCH /zones/{zone_id}/settings/{setting_id} | `zone_id`, `setting_id`, `value` or `enabled` |
| `editMultipleZoneSettings` | PATCH /zones/{zone_id}/settings | `zone_id`, `items` |
| `listDnsRecords` | GET /zones/{zone_id}/dns_records | `zone_id` |
| `getDnsRecord` | GET /zones/{zone_id}/dns_records/{dns_record_id} | `zone_id`, `dns_record_id` |
| `createDnsRecord` | POST /zones/{zone_id}/dns_records | `zone_id`, `name`, `ttl`, `type` |
| `updateDnsRecord` | PATCH /zones/{zone_id}/dns_records/{dns_record_id} | `zone_id`, `dns_record_id`, `name`, `ttl`, `type` |
| `overwriteDnsRecord` | PUT /zones/{zone_id}/dns_records/{dns_record_id} | `zone_id`, `dns_record_id`, `name`, `ttl`, `type` |
| `deleteDnsRecord` | DELETE /zones/{zone_id}/dns_records/{dns_record_id} | `zone_id`, `dns_record_id` |
| `batchDnsRecords` | POST /zones/{zone_id}/dns_records/batch | `zone_id` |
| `exportDnsRecords` | GET /zones/{zone_id}/dns_records/export | `zone_id` |
| `importDnsRecords` | POST /zones/{zone_id}/dns_records/import | `zone_id`, `file` |
| `scanDnsRecords` | POST /zones/{zone_id}/dns_records/scan | `zone_id` |
| `triggerDnsRecordScan` | POST /zones/{zone_id}/dns_records/scan/trigger | `zone_id` |
| `reviewScannedDnsRecords` | POST /zones/{zone_id}/dns_records/scan/review | `zone_id` |
| `listScannedDnsRecords` | GET /zones/{zone_id}/dns_records/scan/review | `zone_id` |
| `getDnssec` | GET /zones/{zone_id}/dnssec | `zone_id` |
| `editDnssec` | PATCH /zones/{zone_id}/dnssec | `zone_id` |
| `deleteDnssec` | DELETE /zones/{zone_id}/dnssec | `zone_id` |
| `listDnssecZsks` | GET /zones/{zone_id}/dnssec/zsk | `zone_id` |
| `getZoneDnsSettings` | GET /zones/{zone_id}/dns_settings | `zone_id` |
| `updateZoneDnsSettings` | PATCH /zones/{zone_id}/dns_settings | `zone_id` |
| `getAccountDnsSettings` | GET /accounts/{account_id}/dns_settings | `account_id` |
| `updateAccountDnsSettings` | PATCH /accounts/{account_id}/dns_settings | `account_id` |
| `listInternalDnsViews` | GET /accounts/{account_id}/dns_settings/views | `account_id` |
| `getInternalDnsView` | GET /accounts/{account_id}/dns_settings/views/{view_id} | `account_id`, `view_id` |
| `createInternalDnsView` | POST /accounts/{account_id}/dns_settings/views | `account_id`, `name`, `zones` |
| `updateInternalDnsView` | PATCH /accounts/{account_id}/dns_settings/views/{view_id} | `account_id`, `view_id` |
| `deleteInternalDnsView` | DELETE /accounts/{account_id}/dns_settings/views/{view_id} | `account_id`, `view_id` |

The JSDoc on each function is the parameter and error contract.
