import { test, expect } from "@playwright/test";
import { CANONICAL_ORIGIN, resolveSiteUrl } from "../lib/site";

// Unit-style, in the runner process. resolveSiteUrl() reads process.env at CALL time, which is
// what makes this testable without rebuilding the app — and it is the reason lib/site.ts keeps
// the function separate from the SITE_URL constant it feeds.
//
// Every case below produced a wrong canonical, a wrong sitemap <loc>, a wrong robots Sitemap:
// line, a wrong schema url and a wrong og:image on the BeBest live site on 9 Sept 2026. One
// environment variable, five wrong things, and nothing failed loudly.

const ORIGINAL = process.env.NEXT_PUBLIC_SITE_URL;

test.afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL;
});

test("an unset variable falls back to the www origin, not the apex that redirects", () => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  expect(resolveSiteUrl()).toBe(CANONICAL_ORIGIN);
  expect(CANONICAL_ORIGIN, "the fallback must be the www host").toContain("//www.");
});

test("an empty or whitespace value falls back rather than yielding an empty origin", () => {
  for (const value of ["", "   "]) {
    process.env.NEXT_PUBLIC_SITE_URL = value;
    expect(resolveSiteUrl(), `should have fallen back for ${JSON.stringify(value)}`).toBe(CANONICAL_ORIGIN);
  }
});

test("trailing slashes are stripped, so a built URL can never contain a double slash", () => {
  for (const value of [`${CANONICAL_ORIGIN}/`, `${CANONICAL_ORIGIN}///`]) {
    process.env.NEXT_PUBLIC_SITE_URL = value;
    const url = resolveSiteUrl();
    expect(url).toBe(CANONICAL_ORIGIN);
    expect(`${url}/services/emergency-plumbing`).not.toContain("//services");
    expect(`${url}/services/emergency-plumbing`).toBe(`${CANONICAL_ORIGIN}/services/emergency-plumbing`);
  }
});

test("any vercel.app host is rejected, bare, subdomained, port and trailing slash included", () => {
  for (const value of [
    "https://speedy.vercel.app",
    "https://speedy-git-main-someteam.vercel.app/",
    "https://vercel.app",
    "https://speedy.vercel.app:3000",
    "https://speedy.vercel.app:3000/",
  ]) {
    process.env.NEXT_PUBLIC_SITE_URL = value;
    // A deployment host must never become the canonical origin, whatever the variable says:
    // a preview that canonicalises to itself competes with the real domain for its own pages.
    expect(resolveSiteUrl(), `should have rejected ${value}`).toBe(CANONICAL_ORIGIN);
  }
});

test("a real non-Vercel origin passes through, including the Playwright test server", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "http://127.0.0.1:4123";
  expect(resolveSiteUrl()).toBe("http://127.0.0.1:4123");

  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
  expect(resolveSiteUrl()).toBe("http://localhost:3000");

  process.env.NEXT_PUBLIC_SITE_URL = CANONICAL_ORIGIN;
  expect(resolveSiteUrl()).toBe(CANONICAL_ORIGIN);
});
