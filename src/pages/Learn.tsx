import { useState } from "react";
import { OverviewLesson, OVERVIEW_TITLE } from "../data/lessons/overview";
import { FbLesson, FB_TITLE } from "../data/lessons/fb";
import { SbLesson, SB_TITLE } from "../data/lessons/sb";
import { CmllLesson, CMLL_TITLE } from "../data/lessons/cmll";
import { LseLesson, LSE_TITLE } from "../data/lessons/lse";
import { EolrLesson, EOLR_TITLE } from "../data/lessons/eolr";
import { EfficiencyLesson, EFFICIENCY_TITLE } from "../data/lessons/efficiency";
import { TransitionLesson, TRANSITION_TITLE } from "../data/lessons/transition";
import { PairingKeyholeLesson, PAIRING_KEYHOLE_TITLE } from "../data/lessons/pairing-keyhole";
import "./Learn.css";

const CHAPTERS = [
  { id: 0, title: OVERVIEW_TITLE, eyebrow: "Ch.0" },
  { id: 1, title: FB_TITLE, eyebrow: "Ch.1" },
  { id: 2, title: SB_TITLE, eyebrow: "Ch.2" },
  { id: 3, title: CMLL_TITLE, eyebrow: "Ch.3" },
  { id: 4, title: LSE_TITLE, eyebrow: "Ch.4" },
  { id: 5, title: EOLR_TITLE, eyebrow: "Ch.5" },
  { id: 6, title: EFFICIENCY_TITLE, eyebrow: "Ch.6" },
  { id: 7, title: TRANSITION_TITLE, eyebrow: "Ch.7" },
  { id: 8, title: PAIRING_KEYHOLE_TITLE, eyebrow: "Ch.8" },
];

function ChapterContent({
  chapter,
  onNext,
}: {
  chapter: number;
  onNext: () => void;
}) {
  const hasNext = chapter < CHAPTERS.length - 1;
  const handleNext = hasNext ? onNext : undefined;

  switch (chapter) {
    case 0:
      return <OverviewLesson onNext={handleNext} />;
    case 1:
      return <FbLesson onNext={handleNext} />;
    case 2:
      return <SbLesson onNext={handleNext} />;
    case 3:
      return <CmllLesson onNext={handleNext} />;
    case 4:
      return <LseLesson onNext={handleNext} />;
    case 5:
      return <EolrLesson onNext={handleNext} />;
    case 6:
      return <EfficiencyLesson onNext={handleNext} />;
    case 7:
      return <TransitionLesson onNext={handleNext} />;
    case 8:
      return <PairingKeyholeLesson onNext={handleNext} />;
    default:
      return <OverviewLesson onNext={handleNext} />;
  }
}

export default function Learn() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleChapterSelect = (id: number) => {
    setActiveChapter(id);
    setMobileOpen(false);
    // 切換章節時回到頁面頂部
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    const next = Math.min(activeChapter + 1, CHAPTERS.length - 1);
    setActiveChapter(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="learn-layout">
      {/* 行動版：頂部下拉選章節 */}
      <div className="learn-mobile-header">
        <button
          className="learn-mobile-toggle btn"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
        >
          <span className="learn-mobile-label">
            {CHAPTERS[activeChapter].eyebrow}：{CHAPTERS[activeChapter].title}
          </span>
          <span className="learn-mobile-arrow">{mobileOpen ? "▲" : "▼"}</span>
        </button>
        {mobileOpen && (
          <nav className="learn-mobile-nav">
            {CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                className={`learn-mobile-item${ch.id === activeChapter ? " active" : ""}`}
                onClick={() => handleChapterSelect(ch.id)}
              >
                <span className="learn-nav-eyebrow">{ch.eyebrow}</span>
                <span className="learn-nav-title">{ch.title}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* 桌面版：左側固定章節目錄 */}
      <aside className="learn-sidebar">
        <div className="learn-sidebar-inner">
          <p className="learn-sidebar-label">章節目錄</p>
          <nav className="learn-nav">
            {CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                className={`learn-nav-item${ch.id === activeChapter ? " active" : ""}`}
                onClick={() => handleChapterSelect(ch.id)}
              >
                <span className="learn-nav-eyebrow">{ch.eyebrow}</span>
                <span className="learn-nav-title">{ch.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* 內容區 */}
      <main className="learn-content">
        <ChapterContent chapter={activeChapter} onNext={handleNext} />
      </main>
    </div>
  );
}
