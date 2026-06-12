// 對全部路由截圖（桌機 + 手機首頁），驗證 shell/nav/RWD
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4173/roux-trainer/";
const routes = ["", "learn", "trainer", "algs", "timer"];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
for (const r of routes) {
  await page.goto(`${base}#/${r}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `/tmp/roux-route-${r || "home"}.png` });
}
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${base}#/`, { waitUntil: "networkidle" });
await mobile.click(".nav-toggle");
await mobile.waitForTimeout(300);
await mobile.screenshot({ path: "/tmp/roux-route-home-mobile.png" });
console.log("PASS screenshots:", routes.length + 1);
await browser.close();
