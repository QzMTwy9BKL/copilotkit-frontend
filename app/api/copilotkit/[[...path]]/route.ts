import { NextRequest, NextResponse } from "next/server";

const BACKEND = "http://8.219.101.225:8000/v1/chat/completions";
const MODEL = "deepseek-v4-flash";

let msgCounter = 0;

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ errors: [{ message: "Invalid JSON" }] }); }

  const query: string = body.query || "";

  // --- Apollo Introspection ---
  if (query.includes("__schema") || query.includes("__type")) {
    return NextResponse.json({
      data: {
        __schema: {
          queryType: { name: "Query" },
          mutationType: { name: "Mutation" },
          types: [],
          directives: [],
        },
      },
    });
  }

  // --- Runtime info query ---
  if (query.includes("runtime")) {
    return NextResponse.json({
      data: { runtime: { url: BACKEND } },
    });
  }

  // --- generateCopilotResponse mutation ---
  if (query.includes("generateCopilotResponse")) {
    const data = body.variables?.data || body.variables || {};
    const messages = data.messages || data.frontend?.messages || [];
    const threadId = data.threadId || `thread-${Date.now()}`;

    // Convert CopilotKit messages to OpenAI format
    const openaiMessages = messages.map((m: any) => ({
      role: m.role || "user",
      content: m.content || "",
    }));

    // Non-streaming call to backend
    let backendText = "";
    let backendError = "";
    try {
      const backendRes = await fetch(BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, messages: openaiMessages, stream: false }),
        signal: AbortSignal.timeout(30000),
      });
      if (!backendRes.ok) {
        backendError = `Backend returned ${backendRes.status}`;
      } else {
        const json = await backendRes.json();
        backendText = json.choices?.[0]?.message?.content || "";
      }
    } catch (e: any) {
      backendError = e.message || String(e);
    }

    if (backendError) {
      return NextResponse.json({
        data: {
          generateCopilotResponse: {
            threadId,
            status: { __typename: "FailedResponseStatus", reason: "UNKNOWN_ERROR", details: backendError },
            messages: [],
            extensions: {},
            metaEvents: [],
          },
        },
      });
    }

    msgCounter++;
    const msgId = `msg-${msgCounter}`;

    return NextResponse.json({
      data: {
        generateCopilotResponse: {
          threadId,
          runId: `run-${Date.now()}`,
          status: { __typename: "SuccessResponseStatus" },
          messages: [
            {
              __typename: "TextMessageOutput",
              id: msgId,
              createdAt: new Date().toISOString(),
              status: { __typename: "MessageSuccessStatus" },
              role: "assistant",
              content: [backendText],
              parentMessageId: null,
            },
          ],
          extensions: {},
          metaEvents: [],
        },
      },
    });
  }

  // Fallback
  return NextResponse.json({ data: {} });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}