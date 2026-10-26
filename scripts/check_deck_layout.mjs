import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deckDir = path.join(root, "src", ".vuepress", "public", "presentation");
const decks = fs.readdirSync(deckDir)
  .filter((name) => /^\d{2}-.+\.html$/u.test(name))
  .sort();

if (decks.length !== 8) {
  throw new Error(`Expected 8 built decks, found ${decks.length}.`);
}

const browserCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
const browser = browserCandidates.find((candidate) => fs.existsSync(candidate));
if (!browser) throw new Error("Chrome or Edge was not found.");

const profile = path.join(root, "tmp", `deck-layout-${process.pid}`);
fs.mkdirSync(profile, { recursive: true });
const child = spawn(browser, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--allow-file-access-from-files",
  "--window-size=1280,720",
  "--remote-debugging-port=0",
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore", windowsHide: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const devToolsFile = path.join(profile, "DevToolsActivePort");
for (let attempt = 0; attempt < 100 && !fs.existsSync(devToolsFile); attempt += 1) {
  await sleep(100);
}
if (!fs.existsSync(devToolsFile)) {
  child.kill();
  throw new Error("Chrome did not create a DevTools endpoint.");
}
const port = fs.readFileSync(devToolsFile, "utf8").split(/\r?\n/u)[0];
const targetResponse = await fetch(
  `http://127.0.0.1:${port}/json/new?about:blank`,
  { method: "PUT" },
);
const target = await targetResponse.json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let messageId = 0;
const pending = new Map();
const eventWaiters = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }
  const waiters = eventWaiters.get(message.method);
  if (waiters?.length) {
    const waiter = waiters.shift();
    waiter(message.params);
  }
});

function command(method, params = {}) {
  const id = ++messageId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

function waitForEvent(method, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const waiters = eventWaiters.get(method) ?? [];
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeoutMs);
    waiters.push((params) => {
      clearTimeout(timer);
      resolve(params);
    });
    eventWaiters.set(method, waiters);
  });
}

await command("Page.enable");
await command("Runtime.enable");

const inspectExpression = String.raw`(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((image) => {
    if (image.complete) return Promise.resolve();
    return new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    });
  }));
  const slides = [...document.querySelectorAll("section[data-marpit-pagination]")];
  return slides.map((slide) => {
    const bounds = slide.getBoundingClientRect();
    const overflowing = [];
    for (const element of slide.querySelectorAll("*")) {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      if (
        rect.left < bounds.left - 2 ||
        rect.top < bounds.top - 2 ||
        rect.right > bounds.right + 2 ||
        rect.bottom > bounds.bottom + 2
      ) {
        overflowing.push({
          tag: element.tagName.toLowerCase(),
          className: String(element.className || ""),
          text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
          left: Math.round(rect.left - bounds.left),
          top: Math.round(rect.top - bounds.top),
          right: Math.round(rect.right - bounds.left),
          bottom: Math.round(rect.bottom - bounds.top),
        });
      }
    }
    return {
      slide: Number(slide.dataset.marpitPagination),
      clientWidth: slide.clientWidth,
      clientHeight: slide.clientHeight,
      scrollWidth: slide.scrollWidth,
      scrollHeight: slide.scrollHeight,
      overflowing: overflowing.slice(0, 8),
      missingImages: [...slide.querySelectorAll("img")]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute("src")),
    };
  });
})()`;

let failed = false;
try {
  for (const deck of decks) {
    const loaded = waitForEvent("Page.loadEventFired");
    await command("Page.navigate", {
      url: pathToFileURL(path.join(deckDir, deck)).href,
    });
    await loaded;
    await sleep(350);
    const evaluation = await command("Runtime.evaluate", {
      expression: inspectExpression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (evaluation.exceptionDetails) {
      throw new Error(evaluation.exceptionDetails.text);
    }
    const report = evaluation.result.value;
    const problems = report.filter((slide) =>
      slide.scrollWidth > slide.clientWidth + 1 ||
      slide.overflowing.length > 0 ||
      slide.missingImages.length > 0
    );
    console.log(`${deck}: ${report.length} slides, ${problems.length} flagged`);
    for (const problem of problems) {
      failed = true;
      console.log(JSON.stringify(problem));
    }
  }
} finally {
  socket.close();
  child.kill();
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    sleep(1500),
  ]);
  try {
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    // Chrome can briefly retain profile locks on Windows; the directory is under ignored tmp/.
  }
}

if (failed) process.exitCode = 1;
