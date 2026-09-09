import { expect, test } from "@playwright/test";

test("search engines receive complete metadata, identity and content without JavaScript", async ({
  browser,
  baseURL,
  request,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveTitle("Salah-Eddine Lachkar — Full-Stack Developer");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("Salah-Eddine");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  expect(
    new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!)
      .href,
  ).toBe("https://lachkar.me/");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Casablanca.*React, Next.js and TypeScript/,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index, follow",
  );
  for (const name of ["og:title", "og:description", "og:image", "og:url"]) {
    await expect(
      page.locator(`meta[property="${name}"]`).first(),
    ).toHaveAttribute("content", /.+/);
  }
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  const image = await page
    .locator('meta[property="og:image"]')
    .first()
    .getAttribute("content");
  const preview = await request.get(new URL(image!).pathname);
  expect(preview.ok()).toBe(true);
  expect(preview.headers()["content-type"]).toContain("image/png");
  const graph = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent())!,
  );
  expect(graph["@context"]).toBe("https://schema.org");
  expect(graph["@graph"]).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        "@type": "WebSite",
        name: "Lachkar",
        url: "https://lachkar.me/",
      }),
      expect.objectContaining({
        "@type": "Person",
        name: "Salah-Eddine Lachkar",
        sameAs: [
          "https://github.com/artpumpkin",
          "https://www.linkedin.com/in/salah-eddine-lachkar/",
        ],
      }),
      expect.objectContaining({
        "@type": "ProfilePage",
        mainEntity: { "@id": "https://lachkar.me/#person" },
      }),
    ]),
  );
  await expect(page.locator("#work")).toContainText("MRPNL");
  await expect(page.locator(".education")).toContainText("DEUG");
  await context.close();
});

test("indexing endpoints and missing pages send correct signals", async ({
  request,
}) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain(
    "Sitemap: https://lachkar.me/sitemap.xml",
  );
  const searchGroups = (await robots.text())
    .split(/\n\s*\n/)
    .filter((group) =>
      /^User-agent:\s*(\*|Googlebot|Bingbot)\s*$/im.test(group),
    );
  expect(searchGroups.length).toBeGreaterThan(0);
  for (const group of searchGroups) {
    expect(group).not.toMatch(/^Disallow:\s*\/\s*$/im);
  }
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("<loc>https://lachkar.me/</loc>");
  const health = await request.get("/api/health");
  expect(health.headers()["x-robots-tag"]).toBe("noindex");
  const missing = await request.get("/seo-test-missing-page");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toMatch(/name="robots" content="noindex"/);
});
