"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

<<<<<<< HEAD
export type Lang = "en" | "zh";
=======
export type Lang = "en" | "zh" | "ms";
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)

type Translations = typeof en;

const en = {
  nav: {
    models: "Models",
    chat: "Chat",
    rankings: "Rankings",
    docs: "Docs",
<<<<<<< HEAD
=======
    activity: "Activity",
    credits: "Credits",
    settings: "Settings",
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
    searchPlaceholder: "Search models...",
    signIn: "Sign in",
    getApiKey: "Get API Key",
  },
  home: {
    badge: "All systems operational • 99.99% uptime",
    title1: "The Unified",
    title2: "Interface For LLMs",
    subtitle: "A single API for hundreds of AI models. Better prices, better uptime, no subscription. Access GPT-4o, Claude 3.5, Gemini, Llama and more.",
    exploreModels: "Explore Models",
    tryPlayground: "Try Playground",
    statModels: "AI Models",
    statProviders: "Providers",
    statStart: "To start, pay as you go",
    codeHeader: "openai-compatible • curl example",
    codeTitle: "One API, Hundreds of Models",
    codeFeatures: [
      "Automatic fallbacks & retries",
      "Load balancing & caching",
      "200+ models, 50+ providers",
      "Unified billing & keys",
    ],
    tokensProcessed: "Monthly tokens processed",
    popularModels: "Popular Models",
    popularDesc: "Access the best models via a single OpenAI-compatible API. Auto-routing, fallbacks, and lower prices.",
    filterPlaceholder: "Filter models (e.g. Claude, vision)",
    viewAll: "View all",
    features: [
      { title: "Unified API", desc: "OpenAI-compatible API for 200+ models. Switch models with one line. No vendor lock-in." },
      { title: "Higher Uptime", desc: "Automatic fallbacks, load balancing, and retries across multiple providers." },
      { title: "Better Prices", desc: "Find the best price for any model. Save up to 80% vs direct provider APIs." },
    ],
  },
  modelsPage: {
    title: "Models",
    desc: "Browse 200+ models across 50+ providers. One API key, OpenAI compatible, with fallbacks and load balancing.",
    searchPlaceholder: "Search by name, provider, capability...",
    vision: "Vision",
    free: "Free",
    sortTop: "Top monthly",
    sortNew: "Newest",
    sortPrice: "Lowest price",
    sortContext: "Longest context",
    modelsCount: "models",
    noMatch: "No models match your filters",
    clearFilters: "Clear filters",
    infoContextTitle: "What is context length?",
    infoContextDesc: "Maximum tokens model can process in one request. 1K ~ 750 words.",
    infoPricingTitle: "Pricing per 1M tokens",
    infoPricingDesc: "Input = prompt tokens, Output = completion tokens. Pay only what you use.",
    infoCompatTitle: "OpenAI Compatible",
    infoCompatDesc: "Change baseURL to openrouter.ai/api/v1, reuse OpenAI SDK. Drop-in replacement.",
  },
  modelCard: {
    context: "Context",
    input: "Input",
    output: "Output",
    viewDetails: "View details →",
  },
  modelDetail: {
    back: "Back to models",
    tryModel: "Try this model",
    openPlayground: "Open in Playground",
    contextLength: "Context length",
    trainingCutoff: "Training cutoff",
    functionCalling: "Function calling",
    structuredOutput: "Structured output",
    supported: "Supported",
    integration: "Integration",
    copy: "Copy",
    copied: "Copied",
<<<<<<< HEAD
    capabilities: "Capabilities",
=======
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
    context: "Context",
    inputOutput: "Input / Output",
    throughput: "Throughput",
    providers: "Providers",
    primary: "Primary",
    apiEndpoint: "API Endpoint",
    headers: "Headers",
<<<<<<< HEAD
    demoNote: "This is a clone demo. Real openrouter.ai provides billing, key management, analytics, and routing to actual providers.",
=======
    demoNote: "This is a full mock backend. Replace with real provider routing in production.",
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
  },
  chat: {
    modelLabel: "Model:",
    context: "Context",
    tokens: "tokens",
    clear: "Clear",
    welcome: "Hi! I'm an OpenRouter clone. Select a model from the top and start chatting. This is a UI demo – responses are mocked but the interface matches OpenRouter's playground.",
    placeholder: "Message the model... (Shift+Enter for new line)",
    demoNote: "Demo playground – no real API calls. Connect your own API key in Keys page to make it live.",
    parameters: "Parameters",
    temperature: "Temperature",
    topP: "Top P",
    maxTokens: "Max Tokens",
    estimatedCost: "Estimated cost",
    thisChat: "this chat",
    inputTokens: "input tokens",
    output: "output",
    descTemp: "Controls randomness",
    descTopP: "Nucleus sampling",
    descMax: "Response length",
    you: "You",
  },
  keysPage: {
    title: "API Keys",
    desc: "Manage your OpenRouter API keys. Keep them secret!",
    createKey: "Create Key",
    created: "Created",
    lastUsed: "Last used",
    used: "used",
    edit: "Edit",
    quickstart: "Quickstart",
    billing: "Billing",
    currentUsage: "Current month usage",
    demoNote: "This is a demo clone – no real billing occurs. In production, you would add credits via Stripe, see analytics, set limits, etc.",
    creditsIncluded: "credits included",
  },
  rankingsPage: {
    title: "Rankings",
    desc: "Top models by usage last 7 days. Real OpenRouter updates hourly.",
    model: "Model",
    tokens: "Tokens (7d)",
    growth: "Growth",
    price: "Price",
  },
<<<<<<< HEAD
=======
  activityPage: {
    title: "Activity",
    desc: "Your recent generations, token usage and latency. Mock data – replace with real DB logs.",
    totalGenerations: "Total Generations",
    totalTokens: "Total Tokens",
    avgLatency: "Avg Latency",
    model: "Model",
    prompt: "Prompt",
    tokensField: "Tokens",
    latency: "Latency",
    cost: "Cost",
    status: "Status",
    time: "Time",
    noActivity: "No activity yet. Chat in Playground to generate logs.",
  },
  creditsPage: {
    title: "Credits & Billing",
    desc: "Manage credits, see usage breakdown and invoices. Mock Stripe integration - ready to plug.",
    balance: "Balance",
    addCredits: "Add Credits",
    usageBreakdown: "Usage Breakdown",
    invoices: "Invoices",
    inputTokens: "Input Tokens",
    outputTokens: "Output Tokens",
    totalCost: "Total Cost",
    thisMonth: "This month",
    lastMonth: "Last month",
    buyCreditsNote: "In production, connect Stripe: create checkout session in /api/credits/checkout",
    mockMode: "Mock Mode – No real charges",
  },
  settingsPage: {
    title: "Settings",
    desc: "Account preferences, team and integrations. Ready for real auth.",
    profile: "Profile",
    preferences: "Preferences",
    team: "Team",
    language: "Language",
    theme: "Theme",
    defaultModel: "Default Model",
    email: "Email",
    save: "Save changes",
    saved: "Saved!",
    languageDesc: "Interface language. Default is English.",
  },
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
  docsPage: {
    title: "OpenRouter Clone Docs",
    subtitle: "Drop-in OpenAI-compatible API for all models.",
    gettingStarted: "Getting Started",
    quickstart: "Quickstart",
    authentication: "Authentication",
    models: "Models",
    streaming: "Streaming",
    features: "Features",
    routing: "Routing & Fallbacks",
    sorting: "Provider Sorting",
    functionCalling: "Function Calling",
    vision: "Vision",
    baseUrl: "Base URL",
    exampleRequest: "Example Request",
    cloneProject: "This Clone Project",
<<<<<<< HEAD
    cloneDesc: "This is a high-fidelity clone built with Next.js 14 + Tailwind. It includes:",
    cloneList: [
      "Landing page with hero, code demo, stats",
      "Models listing with search, filters, sorting",
      "Model detail with providers & code snippet",
      "Chat playground (mocked streaming)",
      "API Keys management UI",
      "Rankings page",
      "Dark theme matching openrouter.ai",
      "English / Chinese i18n toggle",
    ],
    toMakeLive: "To make it fully functional:",
    toMakeList: [
      "Add backend route /api/chat/completions that proxies to OpenRouter or directly to providers",
      "Store API keys in database (Prisma + Postgres)",
      "Add auth via NextAuth / Clerk",
      "Implement real billing via Stripe",
      "Connect to OpenRouter API to fetch live models list: GET https://openrouter.ai/api/v1/models",
=======
    cloneDesc: "Full-stack mock of OpenRouter with pluggable real backend:",
    cloneList: [
      "Landing page, Models, Rankings, Activity, Credits, Settings",
      "Chat Playground with streaming mock",
      "API Keys CRUD (mock DB)",
      "Complete REST API: /api/v1/models, /chat/completions, /credits, /activity, /keys",
      "Service layer in src/lib/openrouter-service.ts – swap mock for real",
      "Dark theme + i18n EN/ZH/MS",
    ],
    toMakeLive: "How to plug real data:",
    toMakeList: [
      "Set env keys in .env.local (OPENAI_API_KEY etc.) and implement real calls in src/lib/openrouter-service.ts",
      "Replace mockStore with Prisma + Postgres – models already typed in src/lib/db/mockStore.ts",
      "Wire Stripe in src/app/api/v1/credits/route.ts",
      "Add NextAuth for real login – see src/app/api/v1/auth/me/route.ts",
      "Frontend already calls mock API – no change needed",
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
    ],
  },
  footer: {
    builtFor: "OpenRouter Clone - Built for demonstration",
    gateway: "Unified LLM Gateway",
    status: "Status",
    github: "GitHub",
    twitter: "Twitter",
    discord: "Discord",
  },
  common: {
    language: "Language",
<<<<<<< HEAD
=======
    english: "English",
    chinese: "中文",
    malay: "Bahasa Melayu",
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
  },
};

const zh = {
  nav: {
    models: "模型广场",
    chat: "对话",
    rankings: "排行榜",
    docs: "文档",
<<<<<<< HEAD
=======
    activity: "活动记录",
    credits: "余额计费",
    settings: "设置",
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
    searchPlaceholder: "搜索模型...",
    signIn: "登录",
    getApiKey: "获取 API Key",
  },
  home: {
    badge: "所有系统正常运行 • 99.99% 可用性",
    title1: "统一的",
    title2: "大模型接口",
    subtitle: "一个 API 接入数百个 AI 模型。更优惠的价格，更高的可用性，无需订阅。支持 GPT-4o、Claude 3.5、Gemini、Llama 等。",
    exploreModels: "探索模型",
    tryPlayground: "试用 Playground",
    statModels: "个 AI 模型",
    statProviders: "个提供商",
    statStart: "0 元起步，按量付费",
    codeHeader: "兼容 OpenAI • curl 示例",
    codeTitle: "一个 API，数百个模型",
    codeFeatures: ["自动降级与重试", "负载均衡与缓存", "200+ 模型，50+ 提供商", "统一计费与密钥管理"],
    tokensProcessed: "每月处理 Token 数",
    popularModels: "热门模型",
    popularDesc: "通过单个兼容 OpenAI 的 API 访问最佳模型。自动路由、降级和更低价格。",
    filterPlaceholder: "筛选模型 (如 Claude, vision)",
    viewAll: "查看全部",
    features: [
      { title: "统一 API", desc: "兼容 OpenAI 的 200+ 模型 API，一行代码切换模型，无厂商锁定。" },
      { title: "更高可用", desc: "跨多提供商自动降级、负载均衡和重试。" },
      { title: "更优惠价格", desc: "为任意模型找到最优价格，比官方直连节省高达 80%。" },
    ],
  },
  modelsPage: {
    title: "模型",
    desc: "浏览 50+ 提供商的 200+ 模型。一个 API Key，兼容 OpenAI，支持降级和负载均衡。",
    searchPlaceholder: "按名称、提供商、能力搜索...",
    vision: "视觉",
    free: "免费",
    sortTop: "最热门",
    sortNew: "最新",
    sortPrice: "价格最低",
    sortContext: "上下文最长",
    modelsCount: "个模型",
    noMatch: "没有匹配筛选条件的模型",
    clearFilters: "清除筛选",
    infoContextTitle: "什么是上下文长度？",
    infoContextDesc: "模型一次请求最多能处理的 Token 数。1K ≈ 750 个单词。",
    infoPricingTitle: "按 1M Token 计费",
    infoPricingDesc: "Input = 提示词，Output = 生成内容，用多少付多少。",
    infoCompatTitle: "兼容 OpenAI",
    infoCompatDesc: "把 baseURL 改为 openrouter.ai/api/v1，复用 OpenAI SDK，开箱即用。",
  },
  modelCard: {
    context: "上下文",
    input: "输入",
    output: "输出",
    viewDetails: "查看详情 →",
  },
  modelDetail: {
    back: "返回模型列表",
    tryModel: "试用此模型",
    openPlayground: "在 Playground 中打开",
    contextLength: "上下文长度",
    trainingCutoff: "训练截止",
    functionCalling: "函数调用",
    structuredOutput: "结构化输出",
    supported: "支持",
    integration: "接入代码",
    copy: "复制",
    copied: "已复制",
<<<<<<< HEAD
    capabilities: "能力",
=======
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
    context: "上下文",
    inputOutput: "输入 / 输出",
    throughput: "吞吐",
    providers: "提供商",
    primary: "主节点",
    apiEndpoint: "API 端点",
    headers: "请求头",
<<<<<<< HEAD
    demoNote: "这是克隆演示站，真实的 openrouter.ai 提供计费、密钥管理、分析和路由到真实提供商。",
=======
    demoNote: "这是完整的前后端 Mock，已预留真实接入插槽，生产环境替换 openrouter-service 即可。",
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
  },
  chat: {
    modelLabel: "模型：",
    context: "上下文",
    tokens: "tokens",
    clear: "清空",
<<<<<<< HEAD
    welcome: "你好！我是 OpenRouter 克隆版。在顶部选择一个模型开始聊天。这是 UI 演示——回复是模拟的，但界面和 OpenRouter 的 playground 一致。",
    placeholder: "给模型发消息... (Shift+回车换行)",
    demoNote: "演示用 playground，无真实 API 调用。在 Keys 页面连接你的 API Key 即可变成真实对话。",
=======
    welcome: "你好！我是 OpenRouter 克隆版。在顶部选择一个模型开始聊天，这是完整 Mock 后端，已记录到活动页。",
    placeholder: "给模型发消息... (Shift+回车换行)",
    demoNote: "Mock 后端已就绪，真实接入只需替换 Service 层，零前端改动。",
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
    parameters: "参数",
    temperature: "温度",
    topP: "Top P",
    maxTokens: "最大 Token",
    estimatedCost: "预估费用",
    thisChat: "本次对话",
    inputTokens: "输入 tokens",
    output: "输出",
    descTemp: "控制随机性",
    descTopP: "核采样",
    descMax: "回复长度",
    you: "你",
  },
  keysPage: {
    title: "API Keys",
    desc: "管理你的 OpenRouter API 密钥。请妥善保管！",
    createKey: "创建密钥",
    created: "创建于",
    lastUsed: "最后使用",
    used: "已用",
    edit: "编辑",
    quickstart: "快速开始",
    billing: "计费",
    currentUsage: "本月用量",
<<<<<<< HEAD
    demoNote: "这是演示克隆站，无真实扣费。生产环境中你会通过 Stripe 充值、查看分析、设置限额等。",
=======
    demoNote: "这是完整的 Mock 后端，生产环境对接 Stripe 和数据库即可。",
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
    creditsIncluded: "包含额度",
  },
  rankingsPage: {
    title: "排行榜",
    desc: "按最近 7 天用量排名。真实的 OpenRouter 每小时更新。",
    model: "模型",
    tokens: "Tokens (7天)",
    growth: "增长",
    price: "价格",
  },
<<<<<<< HEAD
=======
  activityPage: {
    title: "活动记录",
    desc: "你的生成历史、Token 用量和延迟。Mock 数据，已预留真实 DB 接入。",
    totalGenerations: "总生成数",
    totalTokens: "总 Tokens",
    avgLatency: "平均延迟",
    model: "模型",
    prompt: "提示词",
    tokensField: "Tokens",
    latency: "延迟",
    cost: "费用",
    status: "状态",
    time: "时间",
    noActivity: "还没有活动，去 Playground 聊天即可生成记录。",
  },
  creditsPage: {
    title: "余额与计费",
    desc: "管理余额、查看用量明细和发票。已预留 Stripe 接入。",
    balance: "余额",
    addCredits: "充值",
    usageBreakdown: "用量明细",
    invoices: "发票",
    inputTokens: "输入 Tokens",
    outputTokens: "输出 Tokens",
    totalCost: "总费用",
    thisMonth: "本月",
    lastMonth: "上月",
    buyCreditsNote: "生产环境对接 Stripe：在 /api/credits/checkout 创建支付会话",
    mockMode: "Mock 模式 – 无真实扣费",
  },
  settingsPage: {
    title: "设置",
    desc: "账户偏好、团队和集成。已预留真实登录。",
    profile: "个人资料",
    preferences: "偏好",
    team: "团队",
    language: "语言",
    theme: "主题",
    defaultModel: "默认模型",
    email: "邮箱",
    save: "保存修改",
    saved: "已保存！",
    languageDesc: "界面语言，默认英文。",
  },
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
  docsPage: {
    title: "OpenRouter 克隆版文档",
    subtitle: "兼容 OpenAI 的多模型 API。",
    gettingStarted: "快速开始",
    quickstart: "快速入门",
    authentication: "认证",
    models: "模型",
    streaming: "流式",
    features: "功能",
    routing: "路由与降级",
    sorting: "提供商排序",
    functionCalling: "函数调用",
    vision: "视觉",
    baseUrl: "Base URL",
    exampleRequest: "请求示例",
    cloneProject: "本克隆项目",
<<<<<<< HEAD
    cloneDesc: "这是一个用 Next.js 14 + Tailwind 高仿的克隆，包含：",
    cloneList: [
      "带 Hero、代码演示、统计的着陆页",
      "支持搜索、筛选、排序的模型列表",
      "带提供商和代码片段的模型详情",
      "模拟流式的聊天 Playground",
      "API Keys 管理界面",
      "排行榜页面",
      "匹配 openrouter.ai 的暗色主题",
      "中英文一键切换",
    ],
    toMakeLive: "要变为可生产使用：",
    toMakeList: [
      "添加后端路由 /api/chat/completions 代理到 OpenRouter 或直连提供商",
      "数据库存储 api_keys、usage_logs (Prisma + Postgres)",
      "添加登录 (NextAuth / Clerk)",
      "通过 Stripe 实现真实计费",
      "对接 OpenRouter 官方接口获取实时模型列表：GET https://openrouter.ai/api/v1/models",
=======
    cloneDesc: "完整的前后端 Mock，已预留真实后端插槽：",
    cloneList: [
      "着陆页、模型、排行、活动、余额、设置",
      "带流式 Mock 的聊天 Playground",
      "API Keys 的增删改查 (Mock DB)",
      "完整 REST API：/api/v1/models, /chat/completions, /credits, /activity, /keys",
      "Service 层在 src/lib/openrouter-service.ts – 可一键替换为真实",
      "暗色主题 + 三语 EN/ZH/MS",
    ],
    toMakeLive: "如何接入真实数据：",
    toMakeList: [
      "在 .env.local 配置密钥，在 src/lib/openrouter-service.ts 实现真实调用",
      "用 Prisma + Postgres 替换 mockStore，模型已在 src/lib/db/mockStore.ts 定义",
      "在 src/app/api/v1/credits/route.ts 对接 Stripe",
      "用 NextAuth 实现真实登录，参考 src/app/api/v1/auth/me/route.ts",
      "前端已调用 Mock API，无需改动",
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
    ],
  },
  footer: {
    builtFor: "OpenRouter 克隆版 - 仅作演示",
    gateway: "统一 LLM 网关",
    status: "状态",
    github: "GitHub",
    twitter: "推特",
    discord: "Discord",
  },
  common: {
    language: "语言",
<<<<<<< HEAD
  },
};

export const translations = { en, zh };
=======
    english: "English",
    chinese: "中文",
    malay: "Bahasa Melayu",
  },
};

