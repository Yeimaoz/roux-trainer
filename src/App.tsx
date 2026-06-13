import { lazy, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const Learn = lazy(() => import("./pages/Learn"));
const Trainer = lazy(() => import("./pages/Trainer"));
const Algs = lazy(() => import("./pages/Algs"));
const TimerPage = lazy(() => import("./pages/TimerPage"));
const Smoke = lazy(() => import("./pages/Smoke"));
const Advanced = lazy(() => import("./pages/Advanced"));

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div className="page">載入中…</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="learn" element={<Learn />} />
            <Route path="trainer" element={<Trainer />} />
            <Route path="algs" element={<Algs />} />
            <Route path="timer" element={<TimerPage />} />
            <Route path="advanced" element={<Advanced />} />
            <Route path="smoke" element={<Smoke />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
