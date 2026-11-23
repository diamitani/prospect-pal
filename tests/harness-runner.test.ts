import { describe, expect, it, vi } from "vitest";
import { executeProspectingRun, isNoiseHost } from "@/lib/prospecting/runner";
import { createComposioProviders, runEnrichmentWaterfall, type ComposioExecutor } from "@/lib/prospecting/enrichment";
import { buildGuardIndex } from "@/lib/prospecting/guardrails";
import type { MxLookupResult } from "@/lib/prospecting/mx";
import type { RunEvent } from "@/lib/prospecting/types";
import type { SearchHit } from "@/lib/prospecting/free-search";

const at = new Date().toISOString();
const hits: SearchHit[] = [
  { url: "https://acme.io/careers", title: "Acme — hiring SDRs", snippet: "Acme is hiring 5 SDRs after Series B", retrieved_at: at, provider: "duckduckgo_html" },
  { url: "https://globex.com/news", title: "Globex | launch", snippet: "Globex launches new platform", retrieved_at: at, provider: "x_public" },
];

const discover = vi.fn(async () => ({ hits, notes: [] as string[] }));
const mxOk = async (domain: string): Promise<MxLookupResult> => ({
  domain,
  status: "mx_ok",
  mx: [{ exchange: `mx.${domain}`, priority: 10 }],
  hasA: true,
  hasAAAA: false,
  checked_at: new Date().toISOString(),
});

const apolloPayload = (domain: string) => ({
  successful: true,
  data: {
    people: [
      {
        name: "Dana Scully",
        title: "VP Sales",
        email: `dana@${domain}`,
        email_status: "verified",
        linkedin_url: "https://linkedin.com/in/dana",
      },
    ],
  },
});

const hunterPayload = (domain: string) => ({
  successful: true,
  data: {
    data: {
      emails: [
        {
          value: `fox@${domain}`,
          first_name: "Fox",
          last_name: "Mulder",
          position: "Head of Revenue",
          confidence: 91,
          verification: { status: "accept_all" },
        },
      ],
    },
  },
});

function mockExecutor(opts: { apolloFails?: boolean; apolloEmpty?: boolean } = {}) {
  const calls: string[] = [];
  const exec: ComposioExecutor = async (action, params) => {
    calls.push(action);
    if (action.startsWith("APOLLO")) {
      if (opts.apolloFails) return { error: "apollo quota exhausted" };
      if (opts.apolloEmpty) return { data: { successful: true, data: { people: [] } } };
      return { data: apolloPayload(String(params.q_organization_domains)) };
    }
    if (action.startsWith("HUNTER")) return { data: hunterPayload(String(params.domain)) };
    return { error: "unknown action" };
  };
  return { exec, calls };
}

const brief = "B2B SaaS VP Sales in US hiring SDRs";

