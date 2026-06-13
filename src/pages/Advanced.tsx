import { useState, useMemo } from "react";
import { AdvancedCaseCard } from "../components/AdvancedCaseCard";
import {
  ADVANCED_CASES,
  TAG_LABEL,
  type AdvancedTag,
} from "../data/advanced-cases";
import "./Advanced.css";

type Filter = "all" | AdvancedTag;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "transition", label: TAG_LABEL.transition },
  { key: "pairing", label: TAG_LABEL.pairing },
  { key: "keyhole", label: TAG_LABEL.keyhole },
  { key: "efficiency", label: TAG_LABEL.efficiency },
];

export default function Advanced() {
  const [filter, setFilter] = useState<Filter>("all");

  const cases = useMemo(
    () =>
      filter === "all"
        ? ADVANCED_CASES
        : ADVANCED_CASES.filter((c) => c.tag === filter),
    [filter],
  );

  return (
    <div className="page">
      <span className="eyebrow">ADVANCED BLOCK-BUILDING</span>
      <h1>進階建橋技巧</h1>
      <p className="adv-lead">
        從 FB→SB 銜接、配對插入、Keyhole 空槽活用，到效率走法對照——共 16
        個案例，每案均以 cubing.js KPuzzle 驗證正確性。點擊任一卡片可展開 3D
        動畫解說與指法。
      </p>

      <div className="adv-chips">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`chip${filter === f.key ? " active" : ""}`}
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="adv-count">
        顯示 {cases.length} / {ADVANCED_CASES.length} 個案例
      </p>

      <div className="adv-grid">
        {cases.map((c) => (
          <AdvancedCaseCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}
