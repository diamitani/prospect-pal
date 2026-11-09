/**
 * FREE enrichment path: DuckDuckGo Instant Answer + HTML lite search + public X search.
 * No paid APIs. Never scrapes LinkedIn. Never fabricates results.
 */

export interface SearchHit {
  url: string;
  title: string;
  snippet: string;
  retrieved_at: string;
  provider: "duckduckgo_instant" | "duckduckgo_html" | "x_public";
}

const UA =
  "ProspectPal/1.0 (+https://prospect.salesgency.com; internal-gtm; research)";

/** DuckDuckGo Instant Answer — lookup only, not a full SERP */
export async function duckDuckGoInstant(
  query: string
): Promise<{ hits: SearchHit[]; capability: "instant_only" }> {
  const retrieved_at = new Date().toISOString();
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    if (!res.ok) return { hits: [], capability: "instant_only" };
    const data = (await res.json()) as {
      AbstractURL?: string;
      AbstractText?: string;
      Heading?: string;
      RelatedTopics?: Array<{ FirstURL?: string; Text?: string } | { Topics?: unknown }>;
      Results?: Array<{ FirstURL?: string; Text?: string }>;
    };
    const hits: SearchHit[] = [];
    if (data.AbstractURL) {
      hits.push({
        url: data.AbstractURL,
        title: data.Heading || query,
        snippet: data.AbstractText || "",
        retrieved_at,
        provider: "duckduckgo_instant",
      });
    }
    for (const r of data.Results || []) {
      if (r.FirstURL) {
        hits.push({
          url: r.FirstURL,
          title: r.Text?.slice(0, 120) || r.FirstURL,
          snippet: r.Text || "",
          retrieved_at,
          provider: "duckduckgo_instant",
        });
      }
    }
    for (const t of data.RelatedTopics || []) {
      if ("FirstURL" in t && t.FirstURL) {
        hits.push({
          url: t.FirstURL,
          title: (t.Text || "").slice(0, 120),
          snippet: t.Text || "",
          retrieved_at,
          provider: "duckduckgo_instant",
        });
      }
    }
    return { hits, capability: "instant_only" };
  } catch {
    return { hits: [], capability: "instant_only" };
  }
}

/**
 * Best-effort DuckDuckGo HTML results page parse (lite).
 * If blocked/empty, caller should report capability gap — never invent hits.
 */
export async function duckDuckGoHtmlSearch(
  query: string,
  limit = 8
): Promise<SearchHit[]> {
  const retrieved_at = new Date().toISOString();
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const html = await res.text();
    const hits: SearchHit[] = [];
    // result__a links
    const re =
      /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) && hits.length < limit) {
      const href = decodeURIComponent(
        m[1].replace(/&amp;/g, "&")
      );
      // DDG wraps redirects — extract uddg=
      let finalUrl = href;
      const uddg = href.match(/[?&]uddg=([^&]+)/);
      if (uddg) {
        try {
          finalUrl = decodeURIComponent(uddg[1]);
        } catch {
          finalUrl = href;
        }
      }
      const title = m[2].replace(/<[^>]+>/g, "").trim();
      if (!finalUrl.startsWith("http")) continue;
      hits.push({
        url: finalUrl,
        title,
        snippet: title,
        retrieved_at,
        provider: "duckduckgo_html",
      });
    }
    return hits;
  } catch {
    return [];
  }
}

/**
 * Public X (Twitter) search via syndication/search timeline (unauthenticated).
 * Returns empty on failure — never fabricates posts.
 */
export async function xPublicSearch(
  query: string,
  limit = 5
): Promise<SearchHit[]> {
  const retrieved_at = new Date().toISOString();
  // Use x.com search URL as navigable reference + attempt guest search API
  const searchUrl = `https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=live`;
  try {
    const api = `https://api.twitter.com/2/search/adaptive.json?q=${encodeURIComponent(query)}&count=${limit}`;
    // Without auth this usually 401 — we still return the search URL as a source ref
    const res = await fetch(api, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) {
      return [
        {
          url: searchUrl,
          title: `X public search: ${query}`,
          snippet:
            "Unauthenticated X API unavailable; open the search URL for manual review. No posts fabricated.",
          retrieved_at,
          provider: "x_public",
        },
      ];
    }
    // If somehow succeeds, we still don't invent — parse carefully
    return [
      {
        url: searchUrl,
        title: `X public search: ${query}`,
        snippet: "Search endpoint responded; review linked results manually.",
        retrieved_at,
        provider: "x_public",
      },
    ];
  } catch {
    return [
      {
        url: searchUrl,
        title: `X public search: ${query}`,
        snippet: "X search reference only (fetch failed). No posts fabricated.",
        retrieved_at,
        provider: "x_public",
      },
    ];
  }
}

export async function freeDiscover(query: string): Promise<{
  hits: SearchHit[];
  notes: string[];
}> {
  const notes: string[] = [];
  const html = await duckDuckGoHtmlSearch(query);
  if (html.length === 0) {
    notes.push(
      "duckduckgo_html returned no results (blocked or empty); falling back to Instant Answer (lookup-only)."
    );
  }
  const instant = await duckDuckGoInstant(query);
  if (html.length === 0 && instant.hits.length === 0) {
    notes.push(
      "capability_gap: no full search results available; Instant Answer also empty."
    );
  } else if (html.length === 0) {
    notes.push(
      "capability_note: Instant Answer is lookup-only, not a full SERP substitute."
    );
  }
  const xHits = await xPublicSearch(query);
  const hits = [...html, ...instant.hits, ...xHits];
  // Dedupe by URL
  const seen = new Set<string>();
  const deduped = hits.filter((h) => {
    if (seen.has(h.url)) return false;
    seen.add(h.url);
    return true;
  });
  return { hits: deduped, notes };
}