const ms = {
  nav: {
    models: "Model",
    chat: "Sembang",
    rankings: "Kedudukan",
    docs: "Dok",
    activity: "Aktiviti",
    credits: "Kredit",
    settings: "Tetapan",
    searchPlaceholder: "Cari model...",
    signIn: "Log masuk",
    getApiKey: "Dapatkan Kunci API",
  },
  home: {
    badge: "Semua sistem beroperasi • 99.99% uptime",
    title1: "Antara Muka",
    title2: "Bersatu Untuk LLM",
    subtitle: "Satu API untuk ratusan model AI. Harga lebih baik, uptime lebih tinggi, tanpa langganan. Akses GPT-4o, Claude 3.5, Gemini, Llama dan banyak lagi.",
    exploreModels: "Terokai Model",
    tryPlayground: "Cuba Playground",
    statModels: "Model AI",
    statProviders: "Pembekal",
    statStart: "0 untuk mula, bayar ikut guna",
    codeHeader: "serasi openai • contoh curl",
    codeTitle: "Satu API, Ratusan Model",
    codeFeatures: ["Fallback & retry automatik", "Load balancing & caching", "200+ model, 50+ pembekal", "Billing & kunci bersatu"],
    tokensProcessed: "Token diproses bulanan",
    popularModels: "Model Popular",
    popularDesc: "Akses model terbaik melalui API serasi OpenAI. Auto-routing, fallback, harga lebih rendah.",
    filterPlaceholder: "Tapisan model (cth. Claude, vision)",
    viewAll: "Lihat semua",
    features: [
      { title: "API Bersatu", desc: "API serasi OpenAI untuk 200+ model. Tukar model dengan satu baris. Tiada vendor lock-in." },
      { title: "Uptime Tinggi", desc: "Fallback automatik, load balancing dan retry merentasi banyak pembekal." },
      { title: "Harga Lebih Baik", desc: "Cari harga terbaik untuk mana-mana model. Jimat hingga 80% vs API terus." },
    ],
  },
  modelsPage: {
    title: "Model",
    desc: "Layari 200+ model merentasi 50+ pembekal. Satu kunci API, serasi OpenAI, dengan fallback dan load balancing.",
    searchPlaceholder: "Cari mengikut nama, pembekal, keupayaan...",
    vision: "Visi",
    free: "Percuma",
    sortTop: "Bulanan teratas",
    sortNew: "Terbaru",
    sortPrice: "Harga terendah",
    sortContext: "Konteks terpanjang",
    modelsCount: "model",
    noMatch: "Tiada model sepadan dengan tapisan anda",
    clearFilters: "Kosongkan tapisan",
    infoContextTitle: "Apakah panjang konteks?",
    infoContextDesc: "Token maksimum model boleh proses dalam satu permintaan. 1K ~ 750 perkataan.",
    infoPricingTitle: "Harga per 1M token",
    infoPricingDesc: "Input = token prompt, Output = token completion. Bayar apa yang anda guna.",
    infoCompatTitle: "Serasi OpenAI",
    infoCompatDesc: "Tukar baseURL ke openrouter.ai/api/v1, guna semula SDK OpenAI. Drop-in replacement.",
  },
  modelCard: {
    context: "Konteks",
    input: "Input",
    output: "Output",
    viewDetails: "Lihat butiran →",
  },
  modelDetail: {
    back: "Kembali ke model",
    tryModel: "Cuba model ini",
    openPlayground: "Buka di Playground",
    contextLength: "Panjang konteks",
    trainingCutoff: "Cutoff latihan",
    functionCalling: "Panggilan fungsi",
    structuredOutput: "Output berstruktur",
    supported: "Disokong",
    integration: "Integrasi",
    copy: "Salin",
    copied: "Disalin",
    context: "Konteks",
    inputOutput: "Input / Output",
    throughput: "Throughput",
    providers: "Pembekal",
    primary: "Utama",
    apiEndpoint: "Endpoint API",
    headers: "Headers",
    demoNote: "Ini adalah backend mock penuh. Gantikan dengan routing pembekal sebenar dalam pengeluaran.",
  },
  chat: {
    modelLabel: "Model:",
    context: "Konteks",
    tokens: "token",
    clear: "Kosongkan",
    welcome: "Hai! Saya klon OpenRouter. Pilih model di atas dan mula bersembang. Ini adalah demo UI – respons adalah mock tetapi antara muka sepadan dengan playground OpenRouter.",
    placeholder: "Mesej model... (Shift+Enter untuk baris baru)",
    demoNote: "Playground demo – tiada panggilan API sebenar. Sambungkan kunci API anda di halaman Keys untuk menjadikannya live.",
    parameters: "Parameter",
    temperature: "Suhu",
    topP: "Top P",
    maxTokens: "Token Maks",
    estimatedCost: "Anggaran kos",
    thisChat: "sembang ini",
    inputTokens: "token input",
    output: "output",
    descTemp: "Kawal rawak",
    descTopP: "Persampelan nukleus",
    descMax: "Panjang respons",
    you: "Anda",
  },
  keysPage: {
    title: "Kunci API",
    desc: "Urus kunci API OpenRouter anda. Rahsiakan!",
    createKey: "Cipta Kunci",
    created: "Dicipta",
    lastUsed: "Terakhir digunakan",
    used: "digunakan",
    edit: "Edit",
    quickstart: "Mula cepat",
    billing: "Pengebilan",
    currentUsage: "Penggunaan bulan semasa",
    demoNote: "Ini adalah klon demo – tiada pengebilan sebenar. Dalam pengeluaran, anda akan tambah kredit melalui Stripe, lihat analitik, tetapkan had, dsb.",
    creditsIncluded: "kredit termasuk",
  },
  rankingsPage: {
    title: "Kedudukan",
    desc: "Model teratas mengikut penggunaan 7 hari lepas. OpenRouter sebenar dikemas kini setiap jam.",
    model: "Model",
    tokens: "Token (7h)",
    growth: "Pertumbuhan",
    price: "Harga",
  },
  activityPage: {
    title: "Aktiviti",
    desc: "Generasi terkini anda, penggunaan token dan latensi. Data mock – ganti dengan log DB sebenar.",
    totalGenerations: "Jumlah Generasi",
    totalTokens: "Jumlah Token",
    avgLatency: "Purata Latensi",
    model: "Model",
    prompt: "Prompt",
    tokensField: "Token",
    latency: "Latensi",
    cost: "Kos",
    status: "Status",
    time: "Masa",
    noActivity: "Tiada aktiviti lagi. Sembang di Playground untuk menjana log.",
  },
  creditsPage: {
    title: "Kredit & Pengebilan",
    desc: "Urus kredit, lihat pecahan penggunaan dan invois. Integrasi Stripe mock - sedia untuk plug.",
    balance: "Baki",
    addCredits: "Tambah Kredit",
    usageBreakdown: "Pecahan Penggunaan",
    invoices: "Invois",
    inputTokens: "Token Input",
    outputTokens: "Token Output",
    totalCost: "Jumlah Kos",
    thisMonth: "Bulan ini",
    lastMonth: "Bulan lepas",
    buyCreditsNote: "Dalam pengeluaran, sambungkan Stripe: cipta sesi checkout di /api/credits/checkout",
    mockMode: "Mod Mock – Tiada caj sebenar",
  },
  settingsPage: {
    title: "Tetapan",
    desc: "Keutamaan akaun, pasukan dan integrasi. Sedia untuk auth sebenar.",
    profile: "Profil",
    preferences: "Keutamaan",
    team: "Pasukan",
    language: "Bahasa",
    theme: "Tema",
    defaultModel: "Model Lalai",
    email: "Emel",
    save: "Simpan perubahan",
    saved: "Disimpan!",
    languageDesc: "Bahasa antara muka. Lalai ialah Bahasa Inggeris.",
  },
  docsPage: {
    title: "Dok Klon OpenRouter",
    subtitle: "API serasi OpenAI drop-in untuk semua model.",
    gettingStarted: "Bermula",
    quickstart: "Mula Cepat",
    authentication: "Pengesahan",
    models: "Model",
    streaming: "Streaming",
    features: "Ciri",
    routing: "Routing & Fallback",
    sorting: "Isihan Pembekal",
    functionCalling: "Panggilan Fungsi",
    vision: "Visi",
    baseUrl: "Base URL",
    exampleRequest: "Contoh Permintaan",
    cloneProject: "Projek Klon Ini",
    cloneDesc: "Mock full-stack OpenRouter dengan backend sebenar boleh pasang:",
    cloneList: [
      "Landing, Model, Kedudukan, Aktiviti, Kredit, Tetapan",
      "Chat Playground dengan streaming mock",
      "CRUD Kunci API (mock DB)",
      "REST API lengkap: /api/v1/models, /chat/completions, /credits, /activity, /keys",
      "Lapisan servis di src/lib/openrouter-service.ts – tukar mock ke sebenar",
      "Tema gelap + i18n EN/ZH/MS",
    ],
    toMakeLive: "Cara pasang data sebenar:",
    toMakeList: [
      "Tetapkan kunci env dalam .env.local dan laksana panggilan sebenar dalam src/lib/openrouter-service.ts",
      "Ganti mockStore dengan Prisma + Postgres – model sudah ditaip dalam src/lib/db/mockStore.ts",
      "Wayar Stripe dalam src/app/api/v1/credits/route.ts",
      "Tambah NextAuth untuk log masuk sebenar – lihat src/app/api/v1/auth/me/route.ts",
      "Frontend sudah panggil mock API – tiada perubahan diperlukan",
    ],
  },
  footer: {
    builtFor: "Klon OpenRouter - Dibuat untuk demonstrasi",
    gateway: "Gerbang LLM Bersatu",
    status: "Status",
    github: "GitHub",
    twitter: "Twitter",
    discord: "Discord",
  },
  common: {
    language: "Bahasa",
    english: "English",
    chinese: "中文",
    malay: "Bahasa Melayu",
  },
};

export const translations = { en, zh, ms };
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)

type I18nContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
<<<<<<< HEAD
    if (saved && (saved === "en" || saved === "zh")) {
      setLangState(saved);
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("zh")) setLangState("zh");
=======
    if (saved && (saved === "en" || saved === "zh" || saved === "ms")) {
      setLangState(saved);
    } else {
      // Default is English as requested, only auto-switch if explicit zh/ms
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("zh")) setLangState("zh");
      else if (browserLang.startsWith("ms") || browserLang.startsWith("id")) setLangState("ms");
      else setLangState("en");
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
<<<<<<< HEAD
=======
    document.documentElement.lang = l;
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
  };

  const value: I18nContextType = {
    lang,
    setLang,
    t: translations[lang] as Translations,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
