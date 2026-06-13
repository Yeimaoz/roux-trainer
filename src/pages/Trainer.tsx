import { useState, useCallback } from "react";
import { DrillCard } from "../components/DrillCard";
import { CMLL_CASES } from "../data/cmll";
import { TWO_LOOK_ORIENT, TWO_LOOK_PERMUTE } from "../data/cmll-2look";
import { EOLR_CASES } from "../data/eolr";
import { makeDrill, mulberry32, type AlgCaseLike, type Drill } from "../lib/cases";
import "./Trainer.css";

// ── 題庫定義 ──────────────────────────────────────────────────

type PoolId =
  | "all"
  | "O" | "H" | "Pi" | "U" | "T" | "L" | "S" | "AS"
  | "2look"
  | "eolr";

interface PoolDef {
  id: PoolId;
  label: string;
  kind: "cmll" | "eolr";
  cases: AlgCaseLike[];
  getName: (c: AlgCaseLike) => string;
  getBadge: (c: AlgCaseLike) => string | undefined;
}

function cmllName(c: AlgCaseLike): string {
  const found = CMLL_CASES.find((x) => x.id === c.id);
  return found?.name ?? c.id;
}
function cmllBadge(c: AlgCaseLike): string | undefined {
  const found = CMLL_CASES.find((x) => x.id === c.id);
  return found?.group;
}

const twoLookCases: AlgCaseLike[] = [
  ...TWO_LOOK_ORIENT.map((x) => ({ id: `orient-${x.name}`, alg: x.alg })),
  ...TWO_LOOK_PERMUTE.map((x) => ({ id: `permute-${x.name}`, alg: x.alg })),
];
function twoLookName(c: AlgCaseLike): string {
  const n = c.id.replace(/^orient-|^permute-/, "");
  return TWO_LOOK_ORIENT.find((x) => x.name === n)?.name
    ?? TWO_LOOK_PERMUTE.find((x) => x.name === n)?.name
    ?? c.id;
}
function twoLookBadge(c: AlgCaseLike): string | undefined {
  return c.id.startsWith("orient-") ? "轉正" : "排列";
}

const eolrCasesAsLike: AlgCaseLike[] = EOLR_CASES.map((x) => ({ id: x.id, alg: x.alg }));
function eolrName(c: AlgCaseLike): string {
  return EOLR_CASES.find((x) => x.id === c.id)?.id ?? c.id;
}
function eolrBadge(c: AlgCaseLike): string | undefined {
  const found = EOLR_CASES.find((x) => x.id === c.id);
  return found ? `${found.badEdges} 壞邊` : undefined;
}

const CMLL_GROUPS: Array<"O" | "H" | "Pi" | "U" | "T" | "L" | "S" | "AS"> =
  ["O", "H", "Pi", "U", "T", "L", "S", "AS"];

const POOLS: PoolDef[] = [
  {
    id: "all",
    label: "CMLL 全部",
    kind: "cmll",
    cases: CMLL_CASES,
    getName: cmllName,
    getBadge: cmllBadge,
  },
  ...CMLL_GROUPS.map((g): PoolDef => ({
    id: g,
    label: g,
    kind: "cmll",
    cases: CMLL_CASES.filter((c) => c.group === g),
    getName: cmllName,
    getBadge: cmllBadge,
  })),
  {
    id: "2look",
    label: "2-look",
    kind: "cmll",
    cases: twoLookCases,
    getName: twoLookName,
    getBadge: twoLookBadge,
  },
  {
    id: "eolr",
    label: "EOLR",
    kind: "eolr",
    cases: eolrCasesAsLike,
    getName: eolrName,
    getBadge: eolrBadge,
  },
];

// ── 元件 ──────────────────────────────────────────────────────

interface ActiveDrill {
  drill: Drill;
  poolKind: "cmll" | "eolr";
  caseName: string;
  caseBadge?: string;
}

function generateDrill(pool: PoolDef): ActiveDrill | null {
  if (pool.cases.length === 0) return null;
  const rng = mulberry32(performance.now() | 0);
  const c = pool.cases[Math.floor(rng() * pool.cases.length)];
  const drill = makeDrill(c, mulberry32((performance.now() * 137) | 0));
  return {
    drill,
    poolKind: pool.kind,
    caseName: pool.getName(c),
    caseBadge: pool.getBadge(c),
  };
}

