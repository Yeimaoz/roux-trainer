import { useCallback, useEffect, useRef } from "react";
import { CubeViewer } from "./CubeViewer";
import { STAGE_STICKERINGS } from "../data/stickering";
import type { Drill } from "../lib/cases";
import "./DrillCard.css";

export interface DrillCardProps {
  drill: Drill;
  /** 所選題庫類型，決定 stickering */
  poolKind: "cmll" | "eolr";
  /** case 的顯示名稱（從原始 case 取） */
  caseName: string;
  /** case 的群組標籤（如 "O"/"H"/"2-look"/"EOLR"） */
  caseBadge?: string;
  /** 是否已翻牌 */
  revealed: boolean;
  onReveal: () => void;
  onNext: () => void;
}

export function DrillCard({
  drill,
  poolKind,
  caseName,
  caseBadge,
  revealed,
  onReveal,
  onNext,
}: DrillCardProps) {
  const stickering = poolKind === "eolr"
    ? STAGE_STICKERINGS.lseEo
    : STAGE_STICKERINGS.cmll;

  const moves = drill.solutionAlg.split(/\s+/).filter(Boolean);

  // 鍵盤事件：空白鍵翻牌/下一題，右箭頭直接下一題
  const onRevealRef = useRef(onReveal);
  const onNextRef = useRef(onNext);
  const revealedRef = useRef(revealed);
  onRevealRef.current = onReveal;
  onNextRef.current = onNext;
  revealedRef.current = revealed;

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      if (!revealedRef.current) {
        onRevealRef.current();
      } else {
        onNextRef.current();
      }
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      onNextRef.current();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div className="drillcard">
      {/* ── 題目區（無論翻牌前後都顯示） ── */}
      <div className="drillcard-question">
        <div className="drillcard-viewer">
          <CubeViewer
            setupAlg={drill.setupAlg}
            stickering={stickering}
            size={220}
          />
        </div>
        <p className="drillcard-hint-text">辨識頂層 → 想出公式</p>

        {/* 翻牌前：顯示「看解答」按鈕；翻牌後：不 render 此節點（anti-cheat） */}
        {!revealed && (
          <button
            className="drillcard-flip-btn"
            onClick={onReveal}
          >
            看解答
          </button>
        )}
      </div>

      {/* ── 解答區（翻牌後才 render，anti-cheat：翻牌前不存在於 DOM） ── */}
      {revealed && (
        <div className="drillcard-answer">
          {/* 案例標頭 */}
          <div className="drillcard-answer-head">
            <h3 className="drillcard-case-name">{caseName}</h3>
            {caseBadge && (
              <span className="drillcard-case-badge">{caseBadge}</span>
            )}
          </div>

          {/* 公式大字（分組染色，hover 顯示指法 tooltip） */}
          <div className="drillcard-alg-line" aria-label={`解法：${drill.solutionAlg}`}>
            {drill.annotations.map((ann, i) => {
              const groupMoves = moves.slice(ann.startIndex, ann.endIndex + 1);
              return (
                <span key={i} className="drillcard-alg-group">
                  {groupMoves.map((m, mi) => (
                    <span key={mi} className="drillcard-alg-token">{m}</span>
                  ))}
                  {ann.hint && (
                    <span className="drillcard-tooltip">{ann.hint}</span>
                  )}
                </span>
              );
            })}
          </div>

          {/* 指法列表（每個 trigger 一行） */}
          {drill.annotations.some((a) => a.hint) && (
            <div className="drillcard-fingertricks">
              <span className="drillcard-fingertricks-label">指法提示</span>
              <div className="drillcard-ft-list">
                {drill.annotations.map((ann, i) => {
                  if (!ann.hint) return null;
                  const groupMoves = moves.slice(ann.startIndex, ann.endIndex + 1);
                  return (
                    <div key={i} className="drillcard-ft-item">
                      <span className="drillcard-ft-moves">
                        {groupMoves.join(" ")}
                      </span>
                      <span className="drillcard-ft-hint">{ann.hint}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 播放動畫 CubeViewer */}
          <div className="drillcard-play-section">
            <CubeViewer
              alg={drill.solutionAlg}
              setupAlg={drill.setupAlg}
              stickering={stickering}
              controls
              size={200}
            />
            <span className="drillcard-play-label">▶ 播放解法動畫</span>
          </div>
        </div>
      )}

      {/* ── 底部操作列 ── */}
      <div className="drillcard-actions">
        {!revealed ? (
          <>
            <span className="drillcard-kb-hint">
              <kbd>Space</kbd> 看解答　<kbd>→</kbd> 下一題
            </span>
          </>
        ) : (
          <>
            <button className="drillcard-next-btn btn-primary" onClick={onNext}>
              下一題
            </button>
            <span className="drillcard-kb-hint">
              <kbd>Space</kbd> 或 <kbd>→</kbd> 繼續
            </span>
          </>
        )}
      </div>
    </div>
  );
}
