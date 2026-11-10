# Prospect Pal by Salesgency — Internal GTM

Target URL: https://prospect.salesgency.com

## Supabase: Enably project

Use the **existing Enably** Supabase project (the one already connected to [`diamitani/enablygtm`](https://github.com/diamitani/enablygtm), live at https://enablygtm.vercel.app).

The exact Project URL / ref is **not stored in the Enably repo** (`.env.example` leaves it blank) and was not discoverable from public HTML. Copy it from:

**Supabase dashboard → project “Enably” → Settings → API → Project URL**  
(`https://<project-ref>.supabase.co`)

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` (server only) in `.env.local` and Vercel. Never commit keys.

### Table conflicts — use namespaced tables

Enably already defines `public.workspaces`, `public.workspace_members`, `public.runs`, and `public.artifacts` with a **different** schema (text ids, GTM architect manifests). Applying the older Prospect Pal `runs`/`leads` migrations would collide.

**Apply only** `supabase/migrations/20261110000000_ppal_namespaced_tables.sql` (creates `ppal_runs`, `ppal_leads`, `ppal_crm_write_previews`). Optional: `001_rostr_mcp.sql` (`rostr_*` names, no clash).

Do **not** run `20261109000000_runs_and_leads_v2.sql`, `20261109000001_leads_bootstrap_if_missing.sql`, or `supabase-schema.sql` against Enably.

## Auth (open signup)

Signup is open. Providers: **Google**, **GitHub**, and email + password. Password reset: `/forgot-password` → email link → `/auth/callback?next=/reset-password` → `/reset-password`.

### Dashboard steps (do these yourself; this repo does not change live settings)

1. **Authentication → URL Configuration**
   - **Site URL:** `https://prospect.salesgency.com` (for this app). If Enably still uses the same project, add Prospect Pal URLs as additional Redirect URLs and do not drop Enably’s Site URL / redirects until you decide how to share the project. Preferred Site URL for Prospect Pal production is `https://prospect.salesgency.com`.
   - **Redirect URLs** (add all):
     - `https://prospect.salesgency.com/auth/callback`
     - `https://prospect.salesgency.com/**`
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/**`
     - `https://prospect-pal-two.vercel.app/auth/callback`
     - `https://prospect-pal-*-gptpat.vercel.app/**` (Vercel previews; confirm team slug)
     - Keep Enably URLs too if this project stays shared: `https://enablygtm.vercel.app/auth/callback`, `https://enablygtm-*-gptpat.vercel.app/**`

2. **Authentication → Providers → Google** (minimum): enable. Create an OAuth client in Google Cloud (Web application):
   - Authorized JavaScript origins: `https://prospect.salesgency.com`, `http://localhost:3000`, `https://<project-ref>.supabase.co`
   - Authorized redirect URI: **`https://<project-ref>.supabase.co/auth/v1/callback`** (shown in the Supabase Google provider panel)
   - Paste Client ID + Secret into Supabase.

3. **Authentication → Providers → GitHub**: enable. GitHub OAuth App:
   - Homepage: `https://prospect.salesgency.com`
   - Authorization callback URL: **`https://<project-ref>.supabase.co/auth/v1/callback`**
   - Paste Client ID + Secret into Supabase.

4. **Authentication → Emails**: keep confirmations linking to `{{ .SiteURL }}/auth/callback` (or `.../auth/callback?token_hash={{ .TokenHash }}&type=email&next=/dashboard`). For recovery, links must hit `/auth/callback?next=/reset-password`.

5. Run the `ppal_*` migration in the SQL editor (see above). Redeploy Prospect Pal with the Enably URL + keys.

## Local

```bash
cp .env.example .env.local
# fill Enably URL + anon + service role
npm install
npm run dev
npm test
npm run build
```
