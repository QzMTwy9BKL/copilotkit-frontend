import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const BACKEND_BASE_URL = "http://8.219.101.225:8000";

const openai = new OpenAI({
  apiKey: "not-needed",
  baseURL: `${BACKEND_BASE_URL}/v1`,
});

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

export async function GET(req: NextRequest) {
  return endpoint.handleRequest(req);
}

export async function POST(req: NextRequest) {
  return endpoint.handleRequest(req);
}