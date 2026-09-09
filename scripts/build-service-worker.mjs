import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const path = `${directory}/${entry.name}`;
        return entry.isDirectory() ? files(path) : [path];
      }),
    )
  ).flat();
}

// Include lazy chess chunks so the first puzzle can be opened while offline.
const staticFiles = (await files(".next/static")).filter((path) =>
  /\.(js|css|woff2?)$/.test(path),
);
const publicFiles = [
  "public/Salah_Eddine_Lachkar_CV.pdf",
  "public/chess-preview-desktop.webp",
  "public/chess-preview-compact.webp",
  "public/favicon.ico",
  ...(await files("public/brand")),
];
const template = await readFile("scripts/service-worker.js", "utf8");
const hash = createHash("sha256")
  .update(template)
  .update(await readFile(".next/BUILD_ID"));
for (const path of [...staticFiles, ...publicFiles].sort()) {
  hash.update(path).update(await readFile(path));
}
const assets = [
  "/",
  "/manifest.webmanifest",
  ...staticFiles.map((path) => path.replace(".next/", "/_next/")),
  ...publicFiles.map((path) => path.replace("public/", "/")),
].sort();
await writeFile(
  "public/sw.js",
  template
    .replace('"__VERSION__"', JSON.stringify(hash.digest("hex").slice(0, 20)))
    .replace('"__ASSETS__"', JSON.stringify(assets)),
);
console.log(`Offline support generated: ${assets.length} files.`);
