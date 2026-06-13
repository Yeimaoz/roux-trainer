import { CubeViewer } from "../../components/CubeViewer";
import { STAGE_STICKERINGS } from "../stickering";

export const OVERVIEW_TITLE = "橋式解法總覽";

export function OverviewLesson({ onNext }: { onNext?: () => void }) {
  return (
    <article className="lesson">
      <span className="eyebrow">Chapter 0</span>
      <h1>橋式解法總覽</h1>

      <p>
        橋式解法（Roux Method）是由法國人 Gilles Roux 於 2003 年設計的一套
        3x3 魔方解法，目前是競速社群中繼 CFOP 之後最受歡迎的進階解法之一。
        與傳統 CFOP（約 60 步）相比，橋式平均只需 <strong>約 48 步</strong>，
        在步數效率與直覺性之間取得了出色的平衡。
      </p>

      <h2>橋式解法的四大階段</h2>

      <p>
        橋式解法將解方塊的過程分為四個連貫階段，每個階段各自有清晰的目標與技巧。
        學習時按順序掌握，能讓你循序漸進地建立對整個解法的全局理解。
      </p>

      {/* 四個 CubeViewer 並排展示各階段 */}
      <div className="lesson-stages-grid">
        <div className="lesson-stage-card">
          <div className="lesson-stage-viewer">
            <CubeViewer
              stickering={STAGE_STICKERINGS.fb}
              size={160}
            />
          </div>
          <h3>第一階段：FB 第一橋</h3>
          <p>
            在魔方左側建立一個 <strong>1×2×3 的方塊</strong>（第一橋，First Block，簡稱 FB）。
            第一橋包含左下角 DL 邊、FL 邊、BL 邊，以及 DLF 角和 DBL 角，共 5 個零件。
            這是整個橋式解法的根基，需要大量直覺訓練。
          </p>
          <p className="lesson-stage-steps">平均 ~7 步</p>
        </div>

        <div className="lesson-stage-card">
          <div className="lesson-stage-viewer">
            <CubeViewer
              stickering={STAGE_STICKERINGS.sb}
              size={160}
            />
          </div>
          <h3>第二階段：SB 第二橋</h3>
          <p>
            在魔方右側建立第二個 1×2×3 方塊（Second Block，簡稱 SB）。
            此階段限定只能使用 R、r、U、M 等不破壞第一橋的動作。
            第二橋包含 DR、FR、BR 邊以及 DFR、DRB 角。
          </p>
          <p className="lesson-stage-steps">平均 ~12 步</p>
        </div>

        <div className="lesson-stage-card">
          <div className="lesson-stage-viewer">
            <CubeViewer
              stickering={STAGE_STICKERINGS.cmll}
              size={160}
            />
          </div>
          <h3>第三階段：CMLL</h3>
          <p>
            完成兩橋後，U 層（頂層）剩下 4 個角需要同時解決位置與方向，
            稱為 CMLL（Corners of Last Layer, ignoring M column）。
            初學者可從 2-look 路線起步，熟練後再上手 42 條公式全集。
          </p>
          <p className="lesson-stage-steps">平均 ~11 步</p>
        </div>

        <div className="lesson-stage-card">
          <div className="lesson-stage-viewer">
            <CubeViewer
              stickering={STAGE_STICKERINGS.lse}
              size={160}
            />
          </div>
          <h3>第四階段：LSE</h3>
          <p>
            最後解決 6 條邊（Last Six Edges，簡稱 LSE），分三小步：
            4a EO（邊定向）、4b UL/UR（歸位左右邊）、4c EP（排列剩餘四邊）。
            LSE 全程只用 M 和 U 系動作，節奏感強，是橋式解法最有趣的部分之一。
          </p>
          <p className="lesson-stage-steps">平均 ~18 步</p>
        </div>
      </div>

      <h2>橋式 vs CFOP 比較</h2>

      <p>
        橋式和 CFOP 各有所長，了解兩者的差異能幫助你決定是否要學橋式，
        以及學習過程中如何調整期望。
      </p>

      <div className="lesson-compare-table">
        <table>
          <thead>
            <tr>
              <th>特性</th>
              <th>橋式（Roux）</th>
              <th>CFOP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>平均步數</td>
              <td className="lesson-compare-better">~48 步</td>
              <td>~58~63 步</td>
            </tr>
            <tr>
              <td>需要記憶的公式數</td>
              <td className="lesson-compare-better">42 條（CMLL），進階 EOLR 加強</td>
              <td>57~80 條（OLL + PLL），進階更多</td>
            </tr>
            <tr>
              <td>F2L 形式</td>
              <td className="lesson-compare-better">全直覺，不需背公式</td>
              <td>有直覺版，但 41 條公式更快</td>
            </tr>
            <tr>
              <td>M 動作依賴</td>
              <td>LSE 大量用 M，需要專門練習</td>
              <td className="lesson-compare-better">幾乎不用 M 動作</td>
            </tr>
            <tr>
              <td>辨識難度</td>
              <td>CMLL 辨識需練，車頭燈概念初期陌生</td>
              <td className="lesson-compare-better">OLL/PLL 辨識較直觀</td>
            </tr>
            <tr>
              <td>適合對象</td>
              <td>希望追求低步數、喜歡直覺解法的玩家</td>
              <td className="lesson-compare-better">初學進階、社群資源最豐富</td>
            </tr>
            <tr>
              <td>競速頂尖表現</td>
              <td className="lesson-compare-better">Max Park 等頂尖使用橋式</td>
              <td className="lesson-compare-better">Felix Zemdegs 等使用 CFOP</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>橋式的核心優勢</h2>

      <p>
        橋式最大的吸引力在於它的<strong>步數效率</strong>與<strong>直覺性</strong>的結合。
        在建立兩橋的過程中，幾乎完全依靠空間推理和塊配對邏輯，不需要背誦任何公式。
        這讓解方塊的過程更像是「思考」而非「背誦」，很多玩家覺得橋式比 CFOP 更令人有成就感。
      </p>

      <p>
        LSE 的設計也很巧妙。完成兩橋和 CMLL 後，剩下的 6 條邊只需要 M 和 U 動作就能解決，
        這個子群的動作非常適合練到接近「自動駕駛」的程度，高速解法時手部移動量極小。
        很多橋式高手在 LSE 階段幾乎不需要思考，純靠肌肉記憶完成。
      </p>

      <h2>學習路線建議</h2>

      <p>
        以下是一條適合大多數人的橋式學習路徑，每個節點代表一個可以實際感受到進步的里程碑：
      </p>

      <div className="lesson-roadmap">
        <div className="roadmap-step">
          <div className="roadmap-num">1</div>
          <div className="roadmap-content">
            <h4>掌握兩橋（直覺建立）</h4>
            <p>熟悉 FB 的 DL 邊先行策略，理解 SB 的 R/r/U/M 限制。目標：能解出兩橋（不計時間）。</p>
          </div>
        </div>
        <div className="roadmap-step">
          <div className="roadmap-num">2</div>
          <div className="roadmap-content">
            <h4>2-look CMLL 起步</h4>
            <p>學習 7 條角定向 + 2 條角排列，共 9 條公式搞定 CMLL，目標 sub-45 秒。</p>
          </div>
        </div>
        <div className="roadmap-step">
          <div className="roadmap-num">3</div>
          <div className="roadmap-content">
            <h4>LSE 流暢化</h4>
            <p>練習 M/U 節奏感，讓 4a→4b→4c 流程自動化。目標 sub-30 秒。</p>
          </div>
        </div>
        <div className="roadmap-step">
          <div className="roadmap-num">4</div>
          <div className="roadmap-content">
            <h4>42 條 CMLL 全集</h4>
            <p>逐組學習（O→H→Pi→U→T→L→S→AS），搭配公式表與練習器，目標 sub-20 秒。</p>
          </div>
        </div>
        <div className="roadmap-step roadmap-step-last">
          <div className="roadmap-num">5</div>
          <div className="roadmap-content">
            <h4>EOLR 進階（sub-20 後）</h4>
            <p>EO 與 LR 合併處理，每次解省 5-8 步，衝刺 sub-15 秒的核心技術。</p>
          </div>
        </div>
      </div>

      <p>
        不要急著進入下一個階段。橋式的每個步驟都值得花時間消化。
        建議每週聚焦一個技術點，搭配大量實戰重複，比一次性死背多條公式更有效。
      </p>

      {onNext && (
        <div className="lesson-next">
          <button className="btn btn-primary" onClick={onNext}>
            下一章：FB 第一橋 →
          </button>
        </div>
      )}
    </article>
  );
}
