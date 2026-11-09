"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Badge, Card, StatTile } from "@/components/ds";
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Play,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface LeadRow {
  id: string;
  company: string;
  domain?: string | null;
  contact_name?: string | null;
  name?: string | null;
  title?: string | null;
  email?: string | null;
  icp_score?: number | null;
  tier?: string | null;
  disposition?: string | null;
  dns_status?: string | null;
  verification_status?: string | null;
  signal?: string | null;
  blockers?: string[] | null;
  status?: string | null;
  outreach_subject?: string | null;
  outreach_body?: string | null;
}

interface RunRow {
  id: string;
  status: string;
  brief: string;
  current_step?: string | null;
  enrichment_mode?: string;
  created_at?: string;
  notes?: string[];
}

export default function CoreSdrView() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [brief, setBrief] = useState("");
  const [mode, setMode] = useState<"free" | "byok" | "dual">("free");
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewPayload, setPreviewPayload] = useState<unknown>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [lRes, rRes] = await Promise.all([
        fetch("/api/sdr/leads"),
        fetch("/api/runs"),
      ]);
      const lData = await lRes.json();
      const rData = await rRes.json();
      setLeads(lData.leads || []);
      setRuns(rData.runs || []);
      if (lData.warning || rData.warning) {
        setError(lData.warning || rData.warning);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [lRes, rRes] = await Promise.all([
          fetch("/api/sdr/leads"),
          fetch("/api/runs"),
        ]);
        const lData = await lRes.json();
        const rData = await rRes.json();
        if (cancelled) return;
        setLeads(lData.leads || []);
        setRuns(rData.runs || []);
        if (lData.warning || rData.warning) {
          setError(lData.warning || rData.warning);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function startRun() {
    if (!brief.trim()) {
      setError("Enter a prospecting brief first");
      return;
    }
    setRunning(true);
    setError(null);
    setMsg(null);
    try {
      const res = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, enrichment_mode: mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start run");
      setMsg(`Run ${data.run?.id} queued (${mode}). Worker will execute plan→discover→MX→score.`);
      // Kick worker directly as backup
      if (data.run?.id) {
        await fetch(`/api/runs/${data.run.id}/worker`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        });
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  async function queueDraft(lead: LeadRow) {
    const res = await fetch("/api/sdr/dispatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: lead.id,
        emailSubject: lead.outreach_subject || `Intro — ${lead.company}`,
        emailBody:
          lead.outreach_body ||
          `Draft for ${lead.contact_name || "contact"} at ${lead.company}. (Human must approve before send.)`,
        toEmail: lead.email,
      }),
    });
    const data = await res.json();
    setMsg(data.message || "Draft queued");
    await refresh();
  }

  async function previewHubSpot(leadIds: string[]) {
    setMsg(null);
    const res = await fetch("/api/crm/hubspot/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadIds }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Preview failed");
      return;
    }
    setPreviewId(data.preview_id);
    setPreviewPayload(data.payload);
    setMsg(
      `HubSpot preview ready (${data.payload?.writable_count ?? 0} writable). Approve to write — nothing sent yet.`
    );
  }

  async function approveHubSpot() {
    if (!previewId) return;
    const res = await fetch("/api/crm/hubspot/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preview_id: previewId, approved: true }),
    });
    const data = await res.json();
    setMsg(
      data.applied
        ? "HubSpot write applied via Composio."
        : data.message ||
            data.status ||
            JSON.stringify(data).slice(0, 200)
    );
  }

  const sure = leads.filter((l) => l.disposition === "sure").length;
  const review = leads.filter((l) => l.disposition === "needs_review").length;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Prospecting runs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Prospect Pal by Salesgency — free path (DuckDuckGo + X + MX) or BYOK
            via Composio. Never fabricates leads.
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile value={String(leads.length)} label="Leads" tone="brand" />
        <StatTile value={String(sure)} label="SURE" tone="brand" />
        <StatTile value={String(review)} label="Needs review" />
        <StatTile value={String(runs.length)} label="Runs" />
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Play className="w-4 h-4" /> Start run
        </div>
        <textarea
          className="w-full border rounded-lg p-3 text-sm min-h-[88px]"
          placeholder="Brief: ICP, roles, geography, signals… e.g. B2B SaaS RevOps leaders in US hiring SDRs"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />
        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-xs font-medium text-slate-600">
            Enrichment
            <select
              className="ml-2 border rounded px-2 py-1 text-sm"
              value={mode}
              onChange={(e) =>
                setMode(e.target.value as "free" | "byok" | "dual")
              }
            >
              <option value="free">Free (DDG + X + MX)</option>
              <option value="byok">BYOK (Composio)</option>
              <option value="dual">Dual</option>
            </select>
          </label>
          <Button onClick={startRun} disabled={running}>
            <Search className="w-4 h-4 mr-2" />
            {running ? "Running…" : "Run prospecting"}
          </Button>
        </div>
        {error && (
          <div className="text-sm text-red-700 bg-red-50 rounded-lg p-2 flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}
        {msg && (
          <div className="text-sm text-slate-700 bg-slate-50 rounded-lg p-2">
            {msg}
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Users className="w-4 h-4" /> Leads
            </div>
            <Button
              variant="outline"
              onClick={() =>
                previewHubSpot(leads.filter((l) => l.email).map((l) => l.id))
              }
              disabled={!leads.some((l) => l.email)}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              HubSpot preview
            </Button>
          </div>
          {leads.length === 0 ? (
            <p className="text-sm text-slate-500">
              No leads yet. Start a free-path run — empty results mean search
              found nothing (we do not invent contacts).
            </p>
          ) : (
            <div className="divide-y">
              {leads.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelected(l)}
                  className="w-full text-left py-3 flex items-start justify-between gap-3 hover:bg-slate-50 px-1"
                >
                  <div>
                    <div className="font-medium text-sm">
                      {l.contact_name || l.name || "Unknown contact"}{" "}
                      <span className="text-slate-400 font-normal">
                        @ {l.company}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {l.email || "email unknown"} · {l.dns_status || "dns?"} ·{" "}
                      {l.verification_status || "not_checked"}
                    </div>
                    {l.signal && (
                      <div className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {l.signal}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {l.tier && <Badge tone="brand">Tier {l.tier}</Badge>}
                    <span className="text-xs text-slate-500">
                      {l.icp_score ?? "—"}
                    </span>
                    <Badge>{l.disposition || l.status || "—"}</Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4 space-y-3">
          <div className="font-semibold text-sm">Detail</div>
          {!selected ? (
            <p className="text-sm text-slate-500">Select a lead</p>
          ) : (
            <>
              <div className="text-sm">
                <div className="font-medium">
                  {selected.contact_name || selected.name || "Unknown"} —{" "}
                  {selected.title || "role unknown"}
                </div>
                <div className="text-slate-500">
                  {selected.company}
                  {selected.domain ? ` · ${selected.domain}` : ""}
                </div>
              </div>
              <div className="text-xs space-y-1 text-slate-600">
                <div>Email: {selected.email || "null"}</div>
                <div>DNS: {selected.dns_status}</div>
                <div>Verify: {selected.verification_status}</div>
                <div>Disposition: {selected.disposition}</div>
                {(selected.blockers || []).length > 0 && (
                  <div>Blockers: {(selected.blockers || []).join(", ")}</div>
                )}
              </div>
              <Button onClick={() => queueDraft(selected)}>
                <Mail className="w-4 h-4 mr-2" />
                Queue draft (no send)
              </Button>
              <Button
                variant="outline"
                onClick={() => previewHubSpot([selected.id])}
              >
                HubSpot preview this lead
              </Button>
            </>
          )}

          {previewPayload != null && (
            <div className="mt-4 border-t pt-3 space-y-2">
              <div className="text-xs font-semibold">HubSpot preview</div>
              <pre className="text-[10px] bg-slate-50 p-2 rounded max-h-40 overflow-auto">
                {JSON.stringify(previewPayload, null, 2)}
              </pre>
              <Button onClick={approveHubSpot} disabled={!previewId}>
                Approve write
              </Button>
            </div>
          )}

          <div className="border-t pt-3">
            <div className="text-xs font-semibold mb-2">Recent runs</div>
            {runs.slice(0, 5).map((r) => (
              <div key={r.id} className="text-xs text-slate-600 mb-1">
                <Badge>{r.status}</Badge> {r.current_step || "—"} ·{" "}
                {(r.brief || "").slice(0, 48)}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
