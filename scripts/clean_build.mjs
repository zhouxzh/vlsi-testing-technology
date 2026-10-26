import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vuepressDir = path.join(root, "src", ".vuepress");

for (const name of ["dist", ".temp", ".cache"]) {
  fs.rmSync(path.join(vuepressDir, name), { recursive: true, force: true });
}
