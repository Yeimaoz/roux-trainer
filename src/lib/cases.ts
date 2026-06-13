import { invertAlg, simplifyAlg } from "./alg";
import { annotate, type FingertrickHint } from "./fingertricks/annotate";

export interface AlgCaseLike {
  id: string;
  alg: string;
}

export interface Drill {
  caseId: string;
  /** 套到還原態 = 題目狀態 */
  setupAlg: string;
  /** 解答（含 AUF 前置） */
  solutionAlg: string;
  annotations: FingertrickHint[];
}

/** 決定性 PRNG（mulberry32），seed 固定 → 可重現 */
export function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
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
