import { copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import { OpenAIAdapter } from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: "does-not-matter" });
const adapter = new OpenAIAdapter({ openai });

const endpoint = copilotRuntimeNextJSAppRouterEndpoint({
  runtime: {
    endpoint: "/api/copilotkit",
  },
  serviceAdapter: adapter,
});

export async function POST(req: NextRequest) {
  return endpoint.handleRequest(req);
}