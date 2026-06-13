// Roux 各段高亮：用 cubing.js 內建的官方命名 stickering（Roux group）。
// 走 experimental-stickering 路徑（boot 時即套用，可靠）；
// 先前自訂 experimentalStickeringMaskOrbits 字串在 0.63 有「3D 場景 boot 前
// 設定被吞」的時序雷（源碼 _stickeringMaskRequest 標 TODO），故棄用。
export const STAGE_STICKERINGS = {
  /** 第一橋：只亮左下 1x2x3 */
  fb: "FirstBlock",
  /** 第二橋：第一橋 dim、第二橋亮 */
  sb: "SecondBlock",
  /** CMLL：U 層角亮、兩橋 dim、LSE 邊忽略 */
  cmll: "CMLL",
  /** LSE 最後六邊 */
  lse: "L6E",
  /** LSE 4a EO（邊定向） */
  lseEo: "L6EO",
  /** 後十塊（= FB 完成後的全部剩餘） */
  l10p: "L10P",
  /** 全亮 */
  full: "full",
} as const;

export type StageStickeringKey = keyof typeof STAGE_STICKERINGS;
