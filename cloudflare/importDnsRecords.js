/**
 * @description Import DNS records from a BIND config. POST /zones/{zone_id}/dns_records/import. file is the BIND config. proxied is the optional form field.
 * @param {Object} input
 * @param {string} input.zone_id
 * @param {string} input.file
 * @param {string} [input.proxied]
 * @returns {Object} Cloudflare response body
 * @throws {Error} CLOUDFLARE_INVALID_INPUT: <reason> when a required input is missing
 * @throws {Error} CLOUDFLARE_REQUEST_FAILED: <status> <first error message> when Cloudflare returns a non-2xx status
 */
async function importDnsRecords(input) {
  const req = inputObject(input);
  const zoneId = requiredString(req, "zone_id");
  if (typeof req.file !== "string" || !req.file.trim()) throw new Error("CLOUDFLARE_INVALID_INPUT: file is required");
  const fields = { file: req.file };
  if (present(req, "proxied")) fields.proxied = req.proxied;
  return cloudflareRequest(`/zones/${encodeURIComponent(zoneId)}/dns_records/import`, "POST", { multipart: multipartBody(fields) });
}
