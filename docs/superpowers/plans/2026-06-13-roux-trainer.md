# roux-trainer 橋式教學網站 Implementation Plan（rev2）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 橋式（Roux）教學網站：case 驅動出題、每個 case 的標準最佳公式 + 繁中指法、公式表（CMLL 42 / 2-look / EOLR）、WCA 計時器、3D 動畫，部署 GitHub Pages。

**Architecture:** 純前端 SPA。**沒有 solver**（rev2 user 釐清：「最佳解」= case 的公式最佳解）。出題 = 把公式逆轉（+ 隨機 AUF）施加到還原態製造 case；解答 = 該 case 的標準公式 + 指法標注。公式資料是核心資產，每條以 cubing.js KPuzzle 在測試裡功能驗證（解得掉、保得住橋）。cubing.js 負責 WCA 出題（計時器）與 twisty-player 動畫。

**Tech Stack:** Vite 8 + React 18 + TS（M1 已驗證）、cubing.js 0.63（scramble / twisty / KPuzzle 測試驗證）、react-router 7（hash）、Vitest（happy-dom）、playwright smoke。

**狀態：** M1（骨架 + smoke）完成於 35647d9。本 plan 從資料與工具層開始。

**Repo 慣例：** 直接在 main 工作（全新 repo）。Subagent 只寫檔案**不碰 git**，controller 驗證後 commit。測試指令：`cd /home/Yeimaoz/projects/roux-trainer && npx vitest run [path]`。UI 任務遵循 frontend-design 原則（深色主題、design tokens、RWD），完成後用 playwright 截圖供 controller 審視覺。

**Spec:** `docs/superpowers/specs/2026-06-13-roux-trainer-design.md`（rev2）

## Prerequisites

- M1 已落地（commit 35647d9）：Vite 骨架、cubing.js 0.63 安裝、vite.config.ts 雙修設定、smoke-browser.mjs。
- Node 22 + playwright chromium（WSL 已有快取）。
- 無其他前置——greenfield，所有任務檔案均為新建（vite.config.ts/App.tsx 為修改）。

## Acceptance Criteria（整案）

1. `npx vitest run` 全綠（資料驗證 42+9+EOLR 條、alg 工具、指法、timer、出題引擎）。
2. `npm run build` 成功；`node smoke-browser.mjs` PASS。
3. 五頁功能可用（playwright 截圖人工驗收）：公式表 42 卡、練習器翻牌流、計時器記錄 + 統計、教學六章、首頁。
4. GitHub Pages 上線，實際網址 5 路由 + 出題功能 smoke 通過。
5. 教學內容經 controller 逐章審校（術語正確）。

---

## File Structure

```
src/lib/alg.ts                 parse/invert/simplify/mirror
src/lib/cases.ts               makeDrill 出題引擎
src/lib/fingertricks/triggers.ts   trigger 資料（pattern → 繁中提示）
src/lib/fingertricks/annotate.ts   alg → FingertrickHint[]
src/lib/timer/stats.ts         ao5/ao12/ao100、+2/DNF（WCA 規則）
src/lib/timer/storage.ts       localStorage session v1
src/lib/scramble.ts            cubing.js WCA 出題封裝
src/data/cmll.ts               42 條 CMLL（核心資產，含人工指法）
src/data/cmll-2look.ts         2-look 路線（轉正 7 + 排列 2）
src/data/eolr.ts               EOLR 教學精選 case
src/data/stickering.ts         Roux 各段 twisty mask descriptor
src/data/lessons/              教學章節（繁中 TSX）
src/components/CubeViewer.tsx  twisty-player React 封裝
src/components/AlgCard.tsx     公式卡
src/components/DrillCard.tsx   練習翻牌卡
src/components/Timer.tsx       計時器核心
src/pages/{Home,Learn,Trainer,Algs,TimerPage}.tsx
src/styles/tokens.css + global.css
tests/                          鏡像 src 結構 + kpuzzle-helpers.ts
```

`lib/`、`data/` 零 React 依賴。

---

## Task 1: alg 工具 + KPuzzle 測試 helpers

**Files:** Create `src/lib/alg.ts`、`tests/alg.test.ts`、`tests/kpuzzle-helpers.ts`

- [ ] **Step 1.1 寫失敗測試**

```ts
// tests/alg.test.ts
import { describe, it, expect } from "vitest";
import { parseAlg, invertAlg, mirrorAlgM, simplifyAlg, moveCount } from "../src/lib/alg";
import { applyToSolved, isIdentity } from "./kpuzzle-helpers";

describe("alg utils", () => {
  it("parse 接受標準記號並拒絕垃圾", () => {
    expect(parseAlg("R U2 M' r2")).toEqual(["R", "U2", "M'", "r2"]);
    expect(() => parseAlg("R W3")).toThrow();
  });
  it("alg ∘ invert(alg) = identity（KPuzzle 驗證）", async () => {
    const alg = "R U R' U' M2 F r U2";
    expect(isIdentity(await applyToSolved(`${alg} ${invertAlg(alg)}`))).toBe(true);
  });
  it("M 鏡像：R↔L 且方向反轉、U 反向、M 同字反向（鏡像自反）", () => {
    const a = "R U R' F M";
    expect(mirrorAlgM(mirrorAlgM(a))).toBe(a); // 自反性
    expect(mirrorAlgM("R")).toBe("L'");
  });
  it("wide/rotation 鏡像：r→l'、r2→l2、x→x'", () => {
    expect(mirrorAlgM("r")).toBe("l'");
    expect(mirrorAlgM("r2")).toBe("l2");
    expect(mirrorAlgM("x")).toBe("x'");
  });
  it("鏡像後仍是合法可解 alg：alg鏡像 ∘ invert(alg鏡像) = identity", async () => {
    const m = mirrorAlgM("R U R' U' M' U M");
    expect(isIdentity(await applyToSolved(`${m} ${invertAlg(m)}`))).toBe(true);
  });
  it("simplify 合併相鄰同軸", () => {
    expect(simplifyAlg("R U U' R")).toBe("R2");
    expect(simplifyAlg("U2 U2")).toBe("");
    expect(simplifyAlg("R U R'")).toBe("R U R'");
  });
  it("moveCount", () => {
    expect(moveCount("")).toBe(0);
    expect(moveCount("R U2 M'")).toBe(3);
  });
});
```

- [ ] **Step 1.2 寫 kpuzzle-helpers.ts（測試基礎設施，之後所有資料測試共用）**

