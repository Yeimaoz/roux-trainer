// src/lib/fingertricks/triggers.ts
export interface Trigger { pattern: string[]; hint: string }
// 由長到短排列（annotate 依序比對 = 最長優先）
export const TRIGGERS: Trigger[] = [
  { pattern: ["R","U","R'","U'"], hint: "Sexy move：右食指推 U，R 對拇指食指捏轉，一氣呵成" },
  { pattern: ["R'","U'","R","U"], hint: "反 sexy：右食指勾 U'，R' 手腕回轉" },
  { pattern: ["R'","F","R","F'"], hint: "Sledgehammer：右 R'、左食指撥 F、右回 R、左回 F'" },
  { pattern: ["F","R'","F'","R"], hint: "Hedgeslammer：左食指 F 起手，右手接 R' F' R" },
  { pattern: ["M'","U'","M"],     hint: "右無名指勾 M'、食指推 U'、回 M" },
  { pattern: ["M'","U","M"],      hint: "M' 無名指起手、食指推 U、回 M" },
  { pattern: ["M2","U","M2"],     hint: "4c 節奏：中指+無名指連撥 M2、食指 U、再 M2" },
  { pattern: ["M","U2","M"],      hint: "M 後雙食指連推 U2、補 M" },
  { pattern: ["R","U","R'"],      hint: "右手三連：R 起手、食指推 U、手腕回 R'" },
  { pattern: ["R","U'","R'"],     hint: "R 起手、食指勾 U'、手腕回 R'" },
  { pattern: ["R","U2","R'"],     hint: "R 起手、食指+中指連推 U2、回 R'" },
  { pattern: ["U","M'","U'"],     hint: "食指 U、無名指 M'、食指勾回 U'" },
];
export const SINGLE_MOVE_HINTS: Record<string, string> = {
  "U": "右食指推", "U'": "左食指推（或右食指勾）", "U2": "食指+中指連推",
  "R": "右手腕轉", "R'": "右手腕回轉", "R2": "右手腕連轉兩下",
  "L": "左手腕轉", "L'": "左手腕回轉", "L2": "左手腕連轉",
  "M": "左無名指/中指下撥", "M'": "右無名指上勾", "M2": "中指+無名指連撥",
  "r": "右手雙層腕轉", "r'": "右手雙層回轉", "r2": "右雙層連轉",
  "l": "左手雙層腕轉", "l'": "左手雙層回轉", "l2": "左雙層連轉",
  "F": "左食指底撥（或換握）", "F'": "右食指底撥", "F2": "換握連轉",
  "D": "左無名指底撥", "D'": "右無名指底撥", "D2": "底層連撥",
  "B": "換握轉背面（公式中盡量避免）", "B'": "換握轉背面", "B2": "背面連轉",
  "u": "右食指推雙層", "u'": "左食指推雙層", "u2": "雙層連推",
  "E": "中層水平撥", "E'": "中層反向撥", "E2": "中層連撥",
  "S": "中層前向撥", "S'": "中層反向撥", "S2": "中層連撥",
  "x": "整顆翻轉", "x'": "整顆反翻", "x2": "整顆翻兩下",
  "y": "整顆水平轉", "y'": "整顆反水平轉", "y2": "整顆轉半圈",
  "z": "整顆側翻", "z'": "整顆反側翻", "z2": "整顆側翻半圈",
};
