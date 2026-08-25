import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

interface AnalyzeRequest {
  workflowId?: string;
  executionId?: string;
  n8nUrl?: string;
  n8nApiKey?: string;
  pastedLog?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalyzeRequest;
    const { workflowId, executionId, n8nUrl, n8nApiKey, pastedLog } = body;

    let executionData = pastedLog || "";

    // If live n8n credentials and IDs are provided, pull live from n8n API
    if (n8nUrl && n8nApiKey && (executionId || workflowId)) {
      try {
        const baseUrl = n8nUrl.replace(/\/$/, "");
        let targetExecutionId = executionId;

        // If only workflowId provided, fetch latest error execution
        if (!targetExecutionId && workflowId) {
          const listRes = await fetch(
            `${baseUrl}/api/v1/executions?workflowId=${workflowId}&status=error&limit=1`,
            {
              headers: { "X-N8N-API-KEY": n8nApiKey },
            }
          );
          if (listRes.ok) {
            const listJson = await listRes.json();
            if (listJson.data && listJson.data.length > 0) {
              targetExecutionId = listJson.data[0].id;
            }
          }
        }

        if (targetExecutionId) {
          const execRes = await fetch(
            `${baseUrl}/api/v1/executions/${targetExecutionId}?includeData=true`,
            {
              headers: { "X-N8N-API-KEY": n8nApiKey },
            }
          );
          if (execRes.ok) {
            const execJson = await execRes.json();
            executionData = JSON.stringify(execJson);
          }
        }
      } catch (err) {
        console.warn("Could not fetch live execution from n8n:", err);
      }
    }

    if (!executionData) {
      return NextResponse.json(
        { error: "No execution data, error log, or valid n8n connection provided." },
        { status: 400 }
      );
    }

    // Run AI Execution Analyst
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      system: `You are an elite n8n Execution Analyst and Debugging Systems Engineer.
Your task is to analyze execution logs or error JSON from an n8n workflow and provide a clear, actionable diagnostic report.
Analyze:
1. Failing Node: Identify the exact node name and node type that caused the failure.
2. Error Message & HTTP Code: Extract the underlying error reason (e.g. 401 Unauthorized, 429 Rate Limit, Schema/Type mismatch, Timeout).
3. Plain-English Root Cause: Explain simply what went wrong without technical jargon overload.
4. Remediation Steps: Bulleted, step-by-step instructions on how to fix the issue in n8n (e.g. update credential, add Split in Batches, adjust JSON expression).
5. Suggested JSON/Expression Patch: If applicable, provide the exact code or expression fix.`,
      prompt: `Execution Data / Error Log:\n${executionData.slice(0, 10000)}`,
      schema: z.object({
        failingNode: z.string().describe("Name of the failing node or 'Unknown'"),
        nodeType: z.string().describe("Type of node (e.g. n8n-nodes-base.httpRequest)"),
        errorCode: z.string().describe("HTTP status code or error code"),
        rootCauseSummary: z.string().describe("One-paragraph plain English summary of what happened"),
        severity: z.enum(["critical", "high", "medium", "low"]).describe("Severity level"),
        remediationSteps: z.array(z.string()).describe("List of exact steps to fix the workflow"),
        suggestedFix: z.string().describe("Markdown block or code snippet showing the fix"),
      }),
    });

    return NextResponse.json({
      success: true,
      analysis: object,
      sourceDataSnippet: executionData.slice(0, 500),
    });
  } catch (err) {
    console.error("Execution Analyst error:", err);
    return NextResponse.json({ error: "Failed to analyze execution log" }, { status: 500 });
  }
}
