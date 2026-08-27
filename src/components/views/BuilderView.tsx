"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Button, Card, Badge, Icon, PipelineRail, PipelineNode } from "@/components/ds";

interface BuilderViewProps {
  onCompiled?: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const NINE_NODES: PipelineNode[] = [
  { title: "Intake & cron", subtitle: "Trigger source", icon: "Zap", stage: "trigger", binding: "n8n-nodes-base.cron" },
  { title: "Data normalizer", subtitle: "Schema transform", icon: "FileBraces", stage: "logic", binding: "n8n-nodes-base.set" },
  { title: "CRM dedupe shield", subtitle: "Deal protection", icon: "ShieldCheck", stage: "shield", binding: "n8n-nodes-base.hubspot" },
  { title: "Data tool adapter", subtitle: "Contact reveal", icon: "Search", stage: "data", binding: "n8n-nodes-base.apollo" },
  { title: "AI research & PAS", subtitle: "Email copy", icon: "Sparkles", stage: "ai", binding: "n8n-nodes-base.openai" },
  { title: "Approval switch", subtitle: "Human gate", icon: "Scale", stage: "logic", binding: "n8n-nodes-base.switch" },
  { title: "CRM contact create", subtitle: "Lead sync", icon: "Database", stage: "shield", binding: "n8n-nodes-base.hubspot" },
  { title: "Sequence enrollment", subtitle: "Outreach start", icon: "Send", stage: "sequence", binding: "n8n-nodes-base.smartlead" },
  { title: "Review alert", subtitle: "Slack notify", icon: "Bell", stage: "logic", binding: "n8n-nodes-base.slack" },
];

export default function BuilderView({ onCompiled }: BuilderViewProps) {
  const [mode, setMode] = useState<"chat" | "form">("chat");
  const [activeNode, setActiveNode] = useState(2);
  const [isCompiling, setIsCompiling] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: "I'm your GTM automation architect. Tell me who you sell to, which tools hold your data, and how leads should enter the system.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content || data.message || "I can help you configure your workflow. What tools are you using?",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onCompiled?.();
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Left: Chat/Form Pane */}
      <div
        style={{
          width: "var(--layout-pane, 440px)",
          flexShrink: 0,
          background: "var(--surface-card)",
          borderRight: "1px solid var(--border-hairline)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--border-hairline)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "var(--text-h4)", fontWeight: "var(--weight-bold)" }}>
              PAE workflow compiler
            </div>
            <div style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)" }}>
              PAL intake gate &middot; 9-node reference pattern
            </div>
          </div>
          <div style={{ display: "flex", background: "var(--surface-sunken)", padding: 3, borderRadius: "var(--radius-sm)" }}>
            {(["chat", "form"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: "4px 11px",
                  fontSize: "var(--text-micro)",
                  fontWeight: "var(--weight-semibold)",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "var(--radius-xs)",
                  fontFamily: "inherit",
                  background: mode === m ? "var(--surface-card)" : "transparent",
                  color: mode === m ? "var(--text-brand)" : "var(--text-muted)",
                  boxShadow: mode === m ? "var(--shadow-hairline)" : "none",
                }}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              style={{
                padding: "12px 16px",
                borderRadius: "var(--radius-xl)",
                maxWidth: msg.role === "user" ? "80%" : "85%",
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background: msg.role === "user" ? "var(--action-primary)" : "var(--surface-card)",
                color: msg.role === "user" ? "var(--text-inverse)" : "var(--text-primary)",
                border: msg.role === "assistant" ? "1px solid var(--border-hairline)" : "none",
                boxShadow: msg.role === "assistant" ? "var(--shadow-card)" : "none",
                fontSize: "var(--text-body-sm)",
                lineHeight: "var(--leading-relaxed)",
                borderBottomRightRadius: msg.role === "user" ? "var(--radius-xs)" : undefined,
                borderBottomLeftRadius: msg.role === "assistant" ? "var(--radius-xs)" : undefined,
              }}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--ink-400)",
                      animation: `bounce-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
              <span>Resolving tool bindings</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={onSubmit} style={{ padding: "12px 16px", borderTop: "1px solid var(--border-hairline)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. VP Sales at Series A SaaS, HubSpot + Apollo..."
              style={{
                flex: 1,
                padding: "10px 14px",
                fontSize: "var(--text-body-sm)",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border-hairline)",
                fontFamily: "inherit",
                outline: "none",
              }}
            />
            <Button type="submit" variant="primary" icon="ArrowUp" disabled={isLoading || !input.trim()}>
              Send
            </Button>
          </div>
          <Button variant="accent" fullWidth icon="Zap" onClick={handleCompile} disabled={isCompiling} type="button">
            {isCompiling ? "Compiling engine..." : "Compile GTM engine"}
          </Button>
        </form>
      </div>

      {/* Right: Canvas */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--surface-deep)", minWidth: 0 }}>
        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid var(--border-deep)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-caption)", color: "var(--ink-300)" }}>
              prospect-pal-engine.json
            </span>
            <Badge tone="deep" mono>9-node graph connected</Badge>
          </div>
          <Badge tone="deep" mono shape="rounded">trigger: SCHEDULE</Badge>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "22px 20px" }}>
          <PipelineRail nodes={NINE_NODES} activeIndex={activeNode} onSelect={setActiveNode} onDeep />

          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
            <div
              style={{
                background: "var(--surface-deep-raised)",
                border: "1px solid var(--border-deep)",
                borderRadius: "var(--radius-xl)",
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  fontSize: "var(--text-eyebrow)",
                  fontWeight: "var(--weight-semibold)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-eyebrow)",
                  color: "var(--champagne-200)",
                  marginBottom: 6,
                }}
              >
                Node {String(activeNode + 1).padStart(2, "0")} specification
              </div>
              <div style={{ fontSize: "var(--text-h3)", fontWeight: "var(--weight-semibold)", color: "var(--paper-0)", marginBottom: 6 }}>
                {NINE_NODES[activeNode].title}
              </div>
              <p style={{ margin: 0, fontSize: "var(--text-body-sm)", color: "var(--ink-300)", lineHeight: "var(--leading-relaxed)" }}>
                {NINE_NODES[activeNode].subtitle}. Bound to{" "}
                <span style={{ fontFamily: "var(--font-data)", color: "var(--ink-100)" }}>
                  {NINE_NODES[activeNode].binding}
                </span>
                . Secrets stay as ENV references; nothing is written to Prospect PAL.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border-deep)",
                  borderRadius: "var(--radius-lg)",
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: "var(--text-micro)",
                    color: "var(--ink-400)",
                    textTransform: "uppercase",
                    letterSpacing: "var(--tracking-eyebrow)",
                    fontWeight: "var(--weight-semibold)",
                    marginBottom: 8,
                  }}
                >
                  Requires connection
                </div>
                {["ENV:APOLLO_API_KEY", "ENV:SMARTLEAD_API_KEY"].map((k) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      fontFamily: "var(--font-data)",
                      fontSize: "var(--text-micro)",
                      color: "var(--ink-200)",
                      marginBottom: 5,
                    }}
                  >
                    <Icon name="KeyRound" size={12} color="var(--champagne-300)" />
                    {k}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
