// 進階案例驗證骨架（authoring harness）。
// 對每個 {fb, sb}：setup=invert(fb+sb)，驗證
//   1) sb 只用 R/r/U/M 系 token
//   2) setup → fb 後 FB 五塊歸位
//   3) → sb 後 FB+SB 十塊歸位
// 用法：node tools/verify-cases.mjs（cwd = repo root）
import { cube3x3x3 } from "cubing/puzzles";
import { Alg } from "cubing/alg";

const kp = await cube3x3x3.kpuzzle();
const SOLVED_CENTERS = JSON.stringify(kp.defaultPattern().patternData["CENTERS"]);

const ROTATIONS = [
  "", "y", "y2", "y'", "x", "x y", "x y2", "x y'",
  "x2", "x2 y", "x2 y2", "x2 y'", "x'", "x' y", "x' y2", "x' y'",
  "z", "z y", "z y2", "z y'", "z'", "z' y", "z' y2", "z' y'",
];
function normalize(p) {
  for (const r of ROTATIONS) {
    const q = r === "" ? p : p.applyAlg(r);
    if (JSON.stringify(q.patternData["CENTERS"]) === SOLVED_CENTERS) return q;
  }
  throw new Error("centers unreachable");
}
const EDGE_ORDER = ["UF","UR","UB","UL","DF","DR","DB","DL","FR","FL","BR","BL"];
const CORNER_ORDER = ["UFR","URB","UBL","ULF","DRF","DFL","DLB","DBR"];
function solved(p, orbit, name) {
  const order = orbit === "EDGES" ? EDGE_ORDER : CORNER_ORDER;
  const i = order.indexOf(name);
  const d = p.patternData[orbit];
  return d.pieces[i] === i && d.orientation[i] === 0;
}
const FB = { e: ["DL","FL","BL"], c: ["DFL","DLB"] };
const SB = { e: ["DR","FR","BR"], c: ["DRF","DBR"] };
function fbHome(p) {
  const n = normalize(p);
  return FB.e.every((x) => solved(n, "EDGES", x)) && FB.c.every((x) => solved(n, "CORNERS", x));
}
function bothHome(p) {
  const n = normalize(p);
  return [...FB.e, ...SB.e].every((x) => solved(n, "EDGES", x)) &&
         [...FB.c, ...SB.c].every((x) => solved(n, "CORNERS", x));
}
const SB_TOKEN = /^[RrUM](2|')?$/;
function sbLegal(sb) {
  return sb.trim().split(/\s+/).filter(Boolean).every((t) => SB_TOKEN.test(t));
}
function invert(alg) {
  return new Alg(alg).invert().toString();
}
const count = (a) => (a.trim() ? a.trim().split(/\s+/).length : 0);

export function verifyCase(c) {
  const setup = invert(`${c.fb} ${c.sb}`.trim());
  const errs = [];
  if (!sbLegal(c.sb)) errs.push(`sb 非法 token: ${c.sb}`);
  const afterFb = kp.defaultPattern().applyAlg(setup).applyAlg(c.fb);
  if (!fbHome(afterFb)) errs.push("fb 後 FB 未歸位");
  const afterSb = afterFb.applyAlg(c.sb);
  if (!bothHome(afterSb)) errs.push("sb 後兩橋未歸位");
  return { id: c.id, setup, fbCount: count(c.fb), sbCount: count(c.sb), ok: errs.length === 0, errs };
}

// 若直接執行：驗證 CASES（可在此處填候選案例做 authoring）
if (import.meta.url === `file://${process.argv[1]}`) {
  const mod = await import("./candidate-cases.mjs").catch(() => ({ CASES: [] }));
  let pass = 0;
  for (const c of mod.CASES) {
    const r = verifyCase(c);
    console.log(`${r.ok ? "PASS" : "FAIL"} ${r.id}  fb=${r.fbCount} sb=${r.sbCount}  setup="${r.setup}"${r.ok ? "" : "  ⚠ " + r.errs.join("; ")}`);
    if (r.ok) pass++;
  }
  console.log(`\n${pass}/${mod.CASES.length} passed`);
}
