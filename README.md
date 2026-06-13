# 橋式解法教室 · Roux Trainer

魔術方塊**橋式（Roux method）**教學網站：互動教學、case 辨識練習器、完整公式表（CMLL 42 / 2-look / EOLR）、WCA 計時器、3D 動畫。全站繁體中文，純前端，部署於 GitHub Pages。

> 線上版：<https://yeimaoz.github.io/roux-trainer/>

## 功能

- **教學** — 從橋式總覽到 FB / SB / CMLL / LSE 各階段，逐章嵌互動 3D 範例。
- **練習器** — case 辨識特訓：隨機出題（含隨機 AUF）→ 自己想 → 翻牌看標準公式與手順指法。
- **公式表** — CMLL 42 條完整公式（八組分類）、2-look 入門路線、EOLR 進階；每條附 3D 動畫與繁中指法。
- **計時器** — WCA 流程（15 秒 inspection、+2 / DNF）、ao5 / ao12 / ao100 統計、session 紀錄（localStorage）。

「最佳解」指每個 case（形象）的**標準最佳公式**與手順，非對任意打亂逐段求解。

## 技術棧

Vite + React + TypeScript · [cubing.js](https://js.cubing.net)（WCA 出題 + twisty-player 3D 動畫）· Vitest（公式資料以 cubing.js KPuzzle 功能驗證）· GitHub Pages。

## 本機開發

```bash
npm install
npm run dev       # 開發伺服器
npm run build     # production build
npm run test      # 全套單元測試（含 42 條 CMLL 公式驗證）
```

## 公式資料的正確性

每一條公式都在測試裡用 cubing.js 的方塊模型實際驗證：CMLL 公式驗證「解掉頂層四角且不破壞已建好的兩個橋」，EOLR 驗證「邊定向完成且 UL/UR 歸位」。抄錯一條，測試就會紅。

## 授權

MIT
