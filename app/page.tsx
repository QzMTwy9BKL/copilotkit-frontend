"use client";

import { useState } from "react";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useCopilotChat } from "@copilotkit/react-core";
import { TextMessage, MessageRole } from "@copilotkit/runtime-client-gql";
import "@copilotkit/react-ui/styles.css";

function QuickActionCard({ icon, label, description, onClick }: {
  icon: string;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50 text-left hover:border-zinc-600 hover:bg-zinc-800/50 transition-all cursor-pointer group w-full"
    >
      <p className="text-xs text-zinc-500 mb-2 group-hover:text-zinc-400 transition-colors">{icon} {label}</p>
      <p className="text-sm text-zinc-300 group-hover:text-zinc-200 transition-colors">{description}</p>
    </button>
  );
}

export default function Home() {
  const { appendMessage, isLoading } = useCopilotChat();
  const [agentStatus, setAgentStatus] = useState<"idle" | "running">("idle");

  const sendMsg = (msg: string) => {
    appendMessage(
      new TextMessage({
        content: msg,
        role: MessageRole.User,
      })
    );
  };

  const quickActions = [
    {
      icon: "💬",
      label: "Chat",
      description: "Start a general conversation with the AI assistant",
      action: () => sendMsg("你好，请介绍一下你自己，你能做什么？"),
    },
    {
      icon: "🔍",
      label: "Knowledge Search",
      description: "Search the knowledge base for specific information",
      action: () => sendMsg("请在知识库中搜索关于AI Agent的资料"),
    },
    {
      icon: "🤖",
      label: "Agent Task",
      description: "Run an agent task: write code, analyze data, build reports",
      action: () => {
        setAgentStatus("running");
        sendMsg("请帮我写一个Python脚本，计算斐波那契数列的前20项");
        setTimeout(() => setAgentStatus("idle"), 5000);
      },
    },
    {
      icon: "📁",
      label: "Upload Knowledge",
      description: "Upload .md files or index a folder to build your knowledge base",
      action: () => sendMsg("请帮我把Obsidian笔记导入到知识库"),
    },
  ];

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 bg-zinc-900/50 backdrop-blur-sm shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">AI Company OS</h1>
            <p className="text-sm text-zinc-500 mt-0.5">LangGraph Agent + LightRAG Knowledge Base</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${agentStatus === "running" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}></span>
              {agentStatus === "running" ? "Agent Running..." : "Agent Ready"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Knowledge Ready
            </span>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 overflow-auto">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => {
              setAgentStatus("running");
              sendMsg("请帮我写一个Python脚本，计算斐波那契数列的前20项");
              setTimeout(() => setAgentStatus("idle"), 5000);
            }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 text-left hover:border-zinc-600 hover:bg-zinc-800/50 transition-all cursor-pointer group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🧠</div>
            <h3 className="font-medium text-sm text-zinc-300">LangGraph Agent</h3>
            <p className="text-xs text-zinc-500 mt-1">
              6-node team: CEO → Router → Research/Architect → Engineer → Reviewer
            </p>
            <p className="text-xs text-emerald-600 mt-2 group-hover:text-emerald-500 transition-colors">Click to run a task →</p>
          </button>

          <button
            onClick={() => sendMsg("请在知识库中搜索关于AI Agent的资料")}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 text-left hover:border-zinc-600 hover:bg-zinc-800/50 transition-all cursor-pointer group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📚</div>
            <h3 className="font-medium text-sm text-zinc-300">LightRAG Knowledge</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Graph-based RAG with hybrid search (local + global)
            </p>
            <p className="text-xs text-emerald-600 mt-2 group-hover:text-emerald-500 transition-colors">Click to search knowledge →</p>
          </button>

          <button
            onClick={() => sendMsg("你好，请介绍一下你自己，你能做什么？")}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 text-left hover:border-zinc-600 hover:bg-zinc-800/50 transition-all cursor-pointer group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
            <h3 className="font-medium text-sm text-zinc-300">Chat</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Start a conversation with the AI assistant
            </p>
            <p className="text-xs text-emerald-600 mt-2 group-hover:text-emerald-500 transition-colors">Click to start chatting →</p>
          </button>
        </div>

        {/* Quick Start */}
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
          <h2 className="text-sm font-medium text-zinc-400 mb-4">Quick Actions — Click any card to start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((qa, i) => (
              <QuickActionCard key={i} {...qa} />
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-8 bg-zinc-900/30 border border-zinc-800/50 rounded-xl px-5 py-3">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Server: {process.env.NEXT_PUBLIC_OPENAI_BASE_URL || "8.219.101.225:8000"} | Memory: ~840Mi/3.4Gi</span>
            <span className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                DeepSeek v4 Flash
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ollama nomic-embed-text
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* CopilotKit Popup (floating chat button, bottom-right) */}
      <CopilotPopup
        labels={{
          title: "AI Company OS",
          initial: "👋 Hi! I'm your AI assistant. I can help you with:\n\n- 💬 General chat\n- 🔍 Knowledge base search\n- 🤖 Agent task execution\n\nTry clicking a card on the left, or type a message below!",
        }}
        instructions="You are an AI assistant for AI Company OS. You have access to: 1) query_knowledge - search the knowledge base, 2) run_agent - execute complex tasks with the AI agent team. Use these tools when appropriate. Respond in Chinese by default."
      />
    </main>
  );
}