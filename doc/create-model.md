## 创建模型 (Create a Model)

```
POST /api/create
```

从以下内容创建模型：
 * 另一个模型；
 * safetensors 目录；或
 * GGUF 文件。

如果您要从 safetensors 目录或 GGUF 文件创建模型，您必须为每个文件 [创建 blob](#create-a-blob)，然后在 `files` 字段中使用与每个 blob 关联的文件名和 SHA256 摘要。

### 参数 (Parameters)

- `model`: 要创建的模型名称
- `from`: (可选) 用于创建新模型的现有模型名称
- `files`: (可选) 用于创建模型的 blob 的文件名到 SHA256 摘要的字典
- `adapters`: (可选) LORA 适配器的 blob 的文件名到 SHA256 摘要的字典
- `template`: (可选) 模型的提示模板
- `license`: (可选) 包含模型许可证的字符串或字符串列表
- `system`: (可选) 包含模型系统提示的字符串
- `parameters`: (可选) 模型参数的字典 (请参阅 [Modelfile](./modelfile.md#valid-parameters-and-values) 获取参数列表)
- `messages`: (可选) 用于创建对话的消息对象列表
- `stream`: (可选) 如果为 `false`，响应将作为单个响应对象返回，而不是对象流
- `quantize` (可选): 量化非量化 (例如 float16) 模型

#### 量化类型 (Quantization types)

| 类型 | 推荐 |
| --- | :-: |
| q4_K_M | * |
| q4_K_S | |
| q8_0 | * |

### 示例 (Examples)

#### 创建一个新模型 (Create a new model)

从现有模型创建一个新模型。

##### 请求 (Request)

```shell
curl http://localhost:11434/api/create -d '{
  "model": "mario",
  "from": "llama3.2",
  "system": "You are Mario from Super Mario Bros."
}'
```

##### 响应 (Response)

返回 JSON 对象流：

```json
{"status":"reading model metadata"}
{"status":"creating system layer"}
{"status":"using already created layer sha256:22f7f8ef5f4c791c1b03d7eb414399294764d7cc82c7e94aa81a1feb80a983a2"}
{"status":"using already created layer sha256:8c17c2ebb0ea011be9981cc3922db8ca8fa61e828c5d3f44cb6ae342bf80460b"}
{"status":"using already created layer sha256:7c23fb36d80141c4ab8cdbb61ee4790102ebd2bf7aeff414453177d4f2110e5d"}
{"status":"using already created layer sha256:2e0493f67d0c8c9c68a8aeacdf6a38a2151cb3c4c1d42accf296e19810527988"}
{"status":"using already created layer sha256:2759286baa875dc22de5394b4a925701b1896a7e3f8e53275c36f75a877a82c9"}
{"status":"writing layer sha256:df30045fe90f0d750db82a058109cecd6d4de9c90a3d75b19c09e5f64580bb42"}
{"status":"writing layer sha256:f18a68eb09bf925bb1b669490407c1b1251c5db98dc4d3d81f3088498ea55690"}
{"status":"writing manifest"}
{"status":"success"}
```

#### 量化模型 (Quantize a model)

量化非量化模型。

##### 请求 (Request)

```shell
curl http://localhost:11434/api/create -d '{
  "model": "llama3.2:quantized",
  "from": "llama3.2:3b-instruct-fp16",
  "quantize": "q4_K_M"
}'
```

##### 响应 (Response)

返回 JSON 对象流：

```json
{"status":"quantizing F16 model to Q4_K_M","digest":"0","total":6433687776,"completed":12302}
{"status":"quantizing F16 model to Q4_K_M","digest":"0","total":6433687776,"completed":6433687552}
{"status":"verifying conversion"}
{"status":"creating new layer sha256:fb7f4f211b89c6c4928ff4ddb73db9f9c0cfca3e000c3e40d6cf27ddc6ca72eb"}
{"status":"using existing layer sha256:966de95ca8a62200913e3f8bfbf84c8494536f1b94b49166851e76644e966396"}
{"status":"using existing layer sha256:fcc5a6bec9daf9b561a68827b67ab6088e1dba9d1fa2a50d7bbcc8384e0a265d"}
{"status":"using existing layer sha256:a70ff7e570d97baaf4e62ac6e6ad9975e04caa6d900d3742d37698494479e0cd"}
{"status":"using existing layer sha256:56bb8bd477a519ffa694fc449c2413c6f0e1d3b1c88fa7e3c9d88d3ae49d4dcb"}
{"status":"writing manifest"}
{"status":"success"}
```

#### 从 GGUF 创建模型 (Create a model from GGUF)

从 GGUF 文件创建模型。`files` 参数应填写您要使用的 GGUF 文件的文件名和 SHA256 摘要。在调用此 API 之前，请使用 [/api/blobs/:digest](#push-a-blob) 将 GGUF 文件推送到服务器。


##### 请求 (Request)

```shell
curl http://localhost:11434/api/create -d '{
  "model": "my-gguf-model",
  "files": {
    "test.gguf": "sha256:432f310a77f4650a88d0fd59ecdd7cebed8d684bafea53cbff0473542964f0c3"
  }
}'
```

##### 响应 (Response)

返回 JSON 对象流：

```json
{"status":"parsing GGUF"}
{"status":"using existing layer sha256:432f310a77f4650a88d0fd59ecdd7cebed8d684bafea53cbff0473542964f0c3"}
{"status":"writing manifest"}
{"status":"success"}
```


#### 从 Safetensors 目录创建模型 (Create a model from a Safetensors directory)

`files` 参数应包含 safetensors 模型的字典，其中包括每个文件的文件名和 SHA256 摘要。在调用此 API 之前，请使用 [/api/blobs/:digest](#push-a-blob) 将每个文件推送到服务器。文件将保留在缓存中，直到 Ollama 服务器重新启动。

##### 请求 (Request)

```shell
curl http://localhost:11434/api/create -d '{
  "model": "fred",
  "files": {
    "config.json": "sha256:dd3443e529fb2290423a0c65c2d633e67b419d273f170259e27297219828e389",
    "generation_config.json": "sha256:88effbb63300dbbc7390143fbbdd9d9fa50587b37e8bfd16c8c90d4970a74a36",
    "special_tokens_map.json": "sha256:b7455f0e8f00539108837bfa586c4fbf424e31f8717819a6798be74bef813d05",
    "tokenizer.json": "sha256:bbc1904d35169c542dffbe1f7589a5994ec7426d9e5b609d07bab876f32e97ab",
    "tokenizer_config.json": "sha256:24e8a6dc2547164b7002e3125f10b415105644fcf02bf9ad8b674c87b1eaaed6",
    "model.safetensors": "sha256:1ff795ff6a07e6a68085d206fb84417da2f083f68391c2843cd2b8ac6df8538f"
  }
}'
```

##### 响应 (Response)

返回 JSON 对象流：

```shell
{"status":"converting model"}
{"status":"creating new layer sha256:05ca5b813af4a53d2c2922933936e398958855c44ee534858fcfd830940618b6"}
{"status":"using autodetected template llama3-instruct"}
{"status":"using existing layer sha256:56bb8bd477a519ffa694fc449c2413c6f0e1d3b1c88fa7e3c9d88d3ae49d4dcb"}
{"status":"writing manifest"}
{"status":"success"}
```
