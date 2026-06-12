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
    // r 動 FR/DR/BR 邊與右橋角，破壞 SB；實際驗證：blocksPreserved = false
    expect(await blocksPreserved(await applyToSolved("r U r'"))).toBe(false);
    expect(await blocksPreserved(await applyToSolved("U"))).toBe(true);
    // M U M' 只動 M-slice 邊（UF/UB/DF/DB），不動 FB/SB 塊；實際驗證：blocksPreserved = true
    expect(await blocksPreserved(await applyToSolved("M U M'"))).toBe(true);
  });
  it("T-perm 保留兩橋", async () => {
    expect(await blocksPreserved(await applyToSolved("R U R' F' R U R' U' R' F R2 U' R'"))).toBe(true);
  });
});
