/**
 * GET /restful/v2/aftermarket/backorders/requests
 * @see https://www.dynadot.com/domain/api-document#backorder_request_list
 * @param {Object} input
 * @param {number} input.start_time
 * @param {number} input.end_time
 * @returns {Promise<Object>}
 */
async function backorderRequestList(input) {
  return dynadotRest({
    method: "GET",
    path: "/aftermarket/backorders/requests",
    fields: [
      { name: "start_time", in: "query", required: true, type: "integer" },
      { name: "end_time", in: "query", required: true, type: "integer" },
    ]
  }, input);
}
