"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Badge, Card, StatTile } from "@/components/ds";
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Play,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  Ban,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface LeadRow {
  id: string;
  run_id?: string | null;
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
  provenance?: string | null;
  outreach_subject?: string | null;
  outreach_body?: string | null;
  enrichment?: { mode?: string; source?: string; attempted?: string[]; notes?: string[] } | null;
}

interface RunRow {
  id: string;
  status: string;
  brief: string;
  current_step?: string | null;
  enrichment_mode?: string;
  created_at?: string;
  notes?: string[];
  error?: string | null;
}

interface RunEventRow {
  id?: string;
  step: string;
  level: "info" | "warn" | "error";
  message: string;
  meta?: Record<string, unknown>;
  started_at: string;
  duration_ms?: number | null;
  error?: string | null;
}

interface SuppressionRow {
  id: string;
  kind: "email" | "domain";
  value: string;
  reason?: string | null;
  created_at?: string;
}

type Queue = "A" | "B" | "C" | "flagged";

const STEPS = ["plan", "discover", "enrich", "verify", "guard", "score", "artifacts"];

function isFlagged(l: LeadRow) {
  return l.disposition === "excluded" || l.status === "suppressed" || l.status === "duplicate_prior_run";
}

async function jsonOrError(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error("Please sign in again.");
  return data;
}

