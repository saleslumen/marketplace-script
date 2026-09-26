import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const CASES = [
  {
    "fn": "chatCompletions",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/chat/completions",
    "input": {
      "messages": [
        {
          "role": "user",
          "content": "hi"
        }
      ]
    },
    "encoding": "json",
    "body": {
      "messages": [
        {
          "role": "user",
          "content": "hi"
        }
      ]
    }
  },
  {
    "fn": "createMessages",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/messages",
    "input": {
      "messages": [
        {
          "role": "user",
          "content": "hi"
        }
      ],
      "model": "openai/gpt-4"
    },
    "encoding": "json",
    "body": {
      "messages": [
        {
          "role": "user",
          "content": "hi"
        }
      ],
      "model": "openai/gpt-4"
    }
  },
  {
    "fn": "createResponses",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/responses",
    "input": null,
    "encoding": "json",
    "body": {}
  },
  {
    "fn": "createEmbeddings",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/embeddings",
    "input": {
      "input": "hello",
      "model": "openai/gpt-4"
    },
    "encoding": "json",
    "body": {
      "input": "hello",
      "model": "openai/gpt-4"
    }
  },
  {
    "fn": "createImages",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/images",
    "input": {
      "model": "openai/gpt-4",
      "prompt": "a red cube"
    },
    "encoding": "json",
    "body": {
      "model": "openai/gpt-4",
      "prompt": "a red cube"
    }
  },
  {
    "fn": "createAudioSpeech",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/audio/speech",
    "input": {
      "input": "hello",
      "model": "openai/gpt-4"
    },
    "encoding": "json",
    "body": {
      "input": "hello",
      "model": "openai/gpt-4"
    }
  },
  {
    "fn": "createAudioTranscriptions",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/audio/transcriptions",
    "input": {
      "input_audio": {
        "data": "AAAA",
        "format": "wav"
      },
      "model": "openai/gpt-4"
    },
    "encoding": "json",
    "body": {
      "input_audio": {
        "data": "AAAA",
        "format": "wav"
      },
      "model": "openai/gpt-4"
    }
  },
  {
    "fn": "createVideos",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/videos",
    "input": {
      "model": "openai/gpt-4"
    },
    "encoding": "json",
    "body": {
      "model": "openai/gpt-4"
    }
  },
  {
    "fn": "getVideos",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/videos/job_1",
    "input": {
      "jobId": "job_1"
    },
    "encoding": "none"
  },
  {
    "fn": "listVideosContent",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/videos/job_1/content",
    "input": {
      "jobId": "job_1"
    },
    "encoding": "none"
  },
  {
    "fn": "listVideosModels",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/videos/models",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "createRerank",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/rerank",
    "input": {
      "documents": [
        "alpha"
      ],
      "model": "openai/gpt-4",
      "query": "capital of france"
    },
    "encoding": "json",
    "body": {
      "documents": [
        "alpha"
      ],
      "model": "openai/gpt-4",
      "query": "capital of france"
    }
  },
  {
    "fn": "submitDecisionsRequest",
    "method": "POST",
    "url": "https://openrouter.ai/api/alpha/decisions",
    "input": {
      "model": "openai/gpt-4",
      "questions": {
        "answer": {
          "type": "choice"
        }
      },
      "state": "ready"
    },
    "encoding": "json",
    "body": {
      "model": "openai/gpt-4",
      "questions": {
        "answer": {
          "type": "choice"
        }
      },
      "state": "ready"
    }
  },
  {
    "fn": "submitSystemOneRequest",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/systemone",
    "input": {
      "model": "openai/gpt-4",
      "questions": {
        "answer": {
          "type": "choice"
        }
      },
      "state": "ready"
    },
    "encoding": "json",
    "body": {
      "model": "openai/gpt-4",
      "questions": {
        "answer": {
          "type": "choice"
        }
      },
      "state": "ready"
    }
  },
  {
    "fn": "listModels",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/models",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "listModelsUser",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/models/user",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "getModel",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/model/openai/gpt-4",
    "input": {
      "author": "openai",
      "slug": "gpt-4"
    },
    "encoding": "none"
  },
  {
    "fn": "listModelsCount",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/models/count",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "listEndpoints",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/models/openai/gpt-4/endpoints",
    "input": {
      "author": "openai",
      "slug": "gpt-4"
    },
    "encoding": "none"
  },
  {
    "fn": "listEmbeddingsModels",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/embeddings/models",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "listImageModels",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/images/models",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "listImageModelEndpoints",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/images/models/openai/gpt-4/endpoints",
    "input": {
      "author": "openai",
      "slug": "gpt-4"
    },
    "encoding": "none"
  },
  {
    "fn": "listEndpointsZdr",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/endpoints/zdr",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "getGeneration",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/generation?id=gen_1",
    "input": {
      "id": "gen_1"
    },
    "encoding": "none"
  },
  {
    "fn": "listGenerationContent",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/generation/content?id=gen_1",
    "input": {
      "id": "gen_1"
    },
    "encoding": "none"
  },
  {
    "fn": "getCredits",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/credits",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "getCurrentKey",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/key",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "listProviders",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/providers",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "copyVaultSecretsToIntern",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/vault/interns/intern_1/secrets/copy",
    "input": {
      "internId": "intern_1",
      "names": [
        "example.com"
      ]
    },
    "encoding": "json",
    "body": {
      "names": [
        "example.com"
      ]
    }
  },
  {
    "fn": "createAuthKeysCode",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/auth/keys/code",
    "input": {
      "callback_url": "https://example.com/callback"
    },
    "encoding": "json",
    "body": {
      "callback_url": "https://example.com/callback"
    }
  },
  {
    "fn": "createBatches",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/batches",
    "input": {
      "endpoint": "/v1/chat/completions",
      "model": "openai/gpt-4",
      "requests": [
        {}
      ]
    },
    "encoding": "json",
    "body": {
      "endpoint": "/v1/chat/completions",
      "model": "openai/gpt-4",
      "requests": [
        {}
      ]
    }
  },
  {
    "fn": "createIntern",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/interns",
    "input": {
      "name": "secret_name"
    },
    "encoding": "json",
    "body": {
      "name": "secret_name"
    }
  },
  {
    "fn": "createOauthToken",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/oauth/token",
    "input": {
      "federation_policy_id": "policy_1",
      "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
      "subject_token": "jwt",
      "subject_token_type": "urn:ietf:params:oauth:token-type:jwt"
    },
    "encoding": "form",
    "form": "federation_policy_id=policy_1&grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Atoken-exchange&subject_token=jwt&subject_token_type=urn%3Aietf%3Aparams%3Aoauth%3Atoken-type%3Ajwt"
  },
  {
    "fn": "createPresetsChatCompletions",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/presets/gpt-4/chat/completions",
    "input": {
      "slug": "gpt-4",
      "messages": [
        {
          "role": "user",
          "content": "hi"
        }
      ]
    },
    "encoding": "json",
    "body": {
      "messages": [
        {
          "role": "user",
          "content": "hi"
        }
      ]
    }
  },
  {
    "fn": "createPresetsMessages",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/presets/gpt-4/messages",
    "input": {
      "slug": "gpt-4",
      "messages": [
        {
          "role": "user",
          "content": "hi"
        }
      ],
      "model": "openai/gpt-4"
    },
    "encoding": "json",
    "body": {
      "messages": [
        {
          "role": "user",
          "content": "hi"
        }
      ],
      "model": "openai/gpt-4"
    }
  },
  {
    "fn": "createPresetsResponses",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/presets/gpt-4/responses",
    "input": {
      "slug": "gpt-4"
    },
    "encoding": "json",
    "body": {}
  },
  {
    "fn": "deleteBatch",
    "method": "DELETE",
    "url": "https://openrouter.ai/api/v1/batches/gen_1",
    "input": {
      "id": "gen_1"
    },
    "encoding": "none"
  },
  {
    "fn": "deleteFile",
    "method": "DELETE",
    "url": "https://openrouter.ai/api/v1/files/file_1",
    "input": {
      "file_id": "file_1"
    },
    "encoding": "none"
  },
  {
    "fn": "deleteIntern",
    "method": "DELETE",
    "url": "https://openrouter.ai/api/v1/interns/intern_1",
    "input": {
      "internId": "intern_1"
    },
    "encoding": "json",
    "body": {}
  },
  {
    "fn": "deleteInternVaultSecret",
    "method": "DELETE",
    "url": "https://openrouter.ai/api/v1/vault/interns/intern_1/secrets/secret_name",
    "input": {
      "internId": "intern_1",
      "name": "secret_name"
    },
    "encoding": "none"
  },
  {
    "fn": "deleteVaultSecret",
    "method": "DELETE",
    "url": "https://openrouter.ai/api/v1/vault/secrets/secret_name",
    "input": {
      "name": "secret_name"
    },
    "encoding": "none"
  },
  {
    "fn": "downloadContainerFileContent",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/containers/container_1/files/file_1/content",
    "input": {
      "container_id": "container_1",
      "file_id": "file_1"
    },
    "encoding": "none"
  },
  {
    "fn": "downloadFileContent",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/files/file_1/content",
    "input": {
      "file_id": "file_1"
    },
    "encoding": "none"
  },
  {
    "fn": "exchangeAuthCodeForAPIKey",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/auth/keys",
    "input": {
      "code": "auth-code"
    },
    "encoding": "json",
    "body": {
      "code": "auth-code"
    }
  },
  {
    "fn": "getAppRankings",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/datasets/app-rankings",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "getBatches",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/batches/gen_1",
    "input": {
      "id": "gen_1"
    },
    "encoding": "none"
  },
  {
    "fn": "getBenchmarks",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/benchmarks",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "getContainerFile",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/containers/container_1/files/file_1",
    "input": {
      "container_id": "container_1",
      "file_id": "file_1"
    },
    "encoding": "none"
  },
  {
    "fn": "getFileMetadata",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/files/file_1",
    "input": {
      "file_id": "file_1"
    },
    "encoding": "none"
  },
  {
    "fn": "getIntern",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/interns/intern_1",
    "input": {
      "internId": "intern_1"
    },
    "encoding": "none"
  },
  {
    "fn": "getInternDaemonAccess",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/interns/intern_1/daemon-access",
    "input": {
      "internId": "intern_1"
    },
    "encoding": "none"
  },
  {
    "fn": "getPreset",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/presets/gpt-4",
    "input": {
      "slug": "gpt-4"
    },
    "encoding": "none"
  },
  {
    "fn": "getPresetVersion",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/presets/gpt-4/versions/1",
    "input": {
      "slug": "gpt-4",
      "version": "1"
    },
    "encoding": "none"
  },
  {
    "fn": "getRankingsDaily",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/datasets/rankings-daily",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "getSessionCost",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/datasets/session-cost",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "getTaskClassifications",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/classifications/task",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "invokeIntern",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/interns/intern_1/invoke",
    "input": {
      "internId": "intern_1",
      "input": "hello"
    },
    "encoding": "json",
    "body": {
      "input": "hello"
    }
  },
  {
    "fn": "listBatches",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/batches",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "listContainerFiles",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/containers/container_1/files",
    "input": {
      "container_id": "container_1"
    },
    "encoding": "none"
  },
  {
    "fn": "listFiles",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/files",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "listInternVaultSecrets",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/vault/interns/intern_1/secrets",
    "input": {
      "internId": "intern_1"
    },
    "encoding": "none"
  },
  {
    "fn": "listInterns",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/interns",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "listOauthJwks",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/oauth/jwks",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "listPresetVersions",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/presets/gpt-4/versions",
    "input": {
      "slug": "gpt-4"
    },
    "encoding": "none"
  },
  {
    "fn": "listPresets",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/presets",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "listVaultSecrets",
    "method": "GET",
    "url": "https://openrouter.ai/api/v1/vault/secrets",
    "input": null,
    "encoding": "none"
  },
  {
    "fn": "promoteContainerFile",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/containers/container_1/files/file_1/promote",
    "input": {
      "container_id": "container_1",
      "file_id": "file_1"
    },
    "encoding": "none"
  },
  {
    "fn": "provisionIntern",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/interns/intern_1/provision",
    "input": {
      "internId": "intern_1"
    },
    "encoding": "none"
  },
  {
    "fn": "storeInternVaultSecret",
    "method": "PUT",
    "url": "https://openrouter.ai/api/v1/vault/interns/intern_1/secrets/secret_name",
    "input": {
      "internId": "intern_1",
      "name": "secret_name",
      "hosts": [
        "example.com"
      ],
      "value": "secret-value"
    },
    "encoding": "json",
    "body": {
      "hosts": [
        "example.com"
      ],
      "value": "secret-value"
    }
  },
  {
    "fn": "storeVaultSecret",
    "method": "PUT",
    "url": "https://openrouter.ai/api/v1/vault/secrets/secret_name",
    "input": {
      "name": "secret_name",
      "hosts": [
        "example.com"
      ],
      "value": "secret-value"
    },
    "encoding": "json",
    "body": {
      "hosts": [
        "example.com"
      ],
      "value": "secret-value"
    }
  },
  {
    "fn": "suspendIntern",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/interns/intern_1/suspend",
    "input": {
      "internId": "intern_1"
    },
    "encoding": "none"
  },
  {
    "fn": "updateIntern",
    "method": "PATCH",
    "url": "https://openrouter.ai/api/v1/interns/intern_1",
    "input": {
      "internId": "intern_1"
    },
    "encoding": "json",
    "body": {}
  },
  {
    "fn": "uploadFile",
    "method": "POST",
    "url": "https://openrouter.ai/api/v1/files",
    "input": {
      "file": "hello"
    },
    "encoding": "multipart",
    "fileText": "hello"
  }
];
const loadScript = (handler) => {
  const calls = [];
  const context = createContext({
    ConnectionApp: {
      getApiKey: async (key) => {
        if (key !== "openrouter") throw new Error(`AUTH_NOT_CONNECTED: ${key}`);
        return "test-openrouter-key";
      },
    },
    UrlFetchApp: {
      fetch: async (url, options = {}) => {
        calls.push({
          url,
          method: String(options.method || "GET").toUpperCase(),
          payload: options.payload,
          contentType: options.headers && options.headers["Content-Type"],
          headers: options.headers || {},
          muteHttpExceptions: options.muteHttpExceptions === true,
        });
        const result = await handler({ url, method: String(options.method || "GET").toUpperCase(), calls });
        const body = result.body === undefined ? {} : result.body;
        return {
          getResponseCode: () => Number(result.status) || 200,
          getContentText: () => (typeof body === "string" ? body : JSON.stringify(body)),
          getHeaders: () => result.headers || { "Content-Type": "application/json" },
        };
      },
    },
  });
  runInContext(readFileSync(join(root, "http.js"), "utf8"), context);
  for (const fileName of readdirSync(root).filter((name) => name.endsWith(".js") && name !== "http.js").sort()) {
    runInContext(readFileSync(join(root, fileName), "utf8"), context);
  }
  return { api: context, calls };
};

