# Ollama UI

一个基于 Electron + Vue 3 的 Ollama 图形化界面应用。

## 功能特性

- ✅ **聊天对话**: 支持流式对话,Markdown 渲染,代码高亮
- ✅ **模型管理**: 拉取、删除、复制模型,查看模型详情
- ✅ **聊天记录**: 保存对话历史,支持搜索
- ✅ **系统配置**: Ollama 服务器地址配置,语言切换,高级参数设置
- ✅ **完全离线**: 所有资源本地化,无需 CDN
- ✅ **国际化**: 支持中文和英文,默认中文
- ✅ **思维模式**: 支持模型思考过程可视化显示
- ✅ **图像识别**: 支持上传图片进行视觉问答
- ✅ **高级参数调节**: 支持温度、Top P、Top K等多种参数调节

## 技术栈

- **Electron**: 跨平台桌面应用框架
- **Vue 3**: 渐进式 JavaScript 框架
- **Vite**: 下一代前端构建工具
- **Pinia**: Vue 状态管理
- **Element Plus**: Vue 3 组件库
- **Lucide Icons**: 现代图标库
- **Markdown-it**: Markdown 渲染
- **Highlight.js**: 代码语法高亮
- **Vue I18n**: 国际化解决方案

## 快速开始

### 前置要求

- Node.js >= 16
- Ollama 服务运行在 `http://localhost:11434`

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run electron:dev
```

这将启动 Vite 开发服务器和 Electron 应用。

### 构建生产版本

```bash
npm run electron:build
```

构建的应用将输出到 `release` 目录。

## API 完整实现

本应用完整实现了所有 Ollama API 端点:

### 对话生成
- `POST /api/chat` - 生成对话补全(流式/非流式)
- `POST /api/generate` - 生成文本补全(流式/非流式)

### 模型管理
- `GET /api/tags` - 列出本地模型
- `POST /api/show` - 显示模型信息
- `POST /api/copy` - 复制模型
- `DELETE /api/delete` - 删除模型
- `POST /api/pull` - 拉取模型
- `POST /api/push` - 推送模型
- `POST /api/create` - 创建自定义模型

### 其他
- `POST /api/embed` - 生成嵌入向量
- `POST /api/embeddings` - 生成嵌入(已弃用)
- `GET /api/ps` - 列出运行中的模型
- `GET /api/version` - 获取版本信息
- `HEAD /api/blobs/:digest` - 检查 blob 是否存在
- `POST /api/blobs/:digest` - 推送 blob

## 项目结构

```
src/
├── api/            # API 接口层
│   └── ollama.js   # Ollama API 客户端
├── components/     # Vue 组件
│   ├── chat/       # 聊天相关组件
│   ├── common/     # 通用组件
│   ├── history/    # 历史记录相关组件
│   ├── models/     # 模型管理相关组件
│   ├── settings/   # 设置相关组件
│   ├── Layout.vue  # 主布局
│   └── MessageCard.vue # 消息卡片
├── composables/    # Vue 组合式函数
├── i18n/          # 国际化
│   ├── index.js
│   └── locales/
│       ├── zh-CN.json
│       └── en-US.json
├── router/        # 路由配置
│   └── index.js
├── store/         # 状态管理
│   ├── chat.js    # 聊天状态
│   ├── models.js  # 模型状态
│   └── settings.js # 设置状态
├── styles/        # 全局样式
│   └── main.css
├── views/         # 页面视图
│   ├── ChatView.vue     # 聊天页面
│   ├── ModelsView.vue   # 模型管理页面
│   ├── HistoryView.vue  # 历史记录页面
│   └── SettingsView.vue # 设置页面
├── App.vue        # 根组件
└── main.js        # 入口文件

electron/
├── main.js        # Electron 主进程
└── preload.js     # 预加载脚本
```

## 配置说明

### Ollama 服务器地址

默认为 `http://localhost:11434`,可在设置页面修改。

### 语言设置

支持中文(zh-CN)和英文(en-US),默认中文。

### 高级参数

- **Temperature**: 控制生成随机性 (0-2)
- **Top P**: 核采样参数 (0-1)
- **Top K**: 限制候选词数量 (1-100)
- **Max Tokens**: 最大生成令牌数
- **Seed**: 随机种子，用于生成可重现的结果
- **Context Window**: 上下文窗口大小
- **Keep Alive**: 模型在内存中保持加载的时间

## 许可证

MIT
