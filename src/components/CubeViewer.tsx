import { useEffect, useRef } from "react";
import { TwistyPlayer } from "cubing/twisty";

export interface CubeViewerProps {
  /** 主 alg（可播放） */
  alg?: string;
  /** 前置打亂（題目狀態） */
  setupAlg?: string;
  /**
   * cubing.js 內建命名 stickering（見 data/stickering.ts STAGE_STICKERINGS）。
   * 注意：自訂 experimentalStickeringMaskOrbits 在 0.63 有 boot 時序雷，不要用。
   */
  stickering?: string;
  visualization?: "3D" | "2D";
  controls?: boolean;
  autoplay?: boolean;
  /** 寬高 px */
  size?: number;
}

export function CubeViewer({
  alg = "",
  setupAlg = "",
  stickering,
  visualization = "3D",
  controls = false,
  autoplay = false,
  size = 240,
}: CubeViewerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const player = new TwistyPlayer({
      puzzle: "3x3x3",
      // 空字串會讓 0.63 的 3D 渲染整顆消失（實測），只傳非空值
      ...(alg ? { alg } : {}),
      ...(setupAlg ? { experimentalSetupAlg: setupAlg } : {}),
      hintFacelets: "none",
      backView: "none",
      background: "none",
      controlPanel: controls ? "bottom-row" : "none",
      visualization: visualization === "2D" ? "2D" : "3D",
      ...(stickering ? { experimentalStickering: stickering } : {}),
    });
    player.style.width = `${size}px`;
    player.style.height = `${size}px`;
    container.appendChild(player);
    if (autoplay) player.play();
    return () => {
      player.remove();
    };
  }, [alg, setupAlg, stickering, visualization, controls, autoplay, size]);

  return <div ref={ref} style={{ width: size, height: size }} />;
}
