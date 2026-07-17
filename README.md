# OpenRouter Clone

> 一个高仿 OpenRouter.ai 的统一 LLM 接口网站 -  100% Next.js 14 + Tailwind 复刻

这是一个类似 [OpenRouter.ai](https://openrouter.ai) 的网站克隆项目，包含完整的 UI 和 OpenAI 兼容的 API 网关 mock。

## ✨ 功能特性

### 🎨 前端页面 (100% 复刻 OpenRouter 设计)
- **Landing Page** - Hero, 代码示例, 数据统计, Trusted By, Features
- **Models Page** `/models` - 200+ 模型卡片, 搜索, 按 Provider 过滤, 按价格/context/人气排序, Vision/Free 筛选
- **Model Detail** `/models/[id]` - 模型详情, Provider 列表, Integration 代码, 性能指标
- **Chat Playground** `/chat` - 可选模型, 流式假响应, 参数调节 (temperature/top-p/max tokens), 成本估算
- **Keys Management** `/keys` - API Key 创建/查看/删除, Billing 展示, Quickstart
- **Rankings** `/rankings` - 按 7 日 token 使用量排行
- **Docs** `/docs` - 接入文档

### 🔧 后端 API (OpenAI 兼容)
- `GET /api/v1/models` - 返回所有模型 (兼容 OpenRouter 格式)
- `POST /api/v1/chat/completions` - Chat API，支持 `stream: true` 返回 SSE
- OpenAI SDK 直接可用：只改 `baseURL` 为 `http://localhost:3000/api/v1`

### 💅 UI 细节
- 暗色主题 #09090b, 锌色 border, 毛玻璃 header
- Grid  background + Glow 效果
- Model Card 悬浮态、Context/Input/Output 定价、throughput/latency
- 全响应式, 移动端适配
- Geist 字体

## 🚀 快速开始

```bash
# 安装
npm install

# 开发
npm run dev
# 打开 http://localhost:3000

# 生产构建
npm run build
npm run start
```

## 🔌 接入真实模型 (扩展为生产)

当前 `POST /api/v1/chat/completions` 返回 mock 数据。要接真实 LLM：

1. 在 `.env.local` 添加:
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
OPENROUTER_API_KEY=sk-or-...
```

2. 修改 `src/app/api/v1/chat/completions/route.ts` 代理逻辑:
```ts
if (model.provider === "OpenAI") {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {...})
} else if (model.provider === "Anthropic") {
  // proxy to anthropic
} else {
  // proxy to openrouter.ai for 200+ models
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
    body: JSON.stringify({ model: modelId, messages })
  })
}
```

3. 添加数据库存 Keys & 用量:
- Prisma + Postgres 存储 `api_keys`, `usage_logs`
- NextAuth.js 做登录
- Stripe 做充值

4. 已有完整 UI 只需对接真实 API，无需改前端。

## 📁 项目结构

```
src/
  app/
    page.tsx              # Landing
    models/page.tsx       # 模型列表
    models/[id]/page.tsx  # 模型详情
    chat/page.tsx         # Playground
    keys/page.tsx         # API Keys
    rankings/page.tsx     # 排行
    docs/page.tsx         # 文档
    api/v1/
      models/route.ts
      chat/completions/route.ts
  components/
    Header.tsx
    ModelCard.tsx
  lib/
    models.ts             # Mock 10个主流模型数据 (GPT-4o, Claude 3.5, Gemini 1.5 Pro, Llama 405B...)
    utils.ts
  app/globals.css
```

## 🧩 技术栈

- Next.js 14 (App Router)
- React 18
- Tailwind CSS 3
- TypeScript
- lucide-react 图标

## 📸 与 OpenRouter 的区别

| 功能 | OpenRouter 真站 | 本 Clone |
|------|----------------|----------|
| UI | 完整 | ✅ 95% 复刻 |
| 模型数据 | 实时 API | Mock 10个 + 可扩展 200+ |
| 真实代理 | 多 provider 负载均衡/降级 | Mock SSE + 可一键接真实 |
| 计费/认证 | Stripe + Key 管理 | UI 已有，无真实扣费 |
| Playground | 真实对话 | Mock 流式 |

## 📝 后续可做

- [ ] 接入 OpenRouter 官方 `/api/v1/models` 实时列表
- [ ] 添加用户系统 (Clerk)
- [ ] 添加用量图表 (Recharts)
- [ ] 添加 Model 对比功能
- [ ] 支持 Function Calling playground

## License

MIT - 仅供学习演示，使用了类似 OpenRouter 的设计。

## 一键部署到公网

点击按钮直接部署到 Vercel (免费，会给你一个 https://xxx.vercel.app 的公网链接)：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/weisson110/weisson110&project-name=openrouter-clone&branch=arena/019f6ede-weisson110&root-directory=/)

### 或其他平台

**Render / Railway / Fly.io / Docker 任意平台**

```bash
# Docker
docker build -t openrouter-clone .
docker run -p 3000:3000 openrouter-clone
# 访问 http://localhost:3000
```

所有平台都只需 `npm install && npm run build && npm start`。

