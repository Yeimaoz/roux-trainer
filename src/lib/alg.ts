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
