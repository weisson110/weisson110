export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export type ChatParams = {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
};

export type EmbeddingParams = {
  model: string;
  input: string;
};

export interface Provider {
  name: string;
  chatCompletions(params: ChatParams): Promise<any>;
  chatCompletionsStream?(params: ChatParams): Promise<ReadableStream>;
  embeddings?(params: EmbeddingParams): Promise<any>;
}
