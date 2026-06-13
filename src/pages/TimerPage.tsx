import { Timer } from "../components/Timer";
import "./TimerPage.css";

export default function TimerPage() {
  return (
    <div className="page">
      <div className="timer-page-header">
        <span className="eyebrow">WCA TIMER</span>
        <h1>計時器</h1>
        <p>按住空白鍵 300ms 後放開開始計時；任意鍵/觸碰停止</p>
      </div>
      <Timer />
    </div>
  );
}