```ts
// tests/kpuzzle-helpers.ts
// cubing.js KPuzzle 驗證工具。KPuzzle 是 cubing.js 的內部方塊模型，
// node 端可跑，當作公式資料的「裁判」。
import { cube3x3x3 } from "cubing/puzzles";
import type { KPattern, KPuzzle } from "cubing/kpuzzle";

let kpuzzleCache: KPuzzle | null = null;
export async function kpuzzle(): Promise<KPuzzle> {
  return (kpuzzleCache ??= await cube3x3x3.kpuzzle());
}

export async function applyToSolved(alg: string): Promise<KPattern> {
  const kp = await kpuzzle();
  return kp.defaultPattern().applyAlg(alg);
}

export function isIdentity(p: KPattern): boolean {
  return p.experimentalIsSolved({ ignoreCenterOrientation: true, ignorePuzzleOrientation: true });
}

// --- 中心歸位（wide/M move 會動中心，塊級檢查前先轉回） ---
const ROTATION_ALGS = [
  "", "y", "y2", "y'",
  "x", "x y", "x y2", "x y'",
  "x2", "x2 y", "x2 y2", "x2 y'",
  "x'", "x' y", "x' y2", "x' y'",
  "z", "z y", "z y2", "z y'",
  "z'", "z' y", "z' y2", "z' y'",
];
export async function normalizePattern(p: KPattern): Promise<KPattern> {
  const kp = await kpuzzle();
  const solvedCenters = JSON.stringify(kp.defaultPattern().patternData["CENTERS"]);
  for (const rot of ROTATION_ALGS) {
    const q = rot === "" ? p : p.applyAlg(rot);
    if (JSON.stringify(q.patternData["CENTERS"]) === solvedCenters) return q;
  }
  throw new Error("centers unreachable");
}

// --- orbit piece 名稱對映 ---
// Bootstrap 流程（一次性，實作本檔時做）：
//   console.log(JSON.stringify((await kpuzzle()).definition.orbits)) 取得
//   EDGES/CORNERS piece 數與順序慣例，再用單一 move 驗證（如 apply "U" 後
//   恰好 U 層 4 邊位置互換）。把確認後的順序寫死成下面兩個常數。
// 寫死後由 guard 測試持續守護（見 Step 1.3）。
export const EDGE_ORDER: string[] = [/* bootstrap 後填，如 "UF","UR","UB","UL",... */];
export const CORNER_ORDER: string[] = [/* bootstrap 後填，如 "UFR","UBR",... */];

export function pieceSolved(p: KPattern, orbit: "EDGES" | "CORNERS", name: string): boolean {
  const order = orbit === "EDGES" ? EDGE_ORDER : CORNER_ORDER;
  const i = order.indexOf(name);
  if (i < 0) throw new Error(`unknown piece ${name}`);
  const d = p.patternData[orbit];
  return d.pieces[i] === i && d.orientation[i] === 0;
}

// Roux 兩橋塊清單
export const FB_PIECES = { edges: ["DL", "FL", "BL"], corners: ["DLF", "DBL"] };
export const SB_PIECES = { edges: ["DR", "FR", "BR"], corners: ["DFR", "DRB"] };
export async function blocksPreserved(p: KPattern): Promise<boolean> {
  const n = await normalizePattern(p);
  return [...FB_PIECES.edges, ...SB_PIECES.edges].every((e) => pieceSolved(n, "EDGES", e)) &&
         [...FB_PIECES.corners, ...SB_PIECES.corners].every((c) => pieceSolved(n, "CORNERS", c));
}
export async function uCornersSolved(p: KPattern): Promise<boolean> {
  const n = await normalizePattern(p);
  return ["URF", "UFL", "ULB", "UBR"].every((c) => pieceSolved(n, "CORNERS", c));
}
```

- [ ] **Step 1.2b Bootstrap orbit 名稱（填入 EDGE_ORDER/CORNER_ORDER，一次性）**

在 repo 根目錄執行：

```bash
cd /home/Yeimaoz/projects/roux-trainer && node --input-type=module <<'EOF'
import { cube3x3x3 } from "cubing/puzzles";
const kp = await cube3x3x3.kpuzzle();
const p = kp.defaultPattern();
console.log("orbits:", JSON.stringify(kp.definition.orbits, null, 1).slice(0, 2000));
const pu = p.applyAlg("U");
console.log("EDGES default:", JSON.stringify(p.patternData["EDGES"]));
console.log("EDGES after U:", JSON.stringify(pu.patternData["EDGES"]));
console.log("CORNERS after R:", JSON.stringify(p.applyAlg("R").patternData["CORNERS"]));
EOF
```

依輸出確認 orbit 名稱與 piece 順序慣例（cubing.js 3x3 definition 內含每個 piece 的名稱順序；拼法以 definition 為準，如 "UFR" vs "URF" 跟著它），填入 `EDGE_ORDER`/`CORNER_ORDER`。填完後 guard 測試驗證正確性（U 後 UF 不在家、DF 在家等行為斷言對不上 = 順序填錯）。

guard 測試（放 `tests/kpuzzle-helpers.test.ts`）：

```ts
// tests/kpuzzle-helpers.test.ts
import { describe, it, expect } from "vitest";
import { applyToSolved, normalizePattern, pieceSolved, blocksPreserved, EDGE_ORDER, CORNER_ORDER } from "./kpuzzle-helpers";

describe("kpuzzle helpers guard", () => {
  it("orbit 對映表已填且長度正確", () => {
    expect(EDGE_ORDER.length).toBe(12);
    expect(CORNER_ORDER.length).toBe(8);
  });
  it("U 後：U 層 4 邊不在家，D 層邊在家", async () => {
    const p = await applyToSolved("U");
    expect(pieceSolved(p, "EDGES", "UF")).toBe(false);
    expect(pieceSolved(p, "EDGES", "DF")).toBe(true);
  });
  it("r U r' 之類動中心的 alg：normalize 後兩橋判定正確", async () => {
    expect(await blocksPreserved(await applyToSolved("r U r'"))).toBe(false); // 破 SB(DR? r 動 DR 邊) — 以實際為準調整斷言對象
    expect(await blocksPreserved(await applyToSolved("U"))).toBe(true);
    expect(await blocksPreserved(await applyToSolved("M U M'"))).toBe(false); // M 動 DF/DB
  });
  it("T-perm 保留兩橋", async () => {
    expect(await blocksPreserved(await applyToSolved("R U R' F' R U R' U' R' F R2 U' R'"))).toBe(true);
  });
});
```

（`r U r'` 斷言：r 動 FR/DR/BR 邊與右橋角，U 又動頂層——實作時跑一次確認實際 false/true 再定案斷言；重點是「動中心的 alg 經 normalize 後判定不亂飛」。）

- [ ] **Step 1.3 確認失敗** → FAIL（module 不存在）
- [ ] **Step 1.4 實作 src/lib/alg.ts**

```ts
// src/lib/alg.ts
const MOVE_RE = /^([URFDLBurfdlbMESxyz])(2|')?$/;

export function parseAlg(alg: string): string[] {
  return alg.trim().split(/\s+/).filter(Boolean).map((tok) => {
    if (!MOVE_RE.test(tok)) throw new Error(`invalid move token: ${tok}`);
    return tok;
  });
}

export function invertAlg(alg: string): string {
  return parseAlg(alg).reverse().map((m) => {
    if (m.endsWith("2")) return m;
    if (m.endsWith("'")) return m.slice(0, -1);
    return m + "'";
  }).join(" ");
}

// M 面鏡像（左右互換）：R↔L、r↔l；x 軸向：方向反轉；M 在鏡面內：同字反向；
// U/D/F/B/E/S/y/z：同字反向。
const MIRROR_BASE: Record<string, string> = { R: "L", L: "R", r: "l", l: "r" };
export function mirrorAlgM(alg: string): string {
  return parseAlg(alg).map((m) => {
    const base = MIRROR_BASE[m[0]] ?? m[0];
    const suf = m.slice(1);
    if (suf === "2") return base + "2";
    return suf === "'" ? base : base + "'";
  }).join(" ");
}

export function simplifyAlg(alg: string): string {
  const out: Array<{ base: string; amt: number }> = [];
  for (const m of parseAlg(alg)) {
    const base = m[0];
    const amt = m.endsWith("2") ? 2 : m.endsWith("'") ? 3 : 1;
    const last = out[out.length - 1];
    if (last && last.base === base) {
      last.amt = (last.amt + amt) % 4;
      if (last.amt === 0) out.pop();
    } else out.push({ base, amt });
  }
  return out.map(({ base, amt }) => base + (amt === 1 ? "" : amt === 2 ? "2" : "'")).join(" ");
}

export function moveCount(alg: string): number {
  return alg.trim() === "" ? 0 : parseAlg(alg).length;
}
```

