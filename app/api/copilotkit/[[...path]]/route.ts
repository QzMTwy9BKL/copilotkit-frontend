import { copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import { OpenAIAdapter } from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "not-needed",
  baseURL: "http://8.219.101.225:8000/v1",
});
const adapter = new OpenAIAdapter({ openai, model: "deepseek-v4-flash" });

const endpoint = copilotRuntimeNextJSAppRouterEndpoint({
  runtime: {
    endpoint: "/api/copilotkit",
  },
  serviceAdapter: adapter,
});

export async function POST(req: NextRequest) {
  return endpoint.handleRequest(req);
}