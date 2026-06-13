// src/data/eolr.ts
// EOLR 教學精選：依壞邊數分類的代表 case（教學足夠，非競技全集）。
//
// 前提假設：FB（第一橋）+ SB（第二橋）+ CMLL 已完成。
// alg 為純 LSE 公式（M/U 系），從 4a EO 起手；
// 終態 = EO 完成 + UL/UR 歸位，其餘塊留在 LSE 域（測試 solvableWithMU2 依賴此前提）。
//
// 「壞邊」（bad edge）定義：LSE 六條邊（UF/UR/UB/UL/DF/DB）中，
// orientation = 1（方向不好）的邊數。
// EO 完成 = 全部 0 bad；最壞情況 = 6 bad（全壞）。
//
// 公式構造方式：從還原態施加打亂序列 S（純 M/U），取 invertAlg(S) 為公式，
// 自動滿足「公式執行後 → UL/UR 歸位且 EO 完成」的驗證要求。
// recognition 描述依打亂後（即套公式前）的實際邊方向與位置人工確認。
//
// 來源：案例邏輯源自 Roux LSE 理論（rouxers.com EOLR 章節思路），
// 公式以 cubing.js KPuzzle 自驗證（tests/data/eolr.test.ts）。

export interface EolrCase {
  id: string;           // 如 "0bad-ul-ur-swap"
  badEdges: 0 | 2 | 4 | 6;
  recognition: string;  // 繁中：壞邊位置 + UL/UR 所在的辨識描述
  alg: string;          // M/U 系公式，終態 = EO 完成 + UL/UR 歸位
  fingertricks: string; // 繁中指法說明
}

