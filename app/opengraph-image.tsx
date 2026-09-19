import { ImageResponse } from "next/og";
import { CALL_NUMBER_DISPLAY, OG_IMAGE, TRADING_NAME } from "@/lib/site";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const MARK = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/brand/roadrunner-white.png")).toString("base64")}`;

// The card every share and every social scraper gets. Navy, the mark, the name, what we do and
// the number: nothing else. No photograph, and no claim beyond those words, because an OG card
// is the one piece of copy nobody proof-reads before it goes out.
//
// alt is read from lib/site.ts so the route and the `images[].alt` in every page's metadata
// are the same string by construction.
export const alt = OG_IMAGE.alt;
export const size = { width: OG_IMAGE.width, height: OG_IMAGE.height };
export const contentType = "image/png";

// No runtime = "edge": the default Node runtime generates this at build time and saves a
// second edge bundle on a file that never changes between deploys.

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#10296B",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* The roadrunner mark, white on the brand navy, embedded as a data URI because the OG
            renderer takes PNG (not WebP) and cannot fetch from /public at build time. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MARK} width={228} height={114} alt="" style={{ marginBottom: 44 }} />

        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 28,
            maxWidth: 900,
          }}
        >
          {TRADING_NAME}
        </div>

        <div style={{ display: "flex", fontSize: 32, color: "rgba(255,255,255,0.78)", marginBottom: 44 }}>
          Plumbing and drainage, 24/7
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-start",
            background: "#FFC233",
            color: "#0B1730",
            borderRadius: 9999,
            padding: "18px 40px",
            fontSize: 38,
            fontWeight: 700,
          }}
        >
          {CALL_NUMBER_DISPLAY}
        </div>
      </div>
    ),
    { ...size },
  );
}
