---
status: design
owner: primary/roux-trainer
created: 2026-06-13
---

# roux-trainer 橋式教學網站 — Design

## 1. Goal

做一個魔術方塊橋式（Roux method）教學網站：生成 WCA 等級打亂、對任意打亂即時產生分段最佳解法（FB / SB / CMLL / LSE，附繁中手順指法標注）、完整公式表（CMLL 42 + 2-look + EOLR）、WCA 流程計時器、3D 動畫展示。全站繁體中文，部署 GitHub Pages。

## 2. Non-goals

- **色向中立（CN）**：v1 固定白底（D）、綠前（F）、左橋橙色（L 面）。CN 讓 solver 複雜度 ×24，教學初期不需要。
- **非三階方塊**：只做 3x3x3。
- **後端 / 帳號系統**：計時器資料存 localStorage，無雲端同步。
- **手部 3D 動畫**：指法標注為繁中文字提示，不做手部模型。
- **真全局最佳解（God's number 等級）**：「最佳」定義為各段在其 moveset 內最佳，非跨段全局最佳（跨段最佳是 open research 問題，且教學價值低）。
- **解法資料庫持久化**：BFS 距離表每次載入重建（1–2 秒），不做 IndexedDB 快取（避免版本管理複雜度）。

## 3. Current Architecture

全新專案，從零開始。目前 repo（`~/projects/roux-trainer`）只有本設計文件，無既有程式碼、無既有使用者、無相容性包袱。

繼承的環境約束：
- 開發環境 WSL + macOS 雙平台（Node.js 專案，天然跨平台，無 pathlib 類問題）
- 部署目標 GitHub Pages（純靜態，限制：無 server-side 程式碼、子路徑 `/roux-trainer/` serving）

## 4. Proposed Changes

全部為新建。技術棧：**Vite + React 18 + TypeScript**（純前端 SPA）+ **cubing.js**（出題 + 3D 動畫，唯一重型外部依賴）+ **react-router**（hash router，避開 Pages 404）+ **Vitest**。

### 4.1 方塊核心模型（`src/lib/cube/`）

標準 20 塊表示：`cp[8]`（角排列）、`co[8]`（角方向 0-2）、`ep[12]`（邊排列）、`eo[12]`（邊方向 0-1），加 `centers[6]`（M/E/S 與 rotation 會動中心；LSE 需要 M 槽中心對齊資訊）。所有 move（U D L R F B、M E S、r l u d f b、x y z，含 2/' 變體）用排列合成實作。alg 工具：解析、反轉、鏡像（CMLL 左右鏡像用）、化簡（合併 `U U'` 等）。

### 4.2 Roux 分段 solver（`src/lib/solver/`，跑 Web Worker）

- **FB**：目標塊 = 邊 DL/FL/BL + 角 DLF/DBL（橙白橋）。狀態索引 = 3 邊（位置×方向）× 2 角（位置×方向）= 10,560 × 504 ≈ 530 萬。Moveset {U, D, L, R, F, B, M, r, u}。從還原態全 BFS 建 Uint8Array 距離表，求解沿距離遞減走 → moveset 內真最佳解；分支枚舉收集至多 3 條替代解。
- **SB**：目標塊 = 邊 DR/FR/BR + 角 DFR/DBR。Moveset 限 **{R, r, U, M}**（標準第二橋手順，天然不破壞 FB）。同表法。
- **CMLL**：辨識 U 層 4 角 perm + orient，窮舉 4 個 AUF → 匹配 42 case → AUF 前置 + 查表公式。
- **LSE**：狀態 = 6 邊（UL UR UF UB DF DB）位置 × M-slice EO × M 中心偏移（4 位置）≈ 18.4 萬。{M, U} 全 BFS → 整段最佳解；同時輸出教學分段 4a EO → 4b UL/UR → 4c EP，各段在 {M,U} 內最佳。
- **Worker 協定**：主執行緒 `solveRoux(scramble: Alg) → Promise<RouxSolution>`；Worker 啟動時建表（進度回報），建好前 UI 顯示「引擎準備中」。

### 4.3 指法標注引擎（`src/lib/fingertricks/`）

Tokenize alg → 滑動視窗比對 trigger 庫（`R U R'`「食指推 U」、`M' U' M`「無名指勾 M」等）→ 未命中 move 用單鍵預設提示。CMLL 42 條另有人工撰寫整條指法描述（存 `data/cmll.ts`），人工標注優先於規則引擎輸出。

