"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "zh";

type Translations = typeof en;

const en = {
  nav: {
    models: "Models",
    chat: "Chat",
    rankings: "Rankings",
    docs: "Docs",
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
    capabilities: "Capabilities",
    context: "Context",
    inputOutput: "Input / Output",
    throughput: "Throughput",
    providers: "Providers",
    primary: "Primary",
    apiEndpoint: "API Endpoint",
    headers: "Headers",
    demoNote: "This is a clone demo. Real openrouter.ai provides billing, key management, analytics, and routing to actual providers.",
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
  },
};

const zh = {
  nav: {
    models: "模型广场",
    chat: "对话",
    rankings: "排行榜",
    docs: "文档",
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
    capabilities: "能力",
    context: "上下文",
    inputOutput: "输入 / 输出",
    throughput: "吞吐",
    providers: "提供商",
    primary: "主节点",
    apiEndpoint: "API 端点",
    headers: "请求头",
    demoNote: "这是克隆演示站，真实的 openrouter.ai 提供计费、密钥管理、分析和路由到真实提供商。",
  },
  chat: {
    modelLabel: "模型：",
    context: "上下文",
    tokens: "tokens",
    clear: "清空",
    welcome: "你好！我是 OpenRouter 克隆版。在顶部选择一个模型开始聊天。这是 UI 演示——回复是模拟的，但界面和 OpenRouter 的 playground 一致。",
    placeholder: "给模型发消息... (Shift+回车换行)",
    demoNote: "演示用 playground，无真实 API 调用。在 Keys 页面连接你的 API Key 即可变成真实对话。",
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
    demoNote: "这是演示克隆站，无真实扣费。生产环境中你会通过 Stripe 充值、查看分析、设置限额等。",
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
  },
};

export const translations = { en, zh };

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
    if (saved && (saved === "en" || saved === "zh")) {
      setLangState(saved);
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("zh")) setLangState("zh");
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
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
