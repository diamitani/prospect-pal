import { NextRequest, NextResponse } from "next/server";
import { TABLES } from "@/lib/db/tables";
import { isUuid, ownerOrFilter, requireUser } from "@/lib/harness/auth";
import { getDb } from "@/lib/harness/db";
import { normalizeSuppressionValue } from "@/lib/prospecting/guardrails";
import type { SuppressionKind } from "@/lib/prospecting/types";

export const runtime = "nodejs";

const KINDS: SuppressionKind[] = ["email", "domain"];

export async function GET() {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const supabase = await getDb();
  if (!supabase) return NextResponse.json({ suppressions: [], warning: "supabase_unavailable" });
  const { data, error } = await supabase
    .from(TABLES.suppressions)
    .select("*")
    .or(ownerOrFilter(auth.owner, "user_id"))
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) return NextResponse.json({ suppressions: [], error: error.message });
  return NextResponse.json({ suppressions: data || [] });
}

/** Body: { kind: "email"|"domain", value, reason? } or { entries: [...] } */
export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const body = await req.json().catch(() => ({}));
  const entries: { kind?: string; value?: string; reason?: string }[] = Array.isArray(body.entries)
    ? body.entries
    : [body];

  const rows: { user_id: string; workspace_id: string | null; kind: SuppressionKind; value: string; reason: string | null }[] = [];
  const rejected: { value: unknown; error: string }[] = [];
  for (const e of entries.slice(0, 500)) {
    const kind = e.kind as SuppressionKind;
    if (!KINDS.includes(kind)) {
      rejected.push({ value: e.value, error: "kind must be email or domain" });
      continue;
    }
    const value = normalizeSuppressionValue(kind, String(e.value ?? ""));
    if (!value) {
      rejected.push({ value: e.value, error: `invalid ${kind}` });
      continue;
    }
    rows.push({
      user_id: auth.owner.userId,
      workspace_id: auth.owner.workspaceId,
      kind,
      value,
      reason: e.reason ? String(e.reason).slice(0, 300) : null,
    });
  }
  if (rows.length === 0) {
    return NextResponse.json({ error: "no valid entries", rejected }, { status: 400 });
  }

  const supabase = await getDb();
  if (!supabase) return NextResponse.json({ error: "supabase_unavailable" }, { status: 503 });
  const { data, error } = await supabase
    .from(TABLES.suppressions)
    .upsert(rows, { onConflict: "user_id,kind,value", ignoreDuplicates: false })
    .select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ suppressions: data || [], rejected }, { status: 201 });
}

/** DELETE ?id=<uuid>  or  ?kind=email&value=x@y.com */
export async function DELETE(req: NextRequest) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const supabase = await getDb();
  if (!supabase) return NextResponse.json({ error: "supabase_unavailable" }, { status: 503 });

  const sp = req.nextUrl.searchParams;
  const id = sp.get("id");
  let q = supabase.from(TABLES.suppressions).delete().eq("user_id", auth.owner.userId);
  if (id) {
    if (!isUuid(id)) return NextResponse.json({ error: "invalid id" }, { status: 400 });
    q = q.eq("id", id);
  } else {
    const kind = sp.get("kind") as SuppressionKind | null;
    const value = kind && KINDS.includes(kind) ? normalizeSuppressionValue(kind, sp.get("value") || "") : null;
    if (!kind || !value) {
      return NextResponse.json({ error: "id or kind+value required" }, { status: 400 });
    }
    q = q.eq("kind", kind).eq("value", value);
  }
  const { data, error } = await q.select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: (data || []).length });
}
