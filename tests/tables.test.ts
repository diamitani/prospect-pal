import { describe, expect, it } from "vitest";
import { TABLES } from "@/lib/db/tables";

describe("namespaced tables", () => {
  it("uses ppal_ prefix so Enably public.runs / artifacts / workspaces are untouched", () => {
    expect(TABLES.runs).toBe("ppal_runs");
    expect(TABLES.leads).toBe("ppal_leads");
    expect(TABLES.crmWritePreviews).toBe("ppal_crm_write_previews");
    for (const name of Object.values(TABLES)) {
      expect(name.startsWith("ppal_")).toBe(true);
    }
  });
});
