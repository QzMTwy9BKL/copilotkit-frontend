import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://8.219.101.225:8000/v1/chat/completions";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const backendRes = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const err = await backendRes.text();
      return NextResponse.json({ error: err }, { status: backendRes.status });
    }

    // Check if streaming response
    const contentType = backendRes.headers.get("content-type") || "";
    if (contentType.includes("text/event-stream")) {
      return new Response(backendRes.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Non-streaming response
    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Backend unreachable" },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}