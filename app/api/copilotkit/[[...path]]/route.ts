import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const BACKEND_BASE_URL = "http://8.219.101.225:8000";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "not-needed",
  baseURL: `${BACKEND_BASE_URL}/v1`,
});

const adapter = new OpenAIAdapter({ openai, model: "deepseek-v4-flash" });

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
          const res = await fetch(`${BACKEND_BASE_URL}/api/knowledge/query`, {
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
          const res = await fetch(`${BACKEND_BASE_URL}/api/agent/run`, {
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
  serviceAdapter: adapter,
  endpoint: "/api/copilotkit",
});

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
