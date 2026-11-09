import { describe, expect, it } from "vitest";
import {
  guessBusinessEmails,
  isPersonalWebmail,
  parseContactName,
} from "@/lib/prospecting/email-patterns";

describe("email patterns", () => {
  it("rejects personal webmail", () => {
    expect(isPersonalWebmail("gmail.com")).toBe(true);
    expect(guessBusinessEmails("Ada Lovelace", "gmail.com")).toEqual([]);
  });

  it("emits at most 3 labeled guesses", () => {
    const g = guessBusinessEmails("Ada Lovelace", "analyticalengine.com");
    expect(g.length).toBeLessThanOrEqual(3);
    expect(g[0].email).toBe("ada.lovelace@analyticalengine.com");
    expect(g.every((x) => x.provenance === "guessed")).toBe(true);
  });

  it("ambiguous single name → no guesses", () => {
    expect(parseContactName("Ada")?.ambiguous).toBe(true);
    expect(guessBusinessEmails("Ada", "x.com")).toEqual([]);
  });
});
