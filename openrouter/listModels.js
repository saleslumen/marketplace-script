/**
 * @description List all models and their properties. GET /api/v1/models.
 * @param {Object} [input]
 * @param {number|null} [input.offset]
 * @param {number} [input.limit]
 * @param {string} [input.category]
 * @param {string} [input.supported_parameters]
 * @param {string} [input.output_modalities]
 * @param {string} [input.sort]
 * @param {string} [input.use_rss]
 * @param {string} [input.use_rss_chat_links]
 * @param {string} [input.q]
 * @param {string} [input.input_modalities]
 * @param {number} [input.context]
 * @param {number|null} [input.min_price]
 * @param {number|null} [input.max_price]
 * @param {string} [input.arch]
 * @param {string} [input.model_authors]
 * @param {string} [input.providers]
 * @param {string} [input.distillable]
 * @param {string} [input.zdr]
 * @param {string} [input.region]
 * @param {number|null} [input.min_output_price]
 * @param {number|null} [input.max_output_price]
 * @param {number|null} [input.min_age_days]
 * @param {number|null} [input.max_age_days]
 * @param {number|null} [input.min_intelligence_index]
 * @param {number|null} [input.max_intelligence_index]
 * @param {number|null} [input.min_coding_index]
 * @param {number|null} [input.max_coding_index]
 * @param {number|null} [input.min_agentic_index]
 * @param {number|null} [input.max_agentic_index]
 * @param {number|null} [input.min_tool_success_rate]
 * @param {number|null} [input.max_tool_success_rate]
 * @returns {Object|string} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/models/list-all-models-and-their-properties
 */
async function listModels(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/models",
  "optionalInput": true,
  "query": [
    {
      "name": "offset",
      "type": "integer",
      "nullable": true
    },
    {
      "name": "limit",
      "type": "integer"
    },
    {
      "name": "category",
      "type": "string"
    },
    {
      "name": "supported_parameters",
      "type": "string"
    },
    {
      "name": "output_modalities",
      "type": "string"
    },
    {
      "name": "sort",
      "type": "string"
    },
    {
      "name": "use_rss",
      "type": "string"
    },
    {
      "name": "use_rss_chat_links",
      "type": "string"
    },
    {
      "name": "q",
      "type": "string"
    },
    {
      "name": "input_modalities",
      "type": "string"
    },
    {
      "name": "context",
      "type": "integer"
    },
    {
      "name": "min_price",
      "type": "number",
      "nullable": true
    },
    {
      "name": "max_price",
      "type": "number",
      "nullable": true
    },
    {
      "name": "arch",
      "type": "string"
    },
    {
      "name": "model_authors",
      "type": "string"
    },
    {
      "name": "providers",
      "type": "string"
    },
    {
      "name": "distillable",
      "type": "string"
    },
    {
      "name": "zdr",
      "type": "string"
    },
    {
      "name": "region",
      "type": "string"
    },
    {
      "name": "min_output_price",
      "type": "number",
      "nullable": true
    },
    {
      "name": "max_output_price",
      "type": "number",
      "nullable": true
    },
    {
      "name": "min_age_days",
      "type": "integer",
      "nullable": true
    },
    {
      "name": "max_age_days",
      "type": "integer",
      "nullable": true
    },
    {
      "name": "min_intelligence_index",
      "type": "number",
      "nullable": true
    },
    {
      "name": "max_intelligence_index",
      "type": "number",
      "nullable": true
    },
    {
      "name": "min_coding_index",
      "type": "number",
      "nullable": true
    },
    {
      "name": "max_coding_index",
      "type": "number",
      "nullable": true
    },
    {
      "name": "min_agentic_index",
      "type": "number",
      "nullable": true
    },
    {
      "name": "max_agentic_index",
      "type": "number",
      "nullable": true
    },
    {
      "name": "min_tool_success_rate",
      "type": "number",
      "nullable": true
    },
    {
      "name": "max_tool_success_rate",
      "type": "number",
      "nullable": true
    }
  ]
});
}