test("source maps one documented operation per file", () => {
  const files = readdirSync(root).filter((name) => name.endsWith(".js") && name !== "http.js").sort();
  const sources = files.map((name) => readFileSync(join(root, name), "utf8"));
  const source = sources.join("\n");
  const http = readFileSync(join(root, "http.js"), "utf8");
  assert.equal(files.includes("decisions.js"), false);
  assert.equal(source.includes("qwen"), false);
  assert.equal(source.includes("typesafe"), false);
  assert.equal(source.includes("sessionId"), false);
  assert.equal(source.toLowerCase().includes("jev"), false);
  assert.equal(http.includes("\n\n"), false);
  assert.equal(sources.some((file) => file.includes("\n\n")), false);
  const script = loadScript(() => ({ body: {} }));
  assert.equal(script.api.decisions, undefined);
  assert.equal(typeof script.api.chatCompletions, "function");
  assert.equal(typeof script.api.listModels, "function");
  assert.equal(typeof script.api.submitDecisionsRequest, "function");
  assert.equal(files.length, CASES.length);
});

test("operations send the documented method, path, and required fields", async () => {
  const script = loadScript(() => ({ body: { echo: true } }));
  for (const item of CASES) {
    const before = script.calls.length;
    const result = item.input === null ? await script.api[item.fn]() : await script.api[item.fn](item.input);
    assert.equal(JSON.stringify(result), JSON.stringify({ echo: true }), item.fn);
    const call = script.calls[script.calls.length - 1];
    assert.equal(script.calls.length, before + 1, item.fn);
    assert.equal(call.method, item.method, item.fn);
    assert.equal(call.url, item.url, item.fn);
    assert.equal(call.muteHttpExceptions, true, item.fn);
    assert.equal(call.headers.Authorization, "Bearer test-openrouter-key", item.fn);
    assert.equal(call.headers.Accept, item.fn === "createAudioSpeech" || item.fn === "downloadContainerFileContent" || item.fn === "downloadFileContent" || item.fn === "listVideosContent" ? "*/*" : "application/json", item.fn);
    if (item.encoding === "json") {
      assert.equal(call.contentType, "application/json", item.fn);
      assert.deepEqual(JSON.parse(call.payload), item.body, item.fn);
    } else if (item.encoding === "form") {
      assert.equal(call.contentType, "application/x-www-form-urlencoded", item.fn);
      assert.equal(call.payload, item.form, item.fn);
    } else if (item.encoding === "multipart") {
      assert.equal(call.contentType, "multipart/form-data; boundary=openrouter-form-boundary", item.fn);
      assert.equal(call.payload.includes('name="file"'), true, item.fn);
      assert.equal(call.payload.includes(item.fileText), true, item.fn);
    } else {
      assert.equal(call.payload, undefined, item.fn);
      assert.equal(call.contentType, undefined, item.fn);
    }
  }
});

