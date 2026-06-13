import { useMemo, useState } from "react";
import { AlgCard } from "../components/AlgCard";
import { CMLL_CASES, type CmllCase } from "../data/cmll";
import { TWO_LOOK_ORIENT, TWO_LOOK_PERMUTE } from "../data/cmll-2look";
import { EOLR_CASES } from "../data/eolr";
import { STAGE_STICKERINGS } from "../data/stickering";
import "./Algs.css";

type Tab = "cmll" | "2look" | "eolr";
const CMLL_GROUPS = ["O", "H", "Pi", "U", "T", "L", "S", "AS"] as const;
const GROUP_LABEL: Record<string, string> = {
  O: "O 組",
  H: "H 組",
  Pi: "Pi 組",
  U: "U 組",
  T: "T 組",
  L: "L 組",
  S: "S 組",
  AS: "AS 組",
};

export default function Algs() {
  const [tab, setTab] = useState<Tab>("cmll");
  const [group, setGroup] = useState<string>("ALL");

  const cmllByGroup = useMemo(() => {
    const filtered =
      group === "ALL" ? CMLL_CASES : CMLL_CASES.filter((c) => c.group === group);
    const map = new Map<string, CmllCase[]>();
    for (const c of filtered) {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group)!.push(c);
    }
    return map;
  }, [group]);

  return (
    <div className="page">
      <span className="eyebrow">Algorithm Sheet</span>
      <h1>公式表</h1>
      <p className="algs-lead">
        CMLL 42 條完整公式、2-look 入門路線、EOLR 進階 case。點任一張卡看 3D 動畫與指法。
      </p>

      <div className="algs-tabs">
        <button className={`tab ${tab === "cmll" ? "active" : ""}`} onClick={() => setTab("cmll")}>
          CMLL 42
        </button>
        <button className={`tab ${tab === "2look" ? "active" : ""}`} onClick={() => setTab("2look")}>
          2-look 入門
        </button>
        <button className={`tab ${tab === "eolr" ? "active" : ""}`} onClick={() => setTab("eolr")}>
          EOLR 進階
        </button>
      </div>

      {tab === "cmll" && (
        <>
          <div className="algs-chips">
            <button
              className={`chip ${group === "ALL" ? "active" : ""}`}
              onClick={() => setGroup("ALL")}
            >
              全部 42
            </button>
            {CMLL_GROUPS.map((g) => (
              <button
                key={g}
                className={`chip ${group === g ? "active" : ""}`}
                onClick={() => setGroup(g)}
              >
                {GROUP_LABEL[g]}
              </button>
            ))}
          </div>
          {[...cmllByGroup.entries()].map(([g, cases]) => (
            <section key={g} className="algs-section">
              <h2 className="algs-group-title">
                {GROUP_LABEL[g]} <span>{cases.length} 條</span>
              </h2>
              <div className="algs-grid">
                {cases.map((c) => (
                  <AlgCard
                    key={c.id}
                    title={c.name}
                    badge={c.id}
                    recognition={c.recognition}
                    alg={c.alg}
                    alternatives={c.alternatives}
                    fingertricks={c.fingertricks}
                    stickering={STAGE_STICKERINGS.cmll}
                  />
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      {tab === "2look" && (
        <>
          <section className="algs-section">
            <h2 className="algs-group-title">
              第一眼 · 轉正 <span>{TWO_LOOK_ORIENT.length} 條</span>
            </h2>
            <div className="algs-grid">
              {TWO_LOOK_ORIENT.map((a) => (
                <AlgCard
                  key={a.name}
                  title={a.name}
                  badge="轉正"
                  recognition={a.recognition}
                  alg={a.alg}
                  fingertricks={a.fingertricks}
                  stickering={STAGE_STICKERINGS.cmll}
                />
              ))}
            </div>
          </section>
          <section className="algs-section">
            <h2 className="algs-group-title">
              第二眼 · 排列 <span>{TWO_LOOK_PERMUTE.length} 條</span>
            </h2>
            <div className="algs-grid">
              {TWO_LOOK_PERMUTE.map((a) => (
                <AlgCard
                  key={a.name}
                  title={a.name}
                  badge="排列"
                  recognition={a.recognition}
                  alg={a.alg}
                  fingertricks={a.fingertricks}
                  stickering={STAGE_STICKERINGS.cmll}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {tab === "eolr" && (
        <section className="algs-section">
          <h2 className="algs-group-title">
            EOLR · 邊定向 + UL/UR <span>{EOLR_CASES.length} 條</span>
          </h2>
          <div className="algs-grid">
            {EOLR_CASES.map((c) => (
              <AlgCard
                key={c.id}
                title={c.id}
                badge={`${c.badEdges} 壞邊`}
                recognition={c.recognition}
                alg={c.alg}
                fingertricks={c.fingertricks}
                stickering={STAGE_STICKERINGS.lseEo}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
