// src/data/cmll.ts
// CMLL 42 條公式（核心資產）
// 公式來源：speedcubedb.com CMLL 區，以 KPuzzle 驗證（解掉 U 角 + 保留兩橋）
// recognition 與 fingertricks 為繁中人工撰寫，controller 審校
// alternatives：僅收錄以 areEquivalent() 驗證通過的真正等效公式

export interface CmllCase {
  id: string;          // 如 "O-adj"、"H1"、"Pi3"
  group: "O" | "H" | "Pi" | "U" | "T" | "L" | "S" | "AS";
  name: string;        // 顯示名（繁中）
  recognition: string; // 繁中辨識描述（頂色分布 + 車頭燈位置）
  alg: string;         // 主公式（KPuzzle 驗證通過）
  alternatives: string[];
  fingertricks: string; // 繁中指法（人工撰寫）
}

export const CMLL_CASES: CmllCase[] = [
  // ──────────────── O 組（2 條）─────────────────
  // O 組：四角方向全對，只需排列
  {
    id: "O-adj",
    group: "O",
    name: "O 相鄰換",
    recognition: "四角頂色全朝上（方向正確），右側兩角側色不對，需要相鄰角互換（T-perm）",
    alg: "R U R' F' R U R' U' R' F R2 U' R'",
    alternatives: [],
    fingertricks: "T-perm：右手起手 sexy（R U R'）、F' 用左食指背撥、接 sexy（R U R' U'）、最後 R' F R2 U' R' 收，練熟後全程右手主導",
  },
  {
    id: "O-diag",
    group: "O",
    name: "O 對角換",
    recognition: "四角頂色全朝上，但四個角的側色全不對，需要對角兩角互換（Y-perm）",
    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    alternatives: [],
    fingertricks: "Y-perm：F 起手（左食指底撥），接右手雙段組合，後段 R U R' U' R' F R F' 是 sledgehammer 變體，節奏分兩半",
  },

  // ──────────────── H 組（4 條）─────────────────
  // H 組：四角方向全錯，頂色分布呈 H 形
  {
    id: "H1",
    group: "H",
    name: "H 柱形",
    recognition: "四角全未轉正，左右兩側各有一對相鄰頂色朝側面（H 形分布），無車頭燈",
    alg: "U R U R' U R U' R' U R U2 R'",
    alternatives: [],
    fingertricks: "含 U 前置 AUF；主體三段 R U 節奏：R U R'、U R U' R'、U R U2 R'，加快後一氣呵成，節奏是關鍵",
  },
  {
    id: "H2",
    group: "H",
    name: "H 橫列",
    recognition: "四角全未轉正，頂色前後各一排朝前後（橫列狀），車頭燈在前後而非左右",
    alg: "F R U R' U' R U R' U' R U R' U' F'",
    alternatives: ["F' L' U' L U L' U' L U L' U' L U F"],
    fingertricks: "F 起手（左食指底撥），接連三次 sexy move（R U R' U'），F' 收尾，三段 sexy 節奏要均勻，左右手互換替代公式效果等同",
  },
  {
    id: "H3",
    group: "H",
    name: "H 列（D 轉）",
    recognition: "四角全未轉正，側色呈直列分布，無前後車頭燈，需借用 D 層轉換",
    alg: "R' F2 D R2 U R2 D' F2 R",
    alternatives: [],
    fingertricks: "R' F2 起手（F2 換握），D 用左無名指撥，R2 雙快轉，U 食指推，D' 收回，F2 再換握，R 收，節奏偏慢分兩段練",
  },
  {
    id: "H4",
    group: "H",
    name: "H 寬列",
    recognition: "四角全未轉正，與 H3 類似但呈現不同分布，需寬轉 r，認形看側面頂色是否偏移",
    alg: "U2 r U' r2 D' r U' r' D r2 U r'",
    alternatives: [],
    fingertricks: "含 U2 前置；r 寬轉起手，D' 左無名指，中間 r U' r' D r2 節奏密集，建議拆成 r2 D' r 和 r' D r2 兩段記憶",
  },

  // ──────────────── Pi 組（6 條）─────────────────
  // Pi 組：四角全未轉正，頂色分布呈 π 形（同側兩角頂色朝前）
  {
    id: "Pi1",
    group: "Pi",
    name: "Pi 右條",
    recognition: "四角全未轉正，右前右後兩角頂色朝前（右側一條），左前左後頂色朝側面",
    alg: "F R U R' U' R U R' U' F'",
    alternatives: [],
    fingertricks: "F 起手（左食指底撥），接雙 sexy（R U R' U' R U R' U'），F' 收尾，雙 sexy 節奏要統一，F/F' 換握要預先準備",
  },
  {
    id: "Pi2",
    group: "Pi",
    name: "Pi 斜下",
    recognition: "四角全未轉正，前右角頂色朝前、後左角頂色朝後，呈斜向 π 分布",
    alg: "U F R' F' R U2 R U' R' U R U2 R'",
    alternatives: [],
    fingertricks: "含 U 前置；F R' F'（hedge）起手，接 U2 加速進入 Sune 變體（R U' R' U R U2 R'），最後 U2 R' 收",
  },
  {
    id: "Pi3",
    group: "Pi",
    name: "Pi X 形",
    recognition: "四角全未轉正，前右後左各一顆頂色朝前，對角分布，呈 X 型",
    alg: "R' F2 D R2 U' R2 D' F2 R",
    alternatives: [],
    fingertricks: "R' F2（換握）起手，D 左無名指，R2 快轉，U'（注意方向比 H3 相反），再 D' F2 R，與 H3 結構相近，U 方向是區別點",
  },
  {
    id: "Pi4",
    group: "Pi",
    name: "Pi 斜上",
    recognition: "四角全未轉正，前左角頂色朝前，後右角頂色朝後，呈斜上，與 Pi2 左右鏡像",
    alg: "R U2 R' U' R U R' U2 R' F R F'",
    alternatives: [],
    fingertricks: "R U2 R' 起手（Sune 前段），U' R U R' 中段，U2 R' F R F'（sledgehammer 收尾），分三段記憶效率高",
  },
  {
    id: "Pi5",
    group: "Pi",
    name: "Pi 直列（寬）",
    recognition: "四角全未轉正，頂色呈直列分布，需寬轉 r，注意側面是 π 非 H 形",
    alg: "U' r U' r2 D' r U r' D r2 U r'",
    alternatives: [],
    fingertricks: "含 U' 前置；r 寬轉起手，D' 左手無名指，中段 r U r' D r2 是核心節奏，r' 收尾，與 H4 對比記憶更快掌握",
  },
  {
    id: "Pi6",
    group: "Pi",
    name: "Pi 左條",
    recognition: "四角全未轉正，左前左後兩角頂色朝前（左側一條），與 Pi1 左右對稱",
    alg: "U' R' U' R' F R F' R U' R' U2 R",
    alternatives: [],
    fingertricks: "含 U' 前置；R' U' R' 起手（重複 R'），F R F' 是 sledgehammer 變形，接 R U' R' U2 R 收，節奏強調連貫性",
  },

  // ──────────────── U 組（6 條）─────────────────
  // U 組：兩角方向正確，兩角需轉正；頂色有「車頭燈」（一側兩頂色相鄰）
  {
    id: "U1",
    group: "U",
    name: "U 斜上",
    recognition: "前右後左兩角已轉正（對角），後方有車頭燈（後右後左頂色朝後），兩角未轉正",
    alg: "U2 R2 D R' U2 R D' R' U2 R'",
    alternatives: [],
    fingertricks: "含 U2 前置；R2 快轉，D 左無名指，R' U2 R 雙推，D' 收回，U2 R' 收，D 系動作是核心，手腕勿離開",
  },
  {
    id: "U2",
    group: "U",
    name: "U 斜下",
    recognition: "前左後右兩角已轉正（對角），前方有車頭燈（前右前左頂色朝前），與 U1 相鏡",
    alg: "R2 D' R U2 R' D R U2 R",
    alternatives: [],
    fingertricks: "R2 快轉，D' 左無名指反向撥，R U2 R' D R U2 R 是主體，D/D' 方向與 U1 對比記憶（U1=D，U2=D'）",
  },
  {
    id: "U3",
    group: "U",
    name: "U 底列",
    recognition: "右前右後兩角已轉正（右側車頭燈），左前左後未轉正，車頭燈在右側",
    alg: "R' U' R U' R' U2 R2 U R' U R U2 R'",
    alternatives: [],
    fingertricks: "反 Sune（R' U' R U' R' U2 R）起手，接 Sune（R U R' U R U2 R'），兩段各熟記後組合，中間 R2 是連結點",
  },
  {
    id: "U4",
    group: "U",
    name: "U 列",
    recognition: "前兩角轉正、後兩角未轉正，車頭燈在前方，頂色呈前後對列",
    alg: "U' F R2 D R' U R D' R2 U' F'",
    alternatives: [],
    fingertricks: "含 U' 前置；F 起手，R2 快轉，D 左無名指，中段 R' U R D' R2 是核心，U' F' 收尾，F/F' 換握必須快",
  },
  {
    id: "U5",
    group: "U",
    name: "U X 形",
    recognition: "對角兩角轉正，另對角兩角未轉正（X 形），需寬轉 r",
    alg: "U2 r U' r' U r' D' r U' r' D r",
    alternatives: [],
    fingertricks: "含 U2 前置；r 寬轉起手，D' 左無名指，中段 r U' r' D r 是核心，比 H4/Pi5 短，節奏穩住後不慌",
  },
  {
    id: "U6",
    group: "U",
    name: "U 上列",
    recognition: "前兩角（前左前右）轉正形成前側車頭燈，後兩角未轉正，頂色朝後",
    alg: "U' F R U R' U' F'",
    alternatives: [],
    fingertricks: "含 U' 前置；F 起手（左食指底撥），接 sexy（R U R' U'），F' 收，7 步最短 U 系之一，F/F' 換握要流暢",
  },

  // ──────────────── T 組（6 條）─────────────────
  // T 組：左前角（ULF 位置）已轉正，其餘形態各異
  {
    id: "T1",
    group: "T",
    name: "T 左條",
    recognition: "前左角已轉正，左側車頭燈（左前左後頂色朝左），前右後兩角未轉正",
    alg: "U' R U R' U' R' F R F'",
    alternatives: [],
    fingertricks: "含 U' 前置；sexy（R U R' U'）接 R' F R F'（sledgehammer），記成「sexy + sledge」，兩段之間節奏不要停",
  },
  {
    id: "T2",
    group: "T",
    name: "T 右條",
    recognition: "後右角已轉正，右側車頭燈（右前右後頂色朝右），與 T1 左右對稱",
    alg: "U L' U' L U L F' L' F",
    alternatives: [],
    fingertricks: "含 U 前置；L' U' L（左手反 sexy）接 U，再 L F' L' F（左手 sledge），左手主導，不熟左手可換記鏡像排列",
  },
  {
    id: "T3",
    group: "T",
    name: "T 橫列",
    recognition: "前左角已轉正，後左角頂色朝左，前右後右形成橫列，左右對稱度高",
    alg: "R U2 R' U' R U' R2 U2 R U R' U R",
    alternatives: [],
    fingertricks: "R U2 R'（高 Sune 前段）、接 U' R U' R'（中段）、R2 U2 R U R' U R（後段），全程右手 13 步，分三段記憶",
  },
  {
    id: "T4",
    group: "T",
    name: "T 底列（寬）",
    recognition: "前左角已轉正，後兩角形成後側車頭燈，需寬轉 r' 起手",
    alg: "r' U r U2 R2 F R F' R",
    alternatives: [],
    fingertricks: "r' 寬轉起手，U r 讓右面就位，U2 R2 快連轉，F R F'（hedge），R 收尾，寬轉 r' 與 R 的換接是練習重點",
  },
  {
    id: "T5",
    group: "T",
    name: "T 上列（寬）",
    recognition: "前左角已轉正，前兩角頂色朝前形成前側車頭燈，需寬轉 r'",
    alg: "r' D' r U r' D r U' r U r'",
    alternatives: [],
    fingertricks: "r' 寬轉起手，D' 左無名指，r U r' D r 是核心 commutator 結構，U' r U r' 收，D 系寬轉建議慢速拆解練習",
  },
  {
    id: "T6",
    group: "T",
    name: "T 直列（寬）",
    recognition: "前左角已轉正，頂色呈直列分布，與 T5 角度略異，需寬轉",
    alg: "U2 r U' r2 D' r U2 r' D r2 U r'",
    alternatives: [],
    fingertricks: "含 U2 前置；與 H4/Pi5 同類型寬轉，差別在中段 U2 位置，對比三條（H4/Pi5/T6）能加速記憶",
  },

  // ──────────────── L 組（6 條）─────────────────
  // L 組：後右角（URB 位置）已轉正
  {
    id: "L1",
    group: "L",
    name: "L 最佳",
    recognition: "後右角已轉正（頂色朝上），前三角未轉正；前左角頂色朝前，標準 L 型辨識態",
    alg: "U' F' r U r' U' r' F r",
    alternatives: [],
    fingertricks: "含 U' 前置；F' 左食指反撥，r 寬轉，sexy 變體（U r' U' r'），最後 F r 收，8 步短公式，多練節奏",
  },
  {
    id: "L2",
    group: "L",
    name: "L 次佳",
    recognition: "後右角已轉正，前右角頂色朝上（但位置錯），側面有特殊色分布",
    alg: "U2 F R' F' R U R U' R'",
    alternatives: [],
    fingertricks: "含 U2 前置；F R' F'（hedge）起手，接 R U R U' R'，注意最後是 R U' R'（非 U R'），避免混淆",
  },
  {
    id: "L3",
    group: "L",
    name: "L 純列",
    recognition: "後右角已轉正，整體呈列狀分布，純 U/R 操作無需 F/D 系",
    alg: "R U R' U R U' R' U R U' R' U R U2 R'",
    alternatives: [],
    fingertricks: "全程 R U/U' 組合，15 步最長，分三段：R U R' U R U' R'、U R U' R'、U R U2 R'，找到節奏後很流暢",
  },
  {
    id: "L4",
    group: "L",
    name: "L 前換（D）",
    recognition: "後右角已轉正，前兩角需借 D 層換位，是 L 組較難辨識的 case",
    alg: "U2 R U2 R D R' U2 R D' R2",
    alternatives: [],
    fingertricks: "含 U2 前置；R U2 R D（D 左無名指）起段，R' U2 R D' R2 收，D/D' 對稱，記成「U2 進 D、U2 回 D'」",
  },
  {
    id: "L5",
    group: "L",
    name: "L 對角",
    recognition: "後右角已轉正，前左與後右形成對角，側色呈 X 形分布",
    alg: "U2 R U2 R2 F R F' R U2 R'",
    alternatives: [],
    fingertricks: "含 U2 前置；R U2 R2 起手，F R F'（hedge）是核心，R U2 R' 收，整條以 R 為中心，連貫後很快",
  },
  {
    id: "L6",
    group: "L",
    name: "L 後換（D）",
    recognition: "後右角已轉正，後兩角需借 D 層換位，與 L4 形成前後對比",
    alg: "U R' U2 R' D' R U2 R' D R2",
    alternatives: [],
    fingertricks: "含 U 前置；R' U2 R' D' 起段（D' 左無名指反撥），R U2 R' D R2 收，與 L4 對比記（L4=D，L6=D'）",
  },

  // ──────────────── S（Sune）組（6 條）─────────────────
  // S 組：前右角（UFR 位置）已轉正
  {
    id: "S1",
    group: "S",
    name: "Sune",
    recognition: "前右角已轉正（頂色朝上），其餘三角未轉正；右側無車頭燈，前右角頂色在頂面",
    alg: "U R U R' U R U2 R'",
    alternatives: [],
    fingertricks: "含 U 前置；標準 Sune：R 起手，食指推 U，R'，食指推 U，R，食指+中指推 U2，R' 收，全程右手，初學首要公式",
  },
  {
    id: "S2",
    group: "S",
    name: "Sune X 形",
    recognition: "前右角已轉正，側色呈 X 形分布（對角頂色各朝前），需寬轉",
    alg: "U L' U2 L U2 r U' r' F",
    alternatives: [],
    fingertricks: "含 U 前置；L' U2 L（左手反 AS 起手），U2 r 寬轉，U' r' F（F 換握）收，L 系與 r 系混用，可換記替代公式",
  },
  {
    id: "S3",
    group: "S",
    name: "Sune 斜上",
    recognition: "前右角已轉正，後左角頂色朝上（位置錯），呈斜上分布",
    alg: "U F R' F' R U2 R U2 R'",
    alternatives: [],
    fingertricks: "含 U 前置；F R' F'（hedge 起手），U2 R 讓角就位，U2 R' 收，兩個連續 U2 是記憶點，第二個 U2 前要穩住",
  },
  {
    id: "S4",
    group: "S",
    name: "Sune 直列",
    recognition: "前右角已轉正，頂色呈直列分布，是 S 組最長的 case",
    alg: "U R U R' U' R' F R F' R U R' U R U2 R'",
    alternatives: [],
    fingertricks: "含 U 前置；前段 sexy + hedge（R U R' U' R' F R F'），後接 Sune（R U R' U R U2 R'），記成「hedge + Sune」兩段",
  },
  {
    id: "S5",
    group: "S",
    name: "Sune 右條",
    recognition: "前右角已轉正，右側車頭燈（右前右後頂色朝右），需借 F/R' 換位",
    alg: "U' R U R' U R' F R F' R U2 R'",
    alternatives: [],
    fingertricks: "含 U' 前置；R U R'（sexy 前段），接 U R' F R F'（sledgehammer 變體），R U2 R' 收，中段 R' 起手是辨識點",
  },
  {
    id: "S6",
    group: "S",
    name: "Sune 斜下",
    recognition: "前右角已轉正，前左角頂色朝前（斜下），需寬轉 r",
    alg: "U r U' r' F R' F' R",
    alternatives: [],
    fingertricks: "含 U 前置；r 寬轉起手，U' r' 快速，F R' F'（hedge），R 收尾，8 步短公式，寬轉 r 練到位後很順暢",
  },

  // ──────────────── AS（Anti-Sune）組（6 條）─────────────────
  // AS 組：後左角（UBL 位置）已轉正
  {
    id: "AS1",
    group: "AS",
    name: "反 Sune",
    recognition: "後左角已轉正（頂色朝上），其餘三角未轉正；後左角頂色在頂面，左後無車頭燈",
    alg: "U R' U' R U' R' U2 R",
    alternatives: [],
    fingertricks: "含 U 前置；標準反 Sune：R' 起手（手腕回），食指勾 U'，R，食指勾 U'，R'，食指+中指連推 U2，R 收",
  },
  {
    id: "AS2",
    group: "AS",
    name: "反 Sune 直列",
    recognition: "後左角已轉正，頂色呈直列分布，是 AS 組最複雜的 case",
    alg: "U2 R U R2 F' r F R U' r2 F r",
    alternatives: [],
    fingertricks: "含 U2 前置；R U R2 F' 起段，r F R U' 寬轉中段，r2 F r 收，複雜度高建議完整記憶不拆段",
  },
  {
    id: "AS3",
    group: "AS",
    name: "反 Sune 斜下",
    recognition: "後左角已轉正，前右角頂色朝前（斜下），與 S3 互為鏡像",
    alg: "U' F' L F L' U2 L' U2 L",
    alternatives: [],
    fingertricks: "含 U' 前置；F' L F L'（左手 hedge）起手，U2 L' U2 L 雙推兩次 U2，整體偏左手，不熟左手建議記認形後找其他路線",
  },
  {
    id: "AS4",
    group: "AS",
    name: "反 Sune X 形",
    recognition: "後左角已轉正，側色呈 X 形分布，與 S2 互為鏡像",
    alg: "U' R U2 R' U2 R' F R F'",
    alternatives: [],
    fingertricks: "含 U' 前置；R U2 R' 起手（高抬），U2 R' F R F'（sledgehammer 收），兩個 U2 是記憶點，F 換握要預先準備",
  },
  {
    id: "AS5",
    group: "AS",
    name: "反 Sune 斜上",
    recognition: "後左角已轉正，前右角頂色朝上（位置錯），呈斜上，與 S3 略似",
    alg: "U' R' F R F' r U r'",
    alternatives: [],
    fingertricks: "含 U' 前置；R' F R F'（sledgehammer）起手，r U r' 寬轉收尾，8 步短公式，sledgehammer 後接寬轉是特色",
  },
  {
    id: "AS6",
    group: "AS",
    name: "反 Sune 左條",
    recognition: "後左角已轉正，左側車頭燈（後左前左頂色朝左），與 S5 互為鏡像",
    alg: "U R U2 R' F R' F' R U' R U' R'",
    alternatives: [],
    fingertricks: "含 U 前置；R U2 R' 起手，F R' F'（hedge 變形）中段，R U' R U' R' 收，注意 F/F' 換握，前中後三段各記",
  },
];