- [ ] **Step 1.5 跑到全綠**：`npx vitest run tests/alg.test.ts tests/kpuzzle-helpers.test.ts` → PASS
- [ ] **Step 1.6 Commit**：`git add -A && git commit -m "feat(lib): alg 工具 + KPuzzle 測試 helpers"`

---

## Task 2: CMLL 42 + 2-look 資料（核心資產）

**Files:** Create `src/data/cmll.ts`、`src/data/cmll-2look.ts`、`tests/data/cmll.test.ts`

- [ ] **Step 2.1 先寫資料驗證測試（資料品質的唯一仲裁者）**

```ts
// tests/data/cmll.test.ts
import { describe, it, expect } from "vitest";
import { CMLL_CASES } from "../../src/data/cmll";
import { TWO_LOOK_ORIENT, TWO_LOOK_PERMUTE } from "../../src/data/cmll-2look";
import { invertAlg } from "../../src/lib/alg";
import { applyToSolved, blocksPreserved, uCornersSolved, normalizePattern, pieceSolved } from "../kpuzzle-helpers";

describe("CMLL 資料", () => {
  it("恰 42 條，分布 O:2 H:4 Pi:6 U:6 T:6 L:6 S:6 AS:6，id 唯一", () => {
    expect(CMLL_CASES.length).toBe(42);
    const dist: Record<string, number> = {};
    for (const c of CMLL_CASES) dist[c.group] = (dist[c.group] ?? 0) + 1;
    expect(dist).toEqual({ O: 2, H: 4, Pi: 6, U: 6, T: 6, L: 6, S: 6, AS: 6 });
    expect(new Set(CMLL_CASES.map((c) => c.id)).size).toBe(42);
  });

  for (const c of CMLL_CASES) {
    it(`${c.id}: 主公式解掉角塊且淨保留兩橋`, async () => {
      const setup = await applyToSolved(invertAlg(c.alg));
      expect(await blocksPreserved(setup), "inverse-setup 不保橋 → 公式本身不保橋").toBe(true);
      const after = setup.applyAlg(c.alg);
      expect(await uCornersSolved(after)).toBe(true);
      expect(await blocksPreserved(after)).toBe(true);
    });
    it(`${c.id}: 替代公式效果等價`, async () => {
      for (const alt of c.alternatives) {
        const after = (await applyToSolved(invertAlg(c.alg))).applyAlg(alt);
        expect(await uCornersSolved(after), `alt: ${alt}`).toBe(true);
        expect(await blocksPreserved(after)).toBe(true);
      }
    });
    it(`${c.id}: 必填欄位完整`, () => {
      expect(c.recognition.length).toBeGreaterThan(3);   // 繁中辨識描述
      expect(c.fingertricks.length).toBeGreaterThan(3);  // 繁中指法
    });
  }

  it("42 case 全部可被 2-look 路徑解掉（轉正 × AUF → 排列 × AUF）", async () => {
    const AUF = ["", "U", "U2", "U'"];
    for (const c of CMLL_CASES) {
      const setup = await applyToSolved(invertAlg(c.alg));
      let oriented: typeof setup | null = null;
      // 第一眼：找到 (auf, orient) 使角全轉正（orient 候選含「不需要」）
      outer1: for (const auf of AUF) {
        for (const o of [{ alg: "" }, ...TWO_LOOK_ORIENT]) {
          const cand = setup.applyAlg(`${auf} ${o.alg}`.trim() || "U U'");
          if (await cornersAllOriented(cand)) { oriented = cand; break outer1; }
        }
      }
      expect(oriented, `${c.id} 第一眼無解`).not.toBeNull();
      // 第二眼
      let done = false;
      outer2: for (const auf of AUF) {
        for (const p of [{ alg: "" }, ...TWO_LOOK_PERMUTE]) {
          for (const auf2 of AUF) {
            const cand = oriented!.applyAlg(`${auf} ${p.alg} ${auf2}`.trim() || "U U'");
            if (await uCornersSolved(cand)) { done = true; break outer2; }
          }
        }
      }
      expect(done, `${c.id} 第二眼無解`).toBe(true);
    }
  });
});

// 角全轉正（orientation 全 0，位置可亂）：
async function cornersAllOriented(p: Awaited<ReturnType<typeof applyToSolved>>): Promise<boolean> {
  const n = await normalizePattern(p);
  return [...n.patternData["CORNERS"].orientation].every((o) => o === 0);
}
```

（`"U U'"` 是「空 alg」的 applyAlg 替身——實作時若 cubing.js 接受空字串就直接用空字串。）

- [ ] **Step 2.2 確認失敗** → FAIL

- [ ] **Step 2.3 建立 cmll-2look.ts（先做，42 條的 2-look 測試依賴它）**

```ts
// src/data/cmll-2look.ts
// 2-look CMLL：第一眼轉正（角版 OCLL 7 條）、第二眼排列（2 條）
export interface TwoLookAlg { name: string; recognition: string; alg: string; fingertricks: string }
export const TWO_LOOK_ORIENT: TwoLookAlg[] = [
  { name: "S",  recognition: "一角已轉正在左前，頂色在前", alg: "R U R' U R U2 R'", fingertricks: "Sune：R 起手食指推 U，節奏連貫一氣呵成" },
  { name: "AS", recognition: "一角已轉正，鏡像 Sune", alg: "R U2 R' U' R U' R'", fingertricks: "反 Sune：雙推 U2 後勾 U'" },
  { name: "H",  recognition: "四角全未轉正，左右成對朝側面", alg: "R U R' U R U' R' U R U2 R'", fingertricks: "三段 R U 節奏：推、推、雙推" },
  { name: "Pi", recognition: "四角全未轉正，同側兩頂色朝前", alg: "F R U R' U' R U R' U' F'", fingertricks: "F 起手雙 sexy 收 F'" },
  { name: "U",  recognition: "兩角未轉正（車頭燈朝後）", alg: "R2 D R' U2 R D' R' U2 R'", fingertricks: "R2 D 起手，注意 D 用左無名指" },
  { name: "T",  recognition: "兩角未轉正，頂色朝左右兩側", alg: "r U R' U' r' F R F'", fingertricks: "r 寬轉起手接 sledgehammer" },
  { name: "L",  recognition: "兩角未轉正，對角", alg: "F R' F' r U R U' r'", fingertricks: "F 起手 hedge 變體，r 收尾" },
];
export const TWO_LOOK_PERMUTE: TwoLookAlg[] = [
  { name: "Adj",  recognition: "相鄰兩角互換（一側車頭燈）", alg: "R U R' F' R U R' U' R' F R2 U' R'", fingertricks: "T-perm：sexy 進 F' 出，背熟成肌肉記憶" },
  { name: "Diag", recognition: "對角兩角互換（無車頭燈）", alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'", fingertricks: "Y-perm：F 進雙段收 sledge" },
];
```

（這 9 條是高置信標準公式；正確性仍由 Step 2.1 測試把關，紅了就修。）

- [ ] **Step 2.4 建立 cmll.ts（42 條）**

Schema：

