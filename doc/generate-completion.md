## 生成补全 (Generate a completion)

```
POST /api/generate
```

使用提供的模型为给定的提示生成响应。这是一个流式端点，因此会有一系列响应。最终的响应对象将包括统计信息和来自请求的附加数据。

### 参数 (Parameters)

- `model`: (必填) [模型名称](#model-names)
- `prompt`: 生成响应的提示
- `suffix`: 模型响应之后的文本
- `images`: (可选) base64 编码的图像列表 (用于多模态模型，如 `llava`)
- `think`: (用于思考模型) 模型在响应前是否应该思考？

高级参数 (可选):

- `format`: 返回响应的格式。格式可以是 `json` 或 JSON 模式
- `options`: [Modelfile](./modelfile.md#valid-parameters-and-values) 文档中列出的其他模型参数，例如 `temperature`
- `system`: 系统消息 (覆盖 `Modelfile` 中定义的内容)
- `template`: 要使用的提示模板 (覆盖 `Modelfile` 中定义的内容)
- `stream`: 如果为 `false`，响应将作为单个响应对象返回，而不是对象流
- `raw`: 如果为 `true`，则不会对提示应用任何格式。如果您在对 API 的请求中指定了完整的模板化提示，您可以选择使用 `raw` 参数
- `keep_alive`: 控制请求后模型在内存中保留多长时间 (默认值: `5m`)
- `context` (已弃用): 上一个请求 `/generate` 返回的上下文参数，可用于保持简短的对话记忆

#### 结构化输出 (Structured outputs)

通过在 `format` 参数中提供 JSON 模式来支持结构化输出。模型将生成与模式匹配的响应。请参阅下面的 [结构化输出](#request-structured-outputs) 示例。

#### JSON 模式 (JSON mode)

通过将 `format` 参数设置为 `json` 来启用 JSON 模式。这将把响应结构化为有效的 JSON 对象。请参阅下面的 JSON 模式 [示例](#request-json-mode)。

> [!IMPORTANT]
> 重要的是要在 `prompt` 中指示模型使用 JSON。否则，模型可能会生成大量的空白。

### 示例 (Examples)

#### 生成请求 (流式) (Generate request (Streaming))

##### 请求 (Request)

```shell
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Why is the sky blue?"
}'
```

##### 响应 (Response)

返回 JSON 对象流：

```json
{
  "model": "llama3.2",
  "created_at": "2023-08-04T08:52:19.385406455-07:00",
  "response": "The",
  "done": false
}
```

流中的最终响应还包括有关生成的附加数据：

- `total_duration`: 生成响应所花费的时间
- `load_duration`: 加载模型所花费的时间（纳秒）
- `prompt_eval_count`: 提示中的 token 数量
- `prompt_eval_duration`: 评估提示所花费的时间（纳秒）
- `eval_count`: 响应中的 token 数量
- `eval_duration`: 生成响应所花费的时间（纳秒）
- `context`: 此响应中使用的对话编码，可以在下一个请求中发送以保持对话记忆
- `response`: 如果响应是流式的，则为空；如果不是流式的，则包含完整的响应

要计算响应生成的生成速度（token/秒），请计算 `eval_count` / `eval_duration` * `10^9`。

```json
{
  "model": "llama3.2",
  "created_at": "2023-08-04T19:22:45.499127Z",
  "response": "",
  "done": true,
  "context": [1, 2, 3],
  "total_duration": 10706818083,
  "load_duration": 6338219291,
  "prompt_eval_count": 26,
  "prompt_eval_duration": 130079000,
  "eval_count": 259,
  "eval_duration": 4232710000
}
```

#### 请求 (无流式) (Request (No streaming))

##### 请求 (Request)

当流式传输关闭时，可以在一个回复中接收响应。

```shell
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

##### 响应 (Response)

如果 `stream` 设置为 `false`，响应将是单个 JSON 对象：

```json
{
  "model": "llama3.2",
  "created_at": "2023-08-04T19:22:45.499127Z",
  "response": "The sky is blue because it is the color of the sky.",
  "done": true,
  "context": [1, 2, 3],
  "total_duration": 5043500667,
  "load_duration": 5025959,
  "prompt_eval_count": 26,
  "prompt_eval_duration": 325953000,
  "eval_count": 290,
  "eval_duration": 4709213000
}
```

#### 请求 (带后缀) (Request (with suffix))

##### 请求 (Request)

```shell
curl http://localhost:11434/api/generate -d '{
  "model": "codellama:code",
  "prompt": "def compute_gcd(a, b):",
  "suffix": "    return result",
  "options": {
    "temperature": 0
  },
  "stream": false
}'
```

##### 响应 (Response)

```json5
{
  "model": "codellama:code",
  "created_at": "2024-07-22T20:47:51.147561Z",
  "response": "\n  if a == 0:\n    return b\n  else:\n    return compute_gcd(b % a, a)\n\ndef compute_lcm(a, b):\n  result = (a * b) / compute_gcd(a, b)\n",
  "done": true,
  "done_reason": "stop",
  "context": [...],
  "total_duration": 1162761250,
  "load_duration": 6683708,
  "prompt_eval_count": 17,
  "prompt_eval_duration": 201222000,
  "eval_count": 63,
  "eval_duration": 953997000
}
```

#### 请求 (结构化输出) (Request (Structured outputs))

##### 请求 (Request)

```shell
curl -X POST http://localhost:11434/api/generate -H "Content-Type: application/json" -d '{
  "model": "llama3.1:8b",
  "prompt": "Ollama is 22 years old and is busy saving the world. Respond using JSON",
  "stream": false,
  "format": {
    "type": "object",
    "properties": {
      "age": {
        "type": "integer"
      },
      "available": {
        "type": "boolean"
      }
    },
    "required": [
      "age",
      "available"
    ]
  }
}'
```

##### 响应 (Response)

```json
{
  "model": "llama3.1:8b",
  "created_at": "2024-12-06T00:48:09.983619Z",
  "response": "{\n  \"age\": 22,\n  \"available\": true\n}",
  "done": true,
  "done_reason": "stop",
  "context": [1, 2, 3],
  "total_duration": 1075509083,
  "load_duration": 567678166,
  "prompt_eval_count": 28,
  "prompt_eval_duration": 236000000,
  "eval_count": 16,
  "eval_duration": 269000000
}
```

#### 请求 (JSON 模式) (Request (JSON mode))

> [!IMPORTANT]
> 当 `format` 设置为 `json` 时，输出将始终是格式良好的 JSON 对象。重要的是还要指示模型以 JSON 格式响应。

##### 请求 (Request)

```shell
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "What color is the sky at different times of the day? Respond using JSON",
  "format": "json",
  "stream": false
}'
```

##### 响应 (Response)

```json
{
  "model": "llama3.2",
  "created_at": "2023-11-09T21:07:55.186497Z",
  "response": "{\n\"morning\": {\n\"color\": \"blue\"\n},\n\"noon\": {\n\"color\": \"blue-gray\"\n},\n\"afternoon\": {\n\"color\": \"warm gray\"\n},\n\"evening\": {\n\"color\": \"orange\"\n}\n}\n",
  "done": true,
  "context": [1, 2, 3],
  "total_duration": 4648158584,
  "load_duration": 4071084,
  "prompt_eval_count": 36,
  "prompt_eval_duration": 439038000,
  "eval_count": 180,
  "eval_duration": 4196918000
}
```

`response` 的值将是一个包含类似以下 JSON 的字符串：

```json
{
  "morning": {
    "color": "blue"
  },
  "noon": {
    "color": "blue-gray"
  },
  "afternoon": {
    "color": "warm gray"
  },
  "evening": {
    "color": "orange"
  }
}
```

#### 请求 (带图像) (Request (with images))

要向多模态模型（如 `llava` 或 `bakllava`）提交图像，请提供 base64 编码的 `images` 列表：

#### 请求 (Request)

```shell
curl http://localhost:11434/api/generate -d '{
  "model": "llava",
  "prompt":"What is in this picture?",
  "stream": false,
  "images": ["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"]
305: }'
306: ```
307: 
308: #### 响应 (Response)
309: 
310: ```json
311: {
312:   "model": "llava",
313:   "created_at": "2023-11-03T15:36:02.583064Z",
314:   "response": "A happy cartoon character, which is cute and cheerful.",
315:   "done": true,
316:   "context": [1, 2, 3],
317:   "total_duration": 2938432250,
318:   "load_duration": 2559292,
319:   "prompt_eval_count": 1,
320:   "prompt_eval_duration": 2195557000,
321:   "eval_count": 44,
322:   "eval_duration": 736432000
323: }
324: ```
325: 
326: #### 请求 (原始模式) (Request (Raw Mode))
327: 
328: 在某些情况下，您可能希望绕过模板系统并提供完整的提示。在这种情况下，您可以使用 `raw` 参数来禁用模板。另请注意，原始模式不会返回上下文。
329: 
330: ##### 请求 (Request)
331: 
332: ```shell
333: curl http://localhost:11434/api/generate -d '{
334:   "model": "mistral",
335:   "prompt": "[INST] why is the sky blue? [/INST]",
336:   "raw": true,
337:   "stream": false
338: }'
339: ```
340: 
341: #### 请求 (可复现输出) (Request (Reproducible outputs))
342: 
343: 要获得可复现的输出，请将 `seed` 设置为一个数字：
344: 
345: ##### 请求 (Request)
346: 
347: ```shell
348: curl http://localhost:11434/api/generate -d '{
349:   "model": "mistral",
350:   "prompt": "Why is the sky blue?",
351:   "options": {
352:     "seed": 123
353:   }
354: }'
355: ```
356: 
357: ##### 响应 (Response)
358: 
359: ```json
360: {
361:   "model": "mistral",
362:   "created_at": "2023-11-03T15:36:02.583064Z",
363:   "response": " The sky appears blue because of a phenomenon called Rayleigh scattering.",
364:   "done": true,
365:   "total_duration": 8493852375,
366:   "load_duration": 6589624375,
367:   "prompt_eval_count": 14,
368:   "prompt_eval_duration": 119039000,
369:   "eval_count": 110,
370:   "eval_duration": 1779061000
371: }
372: ```
373: 
374: #### 生成请求 (带选项) (Generate request (With options))
375: 
376: 如果您想在运行时为模型设置自定义选项而不是在 Modelfile 中设置，可以使用 `options` 参数。此示例设置了所有可用选项，但您可以单独设置其中任何一个，并省略不想覆盖的选项。
377: 
378: ##### 请求 (Request)
379: 
380: ```shell
381: curl http://localhost:11434/api/generate -d '{
382:   "model": "llama3.2",
383:   "prompt": "Why is the sky blue?",
384:   "stream": false,
385:   "options": {
386:     "num_keep": 5,
387:     "seed": 42,
388:     "num_predict": 100,
389:     "top_k": 20,
390:     "top_p": 0.9,
391:     "min_p": 0.0,
392:     "typical_p": 0.7,
393:     "repeat_last_n": 33,
394:     "temperature": 0.8,
395:     "repeat_penalty": 1.2,
396:     "presence_penalty": 1.5,
397:     "frequency_penalty": 1.0,
398:     "penalize_newline": true,
399:     "stop": ["\n", "user:"],
400:     "numa": false,
401:     "num_ctx": 1024,
402:     "num_batch": 2,
403:     "num_gpu": 1,
404:     "main_gpu": 0,
405:     "use_mmap": true,
406:     "num_thread": 8
407:   }
408: }'
409: ```
410: 
411: ##### 响应 (Response)
412: 
413: ```json
414: {
415:   "model": "llama3.2",
416:   "created_at": "2023-08-04T19:22:45.499127Z",
417:   "response": "The sky is blue because it is the color of the sky.",
418:   "done": true,
419:   "context": [1, 2, 3],
420:   "total_duration": 4935886791,
421:   "load_duration": 534986708,
422:   "prompt_eval_count": 26,
423:   "prompt_eval_duration": 107345000,
424:   "eval_count": 237,
425:   "eval_duration": 4289432000
426: }
427: ```
428: 
429: #### 加载模型 (Load a model)
430: 
431: 如果提供空提示，模型将被加载到内存中。
432: 
433: ##### 请求 (Request)
434: 
435: ```shell
436: curl http://localhost:11434/api/generate -d '{
437:   "model": "llama3.2"
438: }'
439: ```
440: 
441: ##### 响应 (Response)
442: 
443: 返回单个 JSON 对象：
444: 
445: ```json
446: {
447:   "model": "llama3.2",
448:   "created_at": "2023-12-18T19:52:07.071755Z",
449:   "response": "",
450:   "done": true
451: }
452: ```
453: 
454: #### 卸载模型 (Unload a model)
455: 
456: 如果提供空提示且 `keep_alive` 参数设置为 `0`，模型将从内存中卸载。
457: 
458: ##### 请求 (Request)
459: 
460: ```shell
461: curl http://localhost:11434/api/generate -d '{
462:   "model": "llama3.2",
463:   "keep_alive": 0
464: }'
465: ```
466: 
467: ##### 响应 (Response)
468: 
469: 返回单个 JSON 对象：
470: 
471: ```json
472: {
473:   "model": "llama3.2",
474:   "created_at": "2024-09-12T03:54:03.516566Z",
475:   "response": "",
476:   "done": true,
477:   "done_reason": "unload"
478: }
479: ```
