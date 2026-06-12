// E2E smoke：vite preview 跑起來後，用 headless chromium 驗證
// 1) 出題完成（data-status=ready 且打亂字串非空）
// 2) twisty-player 元素存在（closed shadow root 無法內省 canvas，
//    視覺驗證靠 /tmp/roux-smoke.png 截圖人工確認）
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:4173/roux-trainer/";
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('main[data-status="ready"]', { timeout: 60000 });
  const scramble = (await page.textContent("#scramble-output"))?.trim() ?? "";
  if (scramble.split(" ").length < 15) throw new Error(`scramble 太短: "${scramble}"`);
  await page.waitForSelector("twisty-player", { timeout: 10000 });
  await page.waitForTimeout(3000); // 等 3D 渲染穩定再截圖

  await page.screenshot({ path: "/tmp/roux-smoke.png" });
  console.log("PASS scramble:", scramble);
  console.log("PASS twisty-player mounted; screenshot: /tmp/roux-smoke.png");
  if (errors.length) {
    console.log("FAIL console errors:", errors.join(" | "));
    process.exit(1);
  }
} finally {
  await browser.close();
}
