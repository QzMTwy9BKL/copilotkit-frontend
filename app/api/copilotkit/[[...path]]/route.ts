import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://8.219.101.225:8000";

export async function POST(req: NextRequest) {
  let body = null;
  try { body = await req.json(); } catch { body = "(not JSON)"; }

  let backendOk = false;
  let backendResponse = "";
  try {
    const res = await fetch(BACKEND_URL + "/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [{ role: "user", content: "hello" }],
        stream: false,
        max_tokens: 10,
      }),
      signal: AbortSignal.timeout(8000),
    });
    backendOk = res.ok;
    backendResponse = await res.text();
  } catch (e: any) {
    backendResponse = "ERROR: " + (e.message || String(e));
  }

  const diag = {
    message: "CopilotKit diagnostic route",
    received_body: body,
    received_body_keys: body && typeof body === "object" ? Object.keys(body) : null,
    backend: {
      url: BACKEND_URL + "/v1/chat/completions",
      ok: backendOk,
      response: backendResponse.substring(0, 2000),
    },
  };

  console.log("[DIAG]", JSON.stringify(diag));
  return NextResponse.json(diag);
}

export async function GET() {
  return NextResponse.json({ status: "ok", backend: BACKEND_URL });
}