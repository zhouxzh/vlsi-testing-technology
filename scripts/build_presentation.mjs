import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "src", "presentation");
const outputDir = path.join(root, "src", ".vuepress", "public", "presentation");
const presentationAssetsDir = path.join(sourceDir, "assets");
const presentationAssetsOutputDir = path.join(outputDir, "assets");
const themePath = path.join(sourceDir, "theme.css");
const marpPath = path.join(root, "node_modules", "@marp-team", "marp-cli", "marp-cli.js");

if (!fs.existsSync(marpPath)) {
  throw new Error("Marp CLI is not installed. Run pnpm install first.");
}

const sources = fs.readdirSync(sourceDir)
  .filter((name) => /^\d{2}-.+\.md$/u.test(name))
  .sort();
if (sources.length === 0) throw new Error("No presentation source found.");

fs.mkdirSync(outputDir, { recursive: true });
for (const name of fs.readdirSync(outputDir)) {
  if (name.endsWith(".html")) fs.rmSync(path.join(outputDir, name), { force: true });
}

fs.rmSync(presentationAssetsOutputDir, { recursive: true, force: true });
if (fs.existsSync(presentationAssetsDir)) {
  fs.cpSync(presentationAssetsDir, presentationAssetsOutputDir, { recursive: true });
}

for (const file of sources) {
  const source = path.join(sourceDir, file);
  const slug = file.replace(/\.md$/u, "");
  const result = spawnSync(process.execPath, [
    marpPath,
    source,
    "--html",
    "--theme-set",
    themePath,
    "--theme",
    "vlsi-testing",
    "--output",
    path.join(outputDir, `${slug}.html`),
  ], { cwd: root, stdio: "inherit", shell: false });
  if (result.status !== 0) throw new Error(`Marp failed for ${file}`);
}
console.log(`Built ${sources.length} presentation(s) into ${outputDir}`);
