/**
 * AWS Bedrock Client
 * Uses long-term Bearer token for the Mantle runtime (us-east-1)
 */
import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const BEARER_TOKEN = process.env.AWS_BEDROCK_BEARER_TOKEN!;
const REGION = process.env.AWS_REGION || "us-east-1";
const MODEL_ID = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet-20241022-v2:0";

// Configure Bedrock client with Bearer token auth
export const bedrockClient = new BedrockRuntimeClient({
  region: REGION,
  token: { token: BEARER_TOKEN },
});

export interface BedrockMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Invoke Claude 3.5 Sonnet with streaming
 */
export async function invokeClaudeStream(
  messages: BedrockMessage[],
  systemPrompt: string,
  maxTokens = 4096
): Promise<ReadableStream<Uint8Array>> {
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  };

  const command = new InvokeModelWithResponseStreamCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  const response = await bedrockClient.send(command);

  // Convert AsyncIterable to ReadableStream
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      if (!response.body) {
        controller.close();
        return;
      }
      try {
        for await (const chunk of response.body) {
          if (chunk.chunk?.bytes) {
            controller.enqueue(chunk.chunk.bytes);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return stream;
}

/**
 * Invoke Claude 3.5 Sonnet (non-streaming, for structured JSON output)
 */
export async function invokeClaude(
  messages: BedrockMessage[],
  systemPrompt: string,
  maxTokens = 8192
): Promise<string> {
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  };

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  const response = await bedrockClient.send(command);
  const body = JSON.parse(new TextDecoder().decode(response.body));
  return body.content[0].text;
}

export { MODEL_ID };
