import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("page, navigation, contact and downloadable CV", async ({
  page,
  request,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Salah-Eddine",
  );
  if (isMobile)
    await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Selected work" })
    .click();
  await expect(page).toHaveURL(/#work$/);
  await expect(
    page.getByRole("heading", { name: "MRPNL", exact: true }).last(),
  ).toBeVisible();
  const cv = await request.get("/Salah_Eddine_Lachkar_CV.pdf");
  expect(cv.ok()).toBe(true);
  expect(cv.headers()["content-type"]).toContain("pdf");
  await expect(
    page.getByRole("link", { name: "lachkar.salah@outlook.com" }),
  ).toHaveAttribute("href", "mailto:lachkar.salah@outlook.com");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("keyboard chess hint, illegal move, solve and reset", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  await page.getByRole("button", { name: "Keyboard / 2D" }).click();
  await page.getByRole("button", { name: "Hint", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("h6 to g7");
  await page.locator('[data-square="f5"]').click();
  await expect(page.getByRole("status")).toContainText("not legal");
  await page.locator('[data-square="g7"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("Checkmate");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("White to move");
  await page.locator('[data-square="h6"]').focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator('[data-square="g6"]')).toBeFocused();
});
test("accessible document and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  await page.getByRole("button", { name: "Keyboard / 2D" }).click();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
test("WebGL failure retains a playable fallback", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes("webgl")) return null;
      return original.apply(this, [type, ...args] as Parameters<
        typeof original
      >);
    } as typeof original;
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  if ((page.viewportSize()?.width || 1280) > 700) {
    await page
      .getByRole("button", { name: "Start puzzle", exact: true })
      .click();
  } else {
    await page.getByRole("button", { name: "3D view", exact: true }).click();
  }
  await expect(page.getByRole("group", { name: /Chessboard/ })).toBeVisible();
  await page.locator('[data-square="h6"]').click();
  await page.locator('[data-square="g7"]').click();
  await expect(page.getByRole("status")).toContainText("Checkmate");
});
test("health and SEO endpoints", async ({ request }) => {
  expect(await (await request.get("/api/health")).json()).toEqual({
    status: "ok",
  });
  for (const url of [
    "/robots.txt",
    "/sitemap.xml",
    "/opengraph-image",
    "/icon.svg",
  ])
    expect((await request.get(url)).ok()).toBe(true);
});

test("3D moves remain visible for both unsuccessful and successful attempts", async ({
  page,
  isMobile,
}) => {
  const { PerspectiveCamera, Vector3 } = await import("three");
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  if ((page.viewportSize()?.width || 1280) > 700) {
    await page
      .getByRole("button", { name: "Start puzzle", exact: true })
      .click();
  } else {
    await page.getByRole("button", { name: "3D view", exact: true }).click();
  }
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();
  await canvas.scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute("data-ready", "true");
  // Project the known starting board coordinates to real pointer positions.
  // This exercises Three.js raycasting and UI state, not an internal move API.
  const clickPoint = async (x: number, y: number, z: number) => {
    const box = await canvas.boundingBox();
    if (!box) throw new Error("The 3D canvas is missing");
    const camera = new PerspectiveCamera(37, box.width / box.height, 0.1, 1000);
    camera.position.set(6.7, 8.8, 10.5);
    camera.zoom = Math.min(1.4, Math.max(0.95, box.width / 380));
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const position = new Vector3(x, y, z).applyAxisAngle(
      new Vector3(0, 1, 0),
      -0.12,
    );
    position.y += 0.35;
    position.project(camera);
    const px = box.x + ((position.x + 1) * box.width) / 2;
    const py = box.y + ((1 - position.y) * box.height) / 2;
    if (isMobile) await page.touchscreen.tap(px, py);
    else await page.mouse.click(px, py);
  };
  await page.getByRole("button", { name: "Explore 3D", exact: true }).click();
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds.x + bounds.width / 2 + 60,
    bounds.y + bounds.height / 2 + 20,
    { steps: 8 },
  );
  await page.mouse.up();
  await page
    .getByRole("button", { name: "Back to puzzle", exact: true })
    .click();
  await clickPoint(2.59, 0.8, -1.11); // Queen on h6.
  await expect(page.getByRole("status")).toContainText("queen on h6 selected");
  await clickPoint(2.59, 0.04, -0.37); // Legal Qh5, not checkmate.
  await expect(page.getByRole("status")).toContainText(
    "Qh5 is legal, but not checkmate",
  );
  await expect(
    page.getByRole("button", { name: "Hint", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Keyboard / 2D" }).click();
  await expect(page.locator('[data-square="h5"]')).toHaveAttribute(
    "aria-label",
    "h5, white queen",
  );
  await expect(page.locator('[data-square="h6"]')).toHaveAttribute(
    "aria-label",
    "h6",
  );
  await page.locator('[data-square="g6"]').click();
  await expect(page.getByRole("status")).toContainText("Qh5 is legal");
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.locator('[data-square="h6"]')).toHaveAttribute(
    "aria-label",
    "h6, white queen",
  );
  await expect(
    page.getByRole("button", { name: "Hint", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "3D view", exact: true }).click();
  await expect(canvas).toBeVisible();
  await canvas.scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await clickPoint(2.59, 0.8, -1.11);
  await expect(page.getByRole("status")).toContainText("queen on h6 selected");
  await clickPoint(1.85, 0.04, -1.85); // Qg7 mate.
  await expect(page.getByRole("status")).toContainText("Checkmate");
  await page.getByRole("button", { name: "Keyboard / 2D" }).click();
  await expect(page.locator('[data-square="g7"]')).toHaveAttribute(
    "aria-label",
    "g7, white queen",
  );
});

test("board preview remains visible while the interactive scene downloads", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let delayed = false;
  await page.route("**/*.js", async (route) => {
    delayed = true;
    await gate;
    await route.continue();
  });
  try {
    if ((page.viewportSize()?.width || 1280) > 700) {
      await page
        .getByRole("button", { name: "Start puzzle", exact: true })
        .click();
    } else {
      await page.getByRole("button", { name: "3D view", exact: true }).click();
    }
    await expect.poll(() => delayed).toBe(true);
    const preview = page.locator(".scene-preview");
    await expect(preview).toBeVisible();
    await expect(preview).toBeDisabled();
    await expect(preview).toContainText("Preparing the board");
    await expect(preview.locator("img")).toBeVisible();
    await expect
      .poll(() =>
        preview
          .locator("img")
          .evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
      )
      .toBe(true);
  } finally {
    release();
  }
  await expect(page.locator("canvas")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".scene-preview")).toHaveCount(0);
  await page.getByRole("button", { name: "Keyboard / 2D" }).click();
  await page.getByRole("button", { name: "3D view" }).click();
  await expect(page.locator("canvas")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".scene-preview")).toHaveCount(0);
});

test("2D squares stay equal and random multi-move puzzles can be solved with hints", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  await page.getByRole("button", { name: "Keyboard / 2D" }).click();
  const cells = await page.locator("[data-square]").evaluateAll((nodes) =>
    nodes.map((node) => {
      const r = node.getBoundingClientRect();
      return { width: r.width, height: r.height };
    }),
  );
  expect(cells).toHaveLength(64);
  for (const cell of cells) {
    expect(Math.abs(cell.width - cell.height)).toBeLessThan(1);
    expect(Math.abs(cell.height - cells[0].height)).toBeLessThan(1);
  }
  for (const mate of [2, 3]) {
    await page
      .getByRole("button", { name: `Mate in ${mate}`, exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      mate === 2 ? "two" : "three",
    );
    for (let move = 0; move < mate; move++) {
      const hint = page.getByRole("button", { name: "Hint", exact: true });
      await expect(hint).toBeEnabled();
      await hint.click();
      const text = await page.getByRole("status").innerText();
      const match = text.match(/from ([a-h][1-8]) to ([a-h][1-8])/)!;
      expect(match).not.toBeNull();
      await page.locator(`[data-square="${match[2]}"]`).click();
      if (move < mate - 1) {
        await expect(page.getByRole("status")).toContainText("Black plays");
        await expect(page.getByRole("status")).toContainText(
          `mate in ${mate - move - 1}`,
        );
      }
    }
    await expect(page.getByRole("status")).toContainText("Checkmate");
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    const before = await page.locator(".flat-board").innerHTML();
    await page.getByRole("button", { name: "New puzzle" }).click();
    expect(await page.locator(".flat-board").innerHTML()).not.toBe(before);
  }
});

test("reset and new puzzle cancel a pending opponent reply", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  await page.getByRole("button", { name: "Keyboard / 2D" }).click();
  await page.getByRole("button", { name: "Mate in 3", exact: true }).click();
  await page.getByRole("button", { name: "Hint", exact: true }).click();
  const text = await page.getByRole("status").innerText();
  await page
    .locator(`[data-square="${text.match(/to ([a-h][1-8])/)![1]}"]`)
    .click();
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  const resetBoard = await page.locator(".flat-board").innerHTML();
  await page.waitForTimeout(800);
  expect(await page.locator(".flat-board").innerHTML()).toBe(resetBoard);
  await expect(page.getByRole("status")).toContainText("three");
});

