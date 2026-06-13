import { useState } from "react";
import { CubeViewer } from "./CubeViewer";
import { invertAlg } from "../lib/alg";
import "./AlgCard.css";

export interface AlgCardProps {
  title: string;
  badge?: string;
  recognition: string;
  alg: string;
  alternatives?: string[];
  fingertricks: string;
  /** cubing.js 內建 stickering（見 data/stickering.ts） */
  stickering?: string;
}

export function AlgCard({
  title,
  badge,
  recognition,
  alg,
  alternatives = [],
  fingertricks,
  stickering,
}: AlgCardProps) {
  const [open, setOpen] = useState(false);
  // 把公式逆轉當 setup → 顯示「題目（待解）」狀態，正視 U 面辨識
  const setupAlg = invertAlg(alg);

  return (
    <>
      <article className="algcard" onClick={() => setOpen(true)}>
        <div className="algcard-view">
          <CubeViewer setupAlg={setupAlg} stickering={stickering} size={132} />
        </div>
        <div className="algcard-body">
          <header className="algcard-head">
            <h3>{title}</h3>
            {badge && <span className="algcard-badge">{badge}</span>}
          </header>
          <p className="algcard-recog">{recognition}</p>
          <code className="alg algcard-alg">{alg}</code>
        </div>
      </article>

      {open && (
        <div className="algmodal-backdrop" onClick={() => setOpen(false)}>
          <div className="algmodal" onClick={(e) => e.stopPropagation()}>
            <button className="algmodal-close" onClick={() => setOpen(false)} aria-label="關閉">
              ✕
            </button>
            <div className="algmodal-grid">
              <div className="algmodal-cube">
                <CubeViewer
                  alg={alg}
                  setupAlg={setupAlg}
                  stickering={stickering}
                  controls
                  size={260}
                />
                <p className="algmodal-hint">▶ 播放看解法逐步動畫</p>
              </div>
              <div className="algmodal-info">
                <span className="eyebrow">{badge ?? "公式"}</span>
                <h2>{title}</h2>
                <h4>辨識</h4>
                <p>{recognition}</p>
                <h4>主公式</h4>
                <code className="alg algmodal-mainalg">{alg}</code>
                {alternatives.length > 0 && (
                  <>
                    <h4>替代公式</h4>
                    {alternatives.map((a) => (
                      <code key={a} className="alg algmodal-alt">
                        {a}
                      </code>
                    ))}
                  </>
                )}
                <h4>指法</h4>
                <p className="algmodal-fingers">{fingertricks}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
