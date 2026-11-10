/**
 * Prospect Pal table names — prefixed `ppal_` so they do not collide with the
 * Enably Supabase project (`public.runs`, `public.workspaces`, `public.artifacts`,
 * `public.workspace_members`).
 *
 * Do NOT write to unprefixed `runs` / `workspaces` / `artifacts` on Enably.
 */
export const TABLES = {
  runs: "ppal_runs",
  leads: "ppal_leads",
  crmWritePreviews: "ppal_crm_write_previews",
} as const;
