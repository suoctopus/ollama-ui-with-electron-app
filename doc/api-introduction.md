# API

## 端点 (Endpoints)

- [生成补全 (Generate a completion)](#generate-a-completion)
- [生成对话补全 (Generate a chat completion)](#generate-a-chat-completion)
- [创建模型 (Create a Model)](#create-a-model)
- [列出本地模型 (List Local Models)](#list-local-models)
- [显示模型信息 (Show Model Information)](#show-model-information)
- [复制模型 (Copy a Model)](#copy-a-model)
- [删除模型 (Delete a Model)](#delete-a-model)
- [拉取模型 (Pull a Model)](#pull-a-model)
- [推送模型 (Push a Model)](#push-a-model)
- [生成嵌入 (Generate Embeddings)](#generate-embeddings)
- [列出运行中的模型 (List Running Models)](#list-running-models)
- [版本 (Version)](#version)

## 约定 (Conventions)

### 模型名称 (Model names)

模型名称遵循 `model:tag` 格式，其中 `model` 可以包含可选的命名空间，例如 `example/model`。一些例子包括 `orca-mini:3b-q8_0` 和 `llama3:70b`。标签 (tag) 是可选的，如果未提供，将默认为 `latest`。标签用于标识特定版本。

### 持续时间 (Durations)

所有持续时间均以纳秒为单位返回。

### 流式响应 (Streaming responses)

某些端点以 JSON 对象流的形式传输响应。可以通过为这些端点提供 `{"stream": false}` 来禁用流式传输。
