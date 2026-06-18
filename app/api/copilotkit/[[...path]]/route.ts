import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = new OpenAI({
  apiKey: "not-needed",
  baseURL: "http://8.219.101.225:8000/v1",
});

const serviceAdapter = new OpenAIAdapter({
  openai,
  model: "deepseek-v4-flash",
});

// Monkey-patch: @ai-sdk/openai v5 defaults to /v1/responses (empty on DeepSeek)
// Force getLanguageModel() to return provider.chat() which hits /v1/chat/completions
(serviceAdapter as any).getLanguageModel = () => {
  const provider = createOpenAI({
    baseURL: openai.baseURL,
    apiKey: openai.apiKey,
  });
  return provider.chat("deepseek-v4-flash");
};

const runtime = new CopilotRuntime();

const endpoint = copilotRuntimeNextJSAppRouterEndpoint({
  runtime,
  serviceAdapter,
  endpoint: "/api/copilotkit",
});

export const POST = (req: NextRequest) => endpoint.handleRequest(req);