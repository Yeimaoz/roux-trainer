# roux-trainer 橋式教學網站 — 設計文件

日期：2026-06-13
狀態：已與 user 確認四大決策（解法引擎 / 技術棧 / 部署 / 內容深度）

## 目標

做一個魔術方塊橋式（Roux method）教學網站，功能：

1. 生成題目（WCA 等級隨機打亂）
2. 對任意打亂提供分段最佳解法（FB / SB / CMLL / LSE），附手順指法標注
3. 公式表（CMLL 42 條全收 + 入門 2-look + EOLR 進階）
4. 計時器（WCA 流程、session 統計）
5. 3D 動畫（打亂展示、解法逐步播放、公式預覽）

全站繁體中文。轉動記號維持標準（R U M r …）。

## 已拍板決策

| 決策 | 選擇 |
|---|---|
| 解法引擎 | 自寫 Roux 分段 solver（瀏覽器內，Web Worker） |
| 技術棧 | Vite + React + TypeScript，純前端 SPA |
| 部署 | GitHub Pages（public repo + Actions 自動部署） |
| 內容深度 | 完整 CMLL 42 + 2-look 入門線 + EOLR 進階 + 基礎概念教學頁 |

## 範圍界定

- **固定色向 v1**：白底（D）、綠前（F）、左橋橙色（L 面）。色向中立（CN）不做。
- 只做三階（3x3x3）。
- 無後端、無帳號系統；計時器資料存 localStorage。
- 指法標注為文字提示（繁中），不做手部 3D 動畫。

## 技術選型

- **Vite + React 18 + TypeScript**：純 client-side，無 SSR 需求。
- **react-router**：5 頁路由（hash router，GitHub Pages 免 404 設定）。
- **cubing.js**（唯一重型外部依賴）：
  - `cubing/scramble` → `randomScrambleForEvent("333")` 出題
  - `<twisty-player>` web component → 3D 動畫（setup alg、逐步播放控制、experimental stickering 遮罩高亮特定階段的塊）
- **Vitest**：核心邏輯單元測試 + solver 正確性整合測試。
- 樣式：自寫 CSS（design tokens），深色主題，RWD。實作時套 frontend-design 原則。

### 已知風險

- cubing.js 的 scramble worker 在 Vite 有歷史整合雷（worker/WASM bundling）。**開工第一步先 smoke test**：Vite 專案內成功出題 + twisty-player 渲染，過了才繼續。
- 瀏覽器內建 BFS 距離表（FB/SB 各約 530 萬 entry 的 Uint8Array ≈ 5MB×2）：在 Worker 內建表約 1–2 秒，App 載入時背景建，建好前 UI 顯示「引擎準備中」。不持久化（每次載入重建，避免 IndexedDB 複雜度）。

## 架構

```
src/
  lib/
    cube/
      state.ts        # CubeState：cp[8] co[8] ep[12] eo[12] + centers[6]
      moves.ts        # 全 move 定義（U D L R F B、M E S、r l u d f b、x y z，含 2/'）
      alg.ts          # alg 解析 / 反轉 / 鏡像 / 化簡（合併 U U' 等）
    solver/
      fb.ts           # FB solver：BFS 全距離表 → 最佳解 + 前 3 替代解
      sb.ts           # SB solver：moveset {R, r, U, M}，同表法
      cmll.ts         # CMLL 辨識（U 層角塊 perm+orient + AUF）→ 42 case 查表
      lse.ts          # LSE solver：{M, U} 全 BFS 最佳解 + 4a/4b/4c 分段
      worker.ts       # Web Worker 入口：建表 + solve 請求
      index.ts        # 主執行緒 API：solveRoux(scramble) → 四段結果
    fingertricks/
      triggers.ts     # trigger pattern 比對（R U R'、R U' R'、M' U M …）
      annotate.ts     # alg → 繁中指法提示
    scramble.ts       # cubing.js 出題封裝
    timer/
      stats.ts        # ao5/ao12/ao100/mean/best、+2/DNF 規則
      storage.ts      # localStorage session 持久化
  data/
    cmll.ts           # 42 條：組別(O/H/Pi/U/T/L/S/AS)、case 名、主公式、替代公式、人工指法標注
    cmll-2look.ts     # 2-look 路線（先翻角 7 case + 排角 2 case）
    eolr.ts           # EOLR case 分類表
    lessons/          # 教學章節內容（繁中，TSX 或 MDX 形式）
  components/
    CubeViewer.tsx    # twisty-player React 封裝（setup、alg、stickering mask、播放控制）
    SolutionCard.tsx  # 單段解法卡（步數、公式、指法、播放、替代解）
    AlgCard.tsx       # 公式表卡片
    Timer.tsx         # 計時器核心（鍵盤+觸控）
  pages/
    Home.tsx          # 總覽：橋式介紹、四階段圖解、學習路線、CFOP 比較
    Learn.tsx         # 教學章節（FB 直覺 / SB / CMLL / LSE 4a-4c / EOLR）
    Trainer.tsx       # 練習器（核心頁）
    Algs.tsx          # 公式表
    TimerPage.tsx     # 計時器
```

模組邊界原則：`lib/` 全部不依賴 React、可獨立測試；`data/` 純資料；UI 只組裝。

## 解法引擎細節

### 方塊模型

