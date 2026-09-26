/**
 * @description List Benchmarks. GET /api/v1/benchmarks.
 * @param {Object} [input]
 * @param {string} [input.source]
 * @param {string} [input.task_type]
 * @param {string} [input.benchmark_type]
 * @param {boolean} [input.include_run_config]
 * @param {string} [input.search_engine]
 * @param {string} [input.search_surface]
 * @param {string} [input.arena]
 * @param {string} [input.category]
 * @param {number} [input.max_results]
 * @returns {Object} OpenRouter response body
 * @throws {Error} OPENROUTER_INVALID_INPUT: <reason>
 * @throws {Error} OPENROUTER_REQUEST_FAILED: <status> <message>
 * @see https://openrouter.ai/docs/api/api-reference/benchmarks/list-benchmarks
 */
async function getBenchmarks(input) {
  return openrouterOperation(input, {
  "method": "GET",
  "path": "/benchmarks",
  "optionalInput": true,
  "query": [
    {
      "name": "source",
      "type": "string"
    },
    {
      "name": "task_type",
      "type": "string"
    },
    {
      "name": "benchmark_type",
      "type": "string"
    },
    {
      "name": "include_run_config",
      "type": "boolean"
    },
    {
      "name": "search_engine",
      "type": "string"
    },
    {
      "name": "search_surface",
      "type": "string"
    },
    {
      "name": "arena",
      "type": "string"
    },
    {
      "name": "category",
      "type": "string"
    },
    {
      "name": "max_results",
      "type": "integer"
    }
  ]
});
}
