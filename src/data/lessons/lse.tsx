import { CubeViewer } from "../../components/CubeViewer";
import { STAGE_STICKERINGS } from "../stickering";
import { invertAlg } from "../../lib/alg";

export const LSE_TITLE = "LSE：最後六邊";

// LSE 範例公式（M/U 系，代表各步驟）
const LSE_EO_EXAMPLE = "M U M' U' M U2 M'";
const LSE_ULUR_EXAMPLE = "M2 U M2 U2 M2 U M2";
const LSE_EP_EXAMPLE = "M2 U M2 U M' U2 M2 U2 M'";

export function LseLesson({ onNext }: { onNext?: () => void }) {
  return (
    <article className="lesson">
      <span className="eyebrow">Chapter 4</span>
      <h1>LSE：最後六邊</h1>

      <p>
        CMLL 完成後，魔方還剩下 6 條邊需要處理，這個步驟稱為
        <strong>LSE</strong>（Last Six Edges）。
        這 6 條邊分別是：UF、UB、UL、UR（頂層四邊）以及 DF、DB（底層前後邊）。
      </p>

      <p>
        LSE 是橋式解法中最獨特的部分——<strong>全程只用 M 和 U 動作</strong>，
        不動任何其他面。這個限制讓 LSE 形成一個封閉的子群，
        所有可能的初始狀態都可以在這個子群內解決，而且步數相對固定可預測。
      </p>

      <p>
        LSE 分三個小步驟，依序完成：
      </p>

      <h2>4a：EO（邊定向）</h2>

      <p>
        LSE 的第一步是確認並修正所有壞邊的方向，稱為 EO（Edge Orientation，邊定向）。
        在 6 條邊中，「<strong>方向正確</strong>」代表這條邊可以直接不翻轉地插入它的正確位置；
        「<strong>壞邊</strong>（bad edge）」代表它需要被翻轉才能歸位。
      </p>

      <h3>辨識壞邊的方法</h3>

      <p>
        橋式的壞邊辨識規則：把魔方保持標準持法（白底橙左），
        看 UF、UB、DF、DB 四個位置：
      </p>

      <ul>
        <li>
          如果這個位置的邊塊，其 <strong>U 色或 D 色（白/黃）朝向前面或後面</strong>，
          這條邊就是壞邊。
        </li>
        <li>
          如果 UL、UR 位置的邊塊，其 <strong>U 色或 D 色朝向左面或右面</strong>，
          那它們也是壞邊。
        </li>
        <li>
          更簡單的記法：<strong>頂色（白/黃）不朝頂/底就是壞邊</strong>。
        </li>
      </ul>

      <p>
        壞邊一定是偶數個（0、2、4、6），不可能出現奇數個壞邊的情況。
        根據壞邊的數量，EO 的難度不同：
      </p>

      <ul>
        <li><strong>0 個壞邊</strong>：EO 已完成，直接進入 4b。</li>
        <li><strong>2 個壞邊</strong>：最多 5-7 步完成 EO。</li>
        <li><strong>4 個壞邊</strong>：最多 8-10 步。</li>
        <li><strong>6 個壞邊</strong>：最多 12 步（最差情況，罕見）。</li>
      </ul>

      <p>
        EO 的解決策略是把所有壞邊用 M 動作帶到 UF 或 UB 位置，
        再用 U 旋轉收集，最後一次性用 M2 翻轉所有壞邊。
      </p>

      <div className="lesson-examples">
        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={LSE_EO_EXAMPLE}
              setupAlg={invertAlg(LSE_EO_EXAMPLE)}
              stickering={STAGE_STICKERINGS.lseEo}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>4a EO 範例</h4>
            <code className="alg">{LSE_EO_EXAMPLE}</code>
            <p>
              M 帶邊到中層、U 收集壞邊到同側、M' 翻轉定向。
              觀察動畫時注意黃白色在哪個面。
            </p>
          </div>
        </div>
      </div>

      <h2>4b：UL/UR 歸位</h2>

      <p>
        EO 完成後，下一步是把 UL 和 UR 兩個邊塊送到正確位置，
        使頂層邊的排列符合後續處理的前提。
        此時你需要把這兩個「橋式的夾角邊」——
        橙黃邊（UL = 橙左 L 面 + 黃頂 U 面）和紅黃邊（UR = 紅右 R 面 + 黃頂 U 面）——
        各自放到 UL 和 UR 位置。
      </p>

      <p>
        4b 的解法主要利用 <strong>M2 和 U2</strong> 的組合，
        因為 M2 會交換 UF 和 DB 的邊、以及 UB 和 DF 的邊，
        而 U2 會讓 UF↔UB 且 UL↔UR。
        這個子群非常小，最多 3 個 M2/U2 動作就能解決。
      </p>

      <div className="lesson-examples">
        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={LSE_ULUR_EXAMPLE}
              setupAlg={invertAlg(LSE_ULUR_EXAMPLE)}
              stickering={STAGE_STICKERINGS.lse}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>4b UL/UR 歸位範例</h4>
            <code className="alg">{LSE_ULUR_EXAMPLE}</code>
            <p>
              M2 U M2 U2 M2 U M2 是一個「U 色未改變，但 M 層完成換位」的典型序列。
              完成後 UL 和 UR 會在正確位置。
            </p>
          </div>
        </div>
      </div>

      <h2>4c：EP（邊排列）</h2>

      <p>
        UL/UR 歸位後，最後要解決的是剩下四條邊的位置排列（EP，Edge Permutation）。
        此時 UF、UB、DF、DB 這四條邊都已經方向正確，只需要排列。
      </p>

      <p>
        4c 的解法主要是兩種基礎序列的組合：
      </p>

      <ul>
        <li>
          <code className="alg">M2</code>——交換 UF↔DB 且 UB↔DF
        </li>
        <li>
          <code className="alg">U2</code>——旋轉頂層，讓 UF↔UB 且 UL↔UR（UL/UR 已定，不受影響）
        </li>
      </ul>

      <p>
        常見的完成 EP 的序列：
      </p>

      <ul>
        <li><code className="alg">M2 U2 M2</code>——對邊互換（UF↔UB，DF↔DB 後再換）</li>
        <li><code className="alg">M2 U M2 U'</code>——解決某種排列狀態</li>
        <li><code className="alg">M' U2 M U2 M' U2 M</code>——對角序列</li>
      </ul>

      <div className="lesson-examples">
        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={LSE_EP_EXAMPLE}
              setupAlg={invertAlg(LSE_EP_EXAMPLE)}
              stickering={STAGE_STICKERINGS.lse}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>4c EP 範例</h4>
            <code className="alg">{LSE_EP_EXAMPLE}</code>
            <p>
              M2 + U2 的節奏組合。注意整個 LSE 過程手的動作非常省力，
              M 用中指/無名指撥，U 用食指推，形成一個流暢的節奏。
            </p>
          </div>
        </div>
      </div>

      <h2>M/U 節奏感的訓練</h2>

      <p>
        LSE 的精髓在於讓 M 和 U 的組合變成肌肉記憶。
        建議每天獨立練習 LSE 的手部動作：
      </p>

      <ul>
        <li>
          <strong>M 動作</strong>：右手中指/無名指撥（M），左手無名指勾（M'）。
          練習讓這個動作穩定且不需要換握。
        </li>
        <li>
          <strong>M2</strong>：可以做兩次 M，也可以「單手連撥」，速度快一倍。
        </li>
        <li>
          <strong>U + M 節奏</strong>：U 後立刻接 M，這個二連是 LSE 最常見的基本組合，
          類似跑步的步伐節奏。
        </li>
      </ul>

      <p>
        很多橋式玩家反映，LSE 是整個解法中進步最快的部分——
        一旦找到手感，速度提升非常明顯。建議設定一個「僅練 LSE」的計時目標，
        從 15 秒到 10 秒到 8 秒，循序漸進。
      </p>

      {onNext && (
        <div className="lesson-next">
          <button className="btn btn-primary" onClick={onNext}>
            下一章：EOLR 進階 →
          </button>
        </div>
      )}
    </article>
  );
}
