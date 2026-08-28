"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  palStage?: string;
  agentType?: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatViewProps {
  projectId: string | null;
  onOutputReady: (output: Record<string, unknown>) => void;
}

type AgentType = "orchestrator" | "analyst" | "copywriter" | "researcher" | "architect";

// Session storage key
const SESSION_STORAGE_KEY = "prospect-pal-session";

interface StoredSession {
  sessionId: string;
  userId: string;
  createdAt: string;
}

const AGENT_OPTIONS: { value: AgentType; label: string; icon: string; description: string }[] = [
  { value: "architect", label: "Architect", icon: "🏗️", description: "Design systems & workflows" },
  { value: "orchestrator", label: "Orchestrator", icon: "🎼", description: "Multi-step automation" },
  { value: "analyst", label: "Analyst", icon: "📊", description: "Debug & diagnose issues" },
  { value: "copywriter", label: "Copywriter", icon: "✍️", description: "Email & content generation" },
  { value: "researcher", label: "Researcher", icon: "🔬", description: "Data research & analysis" },
];

const SUGGESTIONS = [
  "Design a lead generation workflow architecture",
  "Research top 10 B2B SaaS companies in marketing automation",
  "Write 3 cold email variations for VP of Sales",
  "Analyze why my Apollo node keeps failing with 429 errors",
  "Build my workflow for B2B fintech prospects",
];

const PAL_STAGES = [
  { id: "extract",    label: "Extracting Intent",   icon: "⟡" },
  { id: "categorize", label: "Categorizing ICP",     icon: "◈" },
  { id: "enhance",    label: "Enhancing Context",    icon: "✦" },
  { id: "instruct",   label: "Writing Instructions", icon: "≋" },
  { id: "compile",    label: "Compiling Workflow",   icon: "⊞" },
];

