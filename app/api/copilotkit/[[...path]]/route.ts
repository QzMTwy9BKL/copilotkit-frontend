import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

// Backend is an OpenAI-compatible server (FastAPI) proxying DeepSeek.
// Base URL must point at the `/v1` root; the OpenAI SDK appends `/chat/completions`.
const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_OPENAI_BASE_URL || "http://8.219.101.225:8000/v1";
const MODEL = process.env.NEXT_PUBLIC_MODEL || "deepseek-v4-flash";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "sk-aios-internal",
  baseURL: BACKEND_BASE_URL,
});

const serviceAdapter = new OpenAIAdapter({ openai, model: MODEL });
const copilotRuntime = new CopilotRuntime();

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: copilotRuntime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
  return handleRequest(req);
};

export const GET = async () =>
  new Response(JSON.stringify({ status: "ok" }), {
    headers: { "Content-Type": "application/json" },
  });