export const EOLR_CASES: EolrCase[] = [
  // ============================================================
  // 0 壞邊（EO 已完成，只需定位 UL/UR）
  // 分布要求：至少 2 條
  // ============================================================
  {
    id: "0bad-ul-ur-swap",
    badEdges: 0,
    recognition:
      "所有 LSE 邊方向均正確（0 壞邊）。UL 和 UR 互換：UL 邊在 UR 槽、UR 邊在 UL 槽。" +
      "頂面看 U 層兩側邊顏色對調。直接 U2 M2 即可送回。",
    alg: "U2 M2",
    fingertricks: "食指+中指連推 U2，中指+無名指連撥 M2；節奏快速兩下即可完成。",
  },
  {
    id: "0bad-lr-in-m-slice",
    badEdges: 0,
    recognition:
      "所有 LSE 邊方向均正確（0 壞邊）。UL 邊在 DF 槽、UR 邊在 DB 槽（兩者都跑進 M 柱）。" +
      "需先用 M2 把它們拉回 U 層，再 U 調整。",
    alg: "M2 U M2",
    fingertricks: "M2 連撥把 UL/UR 從 DF/DB 換上 U 層，U 轉正位，再 M2 送到 UL/UR 槽。",
  },
  {
    id: "0bad-lr-in-m-slice-back",
    badEdges: 0,
    recognition:
      "所有 LSE 邊方向均正確（0 壞邊）。UL 邊在 DB 槽、UR 邊在 DF 槽（互換後跑進 M 柱）。" +
      "與上一個 case 左右鏡像，U 反向調整。",
    alg: "M2 U' M2",
    fingertricks: "M2 連撥後 U' 勾回，再 M2；注意 U' 方向與前一個 case 相反。",
  },

  // ============================================================
  // 2 壞邊
  // 分布要求：至少 4 條
  // ============================================================
  {
    id: "2bad-sune",
    badEdges: 2,
    recognition:
      "2 壞邊。UF 槽和 UL 槽的邊方向不好（朝前/側面而非朝上）。UR 邊在 DF 槽（EO 好）。" +
      "看起來像 Sune 型——前方一壞、UL 位一壞，形成同側兩壞邊圖案。",
    alg: "M' U' M' U' M'",
    fingertricks: "三個 M' 連勾，中間穿插兩個 U'；節奏：勾M' 勾U' 勾M' 勾U' 勾M'，右手無名指為主。",
  },
  {
    id: "2bad-antisune",
    badEdges: 2,
    recognition:
      "2 壞邊。UB 槽和 UL 槽的邊方向不好。UR 邊在 DB 槽（EO 好）。" +
      "與 Sune 型鏡像，壞邊在後方和 UL。",
    alg: "M U M U M",
    fingertricks: "三個 M 連撥，中間穿插兩個 U；節奏：撥M 推U 撥M 推U 撥M，右手無名指。",
  },
  {
    id: "2bad-arrow-ul-uf",
    badEdges: 2,
    recognition:
      "2 壞邊。UL 槽和 UF 槽的邊方向不好，形成前方「箭頭」指向左。" +
      "UR 邊在 UL 槽（EO 好），UL 邊在 UF 槽（但 EO 壞）。需要較複雜的 3M 序列。",
    alg: "M U M U' M'",
    fingertricks: "M 後 U、再 M、U' 勾回、最後 M'；中間 U 調整 UL/UR 位置，整體約 5 步。",
  },
  {
    id: "2bad-complex-arrow",
    badEdges: 2,
    recognition:
      "2 壞邊。UR 槽和 UF 槽的邊方向不好（朝前面），UL 邊在 UF 槽（EO 好）。" +
      "看起來像前方雙箭頭，需要 7 步 M/U 序列處理。",
    alg: "M U' M' U2 M U' M'",
    fingertricks: "M 起手後 U' 勾、M'、U2 雙推、M、U' 勾、M' 收尾；前後 M 呼應，中間 U2 是關鍵。",
  },

  // ============================================================
  // 4 壞邊（最常見類型）
  // 分布要求：至少 4 條
  // ============================================================
  {
    id: "4bad-m-u-mp",
    badEdges: 4,
    recognition:
      "4 壞邊（最常見）。UB/UL/DB/UR 四槽邊方向全壞。UL 邊在 DB 槽、UR 邊在 UB 槽。" +
      "M 柱四邊全翻，U 層後方+UL 壞，像「後箭頭」。",
    alg: "M U M'",
    fingertricks: "M 撥、U 推、M' 勾回；三步標準 EOLR 插入動作，熟練後幾乎一個連貫動作。",
  },
  {
    id: "4bad-mp-u-m",
    badEdges: 4,
    recognition:
      "4 壞邊。UL/UF/DF/UR 四槽邊全壞。UL 邊在 UF 槽、UR 邊在 DF 槽。" +
      "與前一個 case 鏡像，壞邊在前方+UL+UR，像「前箭頭」。",
    alg: "M' U M",
    fingertricks: "M' 勾、U 推、M 撥；鏡像三步，用左手感覺更順（或右手勾 M' 再切換）。",
  },
  {
    id: "4bad-m-up-mp",
    badEdges: 4,
    recognition:
      "4 壞邊。UB/UL/DB/UR 四槽邊全壞（與 M U M' 相同壞邊位）。" +
      "U 反方向（U'），UL 在 DB 方向相反一側。",
    alg: "M U' M'",
    fingertricks: "M 撥、U' 勾、M' 勾；與 M U M' 差一個 U 方向，練習時配對記憶。",
  },
  {
    id: "4bad-mp-up-m",
    badEdges: 4,
    recognition:
      "4 壞邊。UL/DF/UF/UR 四槽邊全壞，UL 邊在 UF 槽（EO 壞）、UR 邊在 DF 槽（EO 壞）。" +
      "U 反方向（U'）版，與 M' U M 的壞邊位置類似但 UL/UR 方向相反；辨識靠 U 層邊朝向。",
    alg: "M' U' M",
    fingertricks: "M' 勾、U' 勾、M 撥；全勾動作，注意手腕節奏不要斷。",
  },
  {
    id: "4bad-m2u-mp",
    badEdges: 4,
    recognition:
      "4 壞邊。UB/UR/UF/UL 四槽全壞（四條 U 層邊全壞），DF/DB 方向好。" +
      "U 層四邊全部方向不對，DF/DB 是好的。M2 能先把 M 柱轉回，再 U 定位後 M' 解決 UL/UR。",
    alg: "M U' M2",
    fingertricks: "M 撥起手、U' 勾、M2 連撥；M2 連動是關鍵，感覺像 M 加速連打兩下。",
  },
  {
    id: "4bad-m2up-mp",
    badEdges: 4,
    recognition:
      "4 壞邊。UB/UL/UF/UR 四槽全壞（U 層四邊全壞，同上），DB/DF 好。" +
      "與前一個 case U 方向相反，M 起手改為 M（正向）。",
    alg: "M U M2",
    fingertricks: "M 撥、U 推、M2 連撥；U 方向與前一個相反，M2 同樣連打加速。",
  },

  // ============================================================
  // 6 壞邊（最複雜，所有 LSE 邊方向全壞）
  // 分布要求：至少 2 條
  // ============================================================
  {
    id: "6bad-type1",
    badEdges: 6,
    recognition:
      "6 壞邊（最複雜，全部 LSE 邊方向不好）。DB/UB/UF/DF/UR/UL 六槽全壞。" +
      "UL 邊在 DF 槽（但 EO 壞）、UR 邊在 UB 槽（EO 壞）。" +
      "辨識重點：頂面看不到任何「正確」邊，需要長序列處理。",
    alg: "M' U' M' U M U' M' U' M'",
    fingertricks:
      "9 步序列，分三組記憶：（M' U'）+ （M' U M）+ （U' M' U' M'）。" +
      "M' 主導，中間 M 正向是切換點；練熟後連貫約 2-3 秒。",
  },
  {
    id: "6bad-type2",
    badEdges: 6,
    recognition:
      "6 壞邊（全壞）。UL/UB/UR/DF/UF/DB 六槽全壞。" +
      "與 6bad-type1 的差異：UL/UR 在不同位置，視覺上右側偏移。" +
      "辨識：同樣全壞，但 U 層邊分布略有不同，需區分後選公式。",
    alg: "M U' M' U M U' M' U' M'",
    fingertricks:
      "9 步序列：（M U'）+ （M' U M）+ （U' M' U' M'）。" +
      "開頭 M 正向（與 type1 的 M' 相反），其餘節奏相同；雙手協作，M 系撥動要連貫。",
  },
];