test("chatCompletions passes documented fields through and returns the response body", async () => {
  const script = loadScript(() => ({ body: { id: "gen_1", choices: [{ message: { content: "ok" } }] } }));
  const result = await script.api.chatCompletions({
    messages: [{ role: "user", content: "hi" }],
    model: "openai/gpt-4",
    temperature: 0,
    response_format: { type: "json_object" },
    tools: [{ type: "function", function: { name: "lookup" } }],
    stream: false,
    reasoning: { effort: "low" },
    "X-OpenRouter-Metadata": "enabled",
    json: true,
    sessionId: "abc",
  });
  assert.equal(JSON.stringify(result), JSON.stringify({ id: "gen_1", choices: [{ message: { content: "ok" } }] }));
  assert.equal(script.calls[0].method, "POST");
  assert.equal(script.calls[0].url, "https://openrouter.ai/api/v1/chat/completions");
  assert.equal(script.calls[0].headers.Authorization, "Bearer test-openrouter-key");
  assert.equal(script.calls[0].headers["X-OpenRouter-Metadata"], "enabled");
  assert.deepEqual(JSON.parse(script.calls[0].payload), {
    messages: [{ role: "user", content: "hi" }],
    model: "openai/gpt-4",
    temperature: 0,
    response_format: { type: "json_object" },
    tools: [{ type: "function", function: { name: "lookup" } }],
    stream: false,
    reasoning: { effort: "low" },
    json: true,
    sessionId: "abc",
  });
});

