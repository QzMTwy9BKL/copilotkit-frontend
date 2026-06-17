"use client";
import { useState, useEffect } from "react";
import { CopilotKit } from "@copilotkit/react-core";

const PASSWORD = "admin123";
const STORAGE_KEY = "aios_auth";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved === "1") setAuthenticated(true);
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <form onSubmit={handleSubmit} className="w-full max-w-sm px-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">AI Company OS</h1>
            <p className="text-sm text-zinc-500">Enter password to continue</p>
          </div>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          {error && (
            <p className="text-red-400 text-xs mt-2 text-center">Incorrect password</p>
          )}
          <button
            type="submit"
            className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <CopilotKit runtimeUrl="/api/copilotkit?token=aios_internal_2024">
      {children}
    </CopilotKit>
  );
}