```ts
// src/data/cmll.ts
export interface CmllCase {
  id: string;          // 如 "O-adj"、"H1"、"Pi3"
  group: "O" | "H" | "Pi" | "U" | "T" | "L" | "S" | "AS";
  name: string;        // 顯示名（繁中可），如「O 相鄰換」
  recognition: string; // 繁中辨識描述（頂色分布 + 車頭燈位置）
  alg: string;         // 主公式
  alternatives: string[];
  fingertricks: string; // 繁中指法（人工撰寫）
}
export const CMLL_CASES: CmllCase[] = [ /* 42 條 */ ];
```

資料來源（按優先序）：
1. speedsolving wiki「CMLL」頁 + speedcubedb CMLL 區（WebFetch / WebSearch 取標準公式；每組主流首選為主公式、次選放 alternatives）。
2. 高置信種子（直接可用）：`O-adj` = T-perm、`O-diag` = Y-perm（見 2-look 檔）、`S1: R U R' U R U2 R'`、`AS1: R U2 R' U' R U' R'`、`Pi1: F R U R' U' R U R' U' F'`、`H2: F R U R' U' R U R' U' R U R' U' F'`。
3. 取不到來源時兜底：該 case 用 2-look 合成公式（轉正 + AUF + 排列，自動搜 AUF 組合直到驗證測試過），標 `alternatives: []`、`fingertricks` 寫 2-look 對應提示——**功能正確優先，最短公式後補**。

每條的 `recognition` 與 `fingertricks` 為繁中人工內容（agent 起草、controller 審校）。

**驗收 = Step 2.1 全綠**（42 條功能驗證 + 分布 + 2-look 可解性 + 欄位完整）。

- [ ] **Step 2.5 跑到全綠** → PASS（單條紅 = 該條公式錯，重新 source，不改測試）
- [ ] **Step 2.6 Commit**：`git commit -m "feat(data): CMLL 42 + 2-look 資料（KPuzzle 自驗證）"`

---

## Task 3: EOLR 教學資料

**Files:** Create `src/data/eolr.ts`、`tests/data/eolr.test.ts`

- [ ] **Step 3.1 寫失敗測試**

```ts
// tests/data/eolr.test.ts
import { describe, it, expect } from "vitest";
import { EOLR_CASES } from "../../src/data/eolr";
import { invertAlg } from "../../src/lib/alg";
import { applyToSolved, normalizePattern, pieceSolved } from "../kpuzzle-helpers";
import type { KPattern } from "cubing/kpuzzle";

describe("EOLR 資料", () => {
  for (const c of EOLR_CASES) {
    it(`${c.id}: setup 後套公式 → UL/UR 歸位且剩餘可用 ⟨M,U2⟩ 解完`, async () => {
      const after = (await applyToSolved(invertAlg(c.alg))).applyAlg(c.alg);
      const n = await normalizePattern(after);
      expect(pieceSolved(n, "EDGES", "UL")).toBe(true);
      expect(pieceSolved(n, "EDGES", "UR")).toBe(true);
      expect(await solvableWithMU2(n), `${c.id} 殘局非 4c 可解`).toBe(true);
    });
    it(`${c.id}: 欄位完整且 alg 僅用 M/U 系 move`, () => {
      expect(c.alg.split(" ").every((m) => /^[MU](2|')?$/.test(m))).toBe(true);
      expect(c.recognition.length).toBeGreaterThan(3);
    });
  }
});

// ⟨M, U2⟩ 子群 BFS（子群很小，全枚舉即可）
async function solvableWithMU2(start: KPattern): Promise<boolean> {
  const MOVES = ["M", "M'", "M2", "U2"];
  const seen = new Set<string>();
  let frontier = [start];
  const key = (p: KPattern) => JSON.stringify(p.patternData);
  seen.add(key(start));
  for (let depth = 0; depth <= 14; depth++) {
    const next: KPattern[] = [];
    for (const p of frontier) {
      if (p.experimentalIsSolved({ ignoreCenterOrientation: true, ignorePuzzleOrientation: true }))
        return true;
      for (const m of MOVES) {
        const q = p.applyAlg(m);
        const k = key(q);
        if (!seen.has(k)) { seen.add(k); next.push(q); }
      }
    }
    frontier = next;
    if (!frontier.length) break;
  }
  return false;
}
```

註：`invertAlg(c.alg)` 直接當 setup（不另加打亂）。EOLR case 定義態 = 它自己的逆——這正是「該形象」的乾淨題目。

- [ ] **Step 3.2 確認失敗** → FAIL
- [ ] **Step 3.3 建立 eolr.ts**

```ts
// src/data/eolr.ts
// EOLR 教學精選：依壞邊數分類的代表 case（教學足夠，非競技全集）。
// 假設前提：FB+SB 已建、CMLL 已解。alg 為純 LSE 公式（M/U 系），從 4a EO 起手；
// 終態 = EO 完成 + UL/UR 歸位，其餘塊不離開 LSE 域（測試 solvableWithMU2 依賴此前提）。
export interface EolrCase {
  id: string;            // 如 "2-arrow-front"
  badEdges: 0 | 2 | 4 | 6;
  recognition: string;   // 繁中：壞邊位置 + UL/UR 所在
  alg: string;           // M/U 系公式，終態 = EO 完成 + UL/UR 歸位
  fingertricks: string;
}
export const EOLR_CASES: EolrCase[] = [ /* 12-20 條教學精選 */ ];
```

來源：EOLR 標準教材（如 rouxers.com EOLR 章節、speedsolving wiki）WebFetch 取案例；不可得時人工構造：從還原態套 M/U 序列產生 case、其逆即公式（**自動滿足驗證**，但要人工確認 recognition 描述正確）。最低 12 條：壞邊 0（UL/UR 換位 ×2）、2（箭頭/側位 ×4）、4（×4）、6（×2）。

- [ ] **Step 3.4 跑到全綠** → PASS
- [ ] **Step 3.5 Commit**：`git commit -m "feat(data): EOLR 教學精選（⟨M,U2⟩ 可解性驗證）"`

---

## Task 4: 指法引擎

**Files:** Create `src/lib/fingertricks/triggers.ts`、`src/lib/fingertricks/annotate.ts`、`tests/fingertricks/annotate.test.ts`

- [ ] **Step 4.1 寫失敗測試**

```ts
// tests/fingertricks/annotate.test.ts
import { describe, it, expect } from "vitest";
import { annotate } from "../../src/lib/fingertricks/annotate";

describe("指法標注", () => {
  it("sexy move 命中 trigger", () => {
    const hints = annotate("R U R' U'");
    expect(hints[0]).toEqual({ startIndex: 0, endIndex: 3, hint: expect.stringContaining("食指") });
  });
  it("最長優先：R U R' U' R U R' → sexy + 三連", () => {
    const hints = annotate("R U R' U' R U R'");
    expect(hints[0].endIndex).toBe(3);
    expect(hints[1]).toEqual({ startIndex: 4, endIndex: 6, hint: expect.any(String) });
  });
  it("未命中 move 用單鍵兜底", () => {
    expect(annotate("M2")[0].hint.length).toBeGreaterThan(0);
  });
  it("空 alg → 空陣列", () => {
    expect(annotate("")).toEqual([]);
  });
  it("整條 alg 被區間完整覆蓋且不重疊", () => {
    const hints = annotate("F R U' R' U' R U R' F' R U R' U' R' F R F'");
    let cursor = 0;
    for (const h of hints) {
      expect(h.startIndex).toBe(cursor);
      cursor = h.endIndex + 1;
    }
    expect(cursor).toBe(17);
  });
});
```