test("unknown body fields are forwarded and path and query fields stay out of the body", async () => {
  const script = loadScript(() => ({ body: { ok: true } }));
  await script.api.chatCompletions({
    messages: [{ role: "user", content: "hi" }],
    vendor_extension: { keep: true },
  });
  assert.deepEqual(JSON.parse(script.calls[0].payload), {
    messages: [{ role: "user", content: "hi" }],
    vendor_extension: { keep: true },
  });
  await script.api.createPresetsChatCompletions({
    slug: "gpt-4",
    messages: [{ role: "user", content: "hi" }],
    vendor_extension: 1,
  });
  assert.equal(script.calls[1].url, "https://openrouter.ai/api/v1/presets/gpt-4/chat/completions");
  assert.deepEqual(JSON.parse(script.calls[1].payload), {
    messages: [{ role: "user", content: "hi" }],
    vendor_extension: 1,
  });
  await script.api.uploadFile({
    file: "hello",
    workspace_id: "ws_1",
    provider: "openai",
    vendor_extension: "kept",
  });
  assert.equal(script.calls[2].url, "https://openrouter.ai/api/v1/files?workspace_id=ws_1&provider=openai");
  assert.equal(script.calls[2].payload.includes('name="vendor_extension"'), true);
  assert.equal(script.calls[2].payload.includes("kept"), true);
  assert.equal(script.calls[2].payload.includes("workspace_id"), false);
  assert.equal(script.calls[2].payload.includes('name="provider"'), false);
  await script.api.createOauthToken({
    federation_policy_id: "policy_1",
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token: "jwt",
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    vendor_extension: "kept",
  });
  assert.equal(script.calls[3].payload.includes("vendor_extension=kept"), true);
});

