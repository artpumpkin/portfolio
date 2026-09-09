import { test, expect } from "@playwright/test";

test.use({ serviceWorkers: "allow" });

test("installable identity and fresh worker delivery", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest",
  );
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest).toMatchObject({
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    short_name: "Lachkar",
  });
  for (const icon of manifest.icons) {
    const response = await request.get(icon.src);
    expect(response.ok()).toBe(true);
    const bytes = await response.body();
    const size = Number(icon.sizes.split("x")[0]);
    expect(bytes.readUInt32BE(16)).toBe(size);
    expect(bytes.readUInt32BE(20)).toBe(size);
  }
  const worker = await request.get("/sw.js");
  expect(worker.headers()["cache-control"]).toContain("no-store");
  expect(worker.headers()["content-type"]).toContain("javascript");
  expect(await worker.text()).not.toContain("__VERSION__");
});

test("first offline visit retains projects, CV and previously unopened chess", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(),
          { once: true },
        ),
      );
    }
  });
  await context.setOffline(true);
  await page.goto("/?source=installed#work");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Salah-Eddine",
  );
  await expect(page.locator(".project h3").first()).toContainText("MRPNL");
  const cv = await page.evaluate(async () => {
    const response = await fetch("/Salah_Eddine_Lachkar_CV.pdf");
    return {
      status: response.status,
      type: response.headers.get("content-type"),
      signature: (await response.text()).slice(0, 5),
    };
  });
  expect(cv).toMatchObject({ status: 200, signature: "%PDF-" });
  expect(cv.type).toContain("pdf");
  if ((page.viewportSize()?.width || 1280) > 700) {
    await page
      .getByRole("button", { name: "Start puzzle", exact: true })
      .click();
  } else {
    await page.getByRole("button", { name: "3D view", exact: true }).click();
  }
  await expect(page.locator("canvas")).toHaveAttribute("data-ready", "true");
  await page.getByRole("button", { name: "Keyboard / 2D" }).click();
  await page.getByRole("button", { name: "Mate in 3", exact: true }).click();
  for (let move = 0; move < 3; move++) {
    const hint = page.getByRole("button", { name: "Hint", exact: true });
    await expect(hint).toBeEnabled();
    await hint.click();
    const text = await page.getByRole("status").innerText();
    await page
      .locator(`[data-square="${text.match(/to ([a-h][1-8])/)![1]}"]`)
      .click();
    if (move < 2)
      await expect(page.getByRole("status")).toContainText(
        `mate in ${2 - move}`,
      );
  }
  await expect(page.getByRole("status")).toContainText("Checkmate");
  const healthOffline = await page.evaluate(() =>
    fetch("/api/health").then(
      () => true,
      () => false,
    ),
  );
  expect(healthOffline).toBe(false);
  await context.setOffline(false);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});
