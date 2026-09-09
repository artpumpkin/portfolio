import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

function worker({ failInstall = false } = {}) {
  const listeners: Record<string, (event: unknown) => void> = {};
  const saved = new Response("saved portfolio");
  const cache = {
    addAll: vi.fn(async () => {
      if (failInstall) throw new Error("interrupted download");
    }),
    match: vi.fn(async () => saved.clone()),
  };
  const caches = {
    open: vi.fn(async () => cache),
    keys: vi.fn(async () => [
      "lachkar-offline-old",
      "lachkar-offline-new",
      "unrelated-cache",
    ]),
    delete: vi.fn(async () => true),
  };
  const fetch = vi.fn(async () => new Response("live portfolio"));
  const claim = vi.fn();
  const skipWaiting = vi.fn();
  runInNewContext(
    readFileSync("scripts/service-worker.js", "utf8")
      .replace('"__VERSION__"', '"new"')
      .replace(
        '"__ASSETS__"',
        JSON.stringify([
          "/",
          "/_next/static/chess.js",
          "/Salah_Eddine_Lachkar_CV.pdf",
        ]),
      ),
    {
      self: {
        location: { origin: "https://lachkar.me" },
        clients: { claim },
        skipWaiting,
        addEventListener: (
          name: string,
          listener: (event: unknown) => void,
        ) => {
          listeners[name] = listener;
        },
      },
      caches,
      fetch,
      URL,
      AbortController,
      setTimeout,
      clearTimeout,
      Request: class extends Request {
        constructor(url: string, options: RequestInit) {
          super(new URL(url, "https://lachkar.me"), options);
        }
      },
    },
  );
  async function lifecycle(name: string) {
    let task: Promise<unknown> | undefined;
    listeners[name]({
      waitUntil: (value: Promise<unknown>) => {
        task = value;
      },
    });
    await task;
  }
  function request(path: string, mode = "navigate", method = "GET") {
    let response: Promise<Response> | undefined;
    listeners.fetch({
      request: { url: new URL(path, "https://lachkar.me").href, mode, method },
      respondWith: (value: Promise<Response>) => {
        response = value;
      },
    });
    return response;
  }
  return { cache, caches, fetch, claim, skipWaiting, lifecycle, request };
}

describe("offline release lifecycle", () => {
  it("keeps the active version when a replacement download fails", async () => {
    const sw = worker({ failInstall: true });
    await expect(sw.lifecycle("install")).rejects.toThrow(
      "interrupted download",
    );
    expect(sw.caches.delete.mock.calls).toEqual([["lachkar-offline-new"]]);
    expect(sw.skipWaiting).not.toHaveBeenCalled();
  });
  it("waits for existing tabs and only removes its own old caches on activation", async () => {
    const sw = worker();
    await sw.lifecycle("install");
    expect(sw.caches.delete).not.toHaveBeenCalled();
    expect(sw.skipWaiting).not.toHaveBeenCalled();
    await sw.lifecycle("activate");
    expect(sw.caches.delete.mock.calls).toEqual([["lachkar-offline-old"]]);
    expect(sw.claim).toHaveBeenCalledOnce();
  });
  it("prefers live pages, falls back offline, and never overwrites the saved build", async () => {
    const sw = worker();
    expect(await (await sw.request("/?source=installed"))!.text()).toBe(
      "live portfolio",
    );
    expect(sw.cache.match).not.toHaveBeenCalled();
    sw.fetch.mockRejectedValueOnce(new Error("offline"));
    expect(await (await sw.request("/"))!.text()).toBe("saved portfolio");
    sw.fetch.mockResolvedValueOnce(
      new Response("unavailable", { status: 503 }),
    );
    expect(await (await sw.request("/"))!.text()).toBe("saved portfolio");
    sw.fetch.mockResolvedValueOnce(new Response("not found", { status: 404 }));
    expect((await sw.request("/"))!.status).toBe(404);
  });
  it("serves saved immutable chunks and leaves APIs, RSC, unknown URLs and writes alone", async () => {
    const sw = worker();
    expect(
      await (await sw.request("/_next/static/chess.js", "cors"))!.text(),
    ).toBe("saved portfolio");
    expect(sw.fetch).not.toHaveBeenCalled();
    for (const [path, mode, method] of [
      ["/api/health", "cors", "GET"],
      ["/?_rsc=abc", "cors", "GET"],
      ["/missing", "navigate", "GET"],
      ["https://example.com/", "navigate", "GET"],
      ["/", "cors", "POST"],
    ]) {
      expect(sw.request(path, mode, method)).toBeUndefined();
    }
  });
});
