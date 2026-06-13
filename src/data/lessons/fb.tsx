import { CubeViewer } from "../../components/CubeViewer";
import { STAGE_STICKERINGS } from "../stickering";
import { invertAlg } from "../../lib/alg";

export const FB_TITLE = "第一橋（First Block）";

// 精選 FB 範例公式（人工驗證，代表常見配對情況）
const FB_EXAMPLES = [
  {
    label: "範例一：DL 邊 + 角直接歸位（簡單）",
    alg: "F U' F' U L' U L",
    desc: "DL 邊已在底層，角在頂層。先用 F U' F' 處理角，再收 L 面。",
  },
  {
    label: "範例二：DL 邊在頂層，角配對插入（中等）",
    alg: "M' U M U' L' U' L",
    desc: "M' U M 把 DL 邊拉到底層，再配合 L 面處理角邊對。",
  },
];

export function FbLesson({ onNext }: { onNext?: () => void }) {
  return (
    <article className="lesson">
      <span className="eyebrow">Chapter 1</span>
      <h1>第一橋（First Block）</h1>

      <p>
        第一橋（First Block，FB）是橋式解法的起點，也是整個解法中對直覺要求最高的階段。
        你的目標是在魔方<strong>左側</strong>建立一個 1×2×3 的完整方塊，
        由 3 條邊（DL、FL、BL）和 2 個角（DLF、DBL）共 5 個零件組成。
      </p>

      <h2>固定面向</h2>

      <p>
        橋式解法的標準持法是：<strong>白色底面朝下，橙色面朝左</strong>
        （假設你的魔方是標準配色：白對黃、橙對紅、綠對藍）。
        第一橋就建在左側（橙色面 + 白色底的交界處）。
      </p>

      <p>
        這個固定面向非常重要——與 CFOP 不同，橋式玩家在整個解方塊過程中
        幾乎不會旋轉整塊魔方（rotation）。手不動、方塊不轉，
        眼睛在固定視角下掃描所有塊的位置，這正是橋式的核心技能之一。
      </p>

      <div className="lesson-viewer-row">
        <div className="lesson-viewer-item">
          <CubeViewer
            stickering={STAGE_STICKERINGS.fb}
            setupAlg="R U R' F R' F' R"
            size={200}
          />
          <p className="lesson-viewer-caption">第一橋目標：左側 1×2×3 亮起</p>
        </div>
      </div>

      <h2>第一橋的組成零件</h2>

      <p>
        搞清楚哪 5 個零件屬於第一橋，是訓練的第一步：
      </p>

      <ul>
        <li>
          <strong>DL 邊</strong>（Down-Left 邊）：位於底層、左面交界的邊塊。
          是第一橋中最重要的零件，通常最先處理。
        </li>
        <li>
          <strong>FL 邊</strong>（Front-Left 邊）：前面與左面交界的邊塊，屬於第一橋的中層部分。
        </li>
        <li>
          <strong>BL 邊</strong>（Back-Left 邊）：背面與左面交界的邊塊，同屬中層。
        </li>
        <li>
          <strong>DLF 角</strong>（Down-Left-Front 角）：底層左前角。
        </li>
        <li>
          <strong>DBL 角</strong>（Down-Back-Left 角）：底層左後角。
        </li>
      </ul>

      <p>
        注意：左面中心（橙色中心）和底面中心（白色中心）是固定的，
        不需要特別處理，它們天然就在正確位置。
      </p>

      <h2>DL 邊先行策略</h2>

      <p>
        建構第一橋最常見的策略是<strong>「DL 邊先行」</strong>：
        先把 DL 邊送到正確位置，再配合處理其餘四個零件。
        這個策略的好處是 DL 邊歸位後，你只需要用 U 面和 R 面的動作就能避免破壞它。
      </p>

      <p>
        DL 邊的辨識非常直觀——它是白橙雙色邊（白色底面、橙色左面的交界邊）。
        找到它後，根據它目前的位置：
      </p>

      <ul>
        <li>
          <strong>已在底層</strong>：可能位置錯誤或方向錯誤，
          用 L 或 D 面動作把它移到正確位置，通常 1-2 步。
        </li>
        <li>
          <strong>在中層（E 層）</strong>：先用 r/M 動作或 L/F/B 動作解放到頂層，再處理。
        </li>
        <li>
          <strong>在頂層（U 層）</strong>：最常見，用 M'/M + U 動作直接放入。
          M' 把頂層前邊拉到底層左邊，M 則相反。
        </li>
      </ul>

      <h2>角邊配對思路</h2>

      <p>
        DL 邊就定位後，接下來要處理剩下的 4 個零件（2 邊 2 角）。
        最有效率的方式是把<strong>角塊和配對邊塊湊在一起，再一起插入</strong>。
      </p>

      <p>
        配對的概念來自 CFOP 的 F2L，但橋式的配對方式更自由——
        你不限定哪個角配哪個邊，而是看當下哪個配對最好做。
        常見的配對場景：
      </p>

      <ul>
        <li>
          <strong>角在頂，邊在 U 層</strong>：用 U 把角邊移到同側，
          再用 R/r 動作把配對好的組合插入 DR 槽，接著 L 面收進左側。
        </li>
        <li>
          <strong>角在底，邊在頂</strong>：用 R U' R' 或類似動作把角拉出，
          在頂層與邊配對，再插入。
        </li>
        <li>
          <strong>兩者都在底層</strong>：這種情況較少，通常需要先把其中一個解放到頂層再配對。
        </li>
      </ul>

      <p>
        初學者不需要記公式，而是要學習<strong>判斷思路</strong>：
        看到塊的位置，能推想出 2-4 步之內達成目的的動作序列。
        大量實戰是建立這個能力的唯一途徑。
      </p>

      <h2>互動範例</h2>

      <p>以下提供兩個代表性的 FB 建構場景，可以播放動畫觀察動作邏輯：</p>

      <div className="lesson-examples">
        {FB_EXAMPLES.map((ex) => (
          <div key={ex.label} className="lesson-example-card">
            <div className="lesson-example-viewer">
              <CubeViewer
                alg={ex.alg}
                setupAlg={invertAlg(ex.alg)}
                stickering={STAGE_STICKERINGS.fb}
                controls
                size={180}
              />
            </div>
            <div className="lesson-example-info">
              <h4>{ex.label}</h4>
              <code className="alg">{ex.alg}</code>
              <p>{ex.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>常見問題與初學陷阱</h2>

      <p>
        學習第一橋時，很多人會遇到以下問題：
      </p>

      <ul>
        <li>
          <strong>頻繁旋轉整顆魔方</strong>：
          這是 CFOP 玩家的習慣，但橋式應該保持固定視角。
          如果你覺得「這個塊看不到」，先試著改變視線角度而不是旋轉魔方。
        </li>
        <li>
          <strong>先處理角再處理邊</strong>：
          通常邊（尤其是 DL 邊）比角更好操控，養成先找邊的習慣。
        </li>
        <li>
          <strong>破壞已經放好的零件</strong>：
          每個動作前想一下是否會動到已歸位的塊，尤其是 L 面動作一定會動到左橋。
        </li>
      </ul>

      <h2>練習建議</h2>

      <p>
        第一橋的練習沒有捷徑，只有大量重複。以下幾個具體方法有助於加速：
      </p>

      <ol>
        <li>
          每天練習「僅 FB」——完成第一橋後拆開重來，不繼續後面的步驟。
          專注感受哪些動作序列對哪些情況最直覺。
        </li>
        <li>
          用本站的練習器選擇「CMLL - O 組」出題，然後只練 FB 部分，
          觀察動畫後思考自己會怎麼做。
        </li>
        <li>
          計時自己的 FB 時間（僅第一橋），目標是穩定在 5 秒以下再進入下一個章節。
        </li>
      </ol>

      {onNext && (
        <div className="lesson-next">
          <button className="btn btn-primary" onClick={onNext}>
            下一章：SB 第二橋 →
          </button>
        </div>
      )}
    </article>
  );
}
