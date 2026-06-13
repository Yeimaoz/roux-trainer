import { CubeViewer } from "../../components/CubeViewer";
import { STAGE_STICKERINGS } from "../stickering";
import { ADVANCED_CASES } from "../advanced-cases";

export const EFFICIENCY_TITLE = "建橋效率原則";

// 從 advanced-cases 挑 efficiency tag 的案例
const EFF_CASES = ADVANCED_CASES.filter((c) => c.tag === "efficiency");

// 取前兩個展示（不超過 ~8 個 twisty-player 限制）
const effWide = EFF_CASES.find((c) => c.id === "eff-wide-insert")!;
const effDirect = EFF_CASES.find((c) => c.id === "eff-direct")!;

export function EfficiencyLesson({ onNext }: { onNext?: () => void }) {
  return (
    <article className="lesson">
      <span className="eyebrow">Chapter 6</span>
      <h1>建橋效率原則</h1>

      <p>
        橋式解法（Roux）的設計哲學從一開始就以<strong>效率</strong>為核心：
        不背大量公式、不繞路、不做多餘動作。
        第一橋和第二橋都是「直覺建橋」——你在腦海裡看到目標、規劃路徑、
        然後用最短的手序完成。公式只是工具，思維才是主體。
      </p>

      <p>
        初學者常見的效率陷阱是：把塊搬到中層，往左轉再往右轉，
        繞了一大圈才完成一個插入。進階玩家看到同樣的局面，
        會直接找到最短路徑——<strong>與其搬來要左轉再右轉，不如直接銜接</strong>。
        這一章專門討論這個思維轉換。
      </p>

      <h2>效率的三個維度</h2>

      <p>
        建橋效率可以拆成三個層面來理解：
      </p>

      <ol>
        <li>
          <strong>移動步數（Move Count）</strong>：同樣的結果，步數越少越好。
          橋式高手的兩橋合計往往在 16-20 步，新手常達 28-35 步。
          步數差距幾乎全來自繞路與重複動作。
        </li>
        <li>
          <strong>換手次數</strong>：每次換手都需要大腦重新對焦、手重新定位。
          流暢的解法應該讓每個手序在同一手位完成，避免頻繁切換左右手主導。
          換手少，速度自然快。
        </li>
        <li>
          <strong>辨識停頓</strong>：腦子跑在手前面是高手的標誌。
          如果你做完一段手序後要停下來想「下一步是什麼」，
          那就是辨識速度跟不上執行速度。效率訓練不只是手速，更是眼速和腦速。
        </li>
      </ol>

      <h2>雙層 r/l 轉：一步抵兩步</h2>

      <p>
        橋式中最實用的效率技巧之一，就是善用<strong>雙層轉（Wide Move）</strong>：
        <code className="alg">r</code>（同時轉 R 和 M' 兩層）與
        <code className="alg">l</code>（同時轉 L 和 M 兩層）。
      </p>

      <p className="lesson-callout">
        <strong>關鍵分工：</strong>
        <code className="alg">r</code> 不會動到左邊的第一橋（R 和 M 都在右半邊與中層），
        所以 <strong>r 可以在第二橋階段、甚至全程使用</strong>；
        但 <code className="alg">l</code> 會同時翻動左橋的五塊，
        <strong>只能在還沒建好第一橋時（FB 段）使用</strong>——
        第二橋階段千萬別用 l，否則會把辛苦建好的第一橋拆掉。
        這就是「左橋歸左手、右橋歸右手」的分工。
      </p>

      <p>
        當你要把第二橋的邊角對從頂層插入右下槽（DR 位置）時：
      </p>

      <ul>
        <li>
          單層做法：<code className="alg">R M' U' M R'</code>——需要 5 步，
          且中間有 M 和 R 交替，容易打架。
        </li>
        <li>
          雙層做法：<code className="alg">r U' r'</code>——只需 3 步，
          r 這一個動作同時搞定 R 和 M'，更順手，節奏更緊湊。
        </li>
      </ul>

      <p>
        記住這個等式：<strong>r = R + M'（同時）</strong>。
        當你看到一個情況需要先 R 再 M' 或先 M' 再 R 時，
        想一想能不能用 r/r' 一步做完——這是橋式省步的最直接方法。
      </p>

      <p className="lesson-note">
        下面的互動案例都是<strong>精選展示型</strong>——為了清楚示範單一技巧，
        起始形狀比真實的 25 步打亂乾淨許多。實戰時初始狀態會更複雜，
        但「找雙層、不繞路、直接銜接」的判斷原則完全一樣。
      </p>

      <div className="lesson-examples">
        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={effWide.fbSolution + " " + effWide.sbSolution}
              setupAlg={effWide.setupAlg}
              stickering={STAGE_STICKERINGS.sb}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>{effWide.title}</h4>
            <code className="alg">
              {effWide.fbSolution} | {effWide.sbSolution}
            </code>
            <p>{effWide.commentary}</p>
            <p>
              <strong>手法提示：</strong>{effWide.fingertricks}
            </p>
            {effWide.naive && (
              <p>
                對照繞路走法：<code className="alg">{effWide.naive.alg}</code>（{effWide.naive.count} 步）
              </p>
            )}
          </div>
        </div>
      </div>

      <h2>直接銜接：能直接接就別繞路</h2>

      <p>
        另一個常見的效率損失是「多餘的橋接步驟」：
        明明下一段手序可以直接開始，卻先插入一個 U 或 L 把塊搬到某個「準備位置」，
        再接後續動作。這種「先準備再動作」的習慣來自初學時的思維定勢，
        但往往可以打破。
      </p>

      <p>
        直接銜接的核心思維是：<strong>FB 做完的那一步，同時也是 SB 開始的那一步</strong>。
        FB 收尾的角度和位置直接決定 SB 的起手，
        中間不應該有「重新定位」的動作。
      </p>

      <div className="lesson-examples">
        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={effDirect.fbSolution + " " + effDirect.sbSolution}
              setupAlg={effDirect.setupAlg}
              stickering={STAGE_STICKERINGS.sb}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>{effDirect.title}</h4>
            <code className="alg">
              {effDirect.fbSolution} | {effDirect.sbSolution}
            </code>
            <p>{effDirect.commentary}</p>
            <p>
              <strong>手法提示：</strong>{effDirect.fingertricks}
            </p>
          </div>
        </div>
      </div>

      <h2>M 層的高效運用</h2>

      <p>
        M 層（中層）是橋式的隱藏武器。很多初學者只用 L/R 面來建橋，
        完全忽略 M 層的功能。但在以下情況，M 層往往比 L 或 R 更直接：
      </p>

      <ul>
        <li>
          <strong>中層邊（DF、DB）的調整</strong>：當右橋需要的邊在中層位置，
          用 M/M' 直接推到位，比先搬出來再搬回去省 2-4 步。
        </li>
        <li>
          <strong>避免動到 FB</strong>：M 層不動左橋，在建右橋時用 M 調整中層邊，
          不會影響已完成的 FB——比用 L 面調整更安全。
        </li>
        <li>
          <strong>配合 r 使用</strong>：r = R + M'，所以 r' = R' + M。
          理解這個分解，能幫你更自由地選擇用 r/r' 還是分開用 R 和 M。
        </li>
      </ul>

      <h2>實戰心法：三問法</h2>

      <p>
        在每個建橋局面開始動手之前，快速問自己三個問題：
      </p>

      <ol>
        <li>
          <strong>「這個塊需要幾步才能到位？」</strong>——估計最短路徑，
          如果你的計劃超過這個數字，代表有繞路。
        </li>
        <li>
          <strong>「有沒有雙層轉可以用？」</strong>——如果動作序列有 R 接 M' 或類似組合，
          嘗試換成 r 系。
        </li>
        <li>
          <strong>「FB 收尾後 SB 能直接接嗎？」</strong>——不需要重新找塊和定位，
          就是最好的銜接。
        </li>
      </ol>

      <p>
        這三問不是要你在每次解方塊時慢下來思考，而是在練習時反覆建立直覺。
        速度是直覺的副產品——當你的大腦自動走最短路徑，
        速度自然跟上來。
      </p>

      <h2>效率的本質</h2>

      <p>
        橋式解法的效率不是靠背公式得來的，而是靠<strong>理解每個塊的最短路徑</strong>。
        FB 和 SB 都沒有固定解法，同一個局面可以有十幾種解，
        最好的那個往往是你看一眼就能反應的那個——
        這個「一眼看出最短路」的能力，就是橋式進階的核心技能。
      </p>

      <p>
        當你開始思考「這裡能不能省一步」、「這裡能不能直接接」，
        你就已經踏入效率訓練的門了。接下來的第七章和第八章，
        我們會把這個原則應用到更具體的銜接技術和配對技術上。
      </p>

      {onNext && (
        <div className="lesson-next">
          <button className="btn btn-primary" onClick={onNext}>
            下一章：FB→SB 銜接與影響 →
          </button>
        </div>
      )}
    </article>
  );
}
