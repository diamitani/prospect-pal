"use client";

import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import { Send, Sparkles, User, Bot, Copy, Check, RotateCcw, Loader2 } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
    };

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id ? { ...m, content: fullContent } : m
          )
        );
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      console.error("Chat error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: "Sorry, I encountered an error. Please try again." }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (text: string) => {
    sendMessage(text);
  };

  const regenerate = useCallback(() => {
    if (messages.length < 2) return;
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) return;

    setMessages((prev) => prev.slice(0, -2));
    setTimeout(() => sendMessage(lastUserMessage.content), 100);
  }, [messages, sendMessage]);

  const suggestions = [
    "Build a prospect automation workflow",
    "Set up CRM duplicate checking",
    "Create an approval gate flow",
    "Generate email sequence nodes",
  ];

  return (
    <div className="assistant-chat">
      <div className="thread-viewport">
        {messages.length === 0 ? (
          <div className="welcome-root">
            <div className="welcome-icon">
              <Sparkles size={28} color="white" strokeWidth={1.75} />
            </div>
            <h2 className="welcome-title">n8n Workflow Engineer</h2>
            <p className="welcome-subtitle">
              I help you build prospect automation workflows for n8n — from lead intake to sequence enrollment.
            </p>
            <div className="welcome-suggestions">
              {suggestions.map((text) => (
                <button
                  key={text}
                  className="suggestion-chip"
                  onClick={() => handleSuggestion(text)}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                role={message.role}
                content={message.content}
                onReload={message.role === "assistant" ? regenerate : undefined}
                isStreaming={isLoading && message.id === messages[messages.length - 1]?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="composer-container">
        <div className="composer-inner">
          <div className="composer-box">
            <input
              className="composer-input"
              placeholder="Ask PAL anything about GTM automation..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="composer-send"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 size={18} strokeWidth={1.75} className="animate-spin" />
              ) : (
                <Send size={18} strokeWidth={1.75} />
              )}
            </button>
          </div>
          <p className="composer-hint">
            Powered by Claude — describe your workflow needs to generate n8n JSON
          </p>
        </div>
      </form>

      <style jsx global>{`
        .assistant-chat {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--surface-base, #fafaf8);
        }

        .thread-viewport {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .welcome-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
          padding: 48px 24px;
        }

        .welcome-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--cobalt-500, #3B5BDB) 0%, var(--cobalt-600, #2A41C9) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(42, 65, 201, 0.25);
        }

        .welcome-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary, #111);
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }

        .welcome-subtitle {
          font-size: 15px;
          color: var(--text-secondary, #6B7280);
          margin: 0 0 24px;
          max-width: 400px;
          line-height: 1.5;
        }

        .welcome-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          max-width: 500px;
        }

        .suggestion-chip {
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary, #6B7280);
          background: var(--surface-card, white);
          border: 1px solid var(--border-hairline, #e5e5e0);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
        }

        .suggestion-chip:hover {
          background: var(--surface-sunken, #f4f3ef);
          border-color: var(--cobalt-200, #bfcfff);
          color: var(--cobalt-700, #1e3a8a);
        }

        .message-container {
          display: flex;
          gap: 12px;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-avatar.user {
          background: var(--surface-deep, #e8e6e1);
        }

        .message-avatar.assistant {
          background: linear-gradient(135deg, var(--cobalt-500, #3B5BDB) 0%, var(--cobalt-600, #2A41C9) 100%);
        }

        .message-content {
          flex: 1;
          min-width: 0;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .message-sender {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary, #111);
        }

        .message-text {
          font-size: 15px;
          line-height: 1.65;
          color: var(--text-primary, #111);
          white-space: pre-wrap;
        }

        .message-text p {
          margin: 0 0 12px;
        }

        .message-text p:last-child {
          margin-bottom: 0;
        }

        .message-text code {
          background: var(--surface-sunken, #f4f3ef);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 13px;
          font-family: var(--font-mono, 'Geist Mono', monospace);
        }

        .message-text pre {
          background: var(--ink-800, #101B2D);
          color: #e5e5e0;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 12px 0;
        }

        .message-text pre code {
          background: none;
          padding: 0;
          color: inherit;
        }

        .message-actions {
          display: flex;
          gap: 4px;
          margin-top: 8px;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .message-container:hover .message-actions {
          opacity: 1;
        }

        .action-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--text-muted, #9CA3AF);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .action-btn:hover {
          background: var(--surface-sunken, #f4f3ef);
          color: var(--text-secondary, #6B7280);
        }

        .composer-container {
          padding: 16px 24px 24px;
          border-top: 1px solid var(--border-hairline, #e5e5e0);
          background: var(--surface-card, white);
        }

        .composer-inner {
          max-width: 800px;
          margin: 0 auto;
        }

        .composer-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--surface-base, #fafaf8);
          border: 1.5px solid var(--border-hairline, #e5e5e0);
          border-radius: 16px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .composer-box:focus-within {
          border-color: var(--cobalt-400, #5c7cfa);
          box-shadow: 0 0 0 3px rgba(42, 65, 201, 0.1);
        }

        .composer-input {
          flex: 1;
          border: none;
          background: none;
          font-size: 15px;
          line-height: 1.5;
          color: var(--text-primary, #111);
          outline: none;
          font-family: inherit;
          padding: 0;
        }

        .composer-input::placeholder {
          color: var(--text-muted, #9CA3AF);
        }

        .composer-input:disabled {
          opacity: 0.6;
        }

        .composer-send {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: none;
          background: var(--cobalt-600, #2A41C9);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .composer-send:hover:not(:disabled) {
          background: var(--cobalt-700, #1e3a8a);
          transform: translateY(-1px);
        }

        .composer-send:disabled {
          background: var(--surface-deep, #e8e6e1);
          color: var(--text-muted, #9CA3AF);
          cursor: not-allowed;
          transform: none;
        }

        .composer-hint {
          font-size: 12px;
          color: var(--text-muted, #9CA3AF);
          text-align: center;
          margin-top: 10px;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 8px 0;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--cobalt-400, #5c7cfa);
          animation: typing-bounce 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) { animation-delay: 0s; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .cursor-blink {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: var(--cobalt-500, #3B5BDB);
          margin-left: 2px;
          animation: blink 1s step-end infinite;
          vertical-align: text-bottom;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  onReload?: () => void;
  isStreaming?: boolean;
}

function MessageBubble({ role, content, onReload, isStreaming }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = role === "user";

  return (
    <div className="message-container">
      <div className={`message-avatar ${isUser ? "user" : "assistant"}`}>
        {isUser ? (
          <User size={16} color="var(--text-secondary, #6B7280)" strokeWidth={1.75} />
        ) : (
          <Bot size={16} color="white" strokeWidth={1.75} />
        )}
      </div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">{isUser ? "You" : "Engineer"}</span>
        </div>
        <div className="message-text">
          {content || (isStreaming && (
            <div className="typing-indicator">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          ))}
          {isStreaming && content && <span className="cursor-blink" />}
        </div>
        {!isUser && content && !isStreaming && (
          <div className="message-actions">
            <button className="action-btn" onClick={handleCopy} title="Copy">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            {onReload && (
              <button className="action-btn" onClick={onReload} title="Regenerate">
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