- [ ] **Step 4.2 確認失敗** → FAIL
- [ ] **Step 4.3 實作 triggers.ts（資料全文）**

```ts
// src/lib/fingertricks/triggers.ts
export interface Trigger { pattern: string[]; hint: string }
// 由長到短排列（annotate 依序比對 = 最長優先）
export const TRIGGERS: Trigger[] = [
  { pattern: ["R","U","R'","U'"], hint: "Sexy move：右食指推 U，R 對拇指食指捏轉，一氣呵成" },
  { pattern: ["R'","U'","R","U"], hint: "反 sexy：右食指勾 U'，R' 手腕回轉" },
  { pattern: ["R'","F","R","F'"], hint: "Sledgehammer：右 R'、左食指撥 F、右回 R、左回 F'" },
  { pattern: ["F","R'","F'","R"], hint: "Hedgeslammer：左食指 F 起手，右手接 R' F' R" },
  { pattern: ["M'","U'","M"],     hint: "右無名指勾 M'、食指推 U'、回 M" },
  { pattern: ["M'","U","M"],      hint: "M' 無名指起手、食指推 U、回 M" },
  { pattern: ["M2","U","M2"],     hint: "4c 節奏：中指+無名指連撥 M2、食指 U、再 M2" },
  { pattern: ["M","U2","M"],      hint: "M 後雙食指連推 U2、補 M" },
  { pattern: ["R","U","R'"],      hint: "右手三連：R 起手、食指推 U、手腕回 R'" },
  { pattern: ["R","U'","R'"],     hint: "R 起手、食指勾 U'、手腕回 R'" },
  { pattern: ["R","U2","R'"],     hint: "R 起手、食指+中指連推 U2、回 R'" },
  { pattern: ["U","M'","U'"],     hint: "食指 U、無名指 M'、食指勾回 U'" },
];
export const SINGLE_MOVE_HINTS: Record<string, string> = {
  "U": "右食指推", "U'": "左食指推（或右食指勾）", "U2": "食指+中指連推",
  "R": "右手腕轉", "R'": "右手腕回轉", "R2": "右手腕連轉兩下",
  "L": "左手腕轉", "L'": "左手腕回轉", "L2": "左手腕連轉",
  "M": "左無名指/中指下撥", "M'": "右無名指上勾", "M2": "中指+無名指連撥",
  "r": "右手雙層腕轉", "r'": "右手雙層回轉", "r2": "右雙層連轉",
  "l": "左手雙層腕轉", "l'": "左手雙層回轉", "l2": "左雙層連轉",
  "F": "左食指底撥（或換握）", "F'": "右食指底撥", "F2": "換握連轉",
  "D": "左無名指底撥", "D'": "右無名指底撥", "D2": "底層連撥",
  "B": "換握轉背面（公式中盡量避免）", "B'": "換握轉背面", "B2": "背面連轉",
  "u": "右食指推雙層", "u'": "左食指推雙層", "u2": "雙層連推",
  "E": "中層水平撥", "E'": "中層反向撥", "E2": "中層連撥",
  "S": "中層前向撥", "S'": "中層反向撥", "S2": "中層連撥",
  "x": "整顆翻轉", "x'": "整顆反翻", "x2": "整顆翻兩下",
  "y": "整顆水平轉", "y'": "整顆反水平轉", "y2": "整顆轉半圈",
  "z": "整顆側翻", "z'": "整顆反側翻", "z2": "整顆側翻半圈",
};
```

- [ ] **Step 4.4 實作 annotate.ts**

```ts
// src/lib/fingertricks/annotate.ts
import { parseAlg } from "../alg";
import { TRIGGERS, SINGLE_MOVE_HINTS } from "./triggers";

export interface FingertrickHint { startIndex: number; endIndex: number; hint: string }

export function annotate(alg: string): FingertrickHint[] {
  if (alg.trim() === "") return [];
  const moves = parseAlg(alg);
  const hints: FingertrickHint[] = [];
  let i = 0;
  outer: while (i < moves.length) {
    for (const t of TRIGGERS) {
      if (t.pattern.length <= moves.length - i &&
          t.pattern.every((m, j) => moves[i + j] === m)) {
        hints.push({ startIndex: i, endIndex: i + t.pattern.length - 1, hint: t.hint });
        i += t.pattern.length;
        continue outer;
      }
    }
    hints.push({ startIndex: i, endIndex: i, hint: SINGLE_MOVE_HINTS[moves[i]] ?? "" });
    i++;
  }
  return hints;
}
```

- [ ] **Step 4.5 跑到全綠** → PASS
- [ ] **Step 4.6 Commit**：`git commit -m "feat(fingertricks): trigger 最長優先指法標注"`

---

## Task 5: timer 邏輯（stats + storage）

**Files:** Create `src/lib/timer/stats.ts`、`src/lib/timer/storage.ts`、`tests/timer/stats.test.ts`、`tests/timer/storage.test.ts`；Modify `vite.config.ts`（vitest environment）、`package.json`（happy-dom）

- [ ] **Step 5.1 裝 happy-dom（僅 storage 測試用，不設全域）**

```bash
npm i -D happy-dom
```

vitest 環境維持 node 預設（KPuzzle 測試純計算跑 node 最快）。只在需要 DOM 的測試檔頂部加 docblock：

```ts
// tests/timer/storage.test.ts 第一行：
// @vitest-environment happy-dom
```

- [ ] **Step 5.2 寫失敗測試**

```ts
// tests/timer/stats.test.ts
import { describe, it, expect } from "vitest";
import { effectiveMs, aoN, best, sessionMean, formatMs, type Solve } from "../../src/lib/timer/stats";

const s = (ms: number, penalty: Solve["penalty"] = null): Solve =>
  ({ id: String(ms) + Math.random(), ms, scramble: "", ts: 0, penalty });

describe("timer stats（WCA 規則）", () => {
  it("+2 加 2000ms，DNF 無效", () => {
    expect(effectiveMs(s(10000, "+2"))).toBe(12000);
    expect(effectiveMs(s(10000, "DNF"))).toBe(Infinity);
  });
  it("ao5：去最好最差取中間 3 平均", () => {
    expect(aoN([8, 10, 12, 14, 100].map((x) => s(x * 1000)), 5)).toBe(12000);
  });
  it("ao5 含 1 DNF：DNF 當最差去掉", () => {
    expect(aoN([s(8000), s(10000), s(12000), s(14000), s(9000, "DNF")], 5)).toBe(12000);
  });
  it("ao5 含 2 DNF → Infinity（顯示 DNF）", () => {
    expect(aoN([s(8000), s(10000), s(12000), s(9000, "DNF"), s(7000, "DNF")], 5)).toBe(Infinity);
  });
  it("不足 N 筆 → null；ao100 去頭尾各 5", () => {
    expect(aoN([s(1000)], 5)).toBeNull();
    const hundred = Array.from({ length: 100 }, (_, i) => s((i + 1) * 1000));
    expect(aoN(hundred, 100)).toBe(50500); // 6..95 平均
  });
  it("formatMs：mm:ss.xx 與 ss.xx", () => {
    expect(formatMs(9870)).toBe("9.87");
    expect(formatMs(69870)).toBe("1:09.87");
    expect(formatMs(Infinity)).toBe("DNF");
  });
});
```

