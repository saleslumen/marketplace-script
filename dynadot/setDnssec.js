/**
 * PUT /restful/v2/domains/{domain_name}/dnssec
 * @see https://www.dynadot.com/domain/api-document#set_dnssec
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {number} [input.key_tag]
 * @param {string} [input.digest_type]
 * @param {string} [input.digest]
 * @param {string} input.algorithm
 * @param {string} [input.flags]
 * @param {string} [input.public_key]
 * @returns {Promise<Object>}
 */
async function setDnssec(input) {
  return dynadotRest({
    method: "PUT",
    path: "/domains/{domain_name}/dnssec",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "key_tag", in: "body", type: "integer" },
      { name: "digest_type", in: "body", type: "string" },
      { name: "digest", in: "body", type: "string" },
      { name: "algorithm", in: "body", required: true, type: "string" },
      { name: "flags", in: "body", type: "string" },
      { name: "public_key", in: "body", type: "string" },
    ]
  }, input);
}
