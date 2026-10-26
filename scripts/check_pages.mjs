import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = process.env.PREVIEW_URL ?? "http://127.0.0.1:8081/vlsi-testing-technology/";
const browserCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const browser = browserCandidates.find((candidate) => fs.existsSync(candidate));
if (!browser) throw new Error("Chrome or Edge was not found.");

const sessionDir = path.join(root, "tmp", `page-check-${process.pid}`);
const profile = path.join(sessionDir, "profile");
const screenshots = path.join(sessionDir, "screenshots");
fs.mkdirSync(profile, { recursive: true });
fs.mkdirSync(screenshots, { recursive: true });

const child = spawn(browser, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
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
  if (waiters?.length) waiters.shift()(message.params);
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

const pages = [
  ["home", ""],
  ["plan", "plan/"],
  ["presentations", "presentation/"],
  ["references", "references/"],
];
const viewports = [
  ["desktop", 1440, 1000],
  ["mobile", 390, 844],
];
const inspectExpression = String.raw`(() => {
  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" &&
      Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
  };
  const content = document.querySelector("[vp-content]") || document.body;
  const images = [...content.querySelectorAll("img")].filter(visible).map((image) => {
    const rect = image.getBoundingClientRect();
    return {
      src: image.currentSrc || image.src,
      rendered: [Math.round(rect.width), Math.round(rect.height)],
      natural: [image.naturalWidth, image.naturalHeight],
      outside: rect.left < -1 || rect.right > innerWidth + 1,
    };
  });
  const tablesAndCode = [...content.querySelectorAll("table, pre")].filter(visible).map((element) => ({
    tag: element.tagName.toLowerCase(),
    client: [element.clientWidth, element.clientHeight],
    scroll: [element.scrollWidth, element.scrollHeight],
  })).filter((item) => item.scroll[0] > item.client[0] + 1 || item.scroll[1] > item.client[1] + 1);
  const broadElements = [...content.querySelectorAll("img, svg, table, pre")]
    .filter(visible)
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.left < -1 || rect.right > innerWidth + 1;
    })
    .slice(0, 20)
    .map((element) => ({
      tag: element.tagName.toLowerCase(),
      className: String(element.className || ""),
      left: Math.round(element.getBoundingClientRect().left),
      right: Math.round(element.getBoundingClientRect().right),
    }));
  return {
    viewport: [innerWidth, innerHeight],
    documentWidth: document.documentElement.scrollWidth,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
    images,
    tablesAndCode,
    broadElements,
  };
})()`;

let failed = false;
try {
  for (const [pageName, relativeUrl] of pages) {
    for (const [viewportName, width, height] of viewports) {
      await command("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      const loaded = waitForEvent("Page.loadEventFired");
      await command("Page.navigate", { url: new URL(relativeUrl, baseUrl).href });
      await loaded;
      let ready = false;
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const check = await command("Runtime.evaluate", {
          expression: `({
            content: Boolean(document.querySelector("[vp-content]")),
            textLength: (document.body.innerText || "").trim().length
          })`,
          returnByValue: true,
        });
        const state = check.result.value;
        if (state.content && state.textLength > 100) {
          ready = true;
          break;
        }
        await sleep(250);
      }
      if (!ready) {
        throw new Error(`Page did not render populated content: ${pageName}/${viewportName}`);
      }
      await sleep(300);
      const evaluation = await command("Runtime.evaluate", {
        expression: inspectExpression,
        returnByValue: true,
      });
      const report = evaluation.result.value;
      const missingImages = report.images.filter((image) =>
        image.natural[0] === 0 || image.natural[1] === 0
      );
      const outsideImages = report.images.filter((image) => image.outside);
      const problems = report.horizontalOverflow || missingImages.length || outsideImages.length || report.broadElements.length;
      if (problems) failed = true;
      console.log(JSON.stringify({
        page: pageName,
        viewport: viewportName,
        size: report.viewport,
        horizontalOverflow: report.horizontalOverflow,
        missingImages,
        outsideImages,
        tablesAndCode: report.tablesAndCode,
        broadElements: report.broadElements,
      }));
      const screenshot = await command("Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
      });
      fs.writeFileSync(
        path.join(screenshots, `${pageName}-${viewportName}.png`),
        Buffer.from(screenshot.data, "base64"),
      );
    }
  }
  console.log(`Screenshots: ${screenshots}`);
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
