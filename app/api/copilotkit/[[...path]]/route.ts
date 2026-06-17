import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "not-needed",
  baseURL: "http://8.219.101.225:8000/v1",
});

// Force @ai-sdk/openai to use /v1/chat/completions (strict mode)
// instead of trying /v1/responses which returns empty content from DeepSeek
(openai as any)._options = { compatibility: "strict" };

const serviceAdapter = new OpenAIAdapter({
  openai,
  model: "deepseek-v4-flash",
});

const runtime = new CopilotRuntime();

const endpoint = copilotRuntimeNextJSAppRouterEndpoint({
  runtime,
  serviceAdapter,
  endpoint: "/api/copilotkit",
});

export const POST = (req: NextRequest) => endpoint.handleRequest(req);