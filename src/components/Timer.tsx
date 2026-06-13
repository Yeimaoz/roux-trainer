/**
 * Timer.tsx — WCA 計時器核心元件
 *
 * 狀態機：idle → armed(空白鍵按住 300ms) → running(放開起跑) → stopped
 * inspection：15s 倒數，>15s → +2，>17s → DNF
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { CubeViewer } from "./CubeViewer";
import { newWcaScramble } from "../lib/scramble";
import {
  loadSessions,
  saveSessions,
  newSession,
  type Session,
} from "../lib/timer/storage";
import {
  aoN,
  best,
  sessionMean,
  formatMs,
  type Solve,
} from "../lib/timer/stats";
import "./Timer.css";

// ── 狀態機型別 ──────────────────────────────────────────────────────────────
type TimerState = "idle" | "inspection" | "armed" | "running" | "stopped";

// ── 唯一 id 產生 ─────────────────────────────────────────────────────────────
let _idCnt = 0;
const uid = () => `${Date.now().toString(36)}-${(_idCnt++).toString(36)}`;

// ── 工具：penalty 循環 ─────────────────────────────────────────────────────
function cyclePenalty(p: Solve["penalty"]): Solve["penalty"] {
  if (p === null) return "+2";
  if (p === "+2") return "DNF";
  return null;
}

// ── 工具：格式化 inspection ────────────────────────────────────────────────
function fmtInspection(ms: number): string {
  const s = Math.ceil(ms / 1000);
  if (s <= 0) return "0";
  return `${s}`;
}

// ─────────────────────────────────────────────────────────────────────────────
export function Timer() {
  // -- sessions -----------------------------------------------------------------
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState<string>(
    () => loadSessions()[0].id
  );

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? sessions[0];
  const solves = activeSession?.solves ?? [];

  const persistSessions = useCallback((updated: Session[]) => {
    setSessions(updated);
    saveSessions(updated);
  }, []);

  // -- scramble -----------------------------------------------------------------
  const [scramble, setScramble] = useState<string>("");
  const [scrambleLoading, setScrambleLoading] = useState(true);
  const prefetchRef = useRef<Promise<string> | null>(null);

  const fetchScramble = useCallback(async (): Promise<string> => {
    const s = await newWcaScramble();
    return s;
  }, []);

  // 初次 + 完成一筆後換 scramble，背景預抓一條備用
  const advanceScramble = useCallback(async () => {
    setScrambleLoading(true);
    let next: string;
    if (prefetchRef.current) {
      try {
        next = await prefetchRef.current;
      } catch {
        next = await fetchScramble();
      }
    } else {
      next = await fetchScramble();
    }
    setScramble(next);
    setScrambleLoading(false);
    // 預抓下一條
    prefetchRef.current = fetchScramble();
  }, [fetchScramble]);

  useEffect(() => {
    advanceScramble();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // -- inspection 開關 ----------------------------------------------------------
  const [inspectionEnabled, setInspectionEnabled] = useState(false);

  // -- 計時器狀態機 -------------------------------------------------------------
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [displayMs, setDisplayMs] = useState(0);
  const [inspectionRemainMs, setInspectionRemainMs] = useState(15000);

  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);
  const inspectionStartRef = useRef<number>(0);
  const armedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentScrambleRef = useRef<string>("");

  // 同步最新 scramble 到 ref（避免閉包過舊）
  useEffect(() => {
    currentScrambleRef.current = scramble;
  }, [scramble]);

  // -- rAF 計時迴圈 (running) ---------------------------------------------------
  const startRunningRaf = useCallback(() => {
    startTsRef.current = performance.now();
    const tick = () => {
      setDisplayMs(performance.now() - startTsRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // -- rAF inspection 倒數 -------------------------------------------------------
  const startInspectionRaf = useCallback(() => {
    inspectionStartRef.current = performance.now();
    const TOTAL = 15000;
    const tick = () => {
      const elapsed = performance.now() - inspectionStartRef.current;
      const remain = TOTAL - elapsed;
      setInspectionRemainMs(remain);
      if (remain > -2000) {
        rafRef.current = requestAnimationFrame(tick);
      }
      // >17s = DNF，inspection rAF 自動停（stopTimer 會補做）
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // -- stop：記錄 solve ---------------------------------------------------------
  const stopTimer = useCallback(() => {
    stopRaf();
    const elapsed = performance.now() - startTsRef.current;
    setDisplayMs(elapsed);
    setTimerState("stopped");

    // 計算 penalty（若 inspection 超時）
    const inspectionElapsed = inspectionEnabled
      ? performance.now() - inspectionStartRef.current
      : 0;
    let penalty: Solve["penalty"] = null;
    if (inspectionEnabled) {
      if (inspectionElapsed > 17000) penalty = "DNF";
      else if (inspectionElapsed > 15000) penalty = "+2";
    }

    const solve: Solve = {
      id: uid(),
      ms: Math.round(elapsed),
      scramble: currentScrambleRef.current,
      ts: Date.now(),
      penalty,
    };

    // 寫入 session
    setSessions((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        return { ...s, solves: [...s.solves, solve] };
      });
      saveSessions(updated);
      return updated;
    });

    // 換下一條 scramble
    advanceScramble();
  }, [stopRaf, inspectionEnabled, activeSessionId, advanceScramble]);

  // -- keydown/keyup/touch 處理 --------------------------------------------------

  // 按住多久後放開
  const pressStartRef = useRef<number>(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (e.repeat) return;

        if (timerState === "running") {
          stopTimer();
          return;
        }
        if (timerState === "stopped" || timerState === "idle") {
          if (inspectionEnabled) {
            setTimerState("inspection");
            setInspectionRemainMs(15000);
            startInspectionRaf();
            return;
          }
          pressStartRef.current = performance.now();
          setTimerState("armed");
          return;
        }
        if (timerState === "inspection") {
          pressStartRef.current = performance.now();
          setTimerState("armed");
          stopRaf();
          return;
        }
      } else {
        // 非空白鍵，只在 running 時 stop
        if (timerState === "running") {
          stopTimer();
        }
      }
    },
    [timerState, stopTimer, inspectionEnabled, startInspectionRaf, stopRaf]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (timerState === "armed") {
        const held = performance.now() - pressStartRef.current;
        if (held >= 300) {
          // 300ms 滿 → 起跑
          setTimerState("running");
          startRunningRaf();
        } else {
          // 不足 → 取消
          setTimerState("idle");
        }
      }
    },
    [timerState, startRunningRaf]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // -- 觸控 (touchstart/touchend) -----------------------------------------------
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (timerState === "running") {
        stopTimer();
        return;
      }
      if (timerState === "stopped" || timerState === "idle") {
        if (inspectionEnabled) {
          setTimerState("inspection");
          setInspectionRemainMs(15000);
          startInspectionRaf();
          return;
        }
        pressStartRef.current = performance.now();
        setTimerState("armed");
        return;
      }
      if (timerState === "inspection") {
        pressStartRef.current = performance.now();
        setTimerState("armed");
        stopRaf();
        return;
      }
    },
    [timerState, stopTimer, inspectionEnabled, startInspectionRaf, stopRaf]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (timerState === "armed") {
        const held = performance.now() - pressStartRef.current;
        if (held >= 300) {
          setTimerState("running");
          startRunningRaf();
        } else {
          setTimerState("idle");
        }
      }
    },
    [timerState, startRunningRaf]
  );

  // inspection 超時自動處理（>17s = DNF，>15s 視覺警告由 CSS 處理）
  useEffect(() => {
    if (timerState !== "inspection") return;
    if (inspectionRemainMs < -2000) {
      // >17s → DNF，直接停止計時
      stopRaf();
      setTimerState("stopped");
      setDisplayMs(0);
      const solve: Solve = {
        id: uid(),
        ms: 0,
        scramble: currentScrambleRef.current,
        ts: Date.now(),
        penalty: "DNF",
      };
      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id !== activeSessionId ? s : { ...s, solves: [...s.solves, solve] }
        );
        saveSessions(updated);
        return updated;
      });
      advanceScramble();
    }
  }, [timerState, inspectionRemainMs, stopRaf, activeSessionId, advanceScramble]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      stopRaf();
      if (armedTimerRef.current) clearTimeout(armedTimerRef.current);
    };
  }, [stopRaf]);

  // -- 統計計算 -----------------------------------------------------------------
  const statsAo5 = aoN(solves, 5);
  const statsAo12 = aoN(solves, 12);
  const statsAo100 = aoN(solves, 100);
  const statsBest = best(solves);
  const statsMean = sessionMean(solves);
  const statsLast = solves.length ? solves[solves.length - 1] : null;

  // -- penalty 點擊循環 ---------------------------------------------------------
  const cycleSolvePenalty = useCallback(
    (solveId: string) => {
      setSessions((prev) => {
        const updated = prev.map((s) => {
          if (s.id !== activeSessionId) return s;
          return {
            ...s,
            solves: s.solves.map((sv) =>
              sv.id === solveId
                ? { ...sv, penalty: cyclePenalty(sv.penalty) }
                : sv
            ),
          };
        });
        saveSessions(updated);
        return updated;
      });
    },
    [activeSessionId]
  );

  // -- 刪除 solve ---------------------------------------------------------------
  const deleteSolve = useCallback(
    (solveId: string) => {
      setSessions((prev) => {
        const updated = prev.map((s) => {
          if (s.id !== activeSessionId) return s;
          return { ...s, solves: s.solves.filter((sv) => sv.id !== solveId) };
        });
        saveSessions(updated);
        return updated;
      });
    },
    [activeSessionId]
  );

  // -- 新增 session ---------------------------------------------------------------
  const addSession = useCallback(() => {
    const name = prompt("新 Session 名稱", `Session ${sessions.length + 1}`);
    if (!name) return;
    const s = newSession(name);
    const updated = [...sessions, s];
    persistSessions(updated);
    setActiveSessionId(s.id);
  }, [sessions, persistSessions]);

  // -- 顯示計算 -----------------------------------------------------------------
  // 計時顯示文字
  let displayLabel: string;
  let displayClass = "";
  if (timerState === "armed") {
    displayLabel = "READY";
    displayClass = "armed";
  } else if (timerState === "inspection") {
    displayLabel = fmtInspection(inspectionRemainMs);
    displayClass = inspectionRemainMs <= 0 ? "danger" : inspectionRemainMs < 3000 ? "warn" : "";
  } else if (timerState === "running") {
    displayLabel = formatMs(displayMs);
    displayClass = "running";
  } else {
    displayLabel = formatMs(displayMs);
    displayClass = timerState === "stopped" ? "stopped" : "";
  }

  const mainAreaClass = [
    "timer-main",
    timerState === "armed" ? "armed" : "",
    timerState === "running" ? "running" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inspectionClass = [
    "timer-inspection",
    timerState === "inspection" && inspectionRemainMs <= 0 ? "danger" : "",
    timerState === "inspection" && inspectionRemainMs > 0 && inspectionRemainMs < 3000
      ? "warn"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="timer-root">
      {/* ── 打亂列 ── */}
      <div className="timer-scramble-bar">
        <span className={`timer-scramble-text${scrambleLoading ? " loading" : ""}`}>
          {scrambleLoading ? "產生打亂中…" : scramble}
        </span>
        {!scrambleLoading && scramble && (
          <div className="timer-scramble-cube">
            <CubeViewer alg={scramble} size={88} />
          </div>
        )}
      </div>

      {/* ── 計時主區 ── */}
      <div
        className={mainAreaClass}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="button"
        tabIndex={-1}
        aria-label="計時區（長按空白鍵或長按此區域計時）"
      >
        {/* inspection 模式倒數提示 */}
        {timerState === "inspection" && (
          <div className={inspectionClass}>
            Inspection {fmtInspection(inspectionRemainMs)}s
          </div>
        )}

        {/* 主計時數字 */}
        <div className={`timer-display${displayClass ? ` ${displayClass}` : ""}`}>
          {timerState === "inspection" ? (
            <span style={{ fontSize: "clamp(2.4rem,8vw,4rem)", color: "var(--c-yellow)" }}>
              {fmtInspection(inspectionRemainMs)}
            </span>
          ) : (
            displayLabel
          )}
        </div>

        {/* 操作提示 */}
        {timerState === "idle" && (
          <p className="timer-hint">按住空白鍵（或長按此區）300ms 後放開開始計時</p>
        )}
        {timerState === "stopped" && (
          <p className="timer-hint">任意鍵 / 觸碰 → 繼續</p>
        )}
        {timerState === "running" && (
          <p className="timer-hint">任意鍵 / 觸碰停止</p>
        )}
      </div>

      {/* ── inspection 開關 ── */}
      <label className="timer-inspection-toggle">
        <input
          type="checkbox"
          checked={inspectionEnabled}
          onChange={(e) => {
            if (timerState === "idle" || timerState === "stopped") {
              setInspectionEnabled(e.target.checked);
              setTimerState("idle");
            }
          }}
        />
        <span>Inspection 15s（WCA 規則）</span>
      </label>

      {/* ── 統計欄 ── */}
      <div className="timer-stats">
        {[
          { label: "single", value: formatMs(statsLast ? statsLast.ms + (statsLast.penalty === "+2" ? 2000 : 0) : null) },
          { label: "best", value: formatMs(statsBest) },
          { label: "ao5", value: formatMs(statsAo5) },
          { label: "ao12", value: formatMs(statsAo12) },
          { label: "ao100", value: formatMs(statsAo100) },
          { label: "mean", value: formatMs(statsMean) },
        ].map(({ label, value }) => (
          <div key={label} className="timer-stat-cell">
            <span className="timer-stat-label">{label}</span>
            <span className={`timer-stat-value${value === "—" ? "" : " highlight"}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* ── 紀錄列表 ── */}
      <div>
        <div className="timer-history-header">
          <h3 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-dim)" }}>
            紀錄（{solves.length} 筆）
          </h3>
          <div className="timer-session-controls">
            <select
              className="timer-session-select"
              value={activeSessionId}
              onChange={(e) => setActiveSessionId(e.target.value)}
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button className="btn" onClick={addSession} style={{ fontSize: "0.82rem" }}>
              + 新 Session
            </button>
          </div>
        </div>

        <div className="timer-history" style={{ marginTop: "var(--sp-2)" }}>
          {solves.length === 0 && (
            <p style={{ color: "var(--text-faint)", fontSize: "0.85rem", padding: "var(--sp-4)" }}>
              尚無紀錄
            </p>
          )}
          {[...solves].reverse().map((sv, revIdx) => {
            const idx = solves.length - revIdx;
            const timeDisplay =
              sv.penalty === "DNF"
                ? "DNF"
                : sv.penalty === "+2"
                ? `${formatMs(sv.ms + 2000)}+`
                : formatMs(sv.ms);
            const timeClass = [
              "timer-history-time",
              sv.penalty === "DNF" ? "dnf" : "",
              sv.penalty === "+2" ? "plus2" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div key={sv.id} className="timer-history-item">
                <span className="timer-history-num">{idx}</span>
                <span
                  className={timeClass}
                  onClick={() => cycleSolvePenalty(sv.id)}
                  title="點擊循環 +2/DNF"
                >
                  {timeDisplay}
                </span>
                <span className="timer-history-scramble">{sv.scramble}</span>
                <button
                  className="timer-history-del"
                  onClick={() => deleteSolve(sv.id)}
                  aria-label="刪除此紀錄"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
