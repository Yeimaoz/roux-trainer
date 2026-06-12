---
status: design
owner: primary/roux-trainer
created: 2026-06-13
revised: 2026-06-13 (rev2 — user 釐清「最佳解」語意，移除任意打亂分段 solver)
---

# roux-trainer 橋式教學網站 — Design

## 1. Goal

做一個魔術方塊橋式（Roux method）教學網站：**case 驅動出題**（CMLL / 2-look / EOLR 等公式 case 的辨識練習題）+ 每個 case 的**標準最佳公式與繁中手順指法**、完整公式表（CMLL 42 + 2-look + EOLR）、WCA 打亂計時器、3D 動畫展示。全站繁體中文，部署 GitHub Pages。

> rev2 釐清：「提供最佳解法」= 每個**形象（case）**的公式最佳解（標準最短/最順手公式 + 指法），**不是**對任意打亂逐段計算最佳解的 solver。

## 2. Non-goals

- **任意打亂的分段最佳解 solver**（rev2 移除）：不做 FB/SB/LSE 的 BFS/IDA* 求解引擎。FB/SB 屬直覺建橋，以教學章節 + 精選範例呈現，不自動求解。
- **色向中立（CN）**：v1 固定白底（D）、綠前（F）、左橋橙色。
- **非三階方塊**：只做 3x3x3。
- **後端 / 帳號系統**：計時器資料存 localStorage。
- **手部 3D 動畫**：指法為繁中文字提示。
- **計時器逐 solve 解法回顧**（依賴 solver，隨 rev2 移除）。

## 3. Current Architecture

M1 已完成（commit 35647d9）：Vite 8 + React 18 + TS 骨架、cubing.js 0.63 出題 + twisty-player 渲染均通過 playwright headless smoke 驗證。關鍵環境設定已落地：`optimizeDeps.exclude:["cubing"]`（dev）+ `build.modulePreload:false`（production worker 雷）。

環境約束：WSL + macOS 雙平台開發（Node 專案天然跨平台）；GitHub Pages 靜態部署（子路徑 `/roux-trainer/`、hash router）。

## 4. Proposed Changes

### 4.1 Case 引擎（`src/lib/cases.ts`）

公式 case 的出題與解答邏輯，純函式：