```ts
// @vitest-environment happy-dom
// tests/timer/storage.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { loadSessions, saveSessions, newSession } from "../../src/lib/timer/storage";

beforeEach(() => localStorage.clear());

describe("session storage v1", () => {
  it("round-trip 一致", () => {
    const ses = newSession("測試");
    ses.solves.push({ id: "a", ms: 9000, scramble: "R U", ts: 1, penalty: null });
    saveSessions([ses]);
    expect(loadSessions()).toEqual([ses]);
  });
  it("空 storage → 一個預設 session", () => {
    expect(loadSessions().length).toBe(1);
  });
  it("壞 JSON → 不炸回預設", () => {
    localStorage.setItem("roux-trainer:sessions:v1", "{oops");
    expect(loadSessions().length).toBe(1);
  });
});
```

- [ ] **Step 5.3 確認失敗** → FAIL
- [ ] **Step 5.4 實作**

```ts
// src/lib/timer/stats.ts
export interface Solve {
  id: string; ms: number; scramble: string; ts: number;
  penalty: null | "+2" | "DNF";
}
export const effectiveMs = (s: Solve): number =>
  s.penalty === "DNF" ? Infinity : s.penalty === "+2" ? s.ms + 2000 : s.ms;

/** WCA aoN：最近 N 筆去頭尾各 ceil(5%)；剩餘含 DNF → Infinity；不足 → null */
export function aoN(solves: Solve[], n: number): number | null {
  if (solves.length < n) return null;
  const w = solves.slice(-n).map(effectiveMs).sort((a, b) => a - b);
  const trim = Math.ceil(n * 0.05);
  const mid = w.slice(trim, n - trim);
  if (mid.some((v) => !Number.isFinite(v))) return Infinity;
  return Math.round(mid.reduce((a, b) => a + b, 0) / mid.length);
}
export const best = (solves: Solve[]): number | null =>
  solves.length ? Math.min(...solves.map(effectiveMs)) : null;
export const sessionMean = (solves: Solve[]): number | null => {
  const f = solves.map(effectiveMs).filter(Number.isFinite);
  return f.length ? Math.round(f.reduce((a, b) => a + b, 0) / f.length) : null;
};
export function formatMs(ms: number | null): string {
  if (ms === null) return "—";
  if (!Number.isFinite(ms)) return "DNF";
  const cs = Math.round(ms / 10);
  const m = Math.floor(cs / 6000), sec = Math.floor((cs % 6000) / 100), c = cs % 100;
  const ss = `${sec}.${String(c).padStart(2, "0")}`;
  return m ? `${m}:${String(sec).padStart(2, "0")}.${String(c).padStart(2, "0")}` : ss;
}
```

```ts
// src/lib/timer/storage.ts
import type { Solve } from "./stats";
export interface Session { id: string; name: string; createdAt: number; solves: Solve[] }
const KEY = "roux-trainer:sessions:v1";
let counter = 0;
const uid = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

export const newSession = (name: string): Session =>
  ({ id: uid(), name, createdAt: Date.now(), solves: [] });

export function saveSessions(list: Session[]): void {
  localStorage.setItem(KEY, JSON.stringify({ sessions: list }));
}
export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.sessions) && parsed.sessions.length) return parsed.sessions;
    }
  } catch { /* 壞資料 → 預設（讀取兜底有正當理由：使用者資料毀損不應讓站掛掉） */ }
  return [newSession("Session 1")];
}
```

- [ ] **Step 5.5 跑全部測試（確認 happy-dom 不影響既有測試）** → PASS
- [ ] **Step 5.6 Commit**：`git commit -m "feat(timer): WCA 統計 + localStorage session v1"`

---

## Task 6: cases.ts 出題引擎 + scramble 封裝

**Files:** Create `src/lib/cases.ts`、`src/lib/scramble.ts`、`tests/cases.test.ts`

- [ ] **Step 6.1 寫失敗測試**

```ts
// tests/cases.test.ts
import { describe, it, expect } from "vitest";
import { makeDrill, mulberry32 } from "../src/lib/cases";
import { CMLL_CASES } from "../src/data/cmll";
import { applyToSolved, isIdentity } from "./kpuzzle-helpers";

describe("makeDrill", () => {
  it("setup + solution = identity（10 個 case × 4 seed）", async () => {
    for (const c of CMLL_CASES.slice(0, 10)) {
      for (let seed = 0; seed < 4; seed++) {
        const d = makeDrill(c, mulberry32(seed));
        expect(isIdentity(await applyToSolved(`${d.setupAlg} ${d.solutionAlg}`)),
          `${c.id} seed=${seed}`).toBe(true);
      }
    }
  });
  it("AUF 隨機化：100 次出題 4 種 AUF 都出現", () => {
    const rng = mulberry32(42);
    const firsts = new Set(
      Array.from({ length: 100 }, () => makeDrill(CMLL_CASES[5], rng).solutionAlg.split(" ")[0]),
    );
    expect(firsts.size).toBeGreaterThanOrEqual(3); // U/U2/U'/直接起手 至少 3 種
  });
  it("annotations 覆蓋整條 solution", () => {
    const d = makeDrill(CMLL_CASES[0], mulberry32(1));
    const last = d.annotations[d.annotations.length - 1];
    expect(last.endIndex).toBe(d.solutionAlg.split(" ").length - 1);
  });
});
```

- [ ] **Step 6.2 確認失敗** → FAIL
- [ ] **Step 6.3 實作**

```ts
// src/lib/cases.ts
import { invertAlg, simplifyAlg } from "./alg";
import { annotate, type FingertrickHint } from "./fingertricks/annotate";

export interface AlgCaseLike { id: string; alg: string }
export interface Drill {
  caseId: string;
  setupAlg: string;     // 套到還原態 = 題目
  solutionAlg: string;  // 解答（含 AUF 前置）
  annotations: FingertrickHint[];
}

export function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const AUFS = ["", "U", "U2", "U'"];

export function makeDrill(c: AlgCaseLike, rng: () => number): Drill {
  const auf = AUFS[Math.floor(rng() * 4)];
  const solutionAlg = simplifyAlg(`${auf} ${c.alg}`.trim());
  return {
    caseId: c.id,
    setupAlg: invertAlg(solutionAlg),
    solutionAlg,
    annotations: annotate(solutionAlg),
  };
}
```

```ts
// src/lib/scramble.ts
import { randomScrambleForEvent } from "cubing/scramble";
export async function newWcaScramble(): Promise<string> {
  return (await randomScrambleForEvent("333")).toString();
}
```

- [ ] **Step 6.4 跑全部測試** → PASS
- [ ] **Step 6.5 Commit**：`git commit -m "feat(lib): case 出題引擎 + WCA scramble 封裝"`

---

## Task 7: App shell（router + design tokens + nav）

**Files:** Create `src/styles/tokens.css`、`src/styles/global.css`、`src/components/Layout.tsx`；Rewrite `src/App.tsx`、`src/main.tsx`；Create 5 個頁面 placeholder

- [ ] **Step 7.1 design tokens（深色方塊主題）**

```css
/* src/styles/tokens.css */
:root {
  /* 表面 */
  --bg: #0e1116; --bg-raised: #161b23; --bg-card: #1b212b;
  --border: #2a3342; --border-strong: #3a465a;
  /* 文字 */
  --text: #e8edf4; --text-dim: #9aa7b8; --text-faint: #5d6b7e;
  /* 品牌：方塊六色取材，主色橙（左橋色） */
  --accent: #f59e0b; --accent-strong: #fbbf24;
  --c-green: #22c55e; --c-red: #ef4444; --c-blue: #3b82f6;
  --c-yellow: #eab308; --c-white: #f1f5f9; --c-orange: #f97316;
  /* 字體 */
  --font-ui: "Noto Sans TC", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace; /* 公式一律 mono */
  /* 間距/圓角 */
  --r-sm: 6px; --r-md: 10px; --r-lg: 16px;
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px; --sp-6: 24px; --sp-8: 32px;
}
```

