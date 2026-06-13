import { Link } from "react-router-dom";
import { CubeViewer } from "../components/CubeViewer";
import { STAGE_STICKERINGS } from "../data/stickering";
import "./Home.css";

// 示範短解（一個有趣但不太長的打亂+解）
const HERO_ALG = "M' U M U2 M' U2 M U M' U' M";

const STAGES = [
  {
    key: "fb",
    stickering: STAGE_STICKERINGS.fb,
    title: "第一橋（FB）",
    desc: "在左側建立 1×2×3 方塊，橋式的直覺起點。",
    color: "var(--c-orange)",
  },
  {
    key: "sb",
    stickering: STAGE_STICKERINGS.sb,
    title: "第二橋（SB）",
    desc: "右側再建一橋，限用 R/r/U/M 不破壞 FB。",
    color: "var(--c-blue)",
  },
  {
    key: "cmll",
    stickering: STAGE_STICKERINGS.cmll,
    title: "CMLL",
    desc: "42 條公式一次解決頂層四角的位置與方向。",
    color: "var(--c-yellow)",
  },
  {
    key: "lse",
    stickering: STAGE_STICKERINGS.lse,
    title: "LSE",
    desc: "最後六邊只用 M/U，節奏流暢，步數最省。",
    color: "var(--c-green)",
  },
];

const FEATURES = [
  {
    to: "/learn",
    icon: "📖",
    label: "教學",
    desc: "六章系統教學，從兩橋到 EOLR 進階一路學下去。",
    accent: "var(--c-orange)",
  },
  {
    to: "/trainer",
    icon: "⚡",
    label: "練習器",
    desc: "CMLL / EOLR case 辨識翻牌練習，附指法提示。",
    accent: "var(--c-blue)",
  },
  {
    to: "/algs",
    icon: "📋",
    label: "公式表",
    desc: "CMLL 42 條、2-look 9 條、EOLR 精選，附 3D 動畫。",
    accent: "var(--c-yellow)",
  },
  {
    to: "/timer",
    icon: "⏱",
    label: "計時器",
    desc: "WCA 規則計時，ao5/ao12/ao100 自動統計。",
    accent: "var(--c-green)",
  },
];

const ROADMAP = [
  { label: "新手", note: "掌握兩橋 + 2-look CMLL + LSE", time: "1-2 個月" },
  { label: "2-look", note: "穩定 sub-45 → sub-30 秒", time: "2-3 個月" },
  { label: "42 條", note: "完整 CMLL，衝刺 sub-20 秒", time: "3-6 個月" },
  { label: "EOLR", note: "EO+LR 合併，sub-15 秒", time: "sub-20 後" },
];

export default function Home() {
  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-text">
          <span className="eyebrow">橋式解法教室</span>
          <h1 className="home-hero-title">
            用橋式，<br />
            <span className="home-hero-accent">更少步數</span>解開 3x3
          </h1>
          <p className="home-hero-sub">
            Roux Method 平均 ~48 步，比 CFOP 省約 12 步。
            從零開始學，六章教學 + 公式表 + 練習器，一站搞定。
          </p>
          <div className="home-hero-actions">
            <Link to="/learn" className="btn btn-primary home-hero-cta">
              開始學習
            </Link>
            <Link to="/algs" className="btn">
              公式表
            </Link>
          </div>
        </div>
        <div className="home-hero-cube">
          <CubeViewer
            alg={HERO_ALG}
            autoplay
            controls
            stickering={STAGE_STICKERINGS.full}
            size={280}
          />
          <p className="home-hero-cube-label">自動播放示範</p>
        </div>
      </section>

      {/* ── 四階段卡片 ── */}
      <section className="home-stages">
        <div className="home-section-header">
          <span className="eyebrow">解法架構</span>
          <h2>四階段一氣呵成</h2>
        </div>
        <div className="home-stages-grid">
          {STAGES.map((s) => (
            <div key={s.key} className="home-stage-card card">
              <div className="home-stage-viewer">
                <CubeViewer stickering={s.stickering} size={140} />
              </div>
              <h3 style={{ color: s.color }}>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 學習路線圖 ── */}
      <section className="home-roadmap">
        <div className="home-section-header">
          <span className="eyebrow">學習路線</span>
          <h2>從新手到進階的完整路徑</h2>
        </div>
        <div className="home-roadmap-track">
          {ROADMAP.map((step, i) => (
            <div key={step.label} className="home-roadmap-step">
              <div className="home-roadmap-dot">
                <span>{i + 1}</span>
              </div>
              <div className="home-roadmap-card card">
                <h4>{step.label}</h4>
                <p>{step.note}</p>
                <span className="home-roadmap-time">{step.time}</span>
              </div>
              {i < ROADMAP.length - 1 && (
                <div className="home-roadmap-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 功能入口 ── */}
      <section className="home-features">
        <div className="home-section-header">
          <span className="eyebrow">功能一覽</span>
          <h2>所有工具都在這裡</h2>
        </div>
        <div className="home-features-grid">
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to} className="home-feature-card card">
              <div
                className="home-feature-icon"
                style={{ color: f.accent }}
              >
                {f.icon}
              </div>
              <h3 style={{ color: f.accent }}>{f.label}</h3>
              <p>{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