### 4.4 資料層（`src/data/`）

- `cmll.ts`：42 條 — 組別（O/H/Pi/U/T/L/S/AS）、case 標準名（O1/O2、H1-4、Pi1-6、U1-6、T1-6、L1-6、S1-6、AS1-6）、主公式、替代公式、人工指法。
- `cmll-2look.ts`：2-look 路線（翻角 7 case + 排角 2 case）。
- `eolr.ts`：EOLR case 分類表（教學內容，不進 solver 主流程）。
- `lessons/`：教學章節內容（繁中 TSX）。

### 4.5 UI（`src/pages/` + `src/components/`）

5 頁（hash router）：

| 頁 | 行為 |
|---|---|
| `/` 總覽 | 橋式介紹、四階段圖解、學習路線（2-look → 42 → EOLR）、CFOP 比較 |
| `/learn` 教學 | 章節：0 總覽與 CFOP 比較 → 1 FB 直覺建橋 → 2 SB → 3 CMLL（2-look→42）→ 4 LSE 4a/4b/4c → 5 EOLR；每章嵌互動 CubeViewer 範例 |
| `/trainer` 練習器 | 出題 → 3D 顯示打亂 → 四張解法卡（階段名、步數、公式、指法、▶ 播放該段動畫含 stickering 高亮、FB 替代解切換）→ 全程連播 + 逐步控制；單段特訓模式（FB / SB / CMLL / LSE 各自獨立出題） |
| `/algs` 公式表 | CMLL 八組 tab 卡片（辨識圖 = twisty-player 2D U 面視角 + 主公式 + 指法 + 點擊 modal 3D 循環播放）、2-look 區、EOLR 表、LSE 4b/4c 參考 |
| `/timer` 計時器 | 空白鍵長按 300ms 轉綠 → 放開起跑 → 任意鍵停（觸控同邏輯）；可選 15s inspection；自動出題；+2/DNF；best/mean/ao5/ao12/ao100；session 列表 + localStorage；每筆「看橋式解法」帶打亂跳練習器 |

關鍵元件：`CubeViewer`（twisty-player React 封裝：setup alg、alg 播放、stickering mask、控制列）、`SolutionCard`、`AlgCard`、`Timer`。

樣式：自寫 CSS design tokens，深色主題，RWD（計時器手機場景）。實作時套 frontend-design 原則。

## 5. API / Data Flow Impact

全新專案，無既有 caller。新建的內部契約：

- `solveRoux(scramble: Alg): Promise<RouxSolution>` — `RouxSolution = { fb: StageSolution & { alternatives: Alg[] }, sb: StageSolution, cmll: StageSolution & { caseName: string }, lse: StageSolution & { phases: { eo, ulur, ep } } }`；`StageSolution = { alg: Alg, moveCount: number, annotations: FingertrickHint[] }`
- Worker message 協定：`{ type: 'init-progress' | 'ready' | 'solve-request' | 'solve-result' }`
- localStorage schema：`roux-trainer:sessions:v1` — `{ sessions: [{ id, name, solves: [{ ms, scramble, ts, penalty: null|'+2'|'DNF' }] }] }`（key 帶版本號，未來 schema 變更走新 key + 讀舊轉新）
- `data/cmll.ts` schema：`{ group, name, recognition: Alg(setup), alg: Alg, alternatives: Alg[], fingertricks: string }`

資料流：`scramble(cubing.js) → CubeState(自家模型) → Worker solver → RouxSolution → UI 卡片 / twisty-player(cubing.js Alg 字串)`。自家模型與 cubing.js 之間只交換 **alg 字串**（單向各自 apply），不共享 state 物件 — 兩邊狀態表示解耦。

## 6. Files to Modify

全部 Create（縮排表結構）：

