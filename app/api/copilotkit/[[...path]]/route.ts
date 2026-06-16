import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const OPENAI_BASE_URL = process.env.NEXT_PUBLIC_OPENAI_BASE_URL || "http://8.219.101.225:8000/v1";

// Force stream: false on all requests because the backend
// /v1/chat/completions returns empty content in streaming mode.
const openai = new OpenAI({
  baseURL: OPENAI_BASE_URL,
  apiKey: "not-needed",
  fetch: async (url: any, init: any) => {
    if (init?.body && typeof init.body === "string") {
      try {
        const body = JSON.parse(init.body);
        if (body.stream !== false) {
          body.stream = false;
          init = { ...init, body: JSON.stringify(body) };
        }
      } catch { /* ignore parse errors */ }
    }
    return fetch(url, init);
  },
} as any);

const serviceAdapter = new OpenAIAdapter({
  openai,
  model: "deepseek-v4-flash",
});

// Base URL for the universal backend proxy (same-origin, server-to-server)
const PROXY_ORIGIN = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const runtime = new CopilotRuntime({
  actions: [
    {
      name: "query_knowledge",
      description: "Search the knowledge base for relevant information. Use this when the user asks about any stored documents or knowledge.",
      parameters: [
        { name: "query", type: "string", description: "The search query", required: true },
      ],
      handler: async ({ query }: { query: string }) => {
        try {
          const res = await fetch(`${PROXY_ORIGIN}/api/backend/api/knowledge/query`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, mode: "hybrid" }),
          });
          const data = await res.json();
          return data.result || "No relevant information found in knowledge base.";
        } catch (e) {
          return `Knowledge search error: ${e}`;
        }
      },
    },
    {
      name: "run_agent",
      description: "Execute a complex task using the AI agent team. The team includes CEO (planner), Researcher, Architect, Engineer, and Reviewer. Use this for multi-step tasks like building software, writing reports, or designing systems.",
      parameters: [
        { name: "goal", type: "string", description: "The task goal for the agent team", required: true },
      ],
      handler: async ({ goal }: { goal: string }) => {
        try {
          const res = await fetch(`${PROXY_ORIGIN}/api/backend/api/agent/run`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ goal, max_retries: 2 }),
          });
          const data = await res.json();
          if (data.status === "completed") {
            const result = data.result;
            const summary = result.ceo_plan
              ? `CEO Plan:\n${result.ceo_plan}\n\nFinal Output:\n${result.code_output || result.review_result || "Task completed."}`
              : JSON.stringify(result);
            return summary;
          }
          return `Agent error: ${data.error}`;
        } catch (e) {
          return `Agent error: ${e}`;
        }
      },
    },
  ],
});

const endpoint = copilotRuntimeNextJSAppRouterEndpoint({
  runtime,
  serviceAdapter,
  endpoint: "/api/copilotkit",
});

// Handle all HTTP methods for all subpaths (threads, runs, etc.)
export async function GET(req: NextRequest) {
  return endpoint.handleRequest(req);
}

export async function POST(req: NextRequest) {
  return endpoint.handleRequest(req);
}

export async function PUT(req: NextRequest) {
  return endpoint.handleRequest(req);
}

export async function DELETE(req: NextRequest) {
  return endpoint.handleRequest(req);
}

export async function PATCH(req: NextRequest) {
  return endpoint.handleRequest(req);
}
