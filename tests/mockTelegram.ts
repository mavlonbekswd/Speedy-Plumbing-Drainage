// A local stand-in for api.telegram.org.
//
// The app reaches it because playwright.config.ts sets TELEGRAM_API_BASE, which is unset in
// every real environment. That is the whole safety story: with the mock in front, the booking
// path can be proven end to end — validation, message shape, the click id, the failure branch —
// without one message ever reaching the client's real group.
//
// It records enough to assert on the message TEXT for a JSON call, and deliberately does NOT
// JSON.parse a multipart body: a photo upload is bytes, and the thing worth asserting about it
// is the byte length and which parts were sent, not a parse that would throw.
//
// The bot token never appears in a recorded path. A token is a credential even when it is fake,
// and a failing test prints what it recorded.

import { createServer, type Server } from "node:http";

export interface MockTelegramCall {
  /** The API method: "sendMessage", "sendPhoto", "sendMediaGroup". */
  method: string;
  /** The request path with the token segment replaced by `bot<redacted>`. */
  path: string;
  contentType: string;
  /** Raw request body length in bytes. Meaningful for both JSON and multipart. */
  byteLength: number;
  /** Parsed body, for `application/json` only. */
  body?: Record<string, unknown>;
  /** Part names in document order, for `multipart/form-data` only. Never parsed further. */
  partNames?: string[];
}

export interface MockTelegram {
  /** Every call since the last reset, in order. */
  calls: MockTelegramCall[];
  /** Clear the log and the failure setting. Call it in `beforeEach`. */
  reset(): void;
  /**
   * Make one method fail, to prove the customer is told to ring rather than given a false
   * success. `setFailure(null)` clears it.
   */
  setFailure(method: string | null, status?: number): void;
  close(): Promise<void>;
  port: number;
}

const TOKEN_SEGMENT = /^\/bot[^/]+/;

function redactPath(url: string): string {
  return url.replace(TOKEN_SEGMENT, "/bot<redacted>");
}

function methodOf(url: string): string {
  const path = url.split("?")[0];
  const parts = path.split("/").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : "";
}

/** Part names from a multipart body, read as latin1 so the byte length stays honest. */
function partNamesOf(raw: Buffer): string[] {
  const names: string[] = [];
  for (const match of raw.toString("latin1").matchAll(/content-disposition:\s*form-data;[^\r\n]*?\bname="([^"]*)"/gi)) {
    names.push(match[1]);
  }
  return names;
}

export async function startMockTelegram(port: number): Promise<MockTelegram> {
  const calls: MockTelegramCall[] = [];
  let failMethod: string | null = null;
  let failStatus = 500;

  const server: Server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks);
      const url = req.url ?? "";
      const contentType = String(req.headers["content-type"] ?? "");
      const method = methodOf(url);

      const call: MockTelegramCall = {
        method,
        path: redactPath(url),
        contentType,
        byteLength: raw.byteLength,
      };

      if (contentType.includes("application/json")) {
        try {
          call.body = JSON.parse(raw.toString("utf8") || "{}") as Record<string, unknown>;
        } catch {
          call.body = { __unparseable: raw.toString("utf8").slice(0, 200) };
        }
      } else if (contentType.includes("multipart/form-data")) {
        call.partNames = partNamesOf(raw);
      }

      calls.push(call);

      const failing = failMethod !== null && failMethod === method;
      const status = failing ? failStatus : 200;
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify(
          failing
            ? { ok: false, error_code: status, description: "mock telegram failure" }
            : { ok: true, result: { message_id: calls.length } },
        ),
      );
    });
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });

  return {
    calls,
    port,
    reset() {
      calls.length = 0;
      failMethod = null;
      failStatus = 500;
    },
    setFailure(method: string | null, status = 500) {
      failMethod = method;
      failStatus = status;
    },
    close() {
      return new Promise<void>((resolve) => server.close(() => resolve()));
    },
  };
}
