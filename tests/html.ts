// Served-HTML helpers.
//
// The method matters more than it sounds. These pages are Next.js App Router documents whose
// RSC flight payload is inlined inside `self.__next_f.push(...)` script blocks, so every hero
// line and every link target appears two or three times in the raw bytes. A naive regex over
// the whole file inflates every count and, worse, reports an internal link as PRESENT when
// only the flight payload mentions it — and a href that exists only inside a script is not a
// link a crawler follows. So: strip scripts and styles first, then measure.
//
// Two deliberate rules, both of which a later reader will want to argue with:
//
//  1. `visibleText` KEEPS the text inside elements carrying the `hidden` attribute. A closed
//     FAQ panel is still content a crawler reads, so the content checks count it.
//     `visibleTextExcludingHidden` is the stricter instrument, and the ad-to-page join uses it:
//     a pinned ad description hidden behind a disclosure is not a promise the visitor sees.
//  2. `unescapeEntities` does NOT rewrite an em-dash to a hyphen. The em-dash is a banned
//     pattern (lib/claims.ts), and normalising it here would quietly launder the violation.

import type { APIRequestContext } from "@playwright/test";

const SCRIPT_OR_STYLE = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
const NOSCRIPT_OR_TEMPLATE = /<(noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi;
const COMMENT = /<!--[\s\S]*?-->/g;
const TAG = /<[^>]+>/g;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  pound: "£",
  copy: "©",
  deg: "°",
  middot: "·",
  times: "×",
  eacute: "é",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  ndash: "–",
  // Kept as the real character on purpose: see the header note.
  mdash: "—",
  hellip: "…",
  bull: "•",
};

/**
 * Decode HTML entities, numeric ones generally rather than from a lookup table: React emits
 * `&#x27;` for an apostrophe, so "Bishop&#x27;s Stortford" has to come back as "Bishop's
 * Stortford" or every town-name mask and every verbatim-copy assertion silently misses it.
 */