export default function CoreSdrView() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [suppressions, setSuppressions] = useState<SuppressionRow[]>([]);
  const [brief, setBrief] = useState("");
  const [mode, setMode] = useState<"free" | "byok" | "dual">("free");
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [events, setEvents] = useState<RunEventRow[]>([]);
  const [queue, setQueue] = useState<Queue>("A");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewPayload, setPreviewPayload] = useState<unknown>(null);
  const [supKind, setSupKind] = useState<"email" | "domain">("domain");
  const [supValue, setSupValue] = useState("");
  const [supReason, setSupReason] = useState("");

  const load = useCallback(async () => {
    const [lRes, rRes, sRes] = await Promise.all([
      fetch("/api/sdr/leads"),
      fetch("/api/runs"),
      fetch("/api/suppressions"),
    ]);
    const [lData, rData, sData] = await Promise.all([jsonOrError(lRes), jsonOrError(rRes), jsonOrError(sRes)]);
    return { lData, rData, sData };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { lData, rData, sData } = await load();
      setLeads(lData.leads || []);
      setRuns(rData.runs || []);
      setSuppressions(sData.suppressions || []);
      const warn = lData.warning || rData.warning || lData.error || rData.error;
      if (warn) setError(String(warn));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { lData, rData, sData } = await load();
        if (cancelled) return;
        setLeads(lData.leads || []);
        setRuns(rData.runs || []);
        setSuppressions(sData.suppressions || []);
        if (!selectedRunId && rData.runs?.[0]?.id) setSelectedRunId(rData.runs[0].id);
        const warn = lData.warning || rData.warning || lData.error || rData.error;
        if (warn) setError(String(warn));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  const selectedRun = runs.find((r) => r.id === selectedRunId) || null;

  // Load + poll the selected run's step timeline.
  useEffect(() => {
    if (!selectedRunId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const tick = async () => {
      try {
        const res = await fetch(`/api/runs/${selectedRunId}`);
        const data = await res.json().catch(() => ({}));
        if (cancelled || !res.ok) return;
        setEvents(data.events || []);
        if (data.run) {
          setRuns((prev) => prev.map((r) => (r.id === data.run.id ? { ...r, ...data.run } : r)));
          if (data.run.status === "queued" || data.run.status === "running") {
            timer = setTimeout(tick, 3000);
          } else if (data.leads?.length) {
            setLeads((prev) => {
              const ids = new Set((data.leads as LeadRow[]).map((l) => l.id));
              return [...(data.leads as LeadRow[]), ...prev.filter((l) => !ids.has(l.id))];
            });
          }
        }
      } catch {
        /* transient */
      }
    };
    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [selectedRunId]);

  async function startRun() {
    if (!brief.trim()) {
      setError("Enter a campaign brief first");
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
      const data = await jsonOrError(res);
      if (!res.ok) throw new Error(data.error || "Failed to start run");
      setMsg(`Run queued (${mode}). Steps: ${STEPS.join(" → ")}.`);
      if (data.run?.id) {
        setRuns((prev) => [data.run, ...prev]);
        setSelectedRunId(data.run.id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  async function retryRun(runId: string) {
    setError(null);
    const res = await fetch(`/api/runs/${runId}/retry`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Retry failed");
      return;
    }
    setMsg("Run re-queued.");
    setRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, ...data.run } : r)));
    setSelectedRunId(null);
    setTimeout(() => setSelectedRunId(runId), 0);
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
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) setError(data.message || data.error || "Could not queue draft");
    else setMsg(data.message || "Draft queued");
    await refresh();
  }

  async function previewHubSpot(leadIds: string[]) {
    setMsg(null);
    const res = await fetch("/api/crm/hubspot/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadIds }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Preview failed");
      return;
    }
    setPreviewId(data.preview_id);
    setPreviewPayload(data.payload);
    setMsg(
      `HubSpot preview ready (${data.payload?.writable_count ?? 0} writable, ${data.payload?.skipped_count ?? 0} skipped). Approve to write — nothing written yet.`
    );
  }

  async function approveHubSpot() {
    if (!previewId) return;
    const res = await fetch("/api/crm/hubspot/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preview_id: previewId, approved: true }),
    });
    const data = await res.json().catch(() => ({}));
    setMsg(
      data.applied
        ? "HubSpot write applied via Composio."
        : data.message || data.status || data.error || JSON.stringify(data).slice(0, 200)
    );
    setPreviewId(null);
  }

  async function addSuppression(kind: "email" | "domain", value: string, reason?: string) {
    if (!value.trim()) return;
    const res = await fetch("/api/suppressions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, value, reason: reason || null }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || data.rejected?.[0]?.error || "Could not add suppression");
      return;
    }
    setSupValue("");
    setSupReason("");
    setMsg(`Suppressed ${kind} ${value}. Future runs will flag it.`);
    await refresh();
  }

  async function removeSuppression(id: string) {
    const res = await fetch(`/api/suppressions?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not remove suppression");
      return;
    }
    setSuppressions((prev) => prev.filter((s) => s.id !== id));
  }

  const queues = useMemo(() => {
    const q: Record<Queue, LeadRow[]> = { A: [], B: [], C: [], flagged: [] };
    for (const l of leads) {
      if (isFlagged(l)) q.flagged.push(l);
      else if (l.tier === "A") q.A.push(l);
      else if (l.tier === "B") q.B.push(l);
      else q.C.push(l);
    }
    return q;
  }, [leads]);

  const visible = queues[queue];
  const stepState = (step: string) => {
    const evs = events.filter((e) => e.step === step);
    const last = evs[evs.length - 1];
    if (!last) return selectedRun?.current_step === step && selectedRun.status === "running" ? "running" : "pending";
    return last.level === "error" ? "error" : last.level === "warn" ? "warn" : "done";
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Outbound harness</h1>
          <p className="text-base text-slate-500 mt-1 max-w-2xl">
            Brief → plan → discover → enrich → verify → guard → score → deliver. Free path
            (DuckDuckGo + X + MX) or your own Apollo / Hunter via Composio. Never fabricates
            contacts. Nothing is sent without your approval.
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatTile value={String(runs.length)} label="Runs" />
        <StatTile value={String(queues.A.length)} label="Tier A" tone="verified" />
        <StatTile value={String(queues.B.length)} label="Tier B" tone="brand" />
        <StatTile value={String(queues.C.length)} label="Tier C / review" />
        <StatTile value={String(queues.flagged.length)} label="Suppressed / dup" tone="premium" />
      </div>

      {(error || msg) && (
        <div className="space-y-2">
          {error && (
            <div className="text-sm text-red-700 bg-red-50 rounded-lg p-3 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {msg && <div className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{msg}</div>}
        </div>
      )}

      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-base font-semibold">
          <Play className="w-4 h-4" /> Campaign brief
        </div>
        <textarea
          className="w-full border rounded-lg p-3 text-sm min-h-[96px]"
          placeholder="ICP, roles, geography, signals… e.g. B2B SaaS RevOps leaders in the US hiring SDRs"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />
        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-medium text-slate-600">
            Enrichment
            <select
              className="ml-2 border rounded px-2 py-1 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value as "free" | "byok" | "dual")}
            >
              <option value="free">Free (DDG + X + MX)</option>
              <option value="byok">BYOK (Apollo / Hunter via Composio)</option>
              <option value="dual">Dual (BYOK waterfall + free fallback)</option>
            </select>
          </label>
          <Button onClick={startRun} disabled={running}>
            <Search className="w-4 h-4 mr-2" />
            {running ? "Starting…" : "Run prospecting"}
          </Button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="font-semibold text-base mb-3">Runs</div>
          {runs.length === 0 ? (
            <p className="text-sm text-slate-500">No runs yet. Start one from the brief above.</p>
          ) : (
            <div className="space-y-1 max-h-[360px] overflow-y-auto">
              {runs.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRunId(r.id)}
                  className={`w-full text-left rounded-lg px-2 py-2 text-sm hover:bg-slate-50 ${
                    r.id === selectedRunId ? "bg-slate-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Badge tone={r.status === "completed" ? "verified" : r.status === "failed" ? "danger" : "attention"}>
                      {r.status}
                    </Badge>
                    <span className="text-xs text-slate-500">{r.enrichment_mode}</span>
                  </div>
                  <div className="mt-1 text-slate-700 line-clamp-2">{r.brief}</div>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-base">Run timeline</div>
            {selectedRun && (selectedRun.status === "failed" || selectedRun.status === "cancelled") && (
              <Button variant="outline" size="sm" onClick={() => retryRun(selectedRun.id)}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry run
              </Button>
            )}
          </div>
          {!selectedRun ? (
            <p className="text-sm text-slate-500">Select a run to see each step.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {STEPS.map((s) => {
                  const st = stepState(s);
                  return (
                    <span
                      key={s}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        st === "done"
                          ? "bg-emerald-50 text-emerald-700"
                          : st === "warn"
                            ? "bg-amber-50 text-amber-700"
                            : st === "error"
                              ? "bg-red-50 text-red-700"
                              : st === "running"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {st === "done" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : st === "error" ? (
                        <XCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {s}
                    </span>
                  );
                })}
              </div>
              {selectedRun.error && (
                <div className="text-sm text-red-700 bg-red-50 rounded p-2">Error: {selectedRun.error}</div>
              )}
              <div className="divide-y max-h-[280px] overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-sm text-slate-500 py-2">
                    {selectedRun.status === "queued" || selectedRun.status === "running"
                      ? "Waiting for the first step…"
                      : "No step events recorded for this run."}
                  </p>
                ) : (
                  events.map((e, i) => (
                    <div key={e.id || i} className="py-2 text-sm flex gap-3">
                      <span className="w-20 shrink-0 font-mono text-xs text-slate-500">{e.step}</span>
                      <div className="flex-1">
                        <div className={e.level === "error" ? "text-red-700" : e.level === "warn" ? "text-amber-700" : ""}>
                          {e.message}
                        </div>
                        {e.error && <div className="text-xs text-red-600">{e.error}</div>}
                        {e.meta && Object.keys(e.meta).length > 0 && (
                          <div className="text-xs text-slate-500 truncate">{JSON.stringify(e.meta)}</div>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">
                        {e.duration_ms != null ? `${e.duration_ms} ms` : ""}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 font-semibold text-base">
              <Users className="w-4 h-4" /> Lead queues
            </div>
            <div className="flex gap-1">
              {(["A", "B", "C", "flagged"] as Queue[]).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQueue(q)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    queue === q ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {q === "flagged" ? "Suppressed / dup" : `Tier ${q}`} ({queues[q].length})
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => previewHubSpot(visible.filter((l) => l.email && !isFlagged(l)).map((l) => l.id))}
              disabled={!visible.some((l) => l.email && !isFlagged(l))}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              HubSpot preview
            </Button>
          </div>
          {visible.length === 0 ? (
            <p className="text-sm text-slate-500">
              No leads in this queue. Empty results mean nothing was found — we never invent contacts.
            </p>
          ) : (
            <div className="divide-y max-h-[420px] overflow-y-auto">
              {visible.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelected(l)}
                  className="w-full text-left py-3 flex items-start justify-between gap-3 hover:bg-slate-50 px-1"
                >
                  <div>
                    <div className="font-medium text-sm">
                      {l.contact_name || l.name || "No named contact"}{" "}
                      <span className="text-slate-400 font-normal">@ {l.company}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {l.email || "email unknown"} · {l.dns_status || "dns?"} · {l.verification_status || "not_checked"}
                      {l.enrichment?.source ? ` · via ${l.enrichment.source}` : ""}
                    </div>
                    {l.signal && <div className="text-xs text-slate-600 mt-1 line-clamp-2">{l.signal}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {l.tier && <Badge tone="brand">Tier {l.tier}</Badge>}
                    <span className="text-xs text-slate-500">{l.icp_score ?? "—"}</span>
                    <Badge tone={isFlagged(l) ? "blocked" : "neutral"}>{l.status === "ready" ? l.disposition : l.status}</Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5 space-y-3">
          <div className="font-semibold text-base">Lead detail</div>
          {!selected ? (
            <p className="text-sm text-slate-500">Select a lead</p>
          ) : (
            <>
              <div className="text-sm">
                <div className="font-medium">
                  {selected.contact_name || selected.name || "No named contact"} — {selected.title || "role unknown"}
                </div>
                <div className="text-slate-500">
                  {selected.company}
                  {selected.domain ? ` · ${selected.domain}` : ""}
                </div>
              </div>
              <div className="text-xs space-y-1 text-slate-600">
                <div>Email: {selected.email || "null"}</div>
                <div>Provenance: {selected.provenance || "—"}</div>
                <div>
                  Enrichment: {selected.enrichment?.mode || "free"} → {selected.enrichment?.source || "none"}
                  {selected.enrichment?.attempted?.length ? ` (tried ${selected.enrichment.attempted.join(" → ")})` : ""}
                </div>
                {selected.enrichment?.notes?.length ? <div>Notes: {selected.enrichment.notes.join("; ")}</div> : null}
                <div>DNS: {selected.dns_status}</div>
                <div>Verify: {selected.verification_status}</div>
                <div>Disposition: {selected.disposition}</div>
                {(selected.blockers || []).length > 0 && <div>Blockers: {(selected.blockers || []).join(", ")}</div>}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => queueDraft(selected)} disabled={isFlagged(selected)}>
                  <Mail className="w-4 h-4 mr-2" />
                  Queue draft (no send)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => previewHubSpot([selected.id])}
                  disabled={!selected.email || isFlagged(selected)}
                >
                  HubSpot preview
                </Button>
                {selected.domain && (
                  <Button size="sm" variant="ghost" onClick={() => addSuppression("domain", selected.domain!, "suppressed from lead detail")}>
                    <Ban className="w-4 h-4 mr-2" />
                    Suppress domain
                  </Button>
                )}
                {selected.email && (
                  <Button size="sm" variant="ghost" onClick={() => addSuppression("email", selected.email!, "suppressed from lead detail")}>
                    <Ban className="w-4 h-4 mr-2" />
                    Suppress email
                  </Button>
                )}
              </div>
            </>
          )}

          {previewPayload != null && (
            <div className="mt-4 border-t pt-3 space-y-2">
              <div className="text-xs font-semibold">HubSpot preview (nothing written yet)</div>
              <pre className="text-[11px] bg-slate-50 p-2 rounded max-h-48 overflow-auto">
                {JSON.stringify(previewPayload, null, 2)}
              </pre>
              <Button size="sm" onClick={approveHubSpot} disabled={!previewId}>
                Approve write
              </Button>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2 font-semibold text-base">
          <Ban className="w-4 h-4" /> Suppression list
        </div>
        <p className="text-sm text-slate-500">
          Emails and domains here are flagged in every future run and can never be queued or synced.
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={supKind}
            onChange={(e) => setSupKind(e.target.value as "email" | "domain")}
          >
            <option value="domain">Domain</option>
            <option value="email">Email</option>
          </select>
          <input
            className="border rounded px-2 py-1 text-sm flex-1 min-w-[180px]"
            placeholder={supKind === "domain" ? "example.com" : "name@example.com"}
            value={supValue}
            onChange={(e) => setSupValue(e.target.value)}
          />
          <input
            className="border rounded px-2 py-1 text-sm flex-1 min-w-[160px]"
            placeholder="Reason (optional)"
            value={supReason}
            onChange={(e) => setSupReason(e.target.value)}
          />
          <Button size="sm" onClick={() => addSuppression(supKind, supValue, supReason)} disabled={!supValue.trim()}>
            Add
          </Button>
        </div>
        {suppressions.length === 0 ? (
          <p className="text-sm text-slate-500">No suppressions yet.</p>
        ) : (
          <div className="divide-y max-h-[240px] overflow-y-auto">
            {suppressions.map((s) => (
              <div key={s.id} className="py-2 flex items-center justify-between text-sm">
                <div>
                  <Badge>{s.kind}</Badge> <span className="font-medium">{s.value}</span>
                  {s.reason && <span className="text-slate-500"> · {s.reason}</span>}
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${s.value}`}
                  className="text-slate-400 hover:text-red-600"
                  onClick={() => removeSuppression(s.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
