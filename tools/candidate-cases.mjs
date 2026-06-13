// 候選進階案例（authoring）。fb=任意 move、sb=只 R/r/U/M。
// 驗證通過後挑選並搬到 src/data/advanced-cases.ts。
export const CASES = [
  // ── efficiency：雙層轉 / 直接銜接 ──
  { id: "eff-wide-insert", tag: "efficiency", fb: "U' L' U L", sb: "r U' r'" },
  { id: "eff-direct", tag: "efficiency", fb: "L' U' L", sb: "U R U' R'" },
  { id: "eff-mslide", tag: "efficiency", fb: "U L' U' L", sb: "U' M' U M" },
  { id: "eff-r2", tag: "efficiency", fb: "F' L' F", sb: "r U2 r'" },

  // ── transition：FB 收尾鋪 SB ──
  { id: "trans-auf", tag: "transition", fb: "U' L' U L", sb: "U R U' R'" },
  { id: "trans-finish", tag: "transition", fb: "L F' L'", sb: "R U R'" },
  { id: "trans-mset", tag: "transition", fb: "U M' U' L'", sb: "U' R U R'" },
  { id: "trans-flow", tag: "transition", fb: "U' L' U L U", sb: "R' U' R" },

  // ── pairing：配對 + 插入 ──
  { id: "pair-basic", tag: "pairing", fb: "L' U L", sb: "R U' R'" },
  { id: "pair-setup", tag: "pairing", fb: "U' L' U L", sb: "U2 R U R'" },
  { id: "pair-long", tag: "pairing", fb: "F' L F", sb: "R U R' U R U' R'" },
  { id: "pair-mslice", tag: "pairing", fb: "L' U' L", sb: "M' U R U' r'" },

  // ── keyhole：空 DR 槽暫存 ──
  { id: "key-store", tag: "keyhole", fb: "U L' U' L", sb: "R U' R'" },
  { id: "key-edge", tag: "keyhole", fb: "L F' L'", sb: "U' R U R'" },
  { id: "key-double", tag: "keyhole", fb: "U' L' U L", sb: "R U2 R'" },
  { id: "key-corner", tag: "keyhole", fb: "U L' U' L", sb: "U R U' M' U R' U' M" },
];
