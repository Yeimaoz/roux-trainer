// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { loadSessions, saveSessions, newSession } from "../../src/lib/timer/storage";

beforeEach(() => localStorage.clear());

describe("session storage v1", () => {
  it("round-trip 一致", () => {
    const ses = newSession("測試");
    ses.solves.push({ id: "a", ms: 9000, scramble: "R U", ts: 1, penalty: null });
    saveSessions([ses]);
    expect(loadSessions()).toEqual([ses]);
  });
  it("空 storage → 一個預設 session", () => {
    expect(loadSessions().length).toBe(1);
  });
  it("壞 JSON → 不炸回預設", () => {
    localStorage.setItem("roux-trainer:sessions:v1", "{oops");
    expect(loadSessions().length).toBe(1);
  });
});
