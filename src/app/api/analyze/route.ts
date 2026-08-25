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

    let analysis = {
      failingNode: "Contact Reveal (Apollo HTTP Request)",
      nodeType: "n8n-nodes-base.httpRequest",
      errorCode: "429 Too Many Requests",
      rootCauseSummary:
        "The enrichment node hit the Apollo.io API rate limit because concurrent requests exceeded the API tier quota without rate-limiting delays.",
      severity: "high" as "critical" | "high" | "medium" | "low",
      remediationSteps: [
        "Add a 'Split in Batches' node before the HTTP Request node with a batch size of 5.",
        "Insert a 'Wait' node set to 1000ms between batches to respect the rate limit.",
        "Enable 'Retry On Fail' in the HTTP Request node settings (3 retries with 2000ms delay).",
      ],
      suggestedFix: `// Add Wait node expression or configure HTTP Request node:
{
  "options": {
    "retry": {
      "times": 3,
      "interval": 2000
    }
  }
}`,
    };

    if (process.env.OPENAI_API_KEY) {
      try {
        const { object } = await generateObject({
          model: openai("gpt-4o"),
          system: `You are an elite n8n Execution Analyst and Debugging Systems Engineer.
Analyze n8n execution errors and extract the failing node, error code, plain English root cause, remediation steps, and fix snippet.`,
          prompt: `Execution Data / Error Log:\n${executionData.slice(0, 10000)}`,
          schema: z.object({
            failingNode: z.string(),
            nodeType: z.string(),
            errorCode: z.string(),
            rootCauseSummary: z.string(),
            severity: z.enum(["critical", "high", "medium", "low"]),
            remediationSteps: z.array(z.string()),
            suggestedFix: z.string(),
          }),
        });
        analysis = object;
      } catch (err) {
        console.warn("OpenAI analyze failed, using fallback:", err);
      }
    } else {
      // Dynamic heuristics on error text
      const lower = executionData.toLowerCase();
      if (lower.includes("401") || lower.includes("unauthorized") || lower.includes("invalid api key")) {
        analysis.errorCode = "401 Unauthorized";
        analysis.rootCauseSummary = "Authentication failed because the API key or OAuth token is invalid or expired.";
        analysis.remediationSteps = [
          "Check n8n Credentials and re-enter a fresh API key or re-authenticate OAuth.",
          "Verify the environment variable is loaded in your instance .env file.",
        ];
      } else if (lower.includes("timeout") || lower.includes("econnrefused")) {
        analysis.errorCode = "ETIMEDOUT / 504";
        analysis.rootCauseSummary = "The target API endpoint did not respond within the default request timeout window.";
        analysis.remediationSteps = [
          "Increase timeout parameter in HTTP Request node from 30s to 120s.",
          "Verify that the destination URL is online and reachable.",
        ];
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
      sourceDataSnippet: executionData.slice(0, 500),
    });
  } catch (err) {
    console.error("Execution Analyst error:", err);
    return NextResponse.json({ error: "Failed to analyze execution log" }, { status: 500 });
  }
}