- `makeDrill(c: AlgCase, rng): Drill` — 隨機 AUF ∈ {∅,U,U2,U'}，`setupAlg = invert(simplify(auf + c.alg))`（套到還原態即製造該 case 題目），`solutionAlg = simplify(auf + c.alg)`，附 `annotations = annotate(solutionAlg)`。
- twisty-player 直接吃 setupAlg 當 `experimental-setup-alg`（或 alg 倒播），不需自家方塊模型。
- alg 工具（`src/lib/alg.ts`）：parse / invert / simplify（合併相鄰同軸）/ mirror（M 鏡像，公式表左右手對照用）。

### 4.2 資料層（`src/data/`）——本案核心資產

- `cmll.ts`：42 條 — 組別（**O 組 2 條：O-adj/O-diag，skip 不入表**；H1-4、Pi1-6、U1-6、T1-6、L1-6、S1-6、AS1-6，合計 2+4+6×6=42）、case 名、辨識描述（繁中）、主公式、替代公式、人工指法標注。
- `cmll-2look.ts`：2-look 路線（轉正 7 條 + 排列 2 條）。
- `eolr.ts`：EOLR case 表（壞邊數 × UL/UR 位置分類，教學精選集）。
- `lessons/`：教學章節內容（繁中 TSX），含 FB/SB 直覺建橋的精選範例（人工撰寫，非 solver 產生）。
- `stickering.ts`：Roux 各段 twisty-player mask descriptor。

**資料品質防線（spec §8）**：每條公式以 cubing.js KPuzzle 做功能驗證——(a) inverse-setup 後套公式回到目標狀態（CMLL：角全還原；EOLR：EO+LR 達成）(b) CMLL 公式淨保留兩橋。錯一條測試就紅。

### 4.3 指法標注引擎（`src/lib/fingertricks/`）

Tokenize alg → 滑動視窗最長優先比對 trigger 庫（`R U R'` 食指推等）→ 未命中用單鍵預設提示。資料表的人工指法欄優先於規則引擎輸出。`FingertrickHint = { startIndex, endIndex, hint }`。

### 4.4 UI（5 頁，hash router）

| 頁 | 行為 |
|---|---|
| `/` 總覽 | 橋式介紹、四階段圖解、學習路線（2-look → 42 → EOLR）、CFOP 比較 |
| `/learn` 教學 | 章節：0 總覽與 CFOP 比較 → 1 FB 直覺建橋 → 2 SB → 3 CMLL（2-look→42）→ 4 LSE 4a/4b/4c → 5 EOLR；每章嵌互動 CubeViewer 範例 |
| `/trainer` 練習器 | **case 辨識特訓**：選題庫（CMLL 全部/單組/2-look/EOLR）→ 隨機 case + 隨機 AUF → 3D 顯示題目 → 自己想 → 翻牌看解答（公式 + 指法 + ▶ 動畫播放）→ 下一題 |
| `/algs` 公式表 | CMLL 八組 tab 卡片（辨識圖 = twisty-player 2D U 面視角 + 主公式 + 指法 + 點擊 modal 3D 循環播放）、2-look 區、EOLR 表 |
| `/timer` 計時器 | 空白鍵長按 300ms 轉綠 → 放開起跑 → 任意鍵停（觸控同邏輯）；可選 15s inspection；WCA 打亂自動出題；+2/DNF；best/mean/ao5/ao12/ao100；session 列表 + localStorage |

`CubeViewer`（twisty-player React 封裝）注意點（M1 實測 + review 確認）：
1. Roux 段高亮需 JS 屬性 `experimentalStickeringMaskOrbits` 餵自訂 mask（非 attribute 內建字串），descriptor 放 `data/stickering.ts`。
2. twisty-player 是 closed shadow root：E2E 驗證一律截圖視覺確認。

樣式：自寫 CSS design tokens，深色主題，RWD（計時器手機場景）。

## 5. API / Data Flow Impact

全新專案。內部契約：

- `AlgCase = { id, group, name, recognition: string, alg: string, alternatives: string[], fingertricks: string }`（cmll/2look/eolr 共用基底；eolr 另有 badEdges 等欄位）
- `Drill = { case: AlgCase, setupAlg: string, solutionAlg: string, annotations: FingertrickHint[] }`
- `FingertrickHint = { startIndex: number, endIndex: number, hint: string }`
- localStorage：`roux-trainer:sessions:v1` — `{ sessions: [{ id, name, createdAt, solves: [{ id, ms, scramble, ts, penalty }] }] }`
- 資料流：`data/*.ts → cases.makeDrill → UI 卡片 / twisty-player（alg 字串）`；計時器 `cubing.js scramble → 計時 → localStorage`。

## 6. Files to Modify

```
M  vite.config.ts                        （已含 cubing 雙修設定，M1 完成）
+  .github/workflows/deploy.yml          push main → build → GitHub Pages
+  src/lib/alg.ts                        parse/invert/simplify/mirror
+  src/lib/cases.ts                      makeDrill 出題引擎
+  src/lib/fingertricks/{triggers,annotate}.ts   指法引擎
+  src/lib/timer/{stats,storage}.ts      WCA 統計 + localStorage
+  src/data/{cmll,cmll-2look,eolr,stickering}.ts  公式資料（本案核心資產）
+  src/data/lessons/*.tsx                教學章節
+  src/components/{CubeViewer,AlgCard,DrillCard,Timer}.tsx
+  src/pages/{Home,Learn,Trainer,Algs,TimerPage}.tsx
+  src/{App,main}.tsx + styles           路由 + design tokens
+  tests/                                vitest（資料驗證/alg 工具/指法/timer）
```

## 7. Migration / Compatibility Notes

No migration — 全新專案。localStorage key 帶版本號（`:v1`）。

## 8. Tests

| 對象 | 測試 | CI-testable |
|---|---|---|
| alg 工具 | invert round-trip（KPuzzle 驗證 alg+invert=identity）、simplify、mirror | ✅ Vitest |
| CMLL 資料 | 42 條逐一：KPuzzle inverse-setup → 套公式 → 角全還原 + 兩橋淨保留；組別分布 2/4/6×6 | ✅ Vitest |
| 2-look 資料 | 42 case 全部可被 2-look 路徑（轉正+排列 × AUF 窮舉）解掉 | ✅ Vitest |
| EOLR 資料 | 每條：inverse-setup → 套公式 → EO 完成 + UL/UR 歸位（KPuzzle 驗證） | ✅ Vitest |
| 出題引擎 | makeDrill：setup+solution = identity；AUF 隨機分布 | ✅ Vitest |
| 指法引擎 | trigger 最長優先、單鍵兜底、空 alg | ✅ Vitest |
| timer stats | ao5/ao12/ao100 含 +2/DNF 邊界（WCA 規則） | ✅ Vitest |
| cubing.js 整合 | `smoke-browser.mjs`（playwright headless）——**2026-06-13 已通過** | ✅ 半自動（截圖確認） |
| UI/RWD | 手動驗收：桌機 + 手機視窗（playwright 截圖輔助） | ⚠️ 手動 |
| Pages 部署 | 上線後實際網址驗證（base path、hash router） | ⚠️ 手動 |

## 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| cubing.js × Vite 整合雷 | dev | **已解決（M1 實測）**：exclude + modulePreload:false，smoke 通過 |
| 公式資料抄錄錯誤 | 教學品質：教錯公式 | §8 KPuzzle 功能驗證逐條把關；組別分布斷言 |
| 指法標注品質 | 教學品質 | 人工標注優先、規則引擎兜底、上線前抽查 |
| 教學文案量大 | 教學品質 | agent 起草 → 主對話審校；章節分批 commit 可獨立 revert |
| GitHub Pages 子路徑/router | deploy | hash router + base 設定（M1 已配）；上線手動驗證 |

## 10. Rollback Plan

Standard git revert; no data side-effect。純靜態站，Pages 壞掉 revert 重 push 即重部署。

## 11. Review Result

```
Verdict: APPROVE WITH CHANGES（rev1，2026-06-13）
Reviewer: design-reviewer subagent（general-purpose / sonnet）
Findings: { Critical: 1, High: 2, Medium: 4, Low: 4, Informational: 6 }
rev1 套用：C1 vite 雙修、H1 O 組命名、H2 stickering JS 屬性、M1-M4、L3。
Spot-check（anti-cheat）通過。

rev2（2026-06-13，user 釐清）：「最佳解」=「case 的公式最佳解」，非任意打亂
逐段 solver。移除：BFS/座標表/FB/SB/LSE solver、Web Worker、計時器解法回顧。
改為：case 引擎（inverse-setup 出題）+ 資料層公式即解答。原 rev1 findings 中
solver 相關項（M1/M3/M4 部分內容）隨之失效；資料驗證改用 cubing.js KPuzzle。
```
