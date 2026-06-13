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
