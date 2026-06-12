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
// Bootstrap 確認（2026-06-13）：
//   edge 和 corner 名稱順序從 cubing.js bluetooth index.js 驗證
//   並以 U/D/R 單步驗證確認正確。
//   拼法以 definition 為準：UFR（非 URF）、DFL（非 DLF）等。
export const EDGE_ORDER: string[] = [
  "UF", "UR", "UB", "UL",
  "DF", "DR", "DB", "DL",
  "FR", "FL", "BR", "BL",
];
export const CORNER_ORDER: string[] = [
  "UFR", "URB", "UBL", "ULF",
  "DRF", "DFL", "DLB", "DBR",
];

export function pieceSolved(p: KPattern, orbit: "EDGES" | "CORNERS", name: string): boolean {
  const order = orbit === "EDGES" ? EDGE_ORDER : CORNER_ORDER;
  const i = order.indexOf(name);
  if (i < 0) throw new Error(`unknown piece ${name}`);
  const d = p.patternData[orbit];
  return d.pieces[i] === i && d.orientation[i] === 0;
}

// Roux 兩橋塊清單（命名以 definition 為準：DFL 非 DLF，DLB 非 DBL，DRF 非 DFR，DBR 非 DRB）
export const FB_PIECES = { edges: ["DL", "FL", "BL"], corners: ["DFL", "DLB"] };
export const SB_PIECES = { edges: ["DR", "FR", "BR"], corners: ["DRF", "DBR"] };
export async function blocksPreserved(p: KPattern): Promise<boolean> {
  const n = await normalizePattern(p);
  return [...FB_PIECES.edges, ...SB_PIECES.edges].every((e) => pieceSolved(n, "EDGES", e)) &&
         [...FB_PIECES.corners, ...SB_PIECES.corners].every((c) => pieceSolved(n, "CORNERS", c));
}
export async function uCornersSolved(p: KPattern): Promise<boolean> {
  const n = await normalizePattern(p);
  return ["UFR", "URB", "UBL", "ULF"].every((c) => pieceSolved(n, "CORNERS", c));
}
