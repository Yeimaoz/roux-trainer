import { CubeViewer } from "../../components/CubeViewer";
import { STAGE_STICKERINGS } from "../stickering";
import { invertAlg } from "../../lib/alg";
export const CMLL_TITLE = "CMLL：頂層四角";

// 2-look 示範公式
const SUNE = "R U R' U R U2 R'";
const T_PERM = "R U R' F' R U R' U' R' F R2 U' R'";

export function CmllLesson({ onNext }: { onNext?: () => void }) {
  return (
    <article className="lesson">
      <span className="eyebrow">Chapter 3</span>
      <h1>CMLL：頂層四角</h1>

      <p>
        完成兩橋後，魔方頂層（U 面）還有 4 個角塊需要同時處理位置和方向，
        這個步驟稱為 <strong>CMLL</strong>（Corners of the Last Layer, ignoring M-slice）。
        CMLL 的「ignoring M-slice」代表 M 層的邊塊（UF、UB、DF、DB）
        在此階段暫時不管，留到最後的 LSE 步驟處理。
      </p>

      <p>
        CMLL 完整有 <strong>42 個 case</strong>，分為 8 個形狀組（O、H、Pi、U、T、L、S、AS）。
        對初學者來說，直接背 42 條公式會讓人望而卻步。
        因此，建議先從 <strong>2-look CMLL</strong> 起步，
        只需要 9 條公式就能完成頂角，再逐步過渡到完整的 42 條。
      </p>

      <h2>2-look CMLL 起步（9 條公式）</h2>

      <p>
        2-look CMLL 把頂角分兩步解決：
      </p>

      <ol>
        <li>
          <strong>第一眼：角定向（OLL 角，共 7 條）</strong>——
          讓 4 個角的頂色全部朝上，不管位置。
          只有 7 種可能的初始形狀，每種對應一條公式（外加「已完成」的情況）。
        </li>
        <li>
          <strong>第二眼：角排列（PLL 角，共 2 條）</strong>——
          角定向完成後，只有 3 種可能：已排好、相鄰兩角互換、對角兩角互換，
          對應 0-2 條公式。
        </li>
      </ol>

      <p>
        加上 AUF（調整 U 面方向），這套方案讓任何人都能在 2 步內完成頂角，
        非常適合剛從 CFOP 轉過來的玩家。
      </p>

      <div className="lesson-viewer-row">
        <div className="lesson-viewer-item">
          <CubeViewer
            stickering={STAGE_STICKERINGS.cmll}
            setupAlg={invertAlg(SUNE)}
            size={200}
          />
          <p className="lesson-viewer-caption">CMLL 前的狀態：頂角待解</p>
        </div>
      </div>

      <h2>核心公式：Sune 家族</h2>

      <p>
        7 條角定向公式中，最重要的是 <strong>Sune</strong>（S 形狀）和 <strong>Anti-Sune</strong>（AS 形狀）。
        這兩條公式的特點是節奏感強、手感好，而且 6 條其他的定向公式都可以從它們衍生：
        某些情況可以做兩次 Sune 或一次 Anti-Sune 加一次 Sune 解決。
      </p>

      <div className="lesson-examples">
        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={SUNE}
              setupAlg={invertAlg(SUNE)}
              stickering={STAGE_STICKERINGS.cmll}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>Sune（S 形）</h4>
            <code className="alg">{SUNE}</code>
            <p>
              辨識：一個角已轉正在左前，頂色朝前。
              節奏：R 起手，食指推 U 一氣呵成。
              記憶口訣：「右上右，右雙右」。
            </p>
          </div>
        </div>

        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={T_PERM}
              setupAlg={invertAlg(T_PERM)}
              stickering={STAGE_STICKERINGS.cmll}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>T-perm（相鄰角互換）</h4>
            <code className="alg">{T_PERM}</code>
            <p>
              第二眼排列的主力公式。辨識：一側有「車頭燈」（兩角同色在同側）。
              T-perm 不移動邊塊，是橋式 CMLL 排列的最佳選擇。
            </p>
          </div>
        </div>
      </div>

      <h2>CMLL 的辨識技巧</h2>

      <p>
        橋式 CMLL 的辨識方法和 CFOP 的 OLL+PLL 不一樣——
        CMLL 要同時判斷<strong>方向（顏色面）和位置（車頭燈）</strong>。
      </p>

      <p>
        常用的辨識框架是看「<strong>車頭燈</strong>」：
        從魔方四個側面看，如果某一面的兩個頂角顏色相同，這一面就有車頭燈。
        車頭燈的有無、數量和位置，是判斷 CMLL 形狀的關鍵資訊。
      </p>

      <ul>
        <li><strong>O 組（無車頭燈）</strong>：四面都沒有車頭燈，只有相鄰換和對角換兩種。</li>
        <li><strong>H 組</strong>：相對兩面各有車頭燈（頂色模式像 H 字）。</li>
        <li><strong>Pi 組</strong>：頂面有 Pi 形態（四個頂角沒有任何面朝頂）。</li>
        <li><strong>U 組</strong>：只有一個角頂色朝上（Sune 家族）。</li>
        <li><strong>T 組</strong>：恰好兩個對角頂色朝上。</li>
        <li><strong>L 組</strong>：兩個相鄰角頂色朝上（形成 L 形）。</li>
        <li><strong>S、AS 組</strong>：特殊方向的車頭燈組合。</li>
      </ul>

      <p>
        初期不用記全部辨識規則，先專注學習 Sune 和 Anti-Sune 的辨識，
        對付不認識的情況先用 Sune×Sune 或 Sune+Anti-Sune 組合解決，
        這樣雖然最多需要 3 步，但完全可以解決所有情況。
      </p>

      <h2>從 2-look 到 42 條全集</h2>

      <p>
        掌握 2-look CMLL 後（通常需要 2-4 週練習），就可以開始學習完整的 42 條。
        橋式社群建議按以下順序逐組學習：
      </p>

      <ol>
        <li>O 組（2 條）——最常見的形狀，O-perm 對角換</li>
        <li>U 組（6 條）——延伸 Sune 家族，手感相近</li>
        <li>T 組（6 條）——辨識直觀，常用</li>
        <li>H 組（4 條）——對稱形狀，容易辨識</li>
        <li>Pi 組（6 條）——Pi 形，需要新的辨識練習</li>
        <li>L 組、S 組、AS 組——最後完成</li>
      </ol>

      <p>
        每組大約需要 1-2 週練到流暢，整套 42 條通常在 3-6 個月完全掌握。
        搭配本站的練習器，每天練習 20-30 分鐘的 case 辨識，進步速度會明顯加快。
      </p>

      <div className="lesson-cta-links">
        <a href="#/algs" className="btn btn-primary">前往 CMLL 公式表</a>
        <a href="#/trainer" className="btn">練習 CMLL Case</a>
      </div>

      {onNext && (
        <div className="lesson-next">
          <button className="btn btn-primary" onClick={onNext}>
            下一章：LSE →
          </button>
        </div>
      )}
    </article>
  );
}
