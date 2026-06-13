import { CubeViewer } from "../../components/CubeViewer";
import { STAGE_STICKERINGS } from "../stickering";
import { invertAlg } from "../../lib/alg";

export const EOLR_TITLE = "EOLR 進階技術";

// EOLR 示範（EO+LR 合併）
const EOLR_DEMO_ALG = "M U M' U2 M U M'";

export function EolrLesson({ onNext }: { onNext?: () => void }) {
  return (
    <article className="lesson">
      <span className="eyebrow">Chapter 5</span>
      <h1>EOLR 進階技術</h1>

      <p>
        EOLR（Edge Orientation + LR pair）是橋式解法中最重要的進階技術之一，
        也是區分「橋式初學者」和「橋式高手」的核心技能。
        簡單來說，EOLR 是把 LSE 的 4a（EO）和 4b（UL/UR 歸位）
        <strong>合併成一個步驟同時完成</strong>，從而省下 5-8 步，
        讓整個解法的步數效率大幅提升。
      </p>

      <p>
        標準橋式解法在 CMLL 完成後，LSE 步驟是：
        先 EO（邊定向）→ 再 UL/UR 歸位 → 最後 EP。
        EOLR 的核心洞察是：在 CMLL 之前，
        就把 <strong>UL/UR 邊（橙藍邊和橙綠邊）移到正確的底層位置</strong>，
        讓 EO 完成的同時，這兩條邊剛好已在 UL/UR。
        這樣 LSE 只剩 4a（EO+LR）+ 4c（EP），省掉整個 4b 步驟。
      </p>

      <h2>EOLR 的動機：省多少步？</h2>

      <p>
        一般橋式解法的 LSE 步數分布大約是：
      </p>

      <ul>
        <li>4a EO：平均 4-6 步</li>
        <li>4b UL/UR：平均 2-4 步</li>
        <li>4c EP：平均 3-5 步</li>
        <li>合計：約 9-15 步</li>
      </ul>

      <p>
        使用 EOLR 後，4b 幾乎被完全消除（偶爾需要 1 步調整），
        LSE 總步數降到 6-10 步，整個解法節省 <strong>5-8 步</strong>。
        對已達 sub-20 秒的玩家來說，這個差距會直接反映在成績上。
      </p>

      <div className="lesson-viewer-row">
        <div className="lesson-viewer-item">
          <CubeViewer
            stickering={STAGE_STICKERINGS.lseEo}
            setupAlg={invertAlg(EOLR_DEMO_ALG)}
            size={200}
          />
          <p className="lesson-viewer-caption">EOLR 起始狀態：EO 未完成，LR pair 需要處理</p>
        </div>
        <div className="lesson-viewer-item">
          <CubeViewer
            alg={EOLR_DEMO_ALG}
            setupAlg={invertAlg(EOLR_DEMO_ALG)}
            stickering={STAGE_STICKERINGS.lse}
            controls
            size={200}
          />
          <p className="lesson-viewer-caption">EOLR 公式示範：EO + LR 同時完成</p>
        </div>
      </div>

      <h2>EOLR 的前提知識</h2>

      <p>
        要學習 EOLR，你需要先掌握：
      </p>

      <ol>
        <li>
          <strong>熟練的 LSE 基礎</strong>：必須能流暢識別壞邊、完成 EO、和解決 4b。
          如果 LSE 基礎不穩，學 EOLR 只會更混亂。
        </li>
        <li>
          <strong>UL/UR 邊辨識</strong>：能快速在打亂狀態中找到橙藍邊（UL）和橙綠邊（UR）。
          EOLR 的核心挑戰就是在處理 EO 的同時，
          心裡記住 UL/UR 在哪裡並引導它們到正確位置。
        </li>
        <li>
          <strong>M/U 組合的直覺操控</strong>：EOLR 的公式以 M/U 系為主，
          每個 case 的解法都是 3-8 步的 M/U 序列，需要大量練習才能直覺反應。
        </li>
      </ol>

      <h2>EOLR case 分類</h2>

      <p>
        根據壞邊數量和 UL/UR 的位置，EOLR case 可以分為幾個大類：
      </p>

      <div className="lesson-compare-table">
        <table>
          <thead>
            <tr>
              <th>壞邊數</th>
              <th>UL/UR 位置</th>
              <th>典型解法步數</th>
              <th>說明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0 個壞邊</td>
              <td>已在 UL/UR</td>
              <td>0 步</td>
              <td>最佳情況，直接進 EP</td>
            </tr>
            <tr>
              <td>0 個壞邊</td>
              <td>UL/UR 互換</td>
              <td>2 步（M2 U M2）</td>
              <td>只需簡單互換</td>
            </tr>
            <tr>
              <td>2 個壞邊</td>
              <td>箭頭型</td>
              <td>4-6 步</td>
              <td>常見情況，多種解法</td>
            </tr>
            <tr>
              <td>4 個壞邊</td>
              <td>各種位置</td>
              <td>6-9 步</td>
              <td>需要更長的 M/U 序列</td>
            </tr>
            <tr>
              <td>6 個壞邊</td>
              <td>無 UL/UR 已就位</td>
              <td>8-12 步</td>
              <td>最難，罕見</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        完整的 EOLR case 表包含約 <strong>30-60 個 case</strong>
        （依你要覆蓋的範圍而定）。大多數玩家先學「arrow cases」（2 bad edges），
        再逐步延伸到更多壞邊的情況。
      </p>

      <h2>何時應該學 EOLR？</h2>

      <p>
        EOLR 是「<strong>sub-20 秒後的技術</strong>」——這不是規定，而是實務建議。
      </p>

      <p>
        原因是：EOLR 的學習曲線比較陡，它要求你在解 CMLL 之前就開始規劃 LSE，
        同時追蹤多個目標。如果你的 CMLL 辨識還不夠快、
        或者 LSE 基礎還沒形成肌肉記憶，
        強行加入 EOLR 規劃反而會讓解法變慢。
      </p>

      <p>
        推薦的學習時機：
      </p>

      <ul>
        <li>穩定 sub-20 秒（或接近 sub-20 秒）</li>
        <li>42 條 CMLL 至少有一半已流暢</li>
        <li>LSE 平均在 10 秒以下</li>
        <li>能在 2 秒以內完成 EO 辨識</li>
      </ul>

      <p>
        如果以上條件都達到，學習 EOLR 會讓你的成績出現顯著跳躍。
        很多玩家在掌握 EOLR 後，成績在幾個月內從 sub-20 推進到 sub-15，甚至 sub-12。
      </p>

      <h2>學習資源</h2>

      <p>
        EOLR 的學習資源比 CMLL 少，但以下幾個地方是最好的起點：
      </p>

      <ul>
        <li>
          <strong>本站 EOLR 公式表</strong>（<a href="#/algs">前往公式表</a>）：
          收錄了精選的教學用 EOLR case，每個 case 都有 M/U 系公式和辨識說明。
        </li>
        <li>
          <strong>rouxers.com</strong>：橋式社群的主要資源站，有完整的 EOLR 教程和 case 表。
        </li>
        <li>
          <strong>SpeedSolving.com 橋式子版</strong>：
          可以找到各個 EOLR case 的討論和最佳化公式。
        </li>
        <li>
          <strong>YouTube</strong>：搜尋「Roux EOLR tutorial」，有多位 sub-10 秒選手的教學影片。
        </li>
      </ul>

      <div className="lesson-cta-links">
        <a href="#/algs" className="btn btn-primary">EOLR 公式表</a>
        <a href="#/trainer" className="btn">練習 EOLR</a>
      </div>

      <h2>EOLR 練習策略</h2>

      <p>
        開始學 EOLR 時，建議採取「<strong>先認識、後出手</strong>」的策略：
      </p>

      <ol>
        <li>
          看到 CMLL 完成的狀態，先花 2-3 秒辨識壞邊數量和 UL/UR 位置。
        </li>
        <li>
          確認這個 case 你知道怎麼解。如果不知道，先用標準 LSE（EO→UL/UR→EP）。
        </li>
        <li>
          隨著認識的 case 增多，逐漸讓 EOLR 取代傳統 4b。
        </li>
      </ol>

      <p>
        不要強迫自己一次學完所有 case。先從 0 壞邊和 2 壞邊的 arrow cases 開始，
        這些佔了出現機率的大多數，投資報酬率最高。
      </p>

      {onNext && (
        <div className="lesson-next">
          <button className="btn btn-primary" onClick={onNext}>
            回到總覽 →
          </button>
        </div>
      )}
    </article>
  );
}
