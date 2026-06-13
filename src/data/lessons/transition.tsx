import { CubeViewer } from "../../components/CubeViewer";
import { STAGE_STICKERINGS } from "../stickering";
import { ADVANCED_CASES } from "../advanced-cases";

export const TRANSITION_TITLE = "FB→SB 銜接與影響";

// 從 advanced-cases 挑 transition tag 的案例
const TRANS_CASES = ADVANCED_CASES.filter((c) => c.tag === "transition");

const transAuf = TRANS_CASES.find((c) => c.id === "trans-auf")!;
const transFinish = TRANS_CASES.find((c) => c.id === "trans-finish")!;

export function TransitionLesson({ onNext }: { onNext?: () => void }) {
  return (
    <article className="lesson">
      <span className="eyebrow">Chapter 7</span>
      <h1>FB→SB 銜接與影響</h1>

      <p>
        橋式解法中，第一橋（FB）和第二橋（SB）之間的轉換，
        是整個解法流暢度的關鍵節點。
        新手往往把 FB 做完後「停頓一下」再開始找第二橋的塊——
        這個停頓看起來只有零點幾秒，卻是成績提升的重大瓶頸。
      </p>

      <p>
        進階技術的核心洞察是：<strong>FB 收尾時，眼睛就要先看 SB</strong>。
        甚至更進一步——FB 的最後幾個動作，可以有意識地安排成對 SB 有利的形式，
        這個技術叫做<strong>影響（Influence）</strong>。
      </p>

      <h2>為什麼銜接這麼重要？</h2>

      <p>
        在標準計時解中，兩橋之間的停頓常常佔去 0.5-1.5 秒。
        這個時間看起來不多，但加上整個解法的其他停頓，
        往往就是 sub-15 和 sub-20 的差距。
        而且停頓帶來的心理負擔也不容忽視：
        一旦在 FB/SB 銜接時卡住，後面的節奏很容易被打亂。
      </p>

      <p>
        橋式高手的兩橋是<strong>連貫的一整段手序</strong>，
        外人看起來根本看不出第一橋在哪裡結束、第二橋在哪裡開始。
        這種流暢性不是天生的，是透過刻意練習「銜接思維」訓練出來的。
      </p>

      <h2>AUF：收尾那一下的影響力</h2>

      <p>
        FB 的最後一步動作（通常是某個 L 面或 F 面的動作）完成後，
        往往需要一個 <strong>AUF（Adjust U Face）</strong>——
        也就是轉 U 層把某個塊對正或調整角度。
      </p>

      <p>
        普通玩家把 AUF 當作「修正上一步的殘餘」，隨意轉一個 U 或 U'。
        進階玩家把 AUF 當成「預先對準 SB 的第一步」：
      </p>

      <ul>
        <li>
          觀察第二橋需要哪些塊，以及它們在 FB 完成後各在哪個位置。
        </li>
        <li>
          選擇一個 AUF 方向（U、U'、U2、或不轉），
          讓 SB 需要的邊或角落到最容易抓取的位置。
        </li>
        <li>
          AUF 完成後，SB 的第一個動作已經在腦子裡了，
          手直接接上去，沒有停頓。
        </li>
      </ul>

      <div className="lesson-examples">
        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={transAuf.fbSolution + " " + transAuf.sbSolution}
              setupAlg={transAuf.setupAlg}
              stickering={STAGE_STICKERINGS.sb}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>{transAuf.title}</h4>
            <code className="alg">
              {transAuf.fbSolution} | {transAuf.sbSolution}
            </code>
            <p>{transAuf.commentary}</p>
            <p>
              <strong>手法提示：</strong>{transAuf.fingertricks}
            </p>
          </div>
        </div>
      </div>

      <h2>影響（Influence）：一個動作做兩件事</h2>

      <p>
        Influence 是橋式進階技術中最優雅的概念之一：
        在完成 FB 某個動作的同時，<strong>順手把 SB 需要的塊帶到有利位置</strong>。
        這個動作對 FB 本身沒有影響（FB 還是正確完成），
        但對 SB 的後續解法有直接幫助。
      </p>

      <p>
        最典型的 Influence 例子是 FB 的蓋板動作（F 或 F' 面）：
        F 面的旋轉不只把 FB 最後一塊鎖進去，
        也同時移動了 FR 和 UF 位置的塊，
        而 SB 需要的角塊往往就在這些位置。
        懂得選擇 F 還是 F' 來利用這個效果，就是 Influence 的入門。
      </p>

      <div className="lesson-examples">
        <div className="lesson-example-card">
          <div className="lesson-example-viewer">
            <CubeViewer
              alg={transFinish.fbSolution + " " + transFinish.sbSolution}
              setupAlg={transFinish.setupAlg}
              stickering={STAGE_STICKERINGS.sb}
              controls
              size={180}
            />
          </div>
          <div className="lesson-example-info">
            <h4>{transFinish.title}</h4>
            <code className="alg">
              {transFinish.fbSolution} | {transFinish.sbSolution}
            </code>
            <p>{transFinish.commentary}</p>
            <p>
              <strong>手法提示：</strong>{transFinish.fingertricks}
            </p>
          </div>
        </div>
      </div>

      <h2>FB 做完前就要在看 SB</h2>

      <p>
        更進一步的銜接訓練，是在 FB 還沒做完的時候，
        就同時追蹤第二橋的關鍵塊在哪裡。
        這不是說要「邊想 FB 邊想 SB」——而是利用 FB 手序執行時的「空閒眼睛時間」。
      </p>

      <p>
        具體做法：
      </p>

      <ol>
        <li>
          FB 的前半段手序是「固定模式」（比如 DL 邊插入，L 面幾個動作），
          這些動作可以靠肌肉記憶執行，眼睛不需要一直盯著 FB。
        </li>
        <li>
          這段時間，眼睛轉去掃描 SB 需要的兩塊（DR 邊和 DFR 或 DBR 角）在哪裡。
        </li>
        <li>
          FB 快收尾時，你已經知道 SB 的起點，
          AUF 就能選擇最有利的方向，直接銜接。
        </li>
      </ol>

      <p>
        這個「FB 手在動、眼在看 SB」的能力，是橋式的<strong>預判（Lookahead）技術</strong>，
        也是中高級玩家與初學者最直觀的差距。
      </p>

      <h2>預判的訓練方法</h2>

      <p>
        預判不是靠大量做解來自動習得的——很多玩家做了幾千次解仍然在 FB/SB 銜接處停頓。
        需要刻意練習：
      </p>

      <ul>
        <li>
          <strong>慢速解練習</strong>：故意以正常速度的一半做 FB，
          同時強迫自己找到 SB 的兩個塊並決定 AUF，
          FB 收尾前一步就要有 SB 計劃。
        </li>
        <li>
          <strong>只練 FB→SB 銜接</strong>：打亂後只解 FB 和 SB 的第一個配對，
          反覆練習這個銜接點，不管後面。
        </li>
        <li>
          <strong>錄影回放</strong>：錄下自己解方塊的影片，
          看看 FB 收尾到 SB 開始之間有多長的停頓，找出停頓原因。
        </li>
        <li>
          <strong>計時 FB+轉 SB 銜接</strong>：只計時「FB 收尾動作 + AUF + SB 第一步」，
          目標是讓這三個動作合計在 1 秒內完成。
        </li>
      </ul>

      <h2>銜接心態：兩橋是一整段</h2>

      <p>
        最終目標是把 FB 和 SB 的心理模型從「兩個步驟」變成「一段連貫的建橋過程」。
        你在 inspection 時（魔方計時前的 15 秒觀察）就應該規劃好兩橋的解法，
        而不是 FB 完成後才開始想 SB。
      </p>

      <p>
        這個「兩橋合規劃」的思維轉換，往往是橋式玩家突破 sub-20 秒的關鍵——
        比手速更關鍵，比記更多公式更關鍵。
        因為它改變的是整個解法的節奏和連貫性。
      </p>

      {onNext && (
        <div className="lesson-next">
          <button className="btn btn-primary" onClick={onNext}>
            下一章：配對插入 + Keyhole →
          </button>
        </div>
      )}
    </article>
  );
}