test("stream true is rejected before the request", async () => {
  const script = loadScript(() => ({ body: { id: "nope" } }));
  await assert.rejects(() => script.api.chatCompletions({ stream: true }), /OPENROUTER_INVALID_INPUT: stream is not supported/);
  await assert.rejects(() => script.api.chatCompletions({ messages: [{ role: "user", content: "hi" }], stream: "true" }), /OPENROUTER_INVALID_INPUT: stream must be a boolean/);
  await assert.rejects(() => script.api.createImages({ stream: true }), /OPENROUTER_INVALID_INPUT: stream is not supported/);
  await assert.rejects(() => script.api.createResponses({ stream: true }), /OPENROUTER_INVALID_INPUT: stream is not supported/);
  await assert.rejects(() => script.api.createMessages({ stream: true }), /OPENROUTER_INVALID_INPUT: stream is not supported/);
  await assert.rejects(() => script.api.createPresetsChatCompletions({ stream: true }), /OPENROUTER_INVALID_INPUT: stream is not supported/);
  assert.equal(script.calls.length, 0);
});

test("validation reports OPENROUTER_INVALID_INPUT and does not call OpenRouter", async () => {
  const script = loadScript(() => ({ body: {} }));
  await assert.rejects(() => script.api.chatCompletions(), /OPENROUTER_INVALID_INPUT: input must be an object/);
  await assert.rejects(() => script.api.chatCompletions([]), /OPENROUTER_INVALID_INPUT: input must be an object/);
  await assert.rejects(() => script.api.chatCompletions({}), /OPENROUTER_INVALID_INPUT: messages is required/);
  await assert.rejects(() => script.api.chatCompletions({ messages: "hi" }), /OPENROUTER_INVALID_INPUT: messages must be an array/);
  await assert.rejects(() => script.api.listModels({ limit: 1.5 }), /OPENROUTER_INVALID_INPUT: limit must be an integer/);
  await assert.rejects(() => script.api.getGeneration({}), /OPENROUTER_INVALID_INPUT: id is required/);
  await assert.rejects(() => script.api.createAudioTranscriptions({ model: "openai/whisper" }), /OPENROUTER_INVALID_INPUT: input_audio or file is required/);
  await assert.rejects(() => script.api.createAudioTranscriptions({ model: "openai/whisper", file: "a", input_audio: { data: "b" } }), /OPENROUTER_INVALID_INPUT: file and input_audio cannot both be set/);
  assert.equal(script.calls.length, 0);
});

