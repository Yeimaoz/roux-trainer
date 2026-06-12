import { describe, it, expect } from "vitest";
import { parseAlg, invertAlg, mirrorAlgM, simplifyAlg, moveCount } from "../src/lib/alg";
import { applyToSolved, isIdentity } from "./kpuzzle-helpers";

describe("alg utils", () => {
  it("parse 接受標準記號並拒絕垃圾", () => {
    expect(parseAlg("R U2 M' r2")).toEqual(["R", "U2", "M'", "r2"]);
    expect(() => parseAlg("R W3")).toThrow();
  });
  it("alg ∘ invert(alg) = identity（KPuzzle 驗證）", async () => {
    const alg = "R U R' U' M2 F r U2";
    expect(isIdentity(await applyToSolved(`${alg} ${invertAlg(alg)}`))).toBe(true);
  });
  it("M 鏡像：R↔L 且方向反轉、U 反向、M 同字反向（鏡像自反）", () => {
    const a = "R U R' F M";
    expect(mirrorAlgM(mirrorAlgM(a))).toBe(a); // 自反性
    expect(mirrorAlgM("R")).toBe("L'");
  });
  it("wide/rotation 鏡像：r→l'、r2→l2、x→x'", () => {
    expect(mirrorAlgM("r")).toBe("l'");
    expect(mirrorAlgM("r2")).toBe("l2");
    expect(mirrorAlgM("x")).toBe("x'");
  });
  it("鏡像後仍是合法可解 alg：alg鏡像 ∘ invert(alg鏡像) = identity", async () => {
    const m = mirrorAlgM("R U R' U' M' U M");
    expect(isIdentity(await applyToSolved(`${m} ${invertAlg(m)}`))).toBe(true);
  });
  it("simplify 合併相鄰同軸", () => {
    expect(simplifyAlg("R U U' R")).toBe("R2");
    expect(simplifyAlg("U2 U2")).toBe("");
    expect(simplifyAlg("R U R'")).toBe("R U R'");
  });
  it("moveCount", () => {
    expect(moveCount("")).toBe(0);
    expect(moveCount("R U2 M'")).toBe(3);
  });
});