test("Lachkar identity, approved project order and corrected public content", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  await expect(
    page.getByRole("link", { name: "Lachkar home", exact: true }),
  ).toHaveCount(2);
  const titles = await page.locator(".project h3").allTextContents();
  expect(
    titles.map((title) => title.replace(" (opens in a new tab)", "").trim()),
  ).toEqual([
    "MRPNL",
    "TickTickTrader",
    "Samurai Rising / Samurai Legends",
    "Mosaic",
    "Idescape",
    "PinkPanda / BambooDAO",
    "AI agent skills & plugins",
    "Trading strategies & market tools",
    "SAFAR",
    "Automation tools",
    "Creative coding & desktop tools",
  ]);
  await expect(page.locator("body")).not.toContainText(
    /AqarSuite|Pet Boutique|SuperCodex|AWAY FROM THE EDITOR/,
  );
  await expect(page.locator("body")).toContainText("Isle of Man-based company");
  await expect(page.locator(".project-agency")).toContainText(
    "alongside MRPNL in 2026",
  );
  await expect(page.locator(".project-staking")).toContainText(
    "Independent software contractor",
  );
  await expect(page.locator(".project-mosaic")).toContainText("SQLite");
  await expect(page.locator(".project-workflows")).toContainText(
    "Trello cards",
  );
  expect(await page.locator('a[href^="tel:"]').count()).toBe(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("project illustration fits mobile, tablet and desktop cards", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  for (const width of [390, 820, 1440]) {
    await page.setViewportSize({ width, height: 1050 });
    await page.locator(".project-mosaic").scrollIntoViewIfNeeded();
    const geometry = await page.locator(".mosaic-art").evaluate((element) => {
      const art = element.getBoundingClientRect();
      const panel = element
        .querySelector(".mosaic-panel")!
        .getBoundingClientRect();
      return {
        artBottom: art.bottom,
        panelBottom: panel.bottom,
        artRight: art.right,
        panelRight: panel.right,
      };
    });
    expect(geometry.panelBottom).toBeLessThanOrEqual(geometry.artBottom);
    expect(geometry.panelRight).toBeLessThanOrEqual(geometry.artRight);
  }
});

test("versioned Lachkar favicons and sharing identity are served", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  await expect(
    page.locator('link[rel="icon"][type="image/svg+xml"]'),
  ).toHaveAttribute("href", "/brand/lachkar-v2.svg");
  await expect(
    page.locator('link[rel="icon"][type="image/png"]'),
  ).toHaveAttribute("href", "/brand/lachkar-v2-32.png");
  await expect(page.locator('link[rel="shortcut icon"]')).toHaveAttribute(
    "href",
    "/brand/lachkar-v2.ico",
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    "/brand/lachkar-v2-180.png",
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    "content",
    "Lachkar",
  );
  const svg = await request.get("/brand/lachkar-v2.svg");
  expect(svg.ok()).toBe(true);
  expect(await svg.text()).toContain("M13 12h11");
  for (const path of ["/favicon.ico", "/brand/lachkar-v2.ico"]) {
    const result = await request.get(path);
    expect(result.ok()).toBe(true);
    const bytes = await result.body();
    expect([...bytes.subarray(0, 6)]).toEqual([0, 0, 1, 0, 3, 0]);
  }
  for (const size of [32, 180]) {
    const result = await request.get(`/brand/lachkar-v2-${size}.png`);
    expect(result.ok()).toBe(true);
    const bytes = await result.body();
    expect(bytes.readUInt32BE(16)).toBe(size);
    expect(bytes.readUInt32BE(20)).toBe(size);
  }
});

