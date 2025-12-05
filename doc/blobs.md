## 检查 Blob 是否存在 (Check if a Blob Exists)

```shell
HEAD /api/blobs/:digest
```

确保用于创建模型的文件 blob (二进制大对象) 存在于服务器上。这将检查您的 Ollama 服务器而不是 ollama.com。

### 查询参数 (Query Parameters)

- `digest`: blob 的 SHA256 摘要

### 示例 (Examples)

#### 请求 (Request)

```shell
curl -I http://localhost:11434/api/blobs/sha256:29fdb92e57cf0827ded04ae6461b5931d01fa595843f55d36f5b275a52087dd2
```

#### 响应 (Response)

如果 blob 存在，则返回 200 OK，如果不存在，则返回 404 Not Found。

## 推送 Blob (Push a Blob)

```
POST /api/blobs/:digest
```

将文件推送到 Ollama 服务器以创建 "blob" (二进制大对象)。

### 查询参数 (Query Parameters)

- `digest`: 文件的预期 SHA256 摘要

### 示例 (Examples)

#### 请求 (Request)

```shell
curl -T model.gguf -X POST http://localhost:11434/api/blobs/sha256:29fdb92e57cf0827ded04ae6461b5931d01fa595843f55d36f5b275a52087dd2
```

#### 响应 (Response)

如果 blob 成功创建，则返回 201 Created，如果使用的摘要不符合预期，则返回 400 Bad Request。
