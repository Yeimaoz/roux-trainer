import { CubeViewer } from "../../components/CubeViewer";
import { STAGE_STICKERINGS } from "../stickering";
import { invertAlg } from "../../lib/alg";

export const SB_TITLE = "第二橋（Second Block）";

const SB_EXAMPLES = [
  {
    label: "範例一：DR 邊插入 + 角配對（基本）",
    alg: "U R U' R' U' R U R'",
    desc: "典型的角邊配對插入：U 把 DR 邊移到前面，R U R' 把角邊組合插入右槽。",
  },
  {
    label: "範例二：r 寬轉配對（進階）",
    alg: "r U R' U' r' U R",
    desc: "用 r 動作把右層邊一起帶入，再配合 R U R' 完成右橋角邊插入。",
  },
];

export function SbLesson({ onNext }: { onNext?: () => void }) {
  return (
    <article className="lesson">
      <span className="eyebrow">Chapter 2</span>
      <h1>第二橋（Second Block）</h1>

      <p>
        完成第一橋之後，接下來要在魔方<strong>右側</strong>建立第二個 1×2×3 方塊，
        稱為第二橋（Second Block，SB）。第二橋包含 DR、FR、BR 三條邊以及 DFR、DRB 兩個角，
        同樣是 5 個零件。
      </p>

      <p>
        第二橋與第一橋最大的不同在於<strong>動作限制</strong>：
        為了不破壞已完成的第一橋，你只能使用特定的動作組合。
        掌握這個限制，是學習第二橋最重要的一步。
      </p>

      <h2>允許的動作集合</h2>

      <p>
        建構第二橋時，可以安全使用的動作為：
        <strong>R、r、U、M</strong>（及它們的逆轉和 2 次方）。
        這些動作不會影響到左側已建好的第一橋。
      </p>

      <div className="lesson-viewer-row">
        <div className="lesson-viewer-item">
          <CubeViewer
            stickering={STAGE_STICKERINGS.sb}
            setupAlg="R U R' U' R U2 R' U R U' R'"
            size={200}
          />
          <p className="lesson-viewer-caption">第二橋目標：右側 1×2×3 完成（左橋保留）</p>
        </div>
      </div>

      <p>
        為什麼 R 和 r 不破壞第一橋？因為第一橋的零件全在左側，
        R 面動作不會動到左側任何東西。r（雙層 R）會動到 M 層的邊，
        但 M 層的邊不屬於第一橋。U 面動作也不會影響底層和中層的第一橋零件。
      </p>

      <p>
        相反地，<strong>L、F、B、D、E 等動作都會破壞第一橋</strong>，
        在 SB 階段要完全避免。如果你發現必須用到這些動作，
        通常代表第一橋還沒完全完成，或者你需要換一種思路解 SB。
      </p>

      <h2>第二橋的零件辨識</h2>

      <p>
        第二橋的五個零件定義如下：
      </p>

      <ul>
        <li>
          <strong>DR 邊</strong>（Down-Right 邊）：底層右側邊，黃紅雙色邊（黃底紅右）。
          與 FB 的 DL 邊對稱。
        </li>
        <li>
          <strong>FR 邊</strong>（Front-Right 邊）：前面右側邊，綠紅雙色。
        </li>
        <li>
          <strong>BR 邊</strong>（Back-Right 邊）：背面右側邊，藍紅雙色。
        </li>
        <li>
          <strong>DFR 角</strong>（Down-Front-Right 角）：底層右前角，黃綠紅三色角。
        </li>
        <li>
          <strong>DRB 角</strong>（Down-Right-Back 角）：底層右後角，黃藍紅三色角。
        </li>
      </ul>

      <h2>DR 邊先行策略</h2>

      <p>
        與第一橋的 DL 邊先行策略類似，第二橋通常也從 <strong>DR 邊</strong> 開始處理。
        DR 邊是黃紅雙色邊，在 R/r/U/M 的動作集合內很容易找到放入底層的路徑。
      </p>

      <p>
        DR 邊常見的起始位置與處理方式：
      </p>

      <ul>
        <li>
          <strong>在頂層（U 層）</strong>：
          用 M/M' 或 U 動作把它移到 UR 位置，再用 R/r 插入底層。
          或者直接用 U 轉到 UR 槽上方再下沉。
        </li>
        <li>
          <strong>在中層（E 層，如 FR 或 BR 位置）</strong>：
          先用 R U R' 或 r U r' 把它解放到頂層，再重新插入。
        </li>
        <li>
          <strong>已在底層但位置/方向錯誤</strong>：
          用 R2 或 R U R' 先把它推到頂層，重新處理。
        </li>
      </ul>

      <h2>配對-插入節奏</h2>

      <p>
        SB 的核心節奏是<strong>「配對—插入」</strong>的循環：
      </p>

      <ol>
        <li>
          <strong>配對</strong>：在 U 層把右側的角塊和對應的邊塊移到同側，
          讓它們形成一個正確的組合（角邊相鄰且朝向正確）。
        </li>
        <li>
          <strong>插入</strong>：用一組 R U R' 或 R' U' R 類型的動作，
          把已配對好的組合插入右橋的對應槽位。
        </li>
        <li>
          <strong>修正</strong>：插入後通常需要一個 AUF（Adjust U Face，調整 U 面方向），
          讓下一組角邊在正確位置等待配對。
        </li>
      </ol>

      <p>
        最常用的插入動作模式：
      </p>

      <ul>
        <li>
          <code className="alg">R U R'</code> ——角在 URF，邊在 UF（正向）
        </li>
        <li>
          <code className="alg">R U' R'</code> ——角在 URF，邊在 UR（反向）
        </li>
        <li>
          <code className="alg">r U r'</code> ——雙層插入，通常用於邊在 UF 且角需要 r 帶入
        </li>
        <li>
          <code className="alg">R2 U R2 U' R2</code> ——DR 邊歸位（不帶角）的特殊情況
        </li>
      </ul>

      <h2>互動範例</h2>

      <p>以下展示兩個典型的 SB 完成場景：</p>

      <div className="lesson-examples">
        {SB_EXAMPLES.map((ex) => (
          <div key={ex.label} className="lesson-example-card">
            <div className="lesson-example-viewer">
              <CubeViewer
                alg={ex.alg}
                setupAlg={invertAlg(ex.alg)}
                stickering={STAGE_STICKERINGS.sb}
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

      <h2>第二橋的常見陷阱</h2>

      <p>
        學習 SB 時最常見的問題是<strong>把 F 或 B 動作摻進去</strong>，
        這通常是因為看到角在前面就本能地想用 F 旋轉，但這樣會破壞第一橋。
        遇到這種衝動時，先想想能不能用 U 把角或邊轉到能用 R/r 處理的位置。
      </p>

      <p>
        另一個問題是<strong>低效的零件處理順序</strong>。
        SB 有 5 個零件，理論上可以按任意順序處理，但最有效率的通常是
        先定 DR 邊、再配對 FR/BR 邊和對應的角，而不是每次都重新辨識。
        培養固定的觀察流程，能大幅減少停頓時間。
      </p>

      <h2>練習方向</h2>

      <p>
        SB 的練習可以和 FB 分開進行——從「兩橋完成」的固定狀態出發，
        只練習 SB 部分。本站練習器支援按 case 出題，
        可以專門練習 CMLL 之前的狀態（即兩橋完成的初始局面）。
      </p>

      <p>
        目標是讓 SB 的處理時間穩定在 <strong>8 秒以下</strong>，
        然後再嘗試把 FB+SB 合起來計時。許多橋式高手把 FB+SB 合計時間做為
        「橋式效率」的核心指標，目標 sub-10 秒。
      </p>

      {onNext && (
        <div className="lesson-next">
          <button className="btn btn-primary" onClick={onNext}>
            下一章：CMLL →
          </button>
        </div>
      )}
    </article>
  );
}
