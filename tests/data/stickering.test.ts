import { describe, it, expect } from "vitest";
import { STAGE_STICKERINGS } from "../../src/data/stickering";

// 名稱必須是 cubing.js 內建 stickering（chunk 內 Roux group 實測存在：
// FirstBlock / SecondBlock / CMLL / L6E / L6EO / L10P）。
// 視覺正確性由 smoke 截圖驗證；這裡守護 key 與名稱不被誤改。
describe("stage stickerings", () => {
  it("涵蓋 Roux 四段 + EO + 全亮", () => {
    expect(Object.keys(STAGE_STICKERINGS)).toEqual(
      expect.arrayContaining(["fb", "sb", "cmll", "lse", "lseEo", "full"]),
    );
  });
  it("名稱皆為已知 cubing.js 內建值", () => {
    const known = new Set(["FirstBlock", "SecondBlock", "CMLL", "L6E", "L6EO", "L10P", "full"]);
    for (const v of Object.values(STAGE_STICKERINGS)) expect(known.has(v), v).toBe(true);
  });
});
