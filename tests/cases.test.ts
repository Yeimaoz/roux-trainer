import { describe, it, expect } from "vitest";
import { makeDrill, mulberry32 } from "../src/lib/cases";
import { CMLL_CASES } from "../src/data/cmll";
import { applyToSolved, isIdentity } from "./kpuzzle-helpers";

describe("makeDrill", () => {
  it("setup + solution = identity（10 個 case × 4 seed）", async () => {
    for (const c of CMLL_CASES.slice(0, 10)) {
      for (let seed = 0; seed < 4; seed++) {
        const d = makeDrill(c, mulberry32(seed));
        expect(
          isIdentity(await applyToSolved(`${d.setupAlg} ${d.solutionAlg}`)),
          `${c.id} seed=${seed}`,
        ).toBe(true);
      }
    }
  });
  it("AUF 隨機化：100 次出題至少 3 種起手", () => {
    const rng = mulberry32(42);
    const firsts = new Set(
      Array.from({ length: 100 }, () => makeDrill(CMLL_CASES[5], rng).solutionAlg.split(" ")[0]),
    );
    expect(firsts.size).toBeGreaterThanOrEqual(3);
  });
  it("annotations 覆蓋整條 solution", () => {
    const d = makeDrill(CMLL_CASES[0], mulberry32(1));
    const last = d.annotations[d.annotations.length - 1];
    expect(last.endIndex).toBe(d.solutionAlg.split(" ").length - 1);
  });
});