test("education, refreshed project copy and footer are consistent", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  await expect(
    page
      .locator("#work")
      .getByRole("heading", { name: "TickTickTrader", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("CONCEPT ILLUSTRATION", { exact: true }),
  ).toHaveCount(0);
  const education = page.locator(".education");
  await expect(education.getByRole("heading", { level: 4 })).toHaveCount(2);
  await expect(education).toContainText("Master in Data Science & Big Data");
  await expect(education).toContainText(
    "Bachelor in Mathematics & Computer Science",
  );
  const footer = page.getByRole("navigation", { name: "Footer navigation" });
  await expect(
    footer.getByRole("link", { name: "Selected work" }),
  ).toHaveAttribute("href", "#work");
  await expect(
    footer.getByRole("link", { name: "Download CV" }),
  ).toHaveAttribute("href", "/Salah_Eddine_Lachkar_CV.pdf");
  await expect(
    footer.getByRole("link", { name: "Email Salah" }),
  ).toHaveAttribute("href", /^mailto:/);
  for (const width of [390, 820, 1440]) {
    await page.setViewportSize({ width, height: 1050 });
    const below = await page.locator(".about-intro").evaluate((element) => {
      return (
        element.querySelector("p")!.getBoundingClientRect().top >=
        element.querySelector("h2")!.getBoundingClientRect().bottom
      );
    });
    expect(below).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("compact playground uses deliberate view and camera controls", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Keyboard / 2D" }),
  ).toHaveAttribute(
    "aria-pressed",
    String((page.viewportSize()?.width || 1280) <= 700),
  );
  const flat = page.getByRole("button", { name: "Keyboard / 2D" });
  await expect(flat).toHaveAttribute("aria-pressed", String(isMobile));
  await page.getByRole("button", { name: "Mate in 2", exact: true }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(flat).toHaveAttribute("aria-pressed", String(isMobile));
  const stage = await page.locator(".scene-wrap").boundingBox();
  if (isMobile)
    await page.getByRole("button", { name: "3D view", exact: true }).click();
  else
    await page
      .getByRole("button", { name: "Start puzzle", exact: true })
      .click();
  await expect(page.locator("canvas")).toHaveAttribute("data-ready", "true");
  const loaded = await page.locator(".scene-wrap").boundingBox();
  expect(loaded!.height).toBe(stage!.height);
  await page.getByRole("button", { name: "Explore 3D", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Hint", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".scene-wrap")).toHaveClass(/is-exploring/);
  await page
    .getByRole("button", { name: "Back to puzzle", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Hint", exact: true }),
  ).toBeEnabled();
  await expect(page.locator(".scene-wrap")).not.toHaveClass(/is-exploring/);
  await flat.click();
  await page.getByRole("button", { name: "Mate in 3", exact: true }).click();
  await expect(flat).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("canvas")).toHaveCount(0);
});
