// 進階建橋案例（FB→SB）。逆向構造：手寫展示技巧的 fbSolution + sbSolution，
// setupAlg = invert(fb + " " + sb)。
// 正確性保證：sbSolution 只用 R/r/U/M（不破壞 FB 左橋），故
//   setup → fb 後 FB 必歸位、再 → sb 後兩橋必歸位（tests/data/advanced-cases.test.ts 逐案驗）。
// commentary 以 move-level 誠實描述該段手序示範的技巧。

export type AdvancedTag = "transition" | "pairing" | "keyhole" | "efficiency";

export interface AdvancedCase {
  id: string;
  tag: AdvancedTag;
  title: string;
  setupAlg: string;
  fbSolution: string;
  sbSolution: string;
  /** 效率對照：等效但較繞路的走法（已 KPuzzle 驗證等效） */
  naive?: { alg: string; count: number };
  commentary: string;
  fingertricks: string;
}

export const TAG_LABEL: Record<AdvancedTag, string> = {
  transition: "FB→SB 銜接",
  pairing: "配對插入",
  keyhole: "Keyhole",
  efficiency: "效率走法",
};

export const ADVANCED_CASES: AdvancedCase[] = [
  // ──────────── efficiency：雙層轉 / 直接銜接 ────────────
  {
    id: "eff-wide-insert",
    tag: "efficiency",
    title: "雙層 r 一次插入",
    setupAlg: "r U r' L' U' L U",
    fbSolution: "U' L' U L",
    sbSolution: "r U' r'",
    naive: { alg: "R M' U' M R'", count: 5 },
    commentary:
      "右橋的邊角已在頂層配成一對。用 r 雙層轉一次（r U' r'）就把整對插進右下槽——等同單層的 R M' U' M R' 五步，少了 2 步又少一次換手。「能用雙層就別拆單層」是橋式提速的關鍵。",
    fingertricks: "r 用右手整隻手腕帶兩層、U' 食指勾、r' 手腕回帶，三拍連貫。",
  },
  {
    id: "eff-direct",
    tag: "efficiency",
    title: "配對後直接銜接",
    setupAlg: "R U R' U' L' U L",
    fbSolution: "L' U' L",
    sbSolution: "U R U' R'",
    commentary:
      "FB 一收完，邊角對已在頂層。直接 U 接 R U' R' 插入，中間不插入任何 L 或 M 的繞路動作。你提到的「與其搬來左轉再右轉，不如直接銜接」就是這個——能直接接就別繞路。",
    fingertricks: "U 食指推、R U' R' 右手三連一氣呵成，不換手。",
  },
  {
    id: "eff-mslide",
    tag: "efficiency",
    title: "M 層滑入省繞路",
    setupAlg: "M' U' M U L' U L U'",
    fbSolution: "U L' U' L",
    sbSolution: "U' M' U M",
    commentary:
      "右橋只差一個中層邊。用 M 層直接滑入（U' M' U M）比用 R 繞一整圈順——當塊就差中層那一格時，M/M' 一推到位，完全不動到右橋已建好的部分。",
    fingertricks: "M' 右手無名指上勾、夾 U、M 回帶，手腕不動。",
  },
  {
    id: "eff-r2",
    tag: "efficiency",
    title: "對面情形雙層翻插",
    setupAlg: "r U2 r' F' L F",
    fbSolution: "F' L' F",
    sbSolution: "r U2 r'",
    naive: { alg: "R M' U2 M R'", count: 5 },
    commentary:
      "邊角對在對面（需翻面插入）。一個 r U2 r' 雙層就翻插到位，等同 R M' U2 M R' 五步。雙層轉不只省手序，也省掉先拆再裝的辨識時間。",
    fingertricks: "r 起手、U2 雙食指連推、r' 收，節奏短促。",
  },

  // ──────────── transition：FB 收尾鋪 SB ────────────
  {
    id: "trans-auf",
    tag: "transition",
    title: "收尾 AUF 順手鋪邊",
    setupAlg: "R U R' U' L' U' L U",
    fbSolution: "U' L' U L",
    sbSolution: "U R U' R'",
    commentary:
      "FB 收尾的 U' 把第一橋對好的同時，順手把右橋要用的邊轉到前上方好抓的位置。FB 還沒做完，眼睛就要先看 SB——收尾那一下決定第二橋順不順。",
    fingertricks: "FB 段 L 收尾後不停頓，直接 U 接 SB 的配對插入。",
  },
  {
    id: "trans-finish",
    tag: "transition",
    title: "蓋上同時帶出角對",
    setupAlg: "R U' R' L F L'",
    fbSolution: "L F' L'",
    sbSolution: "R U R'",
    commentary:
      "用 F' 把 FB 最後一塊蓋上的那一刻，右橋的角邊對剛好被帶到 UFR 待命，接著 R U R' 直接插入。一個動作做兩件事，就是「影響（influence）」的精髓。",
    fingertricks: "L F' L' 左右手交替、R U R' 右手收，中間零停頓。",
  },
  {
    id: "trans-mset",
    tag: "transition",
    title: "建橋途中預定 SB 邊",
    setupAlg: "R U' R' U L U M U'",
    fbSolution: "U M' U' L'",
    sbSolution: "U' R U R'",
    commentary:
      "FB 過程用 M' 調整中層時，順帶把右橋的邊定到頂層。FB 一完成，SB 的邊已經在 U 層等著配對，省去重新找塊的時間。",
    fingertricks: "M' 無名指上勾兼調整、L' 左手收 FB、再轉 SB。",
  },
  {
    id: "trans-flow",
    tag: "transition",
    title: "多轉半圈換順手角度",
    setupAlg: "R' U R U' L' U' L U",
    fbSolution: "U' L' U L U",
    sbSolution: "R' U' R",
    commentary:
      "FB 收尾多帶一個 U，把右橋的對轉到左後方手最好做的角度，再 R' U' R 反手插入。多轉這半圈看似多一步，卻換來插入時零卡頓——預先轉到順手角度，省的是辨識與換手的時間。",
    fingertricks: "收尾 U 食指推、R' U' R 左偏手位反手插。",
  },

  // ──────────── pairing：配對 + 插入 ────────────
  {
    id: "pair-basic",
    tag: "pairing",
    title: "基本配對插入",
    setupAlg: "R U R' L' U' L",
    fbSolution: "L' U L",
    sbSolution: "R U' R'",
    commentary:
      "最基本的 SB 動作：邊和角已在頂層相鄰成對，一個 R U' R' 把整對送進右下槽。橋式第二橋八成的情況都是這種「配好對、一插到底」。",
    fingertricks: "R U' R' 右手三連，拇指食指夾 R、食指勾 U'。",
  },
  {
    id: "pair-setup",
    tag: "pairing",
    title: "先對角度再插入",
    setupAlg: "R U' R' U2 L' U' L U",
    fbSolution: "U' L' U L",
    sbSolution: "U2 R U R'",
    commentary:
      "對和插入槽差半圈，先 U2 把對轉到插入位再 R U R'。配對前先用 U 把角度對好，插入就一步到位——別在錯誤角度硬插。",
    fingertricks: "U2 雙食指連推、R U R' 右手收，兩段分明。",
  },
  {
    id: "pair-long",
    tag: "pairing",
    title: "邊角分開分兩段配",
    setupAlg: "R U R' U' R U' R' F' L' F",
    fbSolution: "F' L F",
    sbSolution: "R U R' U R U' R'",
    commentary:
      "邊和角沒相鄰：先 R U R' 把角擺好、U 調整、再 R U' R' 把邊配上一起插。邊角分開時就分兩段處理，不要妄想一步到位。",
    fingertricks: "兩組 R U R' 之間用 U 銜接，全程右手主導。",
  },
  {
    id: "pair-mslice",
    tag: "pairing",
    title: "M 與雙層混合配對",
    setupAlg: "r U R' U' M L' U L",
    fbSolution: "L' U' L",
    sbSolution: "M' U R U' r'",
    commentary:
      "進階配對：M' 先把邊滑到位、R 配角、最後 r' 雙層把邊角一起收進去。M 負責中層、r 負責整塊，兩者互補能省掉一大段繞路。",
    fingertricks: "M' 無名指、R U' 右手、r' 雙層收尾，三種手法接力。",
  },

  // ──────────── keyhole：空 DR 槽暫存 ────────────
  {
    id: "key-store",
    tag: "keyhole",
    title: "空槽當免費暫存",
    setupAlg: "R U R' L' U L U'",
    fbSolution: "U L' U' L",
    sbSolution: "R U' R'",
    commentary:
      "此時 DR 槽還空著——把它當鑰匙孔（keyhole）。讓角先暫存在這個空槽裡，R U' R' 插入邊的同時順勢把角也歸位。空槽就是你的免費暫存區，善用它能少拆裝。",
    fingertricks: "R U' R' 一氣呵成，過程中角始終待在 DR 不亂跑。",
  },
  {
    id: "key-edge",
    tag: "keyhole",
    title: "借空槽轉向邊",
    setupAlg: "R U' R' U L F L'",
    fbSolution: "L F' L'",
    sbSolution: "U' R U R'",
    commentary:
      "邊的方向不對，先借 DR 空槽把它轉向，U' 對好後 R U R' 把邊角一起鎖進右橋。鑰匙孔不只暫存，也能當「翻面工具」。",
    fingertricks: "U' 食指勾轉向、R U R' 右手收。",
  },
  {
    id: "key-double",
    tag: "keyhole",
    title: "對面塊翻插免拆",
    setupAlg: "R U2 R' L' U' L U",
    fbSolution: "U' L' U L",
    sbSolution: "R U2 R'",
    commentary:
      "對在對面，利用空著的 DR 槽，R U2 R' 一次翻插到位，不必先把塊拆出來再重裝。空槽讓你能「邊翻邊插」。",
    fingertricks: "R 起手、U2 雙食指連推、R' 收，三拍。",
  },
  {
    id: "key-corner",
    tag: "keyhole",
    title: "進階：M 配合喬角",
    setupAlg: "M' U R U' M U R' U' L' U L U'",
    fbSolution: "U L' U' L",
    sbSolution: "U R U' M' U R' U' M",
    commentary:
      "進階鑰匙孔：用 M 配合 R 的多步手序，把角從 DR 暫存區精準喬回正確方向，過程中不破壞已插好的邊。這是 keyhole 與 M 層配合的高階範例，熟練後能處理難纏的角方向。",
    fingertricks: "R U' 右手 / M' 無名指交替，最後 M 收，節奏要穩不要急。",
  },
];