describe("enrichment waterfall mode branching", () => {
  it("free mode never calls Composio and never fabricates contacts", async () => {
    const { exec, calls } = mockExecutor();
    const providers = createComposioProviders("u1", ["apollo", "hunter"], exec);
    const r = await executeProspectingRun(
      { brief, enrichment_mode: "free" },
      { deps: { discover, lookupMx: mxOk, providers } }
    );
    expect(calls).toHaveLength(0);
    expect(r.leads.length).toBe(2);
    for (const l of r.leads) {
      expect(l.contact_name).toBeNull();
      expect(l.email).toBeNull();
      expect(l.enrichment?.source).toBe("free");
      expect(l.blockers).toContain("no_named_contact_from_permitted_sources");
    }
  });

  it("byok uses the first provider that returns contacts and records provenance", async () => {
    const { exec, calls } = mockExecutor();
    const providers = createComposioProviders("u1", ["apollo", "hunter"], exec);
    const r = await executeProspectingRun(
      { brief, enrichment_mode: "byok" },
      { deps: { discover, lookupMx: mxOk, providers } }
    );
    expect(calls.every((c) => c.startsWith("APOLLO"))).toBe(true);
    const acme = r.leads.find((l) => l.domain === "acme.io")!;
    expect(acme.contact_name).toBe("Dana Scully");
    expect(acme.email).toBe("dana@acme.io");
    expect(acme.verification_status).toBe("valid");
    expect(acme.provenance).toMatch(/^apollo:people_search/);
    expect(acme.enrichment).toMatchObject({ mode: "byok", source: "apollo", attempted: ["apollo"] });
  });

  it("byok falls through to Hunter when Apollo errors", async () => {
    const { exec } = mockExecutor({ apolloFails: true });
    const providers = createComposioProviders("u1", ["apollo", "hunter"], exec);
    const r = await executeProspectingRun(
      { brief, enrichment_mode: "byok" },
      { deps: { discover, lookupMx: mxOk, providers } }
    );
    const l = r.leads[0];
    expect(l.enrichment?.source).toBe("hunter");
    expect(l.enrichment?.notes.some((n) => n.startsWith("apollo_error"))).toBe(true);
    // accept_all is never valid and never SURE
    expect(l.verification_status).toBe("accept_all");
    expect(l.disposition).not.toBe("sure");
    expect(l.blockers).toContain("accept_all_never_valid");
  });

  it("byok with no connected provider falls back to the free path with an explicit note", async () => {
    const r = await executeProspectingRun(
      { brief, enrichment_mode: "byok" },
      { deps: { discover, lookupMx: mxOk, providers: [] } }
    );
    expect(r.leads.every((l) => l.contact_name === null && l.email === null)).toBe(true);
    expect(r.leads[0].enrichment?.source).toBe("free");
    expect(r.leads[0].enrichment?.notes[0]).toMatch(/byok_no_connected_provider/);
    expect(r.notes.some((n) => /no Apollo\/Hunter connection/.test(n))).toBe(true);
    const enrichEvent = r.events.find((e) => e.step === "enrich")!;
    expect(enrichEvent.level).toBe("warn");
  });

  it("dual merges providers and guesses only on provider-sourced names", async () => {
    const exec: ComposioExecutor = async (action, params) => {
      const domain = String(params.q_organization_domains ?? params.domain);
      if (action.startsWith("APOLLO")) {
        return { data: { data: { people: [{ first_name: "Walter", last_name: "Skinner", title: "VP Sales" }] } } };
      }
      return { data: hunterPayload(domain) };
    };
    const providers = createComposioProviders("u1", ["apollo", "hunter"], exec);
    const r = await executeProspectingRun(
      { brief, enrichment_mode: "dual", plan: { contacts_per_company: 2 } },
      { deps: { discover, lookupMx: mxOk, providers } }
    );
    const acme = r.leads.filter((l) => l.domain === "acme.io");
    expect(acme.map((l) => l.contact_name).sort()).toEqual(["Fox Mulder", "Walter Skinner"]);
    const walter = acme.find((l) => l.contact_name === "Walter Skinner")!;
    expect(walter.provenance).toMatch(/apollo:people_search\+guessed:/);
    expect(walter.blockers).toContain("email_unverified_guess");
    expect(walter.enrichment?.attempted).toEqual(["apollo", "hunter", "free"]);
  });

  it("dual with empty providers keeps contact null (no fabrication)", async () => {
    const w = await runEnrichmentWaterfall({
      mode: "dual",
      domain: "acme.io",
      roles: ["VP Sales"],
      limit: 2,
      providers: createComposioProviders("u1", ["apollo"], mockExecutor({ apolloEmpty: true }).exec),
    });
    expect(w.contacts).toEqual([]);
    expect(w.usedFreeFallback).toBe(true);
    expect(w.attempted).toEqual(["apollo", "free"]);
  });

  it("rejects provider emails on a different domain or masked by Apollo", async () => {
    const exec: ComposioExecutor = async () => ({
      data: { people: [
        { name: "A B", email: "a@gmail.com" },
        { name: "C D", email: "email_not_unlocked@acme.io" },
      ] },
    });
    const [apollo] = createComposioProviders("u1", ["apollo"], exec);
    const res = await apollo.enrichDomain("acme.io", [], 5);
    expect(res.contacts.map((c) => c.email)).toEqual([null, null]);
  });
});

