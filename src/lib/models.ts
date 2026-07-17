export interface Model {
  id: string;
  name: string;
  provider: string;
  providerIcon: string;
  description: string;
  contextLength: number;
  pricing: {
    input: number; // per 1M tokens
    output: number;
  };
  topProvider?: string;
  modality: string[];
  tags: string[];
  createdAt: string;
  stats: {
    throughput: number;
    latency: number;
    uptime: string;
  };
}

export const models: Model[] = [
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    providerIcon: "◐",
    description: "Most advanced multimodal model, faster and cheaper than GPT-4 Turbo. 128K context window with vision capabilities.",
    contextLength: 128000,
    pricing: { input: 5, output: 15 },
    modality: ["text", "image"],
    tags: ["flagship", "vision", "multimodal"],
    createdAt: "2024-05-13",
    stats: { throughput: 93, latency: 420, uptime: "99.9%" },
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    providerIcon: "◇",
    description: "Most intelligent model, best for complex tasks. Outperforms Claude 3 Opus with twice the speed.",
    contextLength: 200000,
    pricing: { input: 3, output: 15 },
    modality: ["text", "image"],
    tags: ["flagship", "coding", "reasoning"],
    createdAt: "2024-06-20",
    stats: { throughput: 78, latency: 512, uptime: "99.95%" },
  },
  {
    id: "google/gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    providerIcon: "◎",
    description: "Mid-size multimodal model that supports up to 2M tokens, ideal for long-context reasoning.",
    contextLength: 2000000,
    pricing: { input: 1.25, output: 5 },
    modality: ["text", "image", "video", "audio"],
    tags: ["long-context", "multimodal", "google"],
    createdAt: "2024-02-15",
    stats: { throughput: 112, latency: 380, uptime: "99.8%" },
  },
  {
    id: "meta-llama/llama-3.1-405b-instruct",
    name: "Llama 3.1 405B Instruct",
    provider: "Meta",
    providerIcon: "∞",
    description: "The largest open model, competitive with top closed models. Best for synthetic data and distillation.",
    contextLength: 128000,
    pricing: { input: 3, output: 3 },
    modality: ["text"],
    tags: ["open-source", "flagship", "405b"],
    createdAt: "2024-07-23",
    stats: { throughput: 45, latency: 890, uptime: "99.7%" },
  },
  {
    id: "deepseek/deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    providerIcon: "⬢",
    description: "Mixture-of-Experts model with 671B parameters, 37B active. Exceptional coding and math performance.",
    contextLength: 128000,
    pricing: { input: 0.27, output: 1.1 },
    modality: ["text"],
    tags: ["coding", "moe", "cheap"],
    createdAt: "2024-12-26",
    stats: { throughput: 156, latency: 310, uptime: "99.6%" },
  },
  {
    id: "openai/o1-preview",
    name: "o1-preview",
    provider: "OpenAI",
    providerIcon: "◐",
    description: "Reasoning model designed to think before answering. Excels at complex math, science, and coding.",
    contextLength: 128000,
    pricing: { input: 15, output: 60 },
    modality: ["text"],
    tags: ["reasoning", "o1", "preview"],
    createdAt: "2024-09-12",
    stats: { throughput: 22, latency: 2200, uptime: "99.5%" },
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    providerIcon: "◇",
    description: "Fastest and most compact model for near-instant responsiveness. Handles text and vision.",
    contextLength: 200000,
    pricing: { input: 0.25, output: 1.25 },
    modality: ["text", "image"],
    tags: ["fast", "cheap", "vision"],
    createdAt: "2024-03-13",
    stats: { throughput: 210, latency: 180, uptime: "99.99%" },
  },
  {
    id: "qwen/qwen-2.5-72b-instruct",
    name: "Qwen 2.5 72B Instruct",
    provider: "Qwen",
    providerIcon: "⬣",
    description: "Alibaba's powerful instruction model with strong multilingual and coding abilities.",
    contextLength: 128000,
    pricing: { input: 0.35, output: 0.4 },
    modality: ["text"],
    tags: ["open-source", "multilingual", "coding"],
    createdAt: "2024-09-19",
    stats: { throughput: 88, latency: 450, uptime: "99.8%" },
  },
  {
    id: "mistral/mistral-large-2407",
    name: "Mistral Large 2",
    provider: "Mistral",
    providerIcon: "◈",
    description: "Top-tier reasoning with 123B params, multilingual, 128K context, function calling and JSON mode.",
    contextLength: 128000,
    pricing: { input: 2, output: 6 },
    modality: ["text"],
    tags: ["flagship", "function-calling", "european"],
    createdAt: "2024-07-24",
    stats: { throughput: 67, latency: 520, uptime: "99.7%" },
  },
  {
    id: "google/gemma-2-27b-it",
    name: "Gemma 2 27B",
    provider: "Google",
    providerIcon: "◎",
    description: "Lightweight open model built from Gemini research. Great for efficient deployment.",
    contextLength: 8192,
    pricing: { input: 0.1, output: 0.1 },
    modality: ["text"],
    tags: ["open-source", "efficient", "small"],
    createdAt: "2024-06-27",
    stats: { throughput: 180, latency: 220, uptime: "99.9%" },
  },
];

export const providers = ["All", "OpenAI", "Anthropic", "Google", "Meta", "DeepSeek", "Qwen", "Mistral"];