export function unescapeEntities(input: string): string {
  return input.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, body: string) => {
    const lower = body.toLowerCase();
    if (lower.startsWith("#x")) {
      const code = Number.parseInt(lower.slice(2), 16);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    if (lower.startsWith("#")) {
      const code = Number.parseInt(lower.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[lower] ?? match;
  });
}

/** The document with every `<script>` and `<style>` block removed. The load-bearing step. */
export function stripScripts(html: string): string {
  return html.replace(SCRIPT_OR_STYLE, " ");
}

/** Scripts, styles, noscript, templates and comments: everything that is not readable content. */
function stripNonContent(html: string): string {
  return stripScripts(html).replace(NOSCRIPT_OR_TEMPLATE, " ").replace(COMMENT, " ");
}

function collapse(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Body text as a reader or a crawler sees it: scripts, styles, noscript and tags gone, entities
 * decoded, whitespace collapsed. Text inside `hidden` elements IS included — see the header.
 */
export function visibleText(html: string): string {
  return collapse(unescapeEntities(stripNonContent(html).replace(TAG, " ")));
}

// Elements that never carry content, so a `hidden` one only has its own tag to remove.
const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

const ANY_TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;

/** The bare `hidden` attribute, which is how React renders `hidden` and `hidden={true}`. */
function hasHiddenAttribute(attrs: string): boolean {
  return /(?:^|\s)hidden(?:\s*=\s*(?:""|''|"hidden"|'hidden'|hidden|"true"|'true'|true))?(?=\s|\/|$)/i.test(attrs);
}

/**
 * Remove every element carrying the `hidden` ATTRIBUTE, content and all, by depth-counting on
 * the tag name so a nested same-tag element does not close the region early.
 *
 * Deliberately only the attribute. Not `aria-hidden`, which is an accessibility signal rather
 * than a visibility one, and not Tailwind's `class="hidden"`, which is a media-query decision
 * this instrument cannot evaluate. The consequence is stated in the report as a page contract:
 * a line the ad-to-page join has to find must live in unconditionally rendered markup.
 */
export function removeHiddenElements(html: string): string {
  let out = html;

  for (let pass = 0; pass < 200; pass++) {
    ANY_TAG.lastIndex = 0;
    let start = -1;
    let end = -1;
    let match: RegExpExecArray | null;

    while ((match = ANY_TAG.exec(out)) !== null) {
      const [whole, closing, rawName, attrs] = match;
      if (closing) continue;
      if (!hasHiddenAttribute(attrs)) continue;

      const name = rawName.toLowerCase();
      start = match.index;

      if (VOID_ELEMENTS.has(name) || /\/\s*$/.test(attrs)) {
        end = start + whole.length;
        break;
      }

      let depth = 1;
      const inner = new RegExp(`<(/?)${name}\\b((?:"[^"]*"|'[^']*'|[^>"'])*)>`, "gi");
      inner.lastIndex = start + whole.length;
      let step: RegExpExecArray | null;
      while ((step = inner.exec(out)) !== null) {
        if (step[1]) {
          depth -= 1;
          if (depth === 0) {
            end = step.index + step[0].length;
            break;
          }
        } else if (!/\/\s*$/.test(step[2])) {
          depth += 1;
        }
      }
      // Unclosed: drop the rest of the document rather than pretend it closed.
      if (end === -1) end = out.length;
      break;
    }

    if (start === -1) return out;
    out = `${out.slice(0, start)} ${out.slice(end)}`;
  }

  return out;
}

/** Visible text with `hidden` elements removed as well: the always-visible copy, and only that. */
export function visibleTextExcludingHidden(html: string): string {
  return collapse(unescapeEntities(removeHiddenElements(stripNonContent(html)).replace(TAG, " ")));
}

/** Internal link targets from the RENDERED markup only, normalised to a bare path. */
export function internalHrefs(html: string): string[] {
  const out: string[] = [];
  for (const match of stripScripts(html).matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)) {
    const href = unescapeEntities(match[1]);
    if (!href.startsWith("/")) continue; // external, tel:, mailto:, WhatsApp, #fragment
    out.push(href.split(/[?#]/)[0].replace(/\/+$/, "") || "/");
  }
  return out;
}

/** Fetch one route's raw served HTML, insisting on a 200. */
export async function fetchHtml(request: APIRequestContext, path: string): Promise<string> {
  const response = await request.get(path);
  if (response.status() !== 200) throw new Error(`${path} returned ${response.status()}`);
  return response.text();
}

/** Fetch every route once. The map is keyed by the path exactly as it was asked for. */
export async function fetchAll(
  request: APIRequestContext,
  routes: readonly string[],
): Promise<Map<string, string>> {
  const pages = new Map<string, string>();
  for (const route of routes) pages.set(route, await fetchHtml(request, route));
  return pages;
}

/**
 * Inbound internal link count per route: how many OTHER pages carry at least one rendered
 * anchor pointing at it. Self-links do not count, because a page linking to itself gives it no
 * discovery path.
 */
export function inboundLinkCounts(pages: Map<string, string>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const route of pages.keys()) counts.set(route, 0);

  for (const [from, html] of pages) {
    for (const target of new Set(internalHrefs(html))) {
      if (target === from) continue;
      if (counts.has(target)) counts.set(target, counts.get(target)! + 1);
    }
  }
  return counts;
}

/** Lower-case word types: distinct words, letters only. The audit's own tokeniser. */
export function wordTypes(text: string): Set<string> {
  return new Set(text.toLowerCase().match(/[a-z][a-z'’]*/g) ?? []);
}

/**
 * Also counts tokens carrying digits, so "CB1", "IP28" and "A14" count as words. On a page with
 * no postcode district and no road number this changes nothing at all — and a missing postcode
 * district is one of the things a doorway page is missing.
 */
export function alphanumericTypes(text: string): Set<string> {
  return new Set(text.toLowerCase().match(/[a-z][a-z0-9'’]*/g) ?? []);
}

// Elements that end a run of text. Inline elements are deliberately absent: a <strong> inside a
// sentence must not split it, or "a <strong>free</strong> quote on WhatsApp" reads as three
// separate units and the sentence-level claims checks start firing on fragments.
const BLOCK_TAGS = new Set([
  "address", "article", "aside", "blockquote", "br", "button", "dd", "details", "div", "dl",
  "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5",
  "h6", "header", "hr", "label", "legend", "li", "main", "nav", "ol", "option", "p", "section",
  "summary", "table", "td", "th", "tr", "ul",
]);

const NAMED_TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g;

/**
 * Readable text split into the units a READER perceives as separate statements: one per block
 * element, then one per sentence inside it. No minimum length.
 *
 * `sentences()` is the wrong instrument for a per-statement claims check and the difference is
 * the whole reason this exists. It drops anything under five words and it merges an
 * unpunctuated fragment into whatever follows — so a button labelled "Free quote" sitting above
 * the WhatsApp line becomes one unit that mentions WhatsApp, and the check that exists to catch
 * exactly that passes.
 */
export function textUnits(html: string): string[] {
  const broken = stripNonContent(html)
    .replace(NAMED_TAG, (_whole, _closing: string, name: string) =>
      BLOCK_TAGS.has(name.toLowerCase()) ? "\n" : " ",
    )
    .replace(TAG, " ");

  return unescapeEntities(broken)
    .split("\n")
    .flatMap((block) => block.split(/(?<=[.?!])\s+/))
    .map((unit) => unit.replace(/[^\S\n]+/g, " ").trim())
    .filter(Boolean);
}

/** Sentence-ish units of five words or more: "does this URL carry a line of its own". */
export function sentences(text: string): string[] {
  return text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 5);
}

const LD_JSON = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

/** The raw text of every JSON-LD block, unparsed. */
export function jsonLdStrings(html: string): string[] {
  return [...html.matchAll(LD_JSON)].map((m) => m[1]);
}

/**
 * Every JSON-LD block, parsed. Tries the raw text first and the entity-decoded text second,
 * because whether React escapes the block depends on how the author rendered it, and both
 * spellings are legitimate.
 */
export function jsonLdBlocks(html: string): unknown[] {
  return jsonLdStrings(html).map((raw, index) => {
    try {
      return JSON.parse(raw);
    } catch {
      try {
        return JSON.parse(unescapeEntities(raw));
      } catch (error) {
        throw new Error(`JSON-LD block #${index} is not valid JSON: ${(error as Error).message}`);
      }
    }
  });
}

/** Depth-first walk of a parsed JSON-LD value, yielding every object in it. */
export function jsonLdObjects(value: unknown, out: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    for (const item of value) jsonLdObjects(item, out);
  } else if (value && typeof value === "object") {
    out.push(value as Record<string, unknown>);
    for (const item of Object.values(value as Record<string, unknown>)) jsonLdObjects(item, out);
  }
  return out;
}

/** A `<meta>` content value by `property` or `name`, in either attribute order. */
export function meta(html: string, key: string): string | null {
  const pattern = new RegExp(
    `<meta[^>]*(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']` +
      `|<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`,
    "i",
  );
  const match = html.match(pattern);
  return match ? unescapeEntities(match[1] ?? match[2]) : null;
}

/** The canonical href, or null. */
export function canonicalOf(html: string): string | null {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  return match ? unescapeEntities(match[1]) : null;
}

/** The document `<title>`, entity-decoded and collapsed. */
export function titleOf(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? collapse(unescapeEntities(match[1])) : null;
}

/** The robots meta content, or null. */
export function robotsOf(html: string): string | null {
  return meta(html, "robots");
}