test("listModels returns the OpenRouter body and encodes documented query fields", async () => {
  const script = loadScript(() => ({ body: { data: [{ id: "openai/gpt-4" }] } }));
  const listed = await script.api.listModels();
  assert.equal(JSON.stringify(listed), JSON.stringify({ data: [{ id: "openai/gpt-4" }] }));
  assert.equal(listed.raw, undefined);
  assert.equal(script.calls[0].url, "https://openrouter.ai/api/v1/models");
  assert.equal(script.calls[0].payload, undefined);
  await script.api.listModels({ q: "gpt 4", limit: 1, offset: 2, page: 9 });
  assert.equal(script.calls[1].url, "https://openrouter.ai/api/v1/models?offset=2&limit=1&q=gpt%204");
  await script.api.listModelsUser({ output_modalities: "text,image" });
  assert.equal(script.calls[2].url, "https://openrouter.ai/api/v1/models/user?output_modalities=text%2Cimage");
  await script.api.listEndpoints({ author: "openai", slug: "gpt-4:free" });
  assert.equal(script.calls[3].url, "https://openrouter.ai/api/v1/models/openai/gpt-4%3Afree/endpoints");
  await script.api.getModel({ author: "openai", slug: "gpt-4:free" });
  assert.equal(script.calls[4].url, "https://openrouter.ai/api/v1/model/openai/gpt-4%3Afree");
});