- [ ] **Step 7.2 Layout + router**：hash router、頂部 nav（橋式解法教室 logo + 5 連結、行動版折疊）、`<Outlet/>`。5 頁先放標題 placeholder。路由：`/`、`/learn`、`/trainer`、`/algs`、`/timer`。
- [ ] **Step 7.3 驗證**：`npm run build` 過 + `npm run dev` 起來用 playwright 截圖 5 路由各一張，nav 正常切換。
- [ ] **Step 7.4 Commit**：`git commit -m "feat(ui): app shell + 深色 design tokens + hash router"`

---

## Task 8: CubeViewer + stickering

**Files:** Create `src/components/CubeViewer.tsx`、`src/data/stickering.ts`、`tests/data/stickering.test.ts`

- [ ] **Step 8.1 stickering.ts**：Roux 各段 mask。格式用 twisty-player 的 `experimentalStickeringMaskOrbits` 字串（`"EDGES:...,CORNERS:...,CENTERS:..."`，字元 `-`=正常、`D`=調暗、`I`=忽略）。完整範例（12 邊/8 角/6 中心）：`"EDGES:DDDDDDDDDDD-,CORNERS:D-------,CENTERS:------"`（最後一邊亮、第一角暗、其餘照常——實際字元集以 node_modules 原始碼為準）。**orbit piece 順序沿用 Task 1 bootstrap 確認的 EDGE_ORDER/CORNER_ORDER**。定義：`FB_MASK`（只亮 DL/FL/BL/DLF/DBL+L/D 中心）、`SB_MASK`、`CMLL_MASK`（亮 U 角）、`LSE_MASK`（亮 6 邊+UFDB 中心）、`FULL`。寫單元測試驗證 mask 字串長度 = 12/8/6 段。實作時以 cubing.js 原始碼（`node_modules/cubing/dist/lib/.../mask` 區）確認字元集，截圖驗證視覺效果。
- [ ] **Step 8.2 CubeViewer.tsx**

```tsx
// src/components/CubeViewer.tsx
import { useEffect, useRef } from "react";
import { TwistyPlayer } from "cubing/twisty";

export interface CubeViewerProps {
  alg?: string;            // 主 alg（可播放）
  setupAlg?: string;       // 前置（題目狀態）
  mask?: string;           // experimentalStickeringMaskOrbits 字串
  visualization?: "3D" | "2D";  // 2D = 公式表辨識圖（experimental2D LL 視角另研究，先 3D/2D 全圖）
  controls?: boolean;      // 顯示播放控制列
  autoplay?: boolean;
  size?: number;           // px
}

export function CubeViewer({ alg = "", setupAlg = "", mask, visualization = "3D",
  controls = false, autoplay = false, size = 240 }: CubeViewerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const player = new TwistyPlayer({
      puzzle: "3x3x3",
      alg, experimentalSetupAlg: setupAlg,
      hintFacelets: "none", backView: "none", background: "none",
      controlPanel: controls ? "bottom-row" : "none",
      visualization: visualization === "2D" ? "2D" : "3D",
      // TwistyPlayerConfig 介面已含此欄位，constructor 直傳（型別安全，勿用 setter cast）
      ...(mask ? { experimentalStickeringMaskOrbits: mask } : {}),
    });
    player.style.width = `${size}px`;
    player.style.height = `${size}px`;
    container.appendChild(player);
    playerRef.current = player;
    if (autoplay) player.play();
    return () => { player.remove(); playerRef.current = null; };
  }, [alg, setupAlg, mask, visualization, controls, autoplay, size]);

  return <div ref={ref} />;
}
```

（屬性名以 cubing.js 0.63 實際 API 為準——實作時先在 dev console 驗證 `experimentalSetupAlg`/`experimentalStickeringMaskOrbits` 存在；不存在就查 `node_modules/cubing` 的 `.d.ts` 找對應名稱並修正。）

- [ ] **Step 8.3 驗證**：在 Home 頁臨時放 3 個 viewer（純 alg / setup+mask / autoplay），playwright 截圖確認 mask 視覺正確（FB 段只亮左下塊）。
- [ ] **Step 8.4 Commit**：`git commit -m "feat(ui): CubeViewer twisty 封裝 + Roux 段 stickering mask"`

---

## Task 9: 公式表頁（/algs）

**Files:** Create `src/components/AlgCard.tsx`、`src/pages/Algs.tsx`（取代 placeholder）

- [ ] **Step 9.1 AlgCard**：props `{ title, recognition, alg, alternatives, fingertricks, mask?, viewKind }`。卡片：左側 CubeViewer（`setupAlg=invert(alg)`、CMLL 用 CMLL_MASK、2D/3D 視角依 viewKind）、右側 mono 公式 + 辨識描述 + 指法（摺疊展開）。點卡片開 modal：3D CubeViewer autoplay 循環（controls 開）+ 替代公式清單。
- [ ] **Step 9.2 Algs 頁**：三區 tab——「CMLL 42」（八組子 tab：O/H/Pi/U/T/L/S/AS，依 `CMLL_CASES` group 分組 render AlgCard grid）、「2-look 入門」（轉正 7 + 排列 2）、「EOLR」（依 badEdges 分組）。RWD：grid `repeat(auto-fill, minmax(280px, 1fr))`。
- [ ] **Step 9.3 驗證**：build 過；playwright 截圖三個 tab + 一個 modal；42 張卡片全 render（DOM 數量斷言寫進截圖 script）。
- [ ] **Step 9.4 Commit**：`git commit -m "feat(ui): 公式表頁（CMLL 42 / 2-look / EOLR）"`

---

## Task 10: 練習器頁（/trainer）

**Files:** Create `src/components/DrillCard.tsx`、`src/pages/Trainer.tsx`

- [ ] **Step 10.1 行為規格（完整）**：
  - 題庫選擇列（chips）：CMLL 全部｜單組 O/H/Pi/U/T/L/S/AS｜2-look｜EOLR。選擇存 useState（v1 不持久化）。
  - 「下一題」：從選中題庫隨機抽 case → `makeDrill(c, rng)`（rng 用 `mulberry32(Date.now() & 0xffffffff)` 每次新 seed）→ 顯示 CubeViewer（`setupAlg=drill.setupAlg`、CMLL 題配 CMLL_MASK 只亮角、EOLR 配 LSE_MASK）。
  - 翻牌（「看解答」按鈕 / 空白鍵）：翻開後顯示 case 名 + 公式（mono 大字）+ 指法逐 trigger 列表（依 annotations 區間把 move 染色分組）+ ▶ 播放動畫（CubeViewer 換成 `setupAlg + alg` 可控播放）。
  - 鍵盤流：空白鍵 = 翻牌/下一題交替；右箭頭 = 直接下一題。
  - 答案隱藏時不能從 DOM 偷看（翻牌前不 render 解答節點）。
- [ ] **Step 10.2 實作 + 驗證**：build；playwright 腳本走一輪（選 CMLL → 下一題 → 翻牌 → 播放 → 下一題）截圖各步。
- [ ] **Step 10.3 Commit**：`git commit -m "feat(ui): case 辨識練習器（翻牌流）"`

---

## Task 11: 計時器頁（/timer）

**Files:** Create `src/components/Timer.tsx`、`src/pages/TimerPage.tsx`

