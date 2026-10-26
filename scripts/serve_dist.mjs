import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "src", ".vuepress", "dist");
const base = (process.env.BASE ?? "/vlsi-testing-technology/").replace(/\/?$/u, "/");
const port = Number(process.env.PORT ?? 8081);
const host = process.env.HOST ?? "127.0.0.1";

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

if (!fs.existsSync(path.join(dist, "index.html"))) {
  throw new Error("Built site is missing. Run pnpm docs:build first.");
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host ?? host}`);
  if (requestUrl.pathname === "/") {
    response.writeHead(302, { Location: base });
    response.end();
    return;
  }
  if (!requestUrl.pathname.startsWith(base)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const relative = decodeURIComponent(requestUrl.pathname.slice(base.length));
  let target = path.resolve(dist, relative || "index.html");
  if (!target.startsWith(path.resolve(dist))) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    target = path.join(target, "index.html");
  }
  if (!fs.existsSync(target)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypes.get(path.extname(target)) ?? "application/octet-stream",
    "Cache-Control": "no-store",
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  fs.createReadStream(target).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Serving ${dist} at http://${host}:${port}${base}`);
});
