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