- [ ] **Step 11.1 Timer 核心行為（完整規格）**：
  - 狀態機：`idle → armed(空白鍵按住 300ms，未滿 300ms 放開 = 取消) → running(放開起跑) → stopped(任意鍵/觸碰)`。armed 顯示綠色大字 READY；running 大字計時（rAF 更新，等寬數字 `font-variant-numeric: tabular-nums`）。
  - 觸控：長按計時區同邏輯（touchstart/touchend）。
  - inspection 開關（預設關）：開啟時空白鍵第一擊進 15s 倒數，超 15s 自動標 +2、超 17s DNF（WCA）。
  - 每次 stop：寫入目前 session（`storage.ts`），自動抓下一條 WCA scramble（`newWcaScramble()`，背景預抓一條備用避免等待）。
  - scramble 顯示於頂部（mono），旁邊小 CubeViewer 顯示打亂後狀態。
  - 統計欄：current/best 的 single、ao5、ao12、ao100、mean（`formatMs`）。
  - 紀錄列表：時間（點擊循環 none→+2→DNF）、刪除鈕；session 下拉 + 新增 session。
  - 鍵盤保護：計時中忽略瀏覽器快捷（preventDefault on space）。
- [ ] **Step 11.2 實作 + 驗證**：build；playwright 模擬鍵盤 hold/release 跑 2 筆 solve，斷言列表出現 2 筆、ao 區更新；截圖。
- [ ] **Step 11.3 Commit**：`git commit -m "feat(ui): WCA 計時器（inspection/penalty/session）"`

---

## Task 12: 教學章節（/learn）+ 首頁（/）

**Files:** Create `src/data/lessons/{overview,fb,sb,cmll,lse,eolr}.tsx`、`src/pages/Learn.tsx`、`src/pages/Home.tsx`

- [ ] **Step 12.1 Learn 頁框架**：左側章節目錄（行動版頂部下拉）、右側內容區。章節元件從 `data/lessons/` import。
- [ ] **Step 12.2 章節內容（繁中，每章 600-1200 字 + 至少 2 個 CubeViewer 互動範例）**：
  0. **總覽**：橋式四階段（FB→SB→CMLL→LSE）流程圖解（四個 CubeViewer 並排、各配對應 mask 漸進顯示）、平均步數 ~48 vs CFOP ~60、優劣比較表（步數少/無需背 F2L/M 滑塊依賴/辨識較難）。
  1. **FB 第一橋**：1x2x3 概念、左橋固定（橙底白左？正確：白底橙左）、DL 邊先行 → 角邊配對思路、3 個精選範例（易/中/難各一：給打亂 + 人工解說建橋思路 + 動畫）。
  2. **SB 第二橋**：限定 R/r/U/M 的意義（不破壞 FB）、配對-插入節奏、3 個精選範例。
  3. **CMLL**：先 2-look（嵌 2-look 公式卡）→ 騰出進度後上 42（連去公式表/練習器）。
  4. **LSE**：4a EO（壞邊辨識：U/D 色朝前後 = 壞）→ 4b UL/UR → 4c EP，M2/U2 節奏範例。
  5. **EOLR 進階**：EO 與 LR 合併處理的動機（省 5-8 步）、case 表連結、何時該學（sub-20 後）。
  - 內容由實作 agent 起草，**controller 逐章審校**（魔方術語正確性：橋式社群慣用語）。每章末「下一章」導航。
  - **每章最低標準（可查核）**：繁中正文 ≥600 字（不含公式）、≥2 個含 setupAlg 的 CubeViewer 範例、章末「下一章」連結；公式正確性由 controller 對照 data 層審校。
- [ ] **Step 12.3 Home 頁**：hero（標語「用橋式，更少步數解開 3x3」+ CubeViewer autoplay 示範一條短打亂解）、四階段卡片（各配 mask 圖 + 一句話）、學習路線圖（新手→2-look→42→EOLR 時間軸）、四個功能入口卡（教學/練習器/公式表/計時器）。
- [ ] **Step 12.4 驗證**：build；playwright 截圖每章 + 首頁（桌機 1280 + 手機 390 寬雙截圖）。
- [ ] **Step 12.5 Commit**：`git commit -m "feat(content): 教學六章 + 首頁"`

---

## Task 13: 部署 + 上線驗證（M5）

**Files:** Create `.github/workflows/deploy.yml`、`README.md`

- [ ] **Step 13.1 deploy.yml**

```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx vitest run
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 13.2 README.md**：專案簡介（繁中）、學習路線、本機開發指令、技術棧、授權 MIT（加 LICENSE 檔）。
- [ ] **Step 13.3 全量驗證**：`npx vitest run`（全綠）→ `npm run build` → preview + `node smoke-browser.mjs`（PASS + 截圖人工看）→ 手機寬度截圖抽查。
- [ ] **Step 13.4 建 GitHub repo + 推送 + 開 Pages**：`gh repo create Yeimaoz/roux-trainer --public`、`git push`、Pages 設 GitHub Actions 來源、跑 deploy、開實際網址（playwright 對 `https://yeimaoz.github.io/roux-trainer/` 跑 smoke 截圖：5 路由 + 出題功能）。
- [ ] **Step 13.5 Commit + 收尾**：最終 commit、`git status` 乾淨、回報網址。

---

## Self-Review 記錄

- Spec 覆蓋：§4.1 cases→T6、§4.2 資料→T2/T3、§4.3 指法→T4、§4.4 五頁→T7-T12、計時器統計→T5/T11、部署→T13、§8 測試表全對應 ✓
- 無 placeholder：各 task 具完整代碼或完整行為規格 ✓（資料內容本身為 sourcing 任務，驗收 = 自驗證測試綠）
- 型別一致：`FingertrickHint`（T4 定義、T6 使用）、`Solve`（T5 定義、T11 使用）、`EDGE_ORDER`（T1 定義、T8 mask 使用）✓
- rev2 範圍：無 solver 殘留 ✓（計時器無解法回顧、trainer 為 case 翻牌）

## Plan Review Result

```
Verdict: APPROVE WITH CHANGES
Reviewer: plan-reviewer subagent（general-purpose / sonnet）
Date: 2026-06-13
Findings: { Critical: 0, High: 2, Medium: 4, Low: 2, Informational: 5 }
Codebase reality check（controller-run）: 9/9 引用驗證通過
Scope/design-creep audit: clean（6 條 Non-goals 全數通過，rev1 solver 殘留 = 0）
Applied changes:
  - H1 Task 8: stickering mask 改 constructor 直傳（TwistyPlayerConfig 介面已含），
    刪 as-unknown-as setter cast
  - H2 Task 1: 插入 Step 1.2b orbit 名稱 bootstrap（具體指令 + 預期輸出），
    解 EDGE_ORDER 空陣列 blocking 問題
  - M1 Task 1: 補 wide/rotation 鏡像測試（r→l'、x→x'）
  - M2 Task 5: happy-dom 改 per-file docblock，vitest 全域維持 node
  - M3 Task 3: eolr.ts schema 註明「FB+SB+CMLL 已完成」前提
  - M4 Task 12: 教學章節可查核最低標準（≥600 字、≥2 CubeViewer、章末導航）
  - L1 Task 8: 補 mask 字串完整格式範例
未套用: L2（DrillCard RTL 測試——playwright 驗收已足，記為技術債）
Spot-check（anti-cheat）: H1 引用之 cast 原文、H2 引用之空陣列 + guard 斷言
均存在於 plan，finding 屬實。
```
