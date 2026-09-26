/**
 * PUT /restful/v2/default_records
 * @see https://www.dynadot.com/domain/api-document#set_default_dns
 * @param {Object} input
 * @param {Array} input.dns_main_list
 * @param {string} [input.dns_main_list.record_type]
 * @param {string} [input.dns_main_list.record_value1]
 * @param {string} [input.dns_main_list.record_value2]
 * @param {Array} [input.dns_sub_list]
 * @param {string} [input.dns_sub_list.sub_host]
 * @param {string} [input.dns_sub_list.record_type]
 * @param {string} [input.dns_sub_list.record_value1]
 * @param {string} [input.dns_sub_list.record_value2]
 * @param {number} [input.ttl]
 * @param {boolean} [input.add_dns_to_current_setting]
 * @returns {Promise<Object>}
 */
async function setDefaultDns(input) {
  return dynadotRest({
    method: "PUT",
    path: "/default_records",
    fields: [
      { name: "dns_main_list", in: "body", required: true, type: "list", item: "object", fields: [
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
      { name: "ttl", in: "body", type: "integer" },
      { name: "add_dns_to_current_setting", in: "body", type: "boolean" },
    ]
  }, input);
}
