## 列出运行中的模型 (List Running Models)
```
GET /api/ps
```

列出当前加载到内存中的模型。

#### 示例 (Examples)

### 请求 (Request)

```shell
curl http://localhost:11434/api/ps
```

#### 响应 (Response)

将返回单个 JSON 对象。

```json
{
  "models": [
    {
      "name": "mistral:latest",
      "model": "mistral:latest",
      "size": 5137025024,
      "digest": "2ae6f6dd7a3dd734790bbbf58b8909a606e0e7e97e94b7604e0aa7ae4490e6d8",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "llama",
        "families": [
          "llama"
        ],
        "parameter_size": "7.2B",
        "quantization_level": "Q4_0"
      },
      "expires_at": "2024-06-04T14:38:31.83753-07:00",
      "size_vram": 5137025024
    }
  ]
}
```