標準 20 塊表示：`cp[8]`（角排列）、`co[8]`（角方向 0-2）、`ep[12]`（邊排列）、`eo[12]`（邊方向 0-1），加 `centers[6]`（M/E/S 與 rotation 會動中心，LSE 需要 M 槽中心對齊資訊）。所有 move 用排列合成實作，alg 工具支援解析、反轉、鏡像（CMLL 左右鏡像）、化簡。

### FB solver

- 目標塊：邊 DL、FL、BL；角 DLF、DBL（橙白橋，左面）。
- 狀態索引：3 邊（位置×方向）× 2 角（位置×方向）= 10,560 × 504 ≈ 530 萬。
- Moveset：{U, D, L, R, F, B, M, r, u}（含 2/'）。
- 從還原態全 BFS 建距離表（Uint8Array）。求解時沿距離遞減走 → **真最佳解**；分支枚舉收集至多 3 條不同最佳解作為替代解。

### SB solver

- 目標塊：邊 DR、FR、BR；角 DFR、DBR。
- Moveset 限 **{R, r, U, M}**（標準第二橋手順，不破壞 FB）。
- 同 FB 表法，moveset 內真最佳解。

### CMLL

- 辨識：U 層 4 角的 perm + orient，窮舉 4 個 AUF → 匹配 42 case。
- 解 = AUF 前置 + 查表公式。資料含 case 標準名（O1/O2、H1-4、Pi1-6、U1-6、T1-6、L1-6、S1-6、AS1-6）。

### LSE

- 狀態：6 邊（UL UR UF UB DF DB）位置 × M-slice 定義的 EO × M 中心偏移（4 位置）≈ 18.4 萬狀態。
- {M, U} moveset 全 BFS → 整段最佳解。
- 同時輸出教學分段：4a EO（壞邊數顯示）→ 4b UL/UR 歸位 → 4c EP（M2/U2 循環），每段各自在 {M,U} 內最佳。
- EOLR 進階章節用 `data/eolr.ts` 的 case 表（教學內容，不進 solver 主流程）。

### 指法標注

- Tokenize alg → 滑動視窗比對 trigger 庫（`R U R'` 「食指推 U」、`M' U' M` 「無名指勾 M」等）→ 未命中的 move 用單鍵預設提示。
- CMLL 42 條另有人工撰寫的整條指法描述（存 `data/cmll.ts`），品質優先於規則引擎。

### 正確性驗證（Vitest）

1. 方塊模型：每個 move 應用 4 次回到原狀；alg 解析↔反轉 round-trip。
2. Solver 整合：100 條隨機打亂 → 全管線 → 驗證 FB 後 5 塊歸位、SB 後 10 塊歸位、CMLL 後角全對、LSE 後全還原。
3. CMLL 辨識：對 42 條公式各做 inverse setup → 辨識應回到對應 case。
4. 指法引擎：trigger 比對 snapshot 測試。

## 頁面行為

### 練習器（/trainer）

1. 「新題目」→ cubing.js 出題 → Worker 解四段。
2. 顯示：打亂公式 + 3D 方塊（setup = 打亂）+ 四張解法卡。
3. 解法卡：階段名、步數、公式（指法 hover/展開）、▶ 播放該段動畫（stickering 高亮該段目標塊）、FB 卡可切換替代解。
4. 全程連播 + 逐步控制（上一步/下一步/速度）。
5. 單段特訓模式：FB 特訓（隨機打亂只看 FB）、SB 特訓（FB 已完成的隨機態）、CMLL 特訓、LSE 特訓（隨機 {M,U} 態）。

### 計時器（/timer）

- 空白鍵長按 300ms 變綠 → 放開起跑 → 任意鍵停；手機觸控同邏輯。
- 可選 15 秒 inspection（WCA 流程）。
- 每 solve 自動出下一題；記錄（時間、打亂、時間戳、+2/DNF 標記）。
- 統計：best / mean / ao5 / ao12 / ao100，session 列表，localStorage 持久化，可開新 session。
- 每筆記錄「看橋式解法」→ 帶該打亂跳轉練習器。

### 公式表（/algs）

- CMLL：八組 tab，卡片 = 辨識圖（twisty-player 2D U 面視角 + stickering）+ 主公式 + 指法 + 點擊開 modal 3D 循環播放。
- 2-look 區、EOLR 表、LSE 4b/4c 常見 case 參考。

### 教學（/learn）

章節：0 橋式總覽與 CFOP 比較 → 1 FB 直覺建橋 → 2 SB → 3 CMLL（2-look 起步 → 42 條進階）→ 4 LSE（4a/4b/4c）→ 5 EOLR。每章嵌互動範例（CubeViewer）。

### 總覽（/）

學習路線圖（入門 → 進階）、四階段視覺化簡介、各頁入口。

## 部署

- public GitHub repo（author：`claude <noreply@anthropic.com>`）。
- GitHub Actions：push main → build → 部署 GitHub Pages。
- Vite `base` 設 `/roux-trainer/`；hash router 避免 Pages 404。

## 里程碑

1. **M1 骨架 + smoke test**：Vite 專案、cubing.js 出題 + twisty-player 渲染通過。
2. **M2 核心引擎**：cube model + 四段 solver + 測試全綠。
3. **M3 資料層**：CMLL 42 / 2-look / EOLR 資料 + 指法引擎。
4. **M4 UI**：5 頁 + 元件 + 深色主題 RWD。
5. **M5 整合驗證 + 部署**：E2E 手動驗證、GitHub repo + Pages 上線。

## Review Result

（design-review 後填寫）