describe("suppression + cross-run dedupe", () => {
  it("flags suppressed domains and prior-run duplicates instead of re-queuing", async () => {
    const guard = buildGuardIndex(
      [{ kind: "domain", value: "Globex.com" }],
      [{ id: "old", email: "dana@acme.io", domain: "acme.io", run_id: "prev-run", contact_name: "Dana Scully" }],
      "this-run"
    );
    const { exec } = mockExecutor();
    const providers = createComposioProviders("u1", ["apollo"], exec);
    const r = await executeProspectingRun(
      { brief, enrichment_mode: "byok" },
      { runId: "this-run", deps: { discover, lookupMx: mxOk, providers, guard } }
    );
    const acme = r.leads.find((l) => l.domain === "acme.io")!;
    const globex = r.leads.find((l) => l.domain === "globex.com")!;
    expect(acme.status).toBe("duplicate_prior_run");
    expect(acme.disposition).toBe("excluded");
    expect(acme.blockers.some((b) => b.startsWith("duplicate_prior_run:email"))).toBe(true);
    expect(globex.status).toBe("suppressed");
    expect(globex.blockers).toContain("suppressed:domain:globex.com");
    const guardEv = r.events.find((e) => e.step === "guard")!;
    expect(guardEv.meta).toMatchObject({ suppressed: 1, duplicate_prior_run: 1 });
  });

  it("company-level free leads dedupe by domain across runs", async () => {
    const guard = buildGuardIndex([], [{ domain: "acme.io", email: null, contact_name: null, run_id: "prev" }], "now");
    const r = await executeProspectingRun(
      { brief, enrichment_mode: "free" },
      { runId: "now", deps: { discover, lookupMx: mxOk, guard } }
    );
    expect(r.leads.find((l) => l.domain === "acme.io")!.status).toBe("duplicate_prior_run");
    expect(r.leads.find((l) => l.domain === "globex.com")!.status).toBe("ready");
  });

  it("suppressed email matches case-insensitively", async () => {
    const guard = buildGuardIndex([{ kind: "email", value: "DANA@ACME.IO" }], []);
    const { exec } = mockExecutor();
    const r = await executeProspectingRun(
      { brief, enrichment_mode: "byok" },
      { deps: { discover, lookupMx: mxOk, providers: createComposioProviders("u", ["apollo"], exec), guard } }
    );
    expect(r.leads.find((l) => l.domain === "acme.io")!.status).toBe("suppressed");
  });
});

describe("durable events + progress accumulation", () => {
  it("accumulates progress across steps and emits one event per step", async () => {
    const snapshots: number[] = [];
    const sunk: RunEvent[] = [];
    const r = await executeProspectingRun(
      { brief, enrichment_mode: "free" },
      {
        runId: "r1",
        onProgress: (_p, all) => {
          snapshots.push(all.length);
        },
        onEvent: (e) => {
          sunk.push(e);
        },
        deps: { discover, lookupMx: mxOk },
      }
    );
    expect(snapshots).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(r.progress.map((p) => p.step)).toEqual(["plan", "discover", "enrich", "verify", "guard", "score", "artifacts"]);
    expect(sunk.map((e) => e.step)).toEqual(["plan", "discover", "enrich", "verify", "guard", "score", "artifacts"]);
    for (const e of sunk) {
      expect(e.run_id).toBe("r1");
      expect(e.started_at).toBeTruthy();
      expect(e.finished_at).toBeTruthy();
      expect(typeof e.duration_ms).toBe("number");
      expect(e.error).toBeNull();
    }
  });

  it("records an error event with duration when a step throws", async () => {
    const sunk: RunEvent[] = [];
    await expect(
      executeProspectingRun(
        { brief },
        {
          onEvent: (e) => {
            sunk.push(e);
          },
          deps: {
            discover: async () => {
              throw new Error("ddg down");
            },
            lookupMx: mxOk,
          },
        }
      )
    ).rejects.toThrow("ddg down");
    const last = sunk[sunk.length - 1];
    expect(last.step).toBe("discover");
    expect(last.level).toBe("error");
    expect(last.error).toBe("ddg down");
  });

  it("an event sink failure never breaks the run", async () => {
    const r = await executeProspectingRun(
      { brief },
      {
        onEvent: () => {
          throw new Error("db down");
        },
        deps: { discover, lookupMx: mxOk },
      }
    );
    expect(r.leads.length).toBe(2);
  });
});

describe("discovery host filter", () => {
  it("filters search/social hosts without dropping real *x.com companies", () => {
    expect(isNoiseHost("x.com")).toBe(true);
    expect(isNoiseHost("mobile.twitter.com")).toBe(true);
    expect(isNoiseHost("www.google.co.uk")).toBe(true);
    expect(isNoiseHost("globex.com")).toBe(false);
    expect(isNoiseHost("dropbox.com")).toBe(false);
    expect(isNoiseHost("netflix.com")).toBe(false);
  });
});