// Helper to get or create session
function getOrCreateSession(): StoredSession {
  if (typeof window === "undefined") {
    return {
      sessionId: uuidv4(),
      userId: "demo-user",
      createdAt: new Date().toISOString(),
    };
  }

  const stored = localStorage.getItem(SESSION_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid stored session, create new
    }
  }

  const newSession: StoredSession = {
    sessionId: `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    userId: "demo-user",
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
  return newSession;
}

export default function ChatView({ projectId, onOutputReady }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm your **Agent Swarm** — powered by ROSTR framework with intelligent routing.\n\nI can help you with:\n• **Architecture & Design** — System planning\n• **Automation** — Multi-step workflows\n• **Analysis** — Debug & diagnose\n• **Content** — Email & copywriting\n• **Research** — Data & competitive intel\n\nSelect an agent type above or just ask naturally, and I'll route to the right specialist.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [session, setSession] = useState<StoredSession>(() => getOrCreateSession());
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("architect");
  const [routingMode, setRoutingMode] = useState<"auto" | "agent-only">("auto");
  const [useStreamingEndpoint, setUseStreamingEndpoint] = useState(true);
  const [tokenCount, setTokenCount] = useState<{ input: number; output: number } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create new session
  const createNewSession = useCallback(() => {
    const newSession: StoredSession = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      userId: "demo-user",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
    setSession(newSession);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Hi! I'm your **Agent Swarm** — powered by ROSTR framework with intelligent routing.\n\nI can help you with:\n• **Architecture & Design** — System planning\n• **Automation** — Multi-step workflows\n• **Analysis** — Debug & diagnose\n• **Content** — Email & copywriting\n• **Research** — Data & competitive intel\n\nSelect an agent type above or just ask naturally, and I'll route to the right specialist.`,
        timestamp: new Date(),
      },
    ]);
    setTokenCount(null);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  /**
   * Send message using SSE streaming endpoint
   */
  const sendMessageStreaming = useCallback(async (text: string, assistantMsgId: string) => {
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/swarm/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_input: text,
          session_id: session.sessionId,
          agent_type_hint: selectedAgent,
          user_id: session.userId,
          project_id: projectId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";
      let currentPhase = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.slice(6));

              switch (event.type) {
                case "phase":
                  currentPhase = event.stage;
                  if (event.stage === "executing") {
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantMsgId
                          ? { ...m, isStreaming: true }
                          : m
                      )
                    );
                  }
                  break;

                case "token":
                  fullText += event.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, content: fullText, isStreaming: true }
                        : m
                    )
                  );
                  break;

                case "result":
                  setTokenCount({
                    input: event.usage?.input_tokens || 0,
                    output: event.usage?.output_tokens || 0,
                  });
                  // Add routing info
                  const routingInfo = `\n\n*Agent: ${event.agent_type || selectedAgent} | ${event.duration_ms || 0}ms*`;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, content: fullText + routingInfo, isStreaming: false }
                        : m
                    )
                  );
                  break;

                case "error":
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, content: `Error: ${event.message}`, isStreaming: false }
                        : m
                    )
                  );
                  break;
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      // Check if AI suggests workflow generation
      if (/ready to generate|build your workflow|shall i compile|generate now/i.test(fullText)) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, palStage: "ready" }
              : m
          )
        );
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: `Error: ${err instanceof Error ? err.message : "Connection failed."}`, isStreaming: false }
            : m
        )
      );
    }
  }, [session, selectedAgent, projectId]);

  /**
   * Send message using polling endpoint (fallback)
   */
  const sendMessagePolling = useCallback(async (text: string, assistantMsgId: string) => {
    try {
      const resp = await fetch("/api/swarm/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_input: text,
          project_id: projectId,
          user_id: session.userId,
          session_id: session.sessionId,
          routing_preference: routingMode,
          agent_type_hint: selectedAgent,
          use_streaming: true, // Request streaming info in response
        }),
      });

      if (!resp.ok) throw new Error(await resp.text());

      const data = await resp.json();

      let fullText = "";
      if (data.result?.result?.output) {
        fullText = data.result.result.output;
      } else if (data.result?.response) {
        fullText = JSON.stringify(data.result.response, null, 2);
      } else {
        fullText = "Task submitted. Check status for results.";
      }

      const routingInfo = `\n\n*Routed to: ${data.routing?.destination || "agent-swarm"} (${data.phase || "N/A"} phase, priority: ${data.priority?.score?.toFixed(1) || "N/A"})*`;
      fullText = fullText + routingInfo;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, content: fullText } : m
        )
      );

      if (/ready to generate|build your workflow|shall i compile|generate now/i.test(fullText)) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, palStage: "ready" }
              : m
          )
        );
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: `Error: ${err instanceof Error ? err.message : "Connection failed."}` }
            : m
        )
      );
    }
  }, [projectId, session, routingMode, selectedAgent]);

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

    // Check if user is requesting workflow generation
    const isGenRequest = /build it|generate|create workflow|compile|make my workflow/i.test(text);

    if (isGenRequest) {
      await handleGenerate(text, userMsg);
      return;
    }

    // Create assistant message placeholder
    const assistantMsgId = uuidv4();
    setMessages((prev) => [...prev, {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      agentType: selectedAgent,
      timestamp: new Date(),
      isStreaming: true,
    }]);

    try {
      if (useStreamingEndpoint) {
        await sendMessageStreaming(text, assistantMsgId);
      } else {
        await sendMessagePolling(text, assistantMsgId);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [messages, isStreaming, selectedAgent, useStreamingEndpoint, sendMessageStreaming, sendMessagePolling]);

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
      {/* Agent Selection Bar */}
      <div className="bg-white border-b border-surface-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Agent Type:</span>
            <div className="flex gap-2">
              {AGENT_OPTIONS.map((agent) => (
                <button
                  key={agent.value}
                  onClick={() => setSelectedAgent(agent.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedAgent === agent.value
                      ? "bg-brand-700 text-white shadow-md"
                      : "bg-surface-100 text-ink-secondary hover:bg-surface-200"
                  }`}
                  title={agent.description}
                >
                  <span>{agent.icon}</span>
                  {agent.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Streaming toggle */}
            <button
              onClick={() => setUseStreamingEndpoint(!useStreamingEndpoint)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                useStreamingEndpoint
                  ? "bg-violet-50 text-violet-700 border border-violet-200"
                  : "bg-surface-100 text-ink-muted border border-surface-200"
              }`}
              title={useStreamingEndpoint ? "Real-time streaming enabled" : "Using polling mode"}
            >
              {useStreamingEndpoint ? "~ Stream" : "~ Poll"}
            </button>
            {/* Routing toggle */}
            <button
              onClick={() => setRoutingMode(routingMode === "auto" ? "agent-only" : "auto")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                routingMode === "auto"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-brand-50 text-brand-700 border border-brand-200"
              }`}
            >
              {routingMode === "auto" ? "Auto" : "Agent-Only"}
            </button>
            {/* New session button */}
            <button
              onClick={createNewSession}
              className="px-2.5 py-1 rounded text-xs font-medium bg-surface-100 text-ink-muted border border-surface-200 hover:bg-surface-200 transition-all"
              title="Start new session"
            >
              + New
            </button>
          </div>
        </div>
        {/* Token count display */}
        {tokenCount && (
          <div className="mt-2 flex items-center gap-3 text-xs text-ink-muted">
            <span>Tokens: {tokenCount.input} in / {tokenCount.output} out</span>
            <span className="text-ink-faint">Session: {session.sessionId.slice(0, 20)}...</span>
          </div>
        )}
      </div>

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
              <div className="w-7 h-7 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 mr-2.5">
                {msg.agentType ? AGENT_OPTIONS.find(a => a.value === msg.agentType)?.icon || "A" : "A"}
              </div>
            )}
            <div className={`${msg.role === "user" ? "bubble-user" : "bubble-ai"} relative`}>
              <div className="whitespace-pre-wrap">
                <span dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
                {msg.isStreaming && (
                  <span className="inline-block w-2 h-4 bg-brand-600 ml-0.5 animate-pulse" />
                )}
              </div>

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

        {/* Streaming indicator - only show when message is empty */}
        {isStreaming && !isGenerating && messages[messages.length - 1]?.role === "assistant" && !messages[messages.length - 1]?.content && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 mr-2.5">
              {AGENT_OPTIONS.find(a => a.value === selectedAgent)?.icon || "A"}
            </div>
            <div className="bubble-ai flex items-center gap-1.5">
              <span className="text-xs text-ink-muted mr-1">{useStreamingEndpoint ? "Streaming" : "Processing"}</span>
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
          Powered by Agent Swarm (ROSTR) · Claude via AWS Bedrock · {selectedAgent} agent · {useStreamingEndpoint ? "SSE" : "Polling"}
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
