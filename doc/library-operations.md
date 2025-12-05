## 拉取模型 (Pull a Model)

```
POST /api/pull
```

从 ollama 库下载模型。取消的拉取将从中断处继续，多次调用将共享相同的下载进度。

### 参数 (Parameters)

- `model`: 要拉取的模型名称
- `insecure`: (可选) 允许不安全的连接到库。仅在开发期间从您自己的库拉取时使用此选项。
- `stream`: (可选) 如果为 `false`，响应将作为单个响应对象返回，而不是对象流

### 示例 (Examples)

#### 请求 (Request)

```shell
curl http://localhost:11434/api/pull -d '{
  "model": "llama3.2"
}'
```

#### 响应 (Response)

如果未指定 `stream` 或将其设置为 `true`，则返回 JSON 对象流：

第一个对象是清单：

```json
{
  "status": "pulling manifest"
}
```

然后是一系列下载响应。在任何下载完成之前，可能不包含 `completed` 键。要下载的文件数取决于清单中指定的层数。

```json
{
  "status": "downloading digestname",
  "digest": "digestname",
  "total": 2142590208,
  "completed": 241970
}
```

所有文件下载完成后，最终响应为：

```json
{
    "status": "verifying sha256 digest"
}
{
    "status": "writing manifest"
}
{
    "status": "removing any unused layers"
}
{
    "status": "success"
}
```

如果 `stream` 设置为 false，则响应是单个 JSON 对象：

```json
{
  "status": "success"
}
```

## 推送模型 (Push a Model)

```
POST /api/push
```

将模型上传到模型库。需要先注册 ollama.ai 并添加公钥。

### 参数 (Parameters)

- `model`: 要推送的模型名称，格式为 `<namespace>/<model>:<tag>`
- `insecure`: (可选) 允许不安全的连接到库。仅在开发期间推送到您的库时使用此选项。
- `stream`: (可选) 如果为 `false`，响应将作为单个响应对象返回，而不是对象流

### 示例 (Examples)

#### 请求 (Request)

```shell
curl http://localhost:11434/api/push -d '{
  "model": "mattw/pygmalion:latest"
}'
```

#### 响应 (Response)

如果未指定 `stream` 或将其设置为 `true`，则返回 JSON 对象流：

```json
{ "status": "retrieving manifest" }
```

然后：

```json
{
  "status": "starting upload",
  "digest": "sha256:bc07c81de745696fdf5afca05e065818a8149fb0c77266fb584d9b2cba3711ab",
  "total": 1928429856
}
```

然后是一系列上传响应：

```json
{
  "status": "starting upload",
  "digest": "sha256:bc07c81de745696fdf5afca05e065818a8149fb0c77266fb584d9b2cba3711ab",
  "total": 1928429856
}
```

最后，当上传完成时：

```json
{"status":"pushing manifest"}
{"status":"success"}
```

如果 `stream` 设置为 `false`，则响应是单个 JSON 对象：

```json
{ "status": "success" }
```
