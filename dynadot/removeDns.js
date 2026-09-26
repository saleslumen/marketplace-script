/**
 * DELETE /restful/v2/domains/{domain_name}/records
 * @see https://www.dynadot.com/domain/api-document#remove_dns
 * @param {Object} input
 * @param {string|number} input.domain_name
 * @param {Array} [input.dns_main_list]
 * @param {string} [input.dns_main_list.record_type]
 * @param {string} [input.dns_main_list.record_value1]
 * @param {string} [input.dns_main_list.record_value2]
 * @param {Array} [input.dns_sub_list]
 * @param {string} [input.dns_sub_list.sub_host]
 * @param {string} [input.dns_sub_list.record_type]
 * @param {string} [input.dns_sub_list.record_value1]
 * @param {string} [input.dns_sub_list.record_value2]
 * @returns {Promise<Object>}
 */
async function removeDns(input) {
  return dynadotRest({
    method: "DELETE",
    path: "/domains/{domain_name}/records",
    fields: [
      { name: "domain_name", in: "path", required: true, type: "path" },
      { name: "dns_main_list", in: "body", type: "list", item: "object", fields: [
        { name: "record_type", type: "string" },
        { name: "record_value1", type: "string" },
        { name: "record_value2", type: "string" },
      ] },
      { name: "dns_sub_list", in: "body", type: "list", item: "object", fields: [
        { name: "sub_host", type: "string" },
        { name: "record_type", type: "string" },
        { name: "record_value1", type: "string" },
        { name: "record_value2", type: "string" },
      ] },
    ]
  }, input);
}
