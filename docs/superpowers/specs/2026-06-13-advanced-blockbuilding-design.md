---
status: design
owner: primary/roux-trainer
created: 2026-06-13
supersedes-context: 2026-06-13-roux-trainer-design.md（rev2 主站）
---

# 進階建橋技巧（FB→SB）— Design

## 1. Goal

在既有橋式教學網站加入**進階建橋技巧**：FB→SB 銜接/影響、配對與插入、Keyhole，並以**移動效率**為貫穿主軸（少繞路、直接銜接、善用雙層 r/l 轉）。形式 = 進階案例庫（逐步動畫 + 解說）+ 進階教學章節。每個案例以 cubing.js KPuzzle 驗證正確性。

## 2. Non-goals

- **僞塊（pseudo-block）**：user 明確不選，本期不做。
- **色向中立（CN）**：延續主站，固定白底/綠前/橙左。
- **任意打亂 solver**：延續主站，不做。案例用逆向構造（手寫高效解 → setup = 其逆）。
- **competitive SB 完整 algset**：SB 非固定背的公式表，本期做「精選案例 + 技巧原則」，非窮舉。
- **naive 走法的自動最短性證明**：對照走法步數為教學標註（人工確認合理），不宣稱全域最短。

## 3. Current Architecture

主站已上線（commit 02fc62c）：Vite+React+TS，5 分頁（Home/Learn/Trainer/Algs/Timer）。Learn 用 `data/lessons/*.tsx` + 章節切換。CubeViewer 封裝 twisty-player（內建 stickering：FirstBlock/SecondBlock/CMLL/L6E）。資料正確性靠 `tests/kpuzzle-helpers.ts`（blocksPreserved 等，orbit UFR 系）。

## 4. Proposed Changes

### 4.1 進階案例資料（`src/data/advanced-cases.ts`）

```ts
export interface AdvancedCase {
  id: string;
  tag: "transition" | "pairing" | "keyhole" | "efficiency";
  title: string;            // 繁中
  setupAlg: string;         // 題目狀態 = invert(fbSolution + sbSolution)
  fbSolution: string;       // FB 段解（任意 outer move）
  sbSolution: string;       // SB 段解（限 R/r/U/M，不破壞 FB）
  naive?: { alg: string; count: number };  // 對照「繞路」走法（可選，展示效率）
  commentary: string;       // 繁中解說，點出技巧重點
  fingertricks: string;     // 繁中指法
}
export const ADVANCED_CASES: AdvancedCase[];  // 12-16 個，四 tag 各 3-4
```

逆向構造：手寫展示技巧的 `fbSolution`+`sbSolution` → `setupAlg = invert(fbSolution + " " + sbSolution)`。

### 4.2 進階案例頁（`src/pages/Advanced.tsx` + 新 nav 分頁 `/advanced`）

- 技巧分類 chips（全部/transition/pairing/keyhole/efficiency）。
- 每案一張 `AdvancedCaseCard`：題目 3D（setupAlg）→ ▶ 逐步播放（FB 段用 FirstBlock stickering、SB 段用 SecondBlock；播放控制）→ 解說 + 指法 + move 數（效率 vs naive 對照）。
- nav 增第 6 分頁「進階」。

### 4.3 進階教學章節（`src/data/lessons/` 擴充）

- Ch.6 建橋效率原則（efficiency.tsx）：少繞路、直接銜接、雙層 r/l 轉時機。
- Ch.7 FB→SB 銜接與影響（transition.tsx）。
- Ch.8 配對插入 + Keyhole（pairing-keyhole.tsx）。
- Learn.tsx CHAPTERS 陣列加三章；章節內嵌 CubeViewer 範例並連結 /advanced。

## 5. API / Data Flow Impact

純新增。新內部型別 `AdvancedCase`。新 route `/advanced`。資料流：`advanced-cases.ts → AdvancedCaseCard → CubeViewer(alg/setupAlg + stickering 切換)`。無 localStorage、無外部 API。

## 6. Files to Modify

```
+  src/data/advanced-cases.ts            進階案例資料（核心資產）
+  src/components/AdvancedCaseCard.tsx(+css)  案例卡（FB/SB 分段播放）
+  src/pages/Advanced.tsx(+css)          進階案例頁
+  src/data/lessons/efficiency.tsx       Ch.6 建橋效率原則
+  src/data/lessons/transition.tsx       Ch.7 FB→SB 銜接
+  src/data/lessons/pairing-keyhole.tsx  Ch.8 配對插入 + Keyhole
+  tests/data/advanced-cases.test.ts     每案 KPuzzle 驗證
M  src/App.tsx                           加 /advanced route
M  src/components/Layout.tsx             nav 加「進階」
M  src/pages/Learn.tsx                   CHAPTERS 加三章
```

## 7. Migration / Compatibility Notes

No migration — 純新增。不動既有資料/路由行為。

## 8. Tests

| 對象 | 測試 | CI |
|---|---|---|
| 每個 advanced case | KPuzzle：setup → fbSolution → FB 五塊歸位；→ sbSolution → FB+SB 十塊歸位 | ✅ Vitest |
| SB moveset 合法性 | sbSolution 只含 R/r/U/M 系 token | ✅ Vitest |
| setupAlg 一致性 | setupAlg == invert(fbSolution + sbSolution) | ✅ Vitest |
| tag 分布 | 四類各 ≥3 | ✅ Vitest |
| UI | 進階頁 build + 截圖（卡片 render、分段播放）、手機 | ⚠️ 手動截圖 |
| 教學三章 | build + 截圖；術語審校（領域 agent） | ⚠️ 手動 |

## 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| 案例沒真展示該技巧（只是隨機解） | 教學品質 | 逐案手寫示範該 tag 技巧 + 領域專家審；commentary 明確點出技巧 |
| FB/SB 段切分錯（sbSolution 破壞 FB） | 正確性 | §8 測試逐段驗 FB 先歸位、SB 後不破壞 |
| naive 對照步數失真 | 教學 | naive 也用 KPuzzle 驗可解；步數為標註非宣稱最短 |
| nav 第 6 分頁手機塞不下 | UX | 既有漢堡選單；截圖驗手機 |

## 10. Rollback Plan

Standard git revert; no data side-effect。純前端新增，revert 對應 commit 即移除分頁與內容，不影響既有頁。

## 11. Review Result

> design-review 後填寫。
