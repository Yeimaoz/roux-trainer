import type { Solve } from "./stats";
export interface Session { id: string; name: string; createdAt: number; solves: Solve[] }
const KEY = "roux-trainer:sessions:v1";
let counter = 0;
const uid = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

export const newSession = (name: string): Session =>
  ({ id: uid(), name, createdAt: Date.now(), solves: [] });

export function saveSessions(list: Session[]): void {
  localStorage.setItem(KEY, JSON.stringify({ sessions: list }));
}
export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.sessions) && parsed.sessions.length) return parsed.sessions;
    }
  } catch { /* 壞資料 → 預設（讀取兜底有正當理由：使用者資料毀損不應讓站掛掉） */ }
  return [newSession("Session 1")];
}
