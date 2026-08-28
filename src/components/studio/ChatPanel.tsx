"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Button, Icon } from "@/components/ds";
import { TEMPLATES, WorkflowTemplate, DEFAULT_STACK } from "./templates";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

interface ChatPanelProps {
  onStackChange: (stack: typeof DEFAULT_STACK) => void;
  onIcpChange: (icp: string) => void;
  onCompanyChange: (company: string) => void;
  onCompile: () => void;
  isCompiling: boolean;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hey! I'll help you build a lead automation workflow in under 2 minutes.\n\nPick a template to start, or tell me your stack (e.g., \"Apollo to HubSpot via Smartlead\").",
  suggestions: ["Apollo → HubSpot", "Clay → Salesforce", "I'll describe my own"],
};

export default function ChatPanel({
  onStackChange,
  onIcpChange,
  onCompanyChange,
  onCompile,
  isCompiling,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<"stack" | "icp" | "ready">("stack");
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role: "user" | "assistant", content: string, suggestions?: string[]) => {
    setMessages((prev) => [...prev, { id: `${role}-${Date.now()}`, role, content, suggestions }]);
  };

  const handleTemplateClick = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    onStackChange(template.stack);
    addMessage("user", `Use ${template.name}`);
    setTimeout(() => {
      addMessage(
        "assistant",
        `Great choice! I've configured the ${template.name} stack.\n\nNow, tell me about your ideal customer. Who are you selling to?\n\n(e.g., "Series A SaaS companies with 50-200 employees using GitHub")`,
        ["B2B SaaS, 50-500 employees", "E-commerce brands doing $1M+ ARR", "Let me type it out"]
      );
      setStep("icp");
    }, 300);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    setInput("");
    addMessage("user", userInput);

    if (step === "stack") {
      // Parse stack from natural language
      const lower = userInput.toLowerCase();
      let matched = TEMPLATES.find((t) =>
        lower.includes(t.stack.dataSource) || lower.includes(t.stack.crm) || lower.includes(t.stack.sequencer)
      );
      if (!matched) matched = TEMPLATES[0];

      setSelectedTemplate(matched);
      onStackChange(matched.stack);

      setTimeout(() => {
        addMessage(
          "assistant",
          `Got it! I've set up a ${matched!.stack.dataSource} → ${matched!.stack.crm} → ${matched!.stack.sequencer} pipeline.\n\nWho's your ideal customer?`,
          ["Series A+ SaaS startups", "Mid-market e-commerce", "Enterprise tech companies"]
        );
        setStep("icp");
      }, 300);
    } else if (step === "icp") {
      onIcpChange(userInput);
      onCompanyChange(userInput); // Use same for now, can split later

      setTimeout(() => {
        addMessage(
          "assistant",
          `Perfect! Your workflow is ready to compile.\n\n**Stack:** ${selectedTemplate?.name || "Custom"}\n**ICP:** ${userInput.slice(0, 100)}${userInput.length > 100 ? "..." : ""}\n\nHit **Compile** to generate your n8n workflow, or click any node on the canvas to customize.`,
        );
        setStep("ready");
      }, 300);
    } else {
      // Ready state - handle refinements
      setTimeout(() => {
        addMessage(
          "assistant",
          "I've noted that. Click any node on the canvas to make changes, or hit **Compile** when you're ready!",
        );
      }, 300);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "I'll describe my own" || suggestion === "Let me type it out") {
      // Focus input
      return;
    }
    setInput(suggestion);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--surface-raised)" }}>
      {/* Template Quick Starts */}
      {step === "stack" && (
        <div style={{ padding: "16px", borderBottom: "1px solid var(--border-default)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Quick Start Templates
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  background: "var(--surface-default)",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "var(--border-default)",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent-primary)";
                  e.currentTarget.style.background = "var(--surface-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-default)";
                  e.currentTarget.style.background = "var(--surface-default)";
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={template.icon as any} size={16} style={{ color: "white" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{template.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{template.description}</div>
                </div>
                <Icon name="ChevronRight" size={16} style={{ color: "var(--text-muted)" }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: msg.role === "user" ? "var(--accent-primary)" : "var(--surface-default)",
                color: msg.role === "user" ? "white" : "var(--text-primary)",
                fontSize: 14,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
            {msg.suggestions && (
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {msg.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestionClick(s)}
                    style={{
                      padding: "6px 12px",
                      fontSize: 12,
                      fontWeight: 500,
                      background: "var(--surface-default)",
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: "var(--border-default)",
                      borderRadius: 16,
                      cursor: "pointer",
                      color: "var(--text-secondary)",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent-primary)";
                      e.currentTarget.style.color = "var(--accent-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-default)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ padding: "12px 16px", borderTop: "1px solid var(--border-default)", background: "var(--surface-default)" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={step === "stack" ? "Or describe your stack..." : step === "icp" ? "Describe your ideal customer..." : "Ask me anything..."}
            style={{
              flex: 1,
              padding: "10px 14px",
              fontSize: 14,
              border: "1px solid var(--border-default)",
              borderRadius: 8,
              outline: "none",
              background: "var(--surface-raised)",
              color: "var(--text-primary)",
            }}
          />
          <Button type="submit" variant="primary" size="md" iconRight="Send">
            Send
          </Button>
        </div>
        {step === "ready" && (
          <div style={{ marginTop: 12 }}>
            <Button
              variant="accent"
              size="lg"
              iconRight={isCompiling ? undefined : "Zap"}
              onClick={onCompile}
              disabled={isCompiling}
              style={{ width: "100%" }}
            >
              {isCompiling ? "Compiling..." : "Compile Workflow"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