export default function Trainer() {
  const [selectedPool, setSelectedPool] = useState<PoolId>("all");
  const [activeDrill, setActiveDrill] = useState<ActiveDrill | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  const currentPool = POOLS.find((p) => p.id === selectedPool) ?? POOLS[0];

  const handleNext = useCallback(() => {
    const d = generateDrill(currentPool);
    setActiveDrill(d);
    setRevealed(false);
    setSessionTotal((n) => n + 1);
  }, [currentPool]);

  const handleReveal = useCallback(() => {
    setRevealed(true);
    setDoneCount((n) => n + 1);
  }, []);

  const handleSelectPool = (id: PoolId) => {
    setSelectedPool(id);
    setActiveDrill(null);
    setRevealed(false);
  };

  return (
    <div className="page">
      {/* 標頭 */}
      <div className="trainer-header">
        <span className="eyebrow">TRAINER</span>
        <h1>Case 辨識練習</h1>
        <p>從題庫隨機抽 case，辨識後翻牌對答案。</p>
      </div>

      {/* 題庫選擇列 */}
      <div className="trainer-pool-bar" role="group" aria-label="選擇題庫">
        <button
          className="chip"
          aria-pressed={selectedPool === "all"}
          onClick={() => handleSelectPool("all")}
        >
          CMLL 全部
        </button>

        <div className="trainer-pool-sep" role="separator" />

        {CMLL_GROUPS.map((g) => (
          <button
            key={g}
            className="chip"
            aria-pressed={selectedPool === g}
            onClick={() => handleSelectPool(g)}
          >
            {g}
          </button>
        ))}

        <div className="trainer-pool-sep" role="separator" />

        <button
          className="chip"
          aria-pressed={selectedPool === "2look"}
          onClick={() => handleSelectPool("2look")}
        >
          2-look
        </button>
        <button
          className="chip"
          aria-pressed={selectedPool === "eolr"}
          onClick={() => handleSelectPool("eolr")}
        >
          EOLR
        </button>
      </div>

      {/* 主體 */}
      <div className="trainer-main">
        {/* 左：DrillCard 或空白狀態 */}
        <div>
          {activeDrill ? (
            <DrillCard
              drill={activeDrill.drill}
              poolKind={activeDrill.poolKind}
              caseName={activeDrill.caseName}
              caseBadge={activeDrill.caseBadge}
              revealed={revealed}
              onReveal={handleReveal}
              onNext={handleNext}
            />
          ) : (
            <div className="trainer-empty">
              <span>選好題庫，按下「開始出題」</span>
              <button className="trainer-start-btn" onClick={handleNext}>
                開始出題
              </button>
            </div>
          )}
        </div>

        {/* 右：側欄統計 */}
        <aside className="trainer-sidebar">
          <div className="trainer-stat-card">
            <span className="trainer-stat-title">本次練習</span>
            <div className="trainer-stat-row">
              <span>已翻牌</span>
              <span className="trainer-stat-val">{doneCount}</span>
            </div>
            <div className="trainer-stat-row">
              <span>已出題</span>
              <span className="trainer-stat-val">{sessionTotal}</span>
            </div>
          </div>

          <div className="trainer-stat-card">
            <span className="trainer-stat-title">目前題庫</span>
            <p className="trainer-pool-info">
              <strong>{currentPool.label}</strong>
              <br />
              共 {currentPool.cases.length} 個 case
              {currentPool.id === "2look" && (
                <>
                  <br />
                  <span style={{ color: "var(--text-faint)" }}>（OCLL 7 + 排列 2）</span>
                </>
              )}
              {currentPool.id === "eolr" && (
                <>
                  <br />
                  <span style={{ color: "var(--text-faint)" }}>（LSE M/U 系公式）</span>
                </>
              )}
            </p>
          </div>

          <div className="trainer-stat-card">
            <span className="trainer-stat-title">鍵盤快捷鍵</span>
            <div className="trainer-stat-row">
              <span>
                <kbd style={{ background: "var(--bg-elev)", border: "1px solid var(--border-strong)", borderRadius: 4, padding: "1px 6px", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>Space</kbd>
              </span>
              <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>看解答 / 下一題</span>
            </div>
            <div className="trainer-stat-row">
              <span>
                <kbd style={{ background: "var(--bg-elev)", border: "1px solid var(--border-strong)", borderRadius: 4, padding: "1px 6px", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>→</kbd>
              </span>
              <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>直接下一題</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
