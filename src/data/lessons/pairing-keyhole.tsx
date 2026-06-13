import { CubeViewer } from "../../components/CubeViewer";
import { STAGE_STICKERINGS } from "../stickering";
import { ADVANCED_CASES } from "../advanced-cases";

export const PAIRING_KEYHOLE_TITLE = "配對插入 + Keyhole";

// 從 advanced-cases 挑 pairing 和 keyhole tag 的案例
const PAIR_CASES = ADVANCED_CASES.filter((c) => c.tag === "pairing");
const KEY_CASES = ADVANCED_CASES.filter((c) => c.tag === "keyhole");

const pairBasic = PAIR_CASES.find((c) => c.id === "pair-basic")!;
const pairLong = PAIR_CASES.find((c) => c.id === "pair-long")!;
const keyStore = KEY_CASES.find((c) => c.id === "key-store")!;
const keyEdge = KEY_CASES.find((c) => c.id === "key-edge")!;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PairingKeyholeLesson({ onNext: _onNext }: { onNext?: () => void }) {
  return (
    <article className="lesson">
      <span className="eyebrow">Chapter 8</span>
      <h1>配對插入 + Keyhole</h1>

      <p>
        第二橋（SB）的核心技術分為兩個部分：
        <strong>配對插入（Pairing + Insertion）</strong>和
        <strong>鑰匙孔（Keyhole）</strong>。
        這兩個技術不是獨立的公式，而是思考 SB 的基本框架——
        幾乎所有 SB 的局面都可以用這兩種框架之一（或組合）來解決。
      </p>

      <h2>第二橋的目標結構</h2>

      <p>
        第二橋需要完成右側的 1×2×3 方塊，
        由右邊的兩個角塊（DFR 或 DBR）和對應的邊塊（DR、FR 或 BR）組成。
        與第一橋不同，第二橋是在 FB 已完成、左側固定的前提下做的，
        所以所有動作都必須<strong>不破壞 FB</strong>——
        這就是為什麼 SB 手序通常用 R/r/U/M，而不動 L 面。
      </p>

      <h2>配對插入：標準作法</h2>

      <p>
        SB 最常見的解法框架是「先把邊和角配成一對，再把這一對插進右下槽」。
        這個過程分兩個階段：
      </p>

      <h3>第一階段：配對（Pairing）</h3>

      <p>
        配對的目標是讓邊塊和角塊在頂層相鄰，形成一個可以整體插入的組合。
        邊和角要配成「正確的相鄰方向」：
      </p>

      <ul>
        <li>
          如果目標插入位是 <code className="alg">R U' R'</code>，
          那邊和角要在 UFR 和 UF 相鄰（角在 UFR，邊在 UF 且顏色朝向正確）。
        </li>
        <li>
          如果目標插入位是 <code className="alg">R U R'</code>，
          配對方向相反（邊在 UF，角的 U 色朝 U 面）。
        </li>
        <li>
          配對前先確認要用哪種插入，再決定配對的角度——
          別在錯誤方向配對，否則插入時還要轉一次 U2 才能對正，多浪費一步。
        </li>
      </ul>

      <h3>第二階段：插入（Insertion）</h3>

      <p>
        配對完成後，插入通常只需要 2-3 步：
      </p>

      <ul>
        <li>
          <code className="alg">R U' R'</code>——最基本的插入（角在 UFR，邊在 UF，往下鎖）
        </li>
        <li>
          <code className="alg">R U R'</code>——反向插入（角需要翻轉方向）
        </li>
        <li>
          <code className="alg">r U' r'</code>——雙層插入（邊角對已就位，雙層轉一次到底）
        </li>
        <li>
          <code className="alg">r U2 r'</code>——翻面雙層插入（對在對面，需要翻轉 180 度插入）
        </li>
      </ul>

      <div className="lesson-examples">
        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={pairBasic.fbSolution + " " + pairBasic.sbSolution}
              setupAlg={pairBasic.setupAlg}
              stickering={STAGE_STICKERINGS.sb}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>{pairBasic.title}</h4>
            <code className="alg">
              {pairBasic.fbSolution} | {pairBasic.sbSolution}
            </code>
            <p>{pairBasic.commentary}</p>
            <p>
              <strong>手法提示：</strong>{pairBasic.fingertricks}
            </p>
          </div>
        </div>
      </div>

      <h2>邊角分開的處理：分兩段配</h2>

      <p>
        有時候邊和角在打亂後不在相鄰位置，需要分兩段來配對：
      </p>

      <ol>
        <li>
          先把角放到 UFR 位置（用 U/R 系手序），
          暫時不管邊在哪裡。
        </li>
        <li>
          再用 U/M 把邊帶到 UF 位置，形成配對。
        </li>
        <li>
          最後整對插入。
        </li>
      </ol>

      <p>
        關鍵思維：<strong>不要試圖一步到位把邊和角同時送到正確位置</strong>。
        分兩段做雖然看起來多了幾步，但實際上每一步都很直接，
        比想一個「聰明但複雜」的一步法更不容易出錯。
      </p>

      <div className="lesson-examples">
        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={pairLong.fbSolution + " " + pairLong.sbSolution}
              setupAlg={pairLong.setupAlg}
              stickering={STAGE_STICKERINGS.sb}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>{pairLong.title}</h4>
            <code className="alg">
              {pairLong.fbSolution} | {pairLong.sbSolution}
            </code>
            <p>{pairLong.commentary}</p>
            <p>
              <strong>手法提示：</strong>{pairLong.fingertricks}
            </p>
          </div>
        </div>
      </div>

      <h2>Keyhole（鑰匙孔）：空 DR 槽的妙用</h2>

      <p>
        鑰匙孔（Keyhole）技術是橋式中一個特別的概念：
        在 SB 還未完成時，右橋的 DR 位置（右下槽）是空的。
        這個空槽就像一把「鑰匙孔」——
        你可以把塊臨時存進去，再取出來，從而完成更複雜的動作而不打亂已經到位的塊。
      </p>

      <h3>為什麼空槽是免費暫存？</h3>

      <p>
        在橋式的建橋過程中，每個「槽位」（角槽或邊槽）都可以當暫存空間使用——
        只要你最後把正確的塊放回去。
        DR 槽在 SB 完成之前是空的，這讓它成為一個「免費」的暫存：
        你不需要額外動作來清空它，直接用就好。
      </p>

      <p>
        Keyhole 技術的基本操作：
      </p>

      <ul>
        <li>
          <strong>暫存角（Store Corner）</strong>：把角先送入 DR 槽（用 R U' R' 類手序），
          讓頂層的 UFR 位置空出來，再用這個空位調整邊的位置或方向，
          最後再把角取出並與邊合併插入。
        </li>
        <li>
          <strong>翻向邊（Flip Edge）</strong>：當邊方向不對，借 DR 槽把邊翻向再插回去，
          不需要拆開整個配對重做。
        </li>
        <li>
          <strong>翻面插入（Flipped Insertion）</strong>：對在對面時，
          利用空 DR 槽做 R U2 R' 把整對翻面插入，
          比先拆再配更直接省步。
        </li>
      </ul>

      <div className="lesson-examples">
        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={keyStore.fbSolution + " " + keyStore.sbSolution}
              setupAlg={keyStore.setupAlg}
              stickering={STAGE_STICKERINGS.sb}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>{keyStore.title}</h4>
            <code className="alg">
              {keyStore.fbSolution} | {keyStore.sbSolution}
            </code>
            <p>{keyStore.commentary}</p>
            <p>
              <strong>手法提示：</strong>{keyStore.fingertricks}
            </p>
          </div>
        </div>

        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={keyEdge.fbSolution + " " + keyEdge.sbSolution}
              setupAlg={keyEdge.setupAlg}
              stickering={STAGE_STICKERINGS.sb}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>{keyEdge.title}</h4>
            <code className="alg">
              {keyEdge.fbSolution} | {keyEdge.sbSolution}
            </code>
            <p>{keyEdge.commentary}</p>
            <p>
              <strong>手法提示：</strong>{keyEdge.fingertricks}
            </p>
          </div>
        </div>
      </div>

      <h2>Keyhole 辨識：什麼時候用？</h2>

      <p>
        Keyhole 不是所有情況都適用——它在以下幾種情形下特別有用：
      </p>

      <ul>
        <li>
          <strong>邊方向不對時</strong>：邊塊進槽方向錯誤，需要翻面。
          借 DR 槽翻面比重新配對更省步。
        </li>
        <li>
          <strong>對在對面時</strong>：邊角配對後需要旋轉 180 度才能插入。
          用 R U2 R' 或 r U2 r' 加上空槽可以一步翻面到位。
        </li>
        <li>
          <strong>角和邊互相卡住時</strong>：想配對但配對動作會把另一塊打亂。
          用 DR 槽先把角暫存，再安全地移動邊。
        </li>
      </ul>

      <p>
        辨識 Keyhole 機會的關鍵問題：
        <strong>「如果把角先放進 DR 槽，後面會更好處理嗎？」</strong>
        如果答案是肯定的，就用 Keyhole。
      </p>

      <h2>配對 vs Keyhole 的選擇</h2>

      <p>
        配對插入和 Keyhole 不是互斥的，很多情況可以用兩種方式都能解決。
        選擇的標準很簡單：
      </p>

      <ul>
        <li>
          邊和角在頂層且方向對 → 直接配對插入。
        </li>
        <li>
          邊方向不對或對在對面 → 考慮 Keyhole 翻向或翻面插入。
        </li>
        <li>
          邊角都在頂層但位置散 → 先配對（分兩段），不需要 Keyhole。
        </li>
        <li>
          角在底層（DR 附近）而邊在頂層 → 這就是 Keyhole 的本來情境，
          用空槽配合邊調整。
        </li>
      </ul>

      <p>
        不要死記每個情況用哪個，而是培養「一眼看出最短路徑」的直覺。
        這需要大量實際練習，但理解了配對和 Keyhole 的原理後，
        每一次練習都是在強化這個直覺。
      </p>

      <h2>進階展望：SB 無限深</h2>

      <p>
        配對插入和 Keyhole 是 SB 的基礎框架，但 SB 的技術還能繼續深入：
      </p>

      <ul>
        <li>
          <strong>M 層配合 Keyhole</strong>：利用 M/M' 配合 R 系動作做更複雜的方向調整，
          處理更難纏的角方向問題。
        </li>
        <li>
          <strong>第一橋影響第二橋的角</strong>（Transition + Keyhole 組合）：
          FB 收尾時順手把 SB 的角送到 DR 槽，讓 SB 起手就是 Keyhole 情境。
        </li>
        <li>
          <strong>擴展 Keyhole</strong>：使用多步 Keyhole 序列，處理邊角都在底層的難局面。
        </li>
      </ul>

      <p>
        橋式的 SB 沒有上限——頂尖玩家在任何打亂下都能找到最優路徑，
        而這條路徑往往是配對插入、Keyhole 和 M 層三種技術的靈活組合。
        這一章只是開始，真正的進步靠的是把這些工具變成你自己的本能。
      </p>

      <p>
        恭喜你完成了所有進階章節！接下來，用本站的練習器（Trainer）把這些技術應用到實際解法中，
        讓理論變成直覺。
      </p>

      {/* Ch.8 是最後一章，無下一章按鈕 */}
    </article>
  );
}
