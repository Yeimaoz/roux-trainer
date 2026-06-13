import { describe, it, expect } from "vitest";
import { ADVANCED_CASES, type AdvancedTag } from "../../src/data/advanced-cases";
import { invertAlg } from "../../src/lib/alg";
import {
  applyToSolved, normalizePattern, pieceSolved,
  FB_PIECES, SB_PIECES,
} from "../kpuzzle-helpers";
import { kpuzzle } from "../kpuzzle-helpers";
import type { KPattern } from "cubing/kpuzzle";

const SB_TOKEN = /^[RrUM](2|')?$/;

async function fbHome(p: KPattern): Promise<boolean> {
  const n = await normalizePattern(p);
  return FB_PIECES.edges.every((e) => pieceSolved(n, "EDGES", e)) &&
         FB_PIECES.corners.every((c) => pieceSolved(n, "CORNERS", c));
}
async function bothHome(p: KPattern): Promise<boolean> {
  const n = await normalizePattern(p);
  return [...FB_PIECES.edges, ...SB_PIECES.edges].every((e) => pieceSolved(n, "EDGES", e)) &&
         [...FB_PIECES.corners, ...SB_PIECES.corners].every((c) => pieceSolved(n, "CORNERS", c));
}
async function netEqual(a: string, b: string): Promise<boolean> {
  const kp = await kpuzzle();
  const pa = kp.defaultPattern().applyAlg(a);
  const pb = kp.defaultPattern().applyAlg(b);
  return JSON.stringify(pa.patternData) === JSON.stringify(pb.patternData);
}

describe("進階建橋案例", () => {
  it("數量 12-16，id 唯一，四 tag 各 ≥3", () => {
    expect(ADVANCED_CASES.length).toBeGreaterThanOrEqual(12);
    expect(ADVANCED_CASES.length).toBeLessThanOrEqual(16);
    expect(new Set(ADVANCED_CASES.map((c) => c.id)).size).toBe(ADVANCED_CASES.length);
    const dist: Record<string, number> = {};
    for (const c of ADVANCED_CASES) dist[c.tag] = (dist[c.tag] ?? 0) + 1;
    for (const tag of ["transition", "pairing", "keyhole", "efficiency"] as AdvancedTag[]) {
      expect(dist[tag], `tag ${tag}`).toBeGreaterThanOrEqual(3);
    }
  });

  for (const c of ADVANCED_CASES) {
    it(`${c.id}: sbSolution 只含 R/r/U/M 系 token`, () => {
      for (const t of c.sbSolution.trim().split(/\s+/)) {
        expect(SB_TOKEN.test(t), `非法 token: ${t}`).toBe(true);
      }
    });

    it(`${c.id}: setupAlg == invert(fb + sb)`, () => {
      expect(c.setupAlg).toBe(invertAlg(`${c.fbSolution} ${c.sbSolution}`.trim()));
    });

    it(`${c.id}: setup→fb 後 FB 五塊歸位；→sb 後兩橋十塊歸位`, async () => {
      const afterFb = (await applyToSolved(c.setupAlg)).applyAlg(c.fbSolution);
      expect(await fbHome(afterFb), "fb 後 FB 未歸位").toBe(true);
      const afterSb = afterFb.applyAlg(c.sbSolution);
      expect(await bothHome(afterSb), "sb 後兩橋未歸位").toBe(true);
    });

    if (c.naive) {
      it(`${c.id}: naive 與 sbSolution 淨效果等效且步數一致`, async () => {
        expect(await netEqual(c.naive!.alg, c.sbSolution), "naive 非等效").toBe(true);
        expect(c.naive!.alg.trim().split(/\s+/).length).toBe(c.naive!.count);
        expect(c.naive!.count).toBeGreaterThan(c.sbSolution.trim().split(/\s+/).length);
      });
    }
  }
});
