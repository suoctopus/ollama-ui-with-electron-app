## 生成嵌入 (Generate Embeddings)

```
POST /api/embed
```

从模型生成嵌入

### 参数 (Parameters)

- `model`: 生成嵌入的模型名称
- `input`: 生成嵌入的文本或文本列表

高级参数:

- `truncate`: 截断每个输入的末尾以适应上下文长度。如果为 `false` 且超过上下文长度，则返回错误。默认为 `true`
- `options`: [Modelfile](./modelfile.md#valid-parameters-and-values) 文档中列出的其他模型参数，例如 `temperature`
- `keep_alive`: 控制请求后模型在内存中保留多长时间 (默认值: `5m`)

### 示例 (Examples)

#### 请求 (Request)

```shell
curl http://localhost:11434/api/embed -d '{
  "model": "all-minilm",
  "input": "Why is the sky blue?"
}'
```

#### 响应 (Response)

```json
{
  "model": "all-minilm",
  "embeddings": [[
    0.010071029, -0.0017594862, 0.05007221, 0.04692972, 0.054916814,
    0.008599704, 0.105441414, -0.025878139, 0.12958129, 0.031952348
  ]],
  "total_duration": 14143917,
  "load_duration": 1019500,
  "prompt_eval_count": 8
}
```

#### 请求 (多个输入) (Request (Multiple input))

```shell
curl http://localhost:11434/api/embed -d '{
  "model": "all-minilm",
  "input": ["Why is the sky blue?", "Why is the grass green?"]
}'
```

#### 响应 (Response)

```json
{
  "model": "all-minilm",
  "embeddings": [[
    0.010071029, -0.0017594862, 0.05007221, 0.04692972, 0.054916814,
    0.008599704, 0.105441414, -0.025878139, 0.12958129, 0.031952348
  ],[
    -0.0098027075, 0.06042469, 0.025257962, -0.006364387, 0.07272725,
    0.017194884, 0.09032035, -0.051705178, 0.09951512, 0.09072481
  ]]
}
```

## 生成嵌入 (Generate Embedding)

> 注意：此端点已被 `/api/embed` 取代 (Note: this endpoint has been superseded by `/api/embed`)

```
POST /api/embeddings
```

从模型生成嵌入

### 参数 (Parameters)

- `model`: 生成嵌入的模型名称
- `prompt`: 生成嵌入的文本

高级参数:

- `options`: [Modelfile](./modelfile.md#valid-parameters-and-values) 文档中列出的其他模型参数，例如 `temperature`
- `keep_alive`: 控制请求后模型在内存中保留多长时间 (默认值: `5m`)

### 示例 (Examples)

#### 请求 (Request)

```shell
curl http://localhost:11434/api/embeddings -d '{
  "model": "all-minilm",
  "prompt": "Here is an article about llamas..."
}'
```

#### 响应 (Response)

```json
{
  "embedding": [
    0.5670403838157654, 0.009260174818336964, 0.23178744316101074, -0.2916173040866852, -0.8924556970596313,
    0.8785552978515625, -0.34576427936553955, 0.5742510557174683, -0.04222835972905159, -0.137906014919281
  ]
}
```
