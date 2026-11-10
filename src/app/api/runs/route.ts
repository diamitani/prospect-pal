import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-supabase";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import type { CreateRunRequest, EnrichmentMode } from "@/lib/prospecting/types";
import { TABLES } from "@/lib/db/tables";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getSession().catch(() => null);
    const supabase = createAdminClient() || (await createClient().catch(() => null));
    if (!supabase) {
      return NextResponse.json({ runs: [], warning: "supabase_unavailable" });
    }
    let q = supabase.from(TABLES.runs).select("*").order("created_at", { ascending: false }).limit(50);
    if (session?.workspaceId) {
      q = q.eq("workspace_id", session.workspaceId);
    }
    const { data, error } = await q;
    if (error) {
      return NextResponse.json({ runs: [], error: error.message }, { status: 200 });
    }
    return NextResponse.json({ runs: data || [] });
  } catch (err) {
    return NextResponse.json(
      { runs: [], error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession().catch(() => null);
    const body = (await req.json()) as CreateRunRequest;
    if (!body?.brief || typeof body.brief !== "string") {
      return NextResponse.json({ error: "brief is required" }, { status: 400 });
    }

    const enrichment_mode = (body.enrichment_mode ||
      "free") as EnrichmentMode;

    const supabase = createAdminClient() || (await createClient().catch(() => null));
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL and keys" },
        { status: 503 }
      );
    }

    const row = {
      workspace_id: body.workspace_id || session?.workspaceId || null,
      created_by: session?.id || null,
      status: "queued",
      brief: body.brief.trim(),
      enrichment_mode,
      plan: body.plan || null,
      progress: [],
      notes: [],
    };

    const { data, error } = await supabase.from(TABLES.runs).insert(row).select("*").single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fire-and-forget worker kick (same deployment)
    const base =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
    if (base && data?.id) {
      fetch(`${base}/api/runs/${data.id}/worker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-prospect-pal-worker": process.env.WORKER_SECRET || "dev",
        },
        body: JSON.stringify({ kick: true }),
      }).catch((e) => console.warn("[runs] worker kick failed", e));
    }

    return NextResponse.json({ run: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
