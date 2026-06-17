import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://8.219.101.225:8000/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [{ role: "user", content: "hi" }],
        stream: false,
      }),
    });
    const data = await res.json();
    return NextResponse.json({ status: "ok", data });
  } catch (e: any) {
    return NextResponse.json({ status: "error", error: String(e?.message || e) }, { status: 500 });
  }
}
