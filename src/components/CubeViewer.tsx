import { useEffect, useRef } from "react";
import { TwistyPlayer } from "cubing/twisty";

export interface CubeViewerProps {
  /** 主 alg（可播放） */
  alg?: string;
  /** 前置打亂（題目狀態） */
  setupAlg?: string;
  /** experimentalStickeringMaskOrbits 字串（見 data/stickering.ts） */
  mask?: string;
  visualization?: "3D" | "2D";
  controls?: boolean;
  autoplay?: boolean;
  /** 寬高 px */
  size?: number;
}

export function CubeViewer({
  alg = "",
  setupAlg = "",
  mask,
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
      alg,
      experimentalSetupAlg: setupAlg,
      hintFacelets: "none",
      backView: "none",
      background: "none",
      controlPanel: controls ? "bottom-row" : "none",
      visualization: visualization === "2D" ? "2D" : "3D",
      ...(mask ? { experimentalStickeringMaskOrbits: mask } : {}),
    });
    player.style.width = `${size}px`;
    player.style.height = `${size}px`;
    container.appendChild(player);
    if (autoplay) player.play();
    return () => {
      player.remove();
    };
  }, [alg, setupAlg, mask, visualization, controls, autoplay, size]);

  return <div ref={ref} style={{ width: size, height: size }} />;
}
