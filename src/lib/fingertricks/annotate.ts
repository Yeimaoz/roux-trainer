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
