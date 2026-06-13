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
          const algStr = `${auf} ${o.alg}`.trim();
          const cand = algStr ? setup.applyAlg(algStr) : setup;
          if (await cornersAllOriented(cand)) { oriented = cand; break outer1; }
        }
      }
      expect(oriented, `${c.id} 第一眼無解`).not.toBeNull();
      // 第二眼
      let done = false;
      outer2: for (const auf of AUF) {
        for (const p of [{ alg: "" }, ...TWO_LOOK_PERMUTE]) {
          for (const auf2 of AUF) {
            const parts = [auf, p.alg, auf2].filter(Boolean).join(" ");
            const cand = parts ? oriented!.applyAlg(parts) : oriented!;
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
