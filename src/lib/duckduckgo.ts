/**
 * DuckDuckGo AI — Free LLM Backend (no API key required)
 * Models: gpt-4o-mini | claude-3-haiku | llama-3.1-70b | mixtral-8x7b
 * 
 * This is the primary AI backend. AWS Bedrock is the fallback.
 */

export type DDGModel =
  | "gpt-4o-mini"
  | "claude-3-haiku-20240307"
  | "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"
  | "mistralai/Mixtral-8x7B-Instruct-v0.1";

export interface DDGMessage {
  role: "user" | "assistant";
  content: string;
}

const DDG_STATUS_URL = "https://duckduckgo.com/duckchat/v1/status";
const DDG_CHAT_URL   = "https://duckduckgo.com/duckchat/v1/chat";
const DEFAULT_MODEL: DDGModel = "gpt-4o-mini";

/** Get the VQD token required for each DuckDuckGo chat session */
async function getVqdToken(): Promise<string> {
  const res = await fetch(DDG_STATUS_URL, {
    headers: {
      "x-vqd-accept": "1",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`DDG status error: ${res.status}`);
  const token = res.headers.get("x-vqd-4");
  if (!token) throw new Error("DDG: No VQD token in response");
  return token;
}

/**
 * Stream a DuckDuckGo AI response as a ReadableStream of text chunks
 */
export async function streamDDG(
  messages: DDGMessage[],
  systemPrompt?: string,
  model: DDGModel = DEFAULT_MODEL
): Promise<ReadableStream<string>> {
  const vqdToken = await getVqdToken();

  // DDG doesn't support system role — prepend as first user message
  const fullMessages: DDGMessage[] = systemPrompt
    ? [{ role: "user", content: `[SYSTEM CONTEXT]\n${systemPrompt}\n\n[USER]\n${messages[0]?.content || ""}` }, ...messages.slice(1)]
    : messages;

  const res = await fetch(DDG_CHAT_URL, {
    method: "POST",
    headers: {
      "x-vqd-4": vqdToken,
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ model, messages: fullMessages }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DDG chat error: ${res.status} — ${err}`);
  }

  // Parse SSE stream → emit text chunks
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream<string>({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") { controller.close(); return; }
            try {
              const json = JSON.parse(data) as { message?: string };
              if (json.message) controller.enqueue(json.message);
            } catch { /* skip bad JSON */ }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

/**
 * Non-streaming: collect full response text
 */
export async function askDDG(
  messages: DDGMessage[],
  systemPrompt?: string,
  model: DDGModel = DEFAULT_MODEL
): Promise<string> {
  const stream = await streamDDG(messages, systemPrompt, model);
  const reader = stream.getReader();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += value;
  }
  return result;
}

/**
 * Convert DDGStream to a web Response with text/event-stream
 * for use in Next.js API routes
 */
export function ddgStreamToResponse(stream: ReadableStream<string>): Response {
  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(encoder.encode(value));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
