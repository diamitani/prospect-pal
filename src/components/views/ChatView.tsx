"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  palStage?: string;
  timestamp: Date;
}

interface ChatViewProps {
  projectId: string | null;
  onOutputReady: (output: Record<string, unknown>) => void;
}

const SUGGESTIONS = [
  "I sell an AI sales tool to VP Sales at mid-market SaaS companies",
  "I'm an agency looking to generate leads for e-commerce brands",
  "What tools do I need for my outbound stack?",
  "Show me the 6-step automation pipeline",
  "Build my workflow for B2B fintech prospects",
];

const PAL_STAGES = [
  { id: "extract",    label: "Extracting Intent",   icon: "⟡" },
  { id: "categorize", label: "Categorizing ICP",     icon: "◈" },
  { id: "enhance",    label: "Enhancing Context",    icon: "✦" },
  { id: "instruct",   label: "Writing Instructions", icon: "≋" },
  { id: "compile",    label: "Compiling Workflow",   icon: "⊞" },
];

export default function ChatView({ projectId, onOutputReady }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm your **PAL Agent** — the Prompt Abstraction Layer that turns your description into a complete outbound automation engine.\n\nTell me:\n1. What do you sell?\n2. Who is your ideal customer?\n\nI'll handle the rest — extracting your ICP, categorizing your buyer, writing the AI agent prompt, and compiling your n8n workflow. All in one conversation.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [sessionId] = useState(() => uuidv4());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = {
      id: uuidv4(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    // Build message history for API
    const history = [...messages, userMsg]
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    // Add welcome assistant message for context
    const apiMessages = [
      ...history.slice(-10), // Last 10 messages for context window
    ];

    // Check if user is requesting workflow generation
    const isGenRequest = /build it|generate|create workflow|compile|make my workflow/i.test(text);

    if (isGenRequest) {
      await handleGenerate(text, userMsg);
      return;
    }

    // Stream regular chat response
    const assistantMsgId = uuidv4();
    setMessages((prev) => [...prev, {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }]);

    try {
      const resp = await fetch("/api/pal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          projectId,
          sessionId,
        }),
      });

      if (!resp.ok) throw new Error(await resp.text());

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, content: fullText } : m
          )
        );
      }

      // Check if the AI response suggests generating a workflow
      if (/ready to generate|build your workflow|shall i compile|generate now/i.test(fullText)) {
        // AI is suggesting generation — add a quick action button
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: fullText, palStage: "ready" }
              : m
          )
        );
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: `Error: ${err instanceof Error ? err.message : "Connection failed. Please try again."}` }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming, projectId, sessionId]);

  const handleGenerate = async (userDescription: string, _userMsg: Message) => {
    setIsStreaming(false);
    setIsGenerating(true);

    // Show stage-by-stage progress
    const progressMsgId = uuidv4();
    setMessages((prev) => [...prev, {
      id: progressMsgId,
      role: "assistant",
      content: "🚀 **Running PAL Pipeline...**\n\nI'm processing your request through 5 AI stages:",
      palStage: "running",
      timestamp: new Date(),
    }]);

    // Animate through stages
    for (const stage of PAL_STAGES) {
      setActiveStage(stage.id);
      await new Promise((r) => setTimeout(r, 1200));
    }

    try {
      const resp = await fetch("/api/pal/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userDescription,
          projectId,
          userId: "demo-user",
        }),
      });

      const data = await resp.json() as { output?: Record<string, unknown>; error?: string; projectId?: string };

      if (!resp.ok) throw new Error(data.error || "Generation failed");

      setMessages((prev) =>
        prev.map((m) =>
          m.id === progressMsgId
            ? {
                ...m,
                content: `✅ **PAL Pipeline Complete!**\n\nYour automation engine is ready. Here's what was generated:\n\n• **n8n Workflow JSON** — Import directly into your n8n instance\n• **Skill Definition** — Claude agent configuration\n• **Deploy Guide** — Step-by-step setup instructions\n• **Build Prompts** — Customize or regenerate your workflow\n• **Email Framework** — PAS email template\n\nClick **"View Outputs"** to download your complete package.`,
                palStage: "done",
              }
            : m
        )
      );

      if (data.output) {
        onOutputReady({ ...data.output, projectId: data.projectId });
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === progressMsgId
            ? { ...m, content: `❌ Pipeline failed: ${err instanceof Error ? err.message : "Unknown error"}`, palStage: "error" }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
      setActiveStage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-50">
      {/* PAL Stage Progress (shown during generation) */}
      {isGenerating && (
        <div className="bg-white border-b border-surface-200 px-6 py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {PAL_STAGES.map((stage) => (
              <div
                key={stage.id}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeStage === stage.id
                    ? "bg-brand-50 text-brand-700 border border-brand-200"
                    : PAL_STAGES.findIndex((s) => s.id === activeStage) >
                      PAL_STAGES.findIndex((s) => s.id === stage.id)
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-surface-100 text-ink-muted"
                }`}
              >
                <span>{stage.icon}</span>
                {stage.label}
                {activeStage === stage.id && (
                  <span className="flex gap-0.5">
                    <span className="typing-dot w-1 h-1"></span>
                    <span className="typing-dot w-1 h-1"></span>
                    <span className="typing-dot w-1 h-1"></span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 mr-2.5">P</div>
            )}
            <div className={`${msg.role === "user" ? "bubble-user" : "bubble-ai"} relative`}>
              <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />

              {/* Generate button when AI signals readiness */}
              {msg.palStage === "ready" && !isGenerating && (
                <button
                  onClick={() => handleGenerate(messages.find((m) => m.role === "user")?.content || "", msg)}
                  className="mt-3 btn-brand w-full justify-center"
                >
                  ✦ Generate My Workflow Package
                </button>
              )}

              {/* Done — view outputs button */}
              {msg.palStage === "done" && (
                <button
                  onClick={() => onOutputReady({})}
                  className="mt-3 btn-brand w-full justify-center"
                >
                  View Outputs →
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Streaming indicator */}
        {isStreaming && !isGenerating && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 mr-2.5">P</div>
            <div className="bubble-ai flex items-center gap-1.5">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-6 pb-3">
          <div className="text-xs text-ink-muted mb-2 font-medium">Try asking:</div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 bg-white border border-surface-200 rounded-lg text-ink-secondary hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-6">
        <div className="bg-white border border-surface-200 rounded-2xl shadow-card focus-within:border-brand-400 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your product, target customer, or ask a question..."
            rows={2}
            disabled={isStreaming || isGenerating}
            className="w-full px-4 pt-4 pb-2 text-sm text-ink bg-transparent border-none outline-none resize-none placeholder-ink-muted"
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => sendMessage("generate workflow")}
                disabled={isGenerating}
                className="text-xs px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-lg font-semibold hover:bg-brand-100 transition-all disabled:opacity-50"
              >
                ✦ Generate Workflow
              </button>
              <button className="text-xs px-3 py-1.5 bg-surface-50 text-ink-muted border border-surface-200 rounded-lg hover:bg-surface-100 transition-all">
                Show steps
              </button>
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming || isGenerating}
              className="w-8 h-8 bg-brand-700 text-white rounded-lg flex items-center justify-center hover:bg-brand-800 transition-all disabled:opacity-40 text-sm"
            >
              →
            </button>
          </div>
        </div>
        <p className="text-xs text-ink-muted mt-2 text-center">
          Powered by Claude 3.5 Sonnet · AWS Bedrock · us-east-1
        </p>
      </div>
    </div>
  );
}

/** Very light markdown formatter for bold/bullets */
function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n• /g, "\n<span class='text-brand-600'>•</span> ")
    .replace(/\n(\d+)\. /g, "\n<span class='text-brand-600'>$1.</span> ")
    .replace(/\n/g, "<br/>");
}
