# Prospect Pal by Salesgency — Internal GTM MVP

## What this is
Internal prospecting app for Salesgency. Dual enrichment:
1. **Free path** — prospector-skill procedure + DuckDuckGo + public X search refs + DNS/MX (zero paid keys).
2. **BYOK** — Composio-backed Apollo/Hunter/HubSpot connections.

## Manual setup
1. Apply SQL migrations in order under `supabase/migrations/` (especially `20261109000000_runs_and_leads_v2.sql`).
2. Copy `.env.example` → `.env.local` and fill Supabase + allowlist.
3. Deploy branch to Vercel project `prospect-pal`; set env vars; add domain `prospect.salesgency.com`.
4. DNS: CNAME `prospect` → `cname.vercel-dns.com` (or as Vercel Domains UI instructs) on the Salesgency DNS host.
5. Do **not** set `ALLOWLIST_OPEN=true` in production.

## HubSpot
Always `POST /api/crm/hubspot/preview` then `POST /api/crm/hubspot/approve` with `approved:true`. Never automatic.