test("generation, credits, key, and providers use the documented paths", async () => {
  const script = loadScript(() => ({ body: { data: { total_credits: 10 } } }));
  await script.api.getGeneration({ id: "gen_1" });
  assert.equal(script.calls[0].url, "https://openrouter.ai/api/v1/generation?id=gen_1");
  await script.api.getCredits();
  assert.equal(script.calls[1].method, "GET");
  assert.equal(script.calls[1].url, "https://openrouter.ai/api/v1/credits");
  await script.api.getCurrentKey();
  assert.equal(script.calls[2].url, "https://openrouter.ai/api/v1/key");
  const providers = await script.api.listProviders();
  assert.equal(script.calls[3].url, "https://openrouter.ai/api/v1/providers");
  assert.equal(JSON.stringify(providers), JSON.stringify({ data: { total_credits: 10 } }));
  await script.api.listBatches({ status: ["completed", "failed"], limit: 2 });
  assert.equal(script.calls[4].url, "https://openrouter.ai/api/v1/batches?limit=2&status=completed&status=failed");
});

test("non-2xx errors use status and message and omit the API key", async () => {
  const failed = loadScript(() => ({ status: 401, body: { error: { message: "invalid test-openrouter-key", code: 401 } } }));
  await assert.rejects(() => failed.api.getCurrentKey(), (error) => {
    assert.equal(error.message, "OPENROUTER_REQUEST_FAILED: 401 invalid [redacted]");
    assert.equal(error.message.includes("test-openrouter-key"), false);
    assert.equal(error.message.includes("Bearer"), false);
    return true;
  });
  const text = loadScript(() => ({ status: 502, body: "upstream blew up" }));
  await assert.rejects(() => text.api.listProviders(), (error) => {
    assert.equal(error.message, "OPENROUTER_REQUEST_FAILED: 502 upstream blew up");
    return true;
  });
  const empty = loadScript(() => ({ status: 500, body: "" }));
  await assert.rejects(() => empty.api.listProviders(), /OPENROUTER_REQUEST_FAILED: 500 request failed/);
  const bearer = loadScript(() => ({ status: 403, body: { error: { message: "Bearer test-openrouter-key refused" } } }));
  await assert.rejects(() => bearer.api.listProviders(), (error) => {
    assert.equal(error.message, "OPENROUTER_REQUEST_FAILED: 403 Bearer [redacted] refused");
    assert.equal(error.message.includes("test-openrouter-key"), false);
    return true;
  });
});

