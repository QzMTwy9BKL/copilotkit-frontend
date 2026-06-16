import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  (process.env.NEXT_PUBLIC_OPENAI_BASE_URL || "http://8.219.101.225:8000/v1").replace(
    /\/v1\/?$/,
    ""
  );

async function proxy(req: NextRequest, method: string) {
  try {
    const path = req.nextUrl.pathname.replace(/^\/api\/backend/, "");
    const url = `${BACKEND_URL}${path}${req.nextUrl.search}`;

    const headers: Record<string, string> = {};
    const contentType = req.headers.get("content-type") || "application/json";
    headers["Content-Type"] = contentType;

    const body =
      method !== "GET" && method !== "HEAD" ? await req.text() : undefined;

    const backendRes = await fetch(url, {
      method,
      headers,
      body: body || undefined,
    });

    const resBody = await backendRes.text();
    const resContentType = backendRes.headers.get("content-type") || "application/json";

    return new NextResponse(resBody, {
      status: backendRes.status,
      headers: { "Content-Type": resContentType },
    });
  } catch (e: any) {
    console.error("[proxy] error:", e.message || e);
    return new NextResponse(JSON.stringify({ error: "proxy failed", detail: e.message || "unknown" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: NextRequest) {
  return proxy(req, "GET");
}

export async function POST(req: NextRequest) {
  return proxy(req, "POST");
}

export async function PUT(req: NextRequest) {
  return proxy(req, "PUT");
}

export async function DELETE(req: NextRequest) {
  return proxy(req, "DELETE");
}

export async function PATCH(req: NextRequest) {
  return proxy(req, "PATCH");
}
