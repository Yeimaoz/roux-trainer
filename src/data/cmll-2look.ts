// src/data/cmll-2look.ts
// 2-look CMLL：第一眼轉正（角版 OCLL 7 條）、第二眼排列（2 條）
export interface TwoLookAlg { name: string; recognition: string; alg: string; fingertricks: string }
export const TWO_LOOK_ORIENT: TwoLookAlg[] = [
  { name: "S",  recognition: "一角已轉正在左前，頂色在前，其餘三角未轉正", alg: "R U R' U R U2 R'", fingertricks: "Sune：R 起手食指推 U，節奏連貫一氣呵成，最後 U2 雙推" },
  { name: "AS", recognition: "一角已轉正，鏡像 Sune，頂色朝右後", alg: "R U2 R' U' R U' R'", fingertricks: "反 Sune：雙推 U2 後連勾兩次 U'" },
  { name: "H",  recognition: "四角全未轉正，左右成對側色朝同側", alg: "R U R' U R U' R' U R U2 R'", fingertricks: "三段 R U 節奏：推、推、雙推，H 形頂色分布" },
  { name: "Pi", recognition: "四角全未轉正，同側兩頂色朝前方", alg: "F R U R' U' R U R' U' F'", fingertricks: "F 起手雙 sexy move 收 F'，π 形分布" },
  { name: "U",  recognition: "兩角未轉正，車頭燈朝後方相鄰", alg: "R2 D R' U2 R D' R' U2 R'", fingertricks: "R2 D 起手注意 D 用左無名指，U2 食指雙推" },
  { name: "T",  recognition: "兩角未轉正，頂色朝左右兩側成對", alg: "r U R' U' r' F R F'", fingertricks: "r 寬轉起手接 sledgehammer，r' 收尾" },
  { name: "L",  recognition: "兩角未轉正，對角位置頂色外側", alg: "F R' F' r U R U' r'", fingertricks: "F 起手 hedge 變體，最後 r' 寬轉收尾" },
];
export const TWO_LOOK_PERMUTE: TwoLookAlg[] = [
  { name: "Adj",  recognition: "相鄰兩角互換（一側車頭燈顏色一致）", alg: "R U R' F' R U R' U' R' F R2 U' R'", fingertricks: "T-perm：sexy move 進 F' 出，背熟成肌肉記憶" },
  { name: "Diag", recognition: "對角兩角互換（無車頭燈，四側色各異）", alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'", fingertricks: "Y-perm：F 進雙段收 sledgehammer，節奏分兩段" },
];
