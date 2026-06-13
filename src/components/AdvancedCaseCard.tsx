import { useState } from "react";
import { CubeViewer } from "./CubeViewer";
import { STAGE_STICKERINGS } from "../data/stickering";
import type { AdvancedCase } from "../data/advanced-cases";
import { TAG_LABEL } from "../data/advanced-cases";
import "./AdvancedCaseCard.css";

interface Props {
  c: AdvancedCase;
}

function countMoves(alg: string) {
  return alg.trim().split(/\s+/).filter(Boolean).length;
}

export function AdvancedCaseCard({ c }: Props) {
  const [open, setOpen] = useState(false);
  const fullSolution = c.fbSolution + " " + c.sbSolution;
  const totalCount = countMoves(c.fbSolution) + countMoves(c.sbSolution);
  // naive 對照只替換 SB 插入段，故效率值取 SB 段步數
  const sbMoves = countMoves(c.sbSolution);
  const saved = c.naive ? c.naive.count - sbMoves : 0;

  return (
    <>
      <article
        className="adv-card"
        data-tag={c.tag}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
        aria-label={`展開：${c.title}`}
      >
        <div className="adv-card-header">
          <h3>{c.title}</h3>
          <span className="adv-tag-badge" data-tag={c.tag}>
            {TAG_LABEL[c.tag]}
          </span>
        </div>
        <p className="adv-card-movecount">兩橋合計 {totalCount} 步</p>

        <div className="adv-card-cube">
          <CubeViewer
            setupAlg={c.setupAlg}
            stickering={STAGE_STICKERINGS.fb}
            size={140}
          />
        </div>

        <div className="adv-card-alg-preview">
          <div className="adv-alg-row">
            <span className="adv-alg-label fb">FB</span>
            <code className="adv-alg-code fb">{c.fbSolution}</code>
          </div>
          <div className="adv-alg-row">
            <span className="adv-alg-label sb">SB</span>
            <code className="adv-alg-code sb">{c.sbSolution}</code>
          </div>
        </div>

        <p className="adv-card-expand-hint">點擊展開詳細解說 ↗</p>
      </article>

      {open && (
        <div
          className="adv-modal-backdrop"
          onClick={() => setOpen(false)}
        >
          <div
            className="adv-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={c.title}
          >
            <button
              className="adv-modal-close"
              onClick={() => setOpen(false)}
              aria-label="關閉"
            >
              ✕
            </button>

            <div className="adv-modal-header">
              <span className="adv-tag-badge" data-tag={c.tag}>
                {TAG_LABEL[c.tag]}
              </span>
              <h2>{c.title}</h2>
            </div>

            <div className="adv-modal-body">
              {/* ── 左欄：3D 視圖 ── */}
              <div className="adv-modal-left">
                <div className="adv-viewer-block">
                  <CubeViewer
                    setupAlg={c.setupAlg}
                    stickering={STAGE_STICKERINGS.fb}
                    size={200}
                  />
                  <p className="adv-viewer-caption">題目狀態（FB 待建）</p>
                </div>

                <div className="adv-viewer-block">
                  <CubeViewer
                    alg={fullSolution}
                    setupAlg={c.setupAlg}
                    stickering={STAGE_STICKERINGS.sb}
                    controls
                    size={200}
                  />
                  <p className="adv-viewer-caption">▶ 播放 FB→SB 完整解法</p>
                </div>
              </div>

              {/* ── 右欄：解法資訊 ── */}
              <div className="adv-modal-right">
                <div>
                  <p className="adv-section-title">解法公式</p>
                  <div className="adv-alg-block">
                    <div className="adv-alg-row">
                      <span className="adv-alg-label fb">FB</span>
                      <code className="adv-alg-code fb alg">{c.fbSolution}</code>
                    </div>
                    <div className="adv-alg-row">
                      <span className="adv-alg-label sb">SB</span>
                      <code className="adv-alg-code sb alg">{c.sbSolution}</code>
                    </div>
                  </div>
                </div>

                {c.naive && (
                  <div className="adv-naive-block">
                    <p className="adv-naive-title">效率對照</p>
                    <div className="adv-naive-row">
                      <span className="adv-naive-stat">效率走法 {sbMoves} 步</span>
                      <span className="adv-naive-stat">vs 繞路 {c.naive.count} 步</span>
                      <span className="adv-naive-save">省 {saved} 步</span>
                    </div>
                    <p className="adv-naive-alg">繞路：{c.naive.alg}</p>
                  </div>
                )}

                <div className="adv-text-block">
                  <p className="adv-section-title">解說</p>
                  <p>{c.commentary}</p>
                </div>

                <div className="adv-text-block">
                  <p className="adv-section-title">指法</p>
                  <p>{c.fingertricks}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
