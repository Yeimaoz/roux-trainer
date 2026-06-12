import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/roux-trainer/",
  plugins: [react()],
  optimizeDeps: {
    // cubing.js 內部以 URL 動態 spawn worker，esbuild 預打包會弄壞 worker 路徑
    exclude: ["cubing"],
  },
  build: {
    // preload helper 會在 worker entry chunk 裡碰 document，炸掉 cubing.js 的
    // scramble worker（Module worker instantiation failed）
    modulePreload: false,
  },
});