```
+  package.json / vite.config.ts / tsconfig.json / index.html   專案骨架
+  .github/workflows/deploy.yml          push main → build → GitHub Pages
+  src/lib/cube/state.ts                 CubeState 表示 + apply move
+  src/lib/cube/moves.ts                 全 move 排列定義
+  src/lib/cube/alg.ts                   alg 解析/反轉/鏡像/化簡
+  src/lib/solver/fb.ts                  FB 距離表 + 求解
+  src/lib/solver/sb.ts                  SB 距離表 + 求解
+  src/lib/solver/cmll.ts                CMLL 辨識 + 查表
+  src/lib/solver/lse.ts                 LSE BFS + 4a/4b/4c 分段
+  src/lib/solver/worker.ts              Worker 入口（建表 + solve）
+  src/lib/solver/index.ts               主執行緒 API
+  src/lib/fingertricks/{triggers,annotate}.ts   指法引擎
+  src/lib/scramble.ts                   cubing.js 出題封裝
+  src/lib/timer/{stats,storage}.ts      統計 + localStorage
+  src/data/{cmll,cmll-2look,eolr}.ts    公式資料
+  src/data/lessons/*.tsx                教學章節內容
+  src/components/{CubeViewer,SolutionCard,AlgCard,Timer}.tsx
+  src/pages/{Home,Learn,Trainer,Algs,TimerPage}.tsx
+  src/{App,main}.tsx + styles           路由 + design tokens
+  tests/（Vitest，鏡像 src/lib 結構）    見 §8
```

模組邊界：`lib/` 不依賴 React、可獨立測試；`data/` 純資料；UI 只組裝。

## 7. Migration / Compatibility Notes

No migration — 全新專案，純新增。localStorage key 自帶版本號（`:v1`）預留未來 schema 演進。

## 8. Tests

| 對象 | 測試 | CI-testable |
|---|---|---|
| cube model | 每個 move 應用 4 次回原狀；alg 解析↔反轉 round-trip；鏡像自反 | ✅ Vitest |
| solver 整合 | 100 條隨機打亂全管線：FB 後 5 塊歸位 → SB 後 10 塊歸位 → CMLL 後角全對 → LSE 後全還原 | ✅ Vitest |
| CMLL 辨識 | 42 條公式各做 inverse setup → 辨識應回到對應 case | ✅ Vitest |
| 指法引擎 | trigger 比對 snapshot | ✅ Vitest |
| timer stats | ao5/ao12 含 +2/DNF 邊界（WCA 規則：ao5 去最好最差） | ✅ Vitest |
| cubing.js 整合 | M1 smoke test：Vite dev server 內成功出題 + twisty-player 渲染 | ⚠️ 手動（瀏覽器） |
| UI/RWD | 手動驗收：桌機 + 手機視窗 | ⚠️ 手動 |
| Pages 部署 | 上線後實際網址手動驗證（base path、hash router） | ⚠️ 手動 |

## 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| cubing.js × Vite worker/WASM bundling 歷史雷 | dev：出題/動畫直接不可用 | **M1 第一步 smoke test**，過不了改方案（scramble 改自家隨機 move 生成 + 動畫換 lib）再回頭修 spec |
| BFS 建表時間/記憶體超預期（低階手機） | dev/UX：載入卡頓 | Worker 內建表不卡 UI；「引擎準備中」狀態；表是 Uint8Array ≈ 5MB×2，行動裝置可承受 |
| CMLL 公式資料抄錄錯誤 | docs/教學品質：教錯公式 | 測試 §8：42 條全部 inverse-setup 驗證可解 + 還原驗證 |
| 指法標注品質（規則引擎生硬） | 教學品質 | CMLL 人工標注優先；規則引擎只兜底；上線前人工抽查 |
| 教學文案量大、品質參差 | 教學品質 | agent 起草 → 主對話審校；章節分批 commit 可獨立 revert |
| GitHub Pages 子路徑/router 踩雷 | deploy | hash router + Vite `base` 設定；上線後手動驗證清單 |

## 10. Rollback Plan

Standard git revert; no data side-effect。純前端靜態站，無 DB、無 schema migration。Pages 部署壞掉 → revert commit 重新 push 即自動重部署；最壞情況關閉 Pages 即下線。使用者端 localStorage 資料不受站方版本影響（key 帶版本號）。

## 11. Review Result

> This section filled in by `design-review` skill after dispatch.
