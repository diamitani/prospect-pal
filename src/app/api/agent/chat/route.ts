import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { workflowTools } from '@/lib/agent-tools';
import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 60;

/**
 * Unified Agent Chat Endpoint
 *
 * Uses Vercel AI SDK to stream responses from OpenRouter or AWS Bedrock
 * with tool calling for workflow compilation and ICP extraction.
 */

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Determine which LLM provider to use based on env vars
    const useOpenRouter = !!process.env.OPENROUTER_API_KEY;
    const useAWSBedrock = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

    if (!useOpenRouter && !useAWSBedrock) {
      return new Response(
        JSON.stringify({
          error: 'No LLM provider configured. Set OPENROUTER_API_KEY or AWS credentials.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize LLM provider
    let model;

    if (useOpenRouter) {
      // OpenRouter with Anthropic Claude
      const openrouter = createOpenAI({
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: 'https://openrouter.ai/api/v1',
      });
      model = openrouter('anthropic/claude-3.5-sonnet');
    } else {
      // AWS Bedrock with Claude
      const anthropic = createAnthropic({
        apiKey: process.env.AWS_ACCESS_KEY_ID!, // Bedrock uses AWS credentials
        baseURL: `https://bedrock-runtime.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`,
      });
      model = anthropic('anthropic.claude-3-5-sonnet-20241022-v2:0');
    }

    // System prompt for Prospect Automation Engineer
    const systemPrompt = `You are the Prospect Automation Engineer (PAE), an AI agent that builds custom n8n workflows for outbound sales automation.

Your role:
1. Understand the user's ICP (Ideal Customer Profile) and target persona
2. Ask clarifying questions about their tools and preferences
3. Use the tools available to compile workflows, extract structured ICP data, generate email copy, and create deployment guides
4. Explain the workflow design in simple terms
5. Provide actionable next steps

Available tools:
- compile_workflow: Generate complete n8n workflow JSON
- extract_icp: Extract structured ICP from user description
- generate_deploy_guide: Create step-by-step deployment instructions
- generate_email_copy: Generate PAS email templates
- configure_node: Configure specific workflow nodes

Key principles:
- Always confirm ICP, tools, and approval policy before compiling
- Explain trade-offs (e.g., approval gate vs auto-send)
- Use plain language, avoid jargon
- Provide examples when helpful
- Be concise but thorough

When a user describes their campaign, follow this flow:
1. Extract and confirm ICP (use extract_icp tool)
2. Ask about tools: data source, enrichment, CRM, sequencer
3. Ask about approval policy and notifications
4. Compile the workflow (use compile_workflow tool)
5. Generate deployment guide (use generate_deploy_guide tool)
6. Offer to generate email copy if needed

Start by asking the user to describe their ICP and target persona.`;

    // Stream response with tool calling
    const result = await streamText({
      model,
      system: systemPrompt,
      messages,
      tools: workflowTools,
      maxTokens: 4096,
      temperature: 0.7,
      toolChoice: 'auto',
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Agent chat error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
