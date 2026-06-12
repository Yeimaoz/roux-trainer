import { useEffect, useRef, useState } from "react";
import { randomScrambleForEvent } from "cubing/scramble";
import { TwistyPlayer } from "cubing/twisty";

// M1 smoke test 元件：驗證 cubing.js 出題 + twisty-player 在 Vite 下可用。
// 後續會被正式路由/頁面取代。
export default function App() {
  const viewerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);
  const [scramble, setScramble] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const container = viewerRef.current;
    if (!container) return;
    const player = new TwistyPlayer({
      puzzle: "3x3x3",
      hintFacelets: "none",
      backView: "top-right",
      background: "none",
    });
    playerRef.current = player;
    container.appendChild(player);
    return () => {
      player.remove();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    randomScrambleForEvent("333")
      .then((alg) => {
        if (cancelled) return;
        const s = alg.toString();
        setScramble(s);
        if (playerRef.current) playerRef.current.alg = s;
        setStatus("ready");
      })
      .catch((e) => {
        if (cancelled) return;
        setError(String(e));
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main data-status={status} style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>橋式解法教室 — M1 Smoke Test</h1>
      <p id="scramble-output" style={{ fontSize: 20, fontWeight: 600 }}>
        {status === "loading" && "出題中…"}
        {status === "ready" && scramble}
        {status === "error" && `錯誤：${error}`}
      </p>
      <div ref={viewerRef} style={{ width: 480, height: 360 }} />
    </main>
  );
}