test("success bodies stay raw, including JSON error fields, text, and empty responses", async () => {
  const kept = loadScript(() => ({ body: { error: { message: "partial" }, id: "gen_1" } }));
  const generation = await kept.api.getGeneration({ id: "gen_1" });
  assert.equal(JSON.stringify(generation), JSON.stringify({ error: { message: "partial" }, id: "gen_1" }));
  const rss = loadScript(() => ({ body: "<rss>models</rss>", headers: { "Content-Type": "application/rss+xml" } }));
  const feed = await rss.api.listModels({ use_rss: "true" });
  assert.equal(feed, "<rss>models</rss>");
  assert.equal(rss.calls[0].url, "https://openrouter.ai/api/v1/models?use_rss=true");
  const audio = loadScript(() => ({ body: "ID3audio", headers: { "Content-Type": "audio/mpeg" } }));
  const speech = await audio.api.createAudioSpeech({ model: "openai/gpt-4", input: "hello" });
  assert.equal(speech, "ID3audio");
  const empty = loadScript(() => ({ status: 204, body: "" }));
  const deleted = await empty.api.deleteVaultSecret({ name: "secret_name" });
  assert.equal(JSON.stringify(deleted), JSON.stringify({}));
  assert.equal(empty.calls[0].method, "DELETE");
  assert.equal(empty.calls[0].url, "https://openrouter.ai/api/v1/vault/secrets/secret_name");
});

test("decisions and transcription keep documented names and content types", async () => {
  const script = loadScript(() => ({ body: { answers: { choice: "a" }, model: "m", extra: true } }));
  const answers = await script.api.submitDecisionsRequest({
    model: "m",
    state: { lead: 1 },
    questions: { choice: { type: "choice" } },
    session_id: "s1",
    sessionId: "nope",
  });
  assert.equal(JSON.stringify(answers), JSON.stringify({ answers: { choice: "a" }, model: "m", extra: true }));
  assert.equal(script.calls[0].url, "https://openrouter.ai/api/alpha/decisions");
  assert.deepEqual(JSON.parse(script.calls[0].payload), {
    model: "m",
    state: { lead: 1 },
    questions: { choice: { type: "choice" } },
    session_id: "s1",
    sessionId: "nope",
  });
  await script.api.updateIntern({ internId: "intern_1", description: null });
  assert.equal(script.calls[1].method, "PATCH");
  assert.equal(script.calls[1].url, "https://openrouter.ai/api/v1/interns/intern_1");
  assert.deepEqual(JSON.parse(script.calls[1].payload), { description: null });
  await script.api.createAudioTranscriptions({ model: "m", input_audio: { data: "AAAA", format: "wav" }, temperature: 0 });
  assert.equal(script.calls[2].contentType, "application/json");
  assert.deepEqual(JSON.parse(script.calls[2].payload), { input_audio: { data: "AAAA", format: "wav" }, model: "m", temperature: 0 });
  await script.api.createAudioTranscriptions({ model: "m", file: "hello", language: "en" });
  assert.equal(script.calls[3].contentType, "multipart/form-data; boundary=openrouter-form-boundary");
  assert.equal(script.calls[3].payload.includes("hello"), true);
  assert.equal(script.calls[3].payload.includes('name="language"'), true);
  assert.equal(script.calls[3].payload.includes('name="model"'), true);
});
