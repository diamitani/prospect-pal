import { stubProviders, type Brief, type Providers } from "./steps";

type FetchLike = typeof fetch;

async function ask(
  system: string,
  user: string,
  fetchImpl: FetchLike = fetch
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
  const res = await fetchImpl("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL ?? "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Claude API ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  return data.content?.find((c) => c.type === "text")?.text ?? "";
}

/**
 * Turns steps 04 (research_prospect) and 05 (write_email) into live Claude calls
 * when ANTHROPIC_API_KEY is configured, while falling back to stubProviders if a network error occurs.
 */
export function claudeProviders(fetchImpl?: FetchLike): Providers {
  return {
    ...stubProviders,
    async researchProspect(i): Promise<Brief> {
      try {
        const text = await ask(
          "You write concise B2B sales research briefs. Return ONLY a JSON object with keys: " +
            "companyOverview, prospectOverview, signalInduced (explicit events like job postings, funding rounds, migrations), " +
            "signalDeduced (implicit challenges implied by size, tech stack, or industry shifts), products, valueProposition.",
          JSON.stringify(i),
          fetchImpl
        );
        return JSON.parse(
          text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)
        ) as Brief;
      } catch {
        return stubProviders.researchProspect(i);
      }
    },
    async writeEmail(i) {
      try {
        const text = await ask(
          `Write a short, specific sales email from the brief. Tone: ${i.tone ?? "informal, brief"}. ` +
            (i.format === "full_email"
              ? `Include a subject line on the first line as "Subject: ...", then the greeting "Hi ${i.firstName ?? "there"},", body, and signature.`
              : "Write the body only: no greeting and no signature, so it can be used as a CRM messaging token.") +
            " Use only facts from the brief. Never use em-dashes.",
          JSON.stringify(i.brief),
          fetchImpl
        );
        const m = text.match(/^Subject:\s*(.+)\n+/i);
        const body = m ? text.slice(m[0].length).trim() : text.trim();
        return {
          framework:
            i.format === "full_email"
              ? "Delivery Framework A: Full-Body"
              : "Delivery Framework B: Modular Body Only (CRM Token)",
          subject: m ? m[1] : undefined,
          body,
          crmTokenPreview:
            i.format === "full_email"
              ? body
              : `Hi ${i.firstName ?? "there"},\n\n{{email_body_token}}\n\n${i.signature ?? "Best,\nPatrick Diamitani"}`,
        };
      } catch {
        return stubProviders.writeEmail(i);
      }
    },
  };
}

