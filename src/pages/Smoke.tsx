import { useEffect, useRef, useState } from "react";
import { randomScrambleForEvent } from "cubing/scramble";
import { TwistyPlayer } from "cubing/twisty";

// cubing.js 整合 canary（smoke-browser.mjs 驗證用）：出題 + 3D 渲染。
export default function Smoke() {
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
    <div className="page" data-status={status} id="smoke-root">
      <h1>Smoke Test</h1>
      <p id="scramble-output" className="alg">
        {status === "loading" && "出題中…"}
        {status === "ready" && scramble}
        {status === "error" && `錯誤：${error}`}
      </p>
      <div ref={viewerRef} style={{ width: 480, height: 360 }} />
    </div>
  );
}
