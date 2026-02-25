import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const POEMS = [
  "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。",
  "海上生明月，天涯共此时。",
  "山重水复疑无路，柳暗花明又一村。",
  "路漫漫其修远兮，吾将上下而求索。",
  "众里寻他千百度，蓦然回首，那人却在灯火阑珊处。",
  "落霞与孤鹜齐飞，秋水共长天一色。",
  "人生若只如初见，何事秋风悲画扇。",
];

export default function NotFoundView() {
  const [seconds, setSeconds] = useState(10);
  const [poem, setPoem] = useState("正在寻找诗意的远方...");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://v2.xxapi.cn/api/yiyan?type=hitokoto")
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setPoem(data.data);
        } else {
          setPoem(POEMS[Math.floor(Math.random() * POEMS.length)]);
        }
      })
      .catch(() => {
        setPoem(POEMS[Math.floor(Math.random() * POEMS.length)]);
      });
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      navigate("/");
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, navigate]);

  const goHome = () => {
    navigate("/");
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <div className="notfound-page">
        {/* 动态球体背景 */}
        <div className="orb-container">
          <div className="orb orb-large orb-light" style={{ top: "10%", left: "10%" }} />
          <div className="orb orb-large orb-dark" style={{ top: "60%", left: "70%" }} />
          <div className="orb orb-medium orb-light" style={{ top: "30%", left: "50%" }} />
          <div className="orb orb-medium orb-dark" style={{ top: "70%", left: "20%" }} />
          <div className="orb orb-small orb-light" style={{ top: "20%", left: "80%" }} />
          <div className="orb orb-small orb-dark" style={{ top: "80%", left: "40%" }} />
        </div>

        {/* 磨砂玻璃遮罩层 */}
        <div className="frosted-overlay" />

        {/* 内容容器 */}
        <div className="content-box">
          <div className="corner-top-right" />
          <div className="corner-bottom-left" />

          <h1 className="notfound-title">
            <span>404</span>
          </h1>

          <div className="poem">{poem}</div>

          <div className="message">
            此路不通，即将引您重返人间
            <br />
            <span className="countdown">{seconds}</span>秒后自动跳转
          </div>

          <div className="admin-message">该页面被管理员刻意的禁止访问</div>

          <div className="action-buttons">
            <button onClick={goBack} className="action-btn back-btn">
              <ArrowLeft className="w-4 h-4" />
              返回上页
            </button>
            <button onClick={goHome} className="action-btn home-btn">
              <Home className="w-4 h-4" />
              返回首页
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .notfound-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 100px 20px;
          position: relative;
          overflow: hidden;
          background: var(--bg-primary);
        }

        /* 动态球体背景 */
        .orb-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.7;
        }

        .orb-large {
          width: 400px;
          height: 400px;
        }

        .orb-medium {
          width: 250px;
          height: 250px;
        }

        .orb-small {
          width: 150px;
          height: 150px;
        }

        .orb-light {
          background: var(--accent-color);
          opacity: 0.3;
        }

        .orb-dark {
          background: var(--accent-hover);
          opacity: 0.3;
        }

        .orb:nth-child(1) {
          animation: orb-move-1 25s infinite ease-in-out;
        }
        .orb:nth-child(2) {
          animation: orb-move-2 30s infinite ease-in-out;
        }
        .orb:nth-child(3) {
          animation: orb-move-3 20s infinite ease-in-out;
        }
        .orb:nth-child(4) {
          animation: orb-move-4 25s infinite ease-in-out;
        }
        .orb:nth-child(5) {
          animation: orb-move-5 15s infinite ease-in-out;
        }
        .orb:nth-child(6) {
          animation: orb-move-6 18s infinite ease-in-out;
        }

        @keyframes orb-move-1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(50vw, 25vh); }
          50% { transform: translate(30vw, 60vh); }
          75% { transform: translate(-20vw, 40vh); }
        }

        @keyframes orb-move-2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-30vw, 20vh); }
          66% { transform: translate(40vw, -10vh); }
        }

        @keyframes orb-move-3 {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(25vw, -15vh); }
          40% { transform: translate(-15vw, 30vh); }
          60% { transform: translate(10vw, 20vh); }
          80% { transform: translate(-30vw, -10vh); }
        }

        @keyframes orb-move-4 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-40vw, 10vh); }
          50% { transform: translate(20vw, -30vh); }
          75% { transform: translate(15vw, 25vh); }
        }

        @keyframes orb-move-5 {
          0%, 100% { transform: translate(0, 0); }
          30% { transform: translate(35vw, 15vh); }
          60% { transform: translate(-25vw, -20vh); }
        }

        @keyframes orb-move-6 {
          0%, 100% { transform: translate(0, 0); }
          40% { transform: translate(-15vw, 35vh); }
          80% { transform: translate(20vw, -15vh); }
        }

        /* 磨砂玻璃遮罩层 */
        .frosted-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--bg-secondary);
          backdrop-filter: blur(15px);
          opacity: 0.3;
          z-index: 1;
          pointer-events: none;
        }

        /* 内容容器 */
        .content-box {
          position: relative;
          width: 90%;
          max-width: 600px;
          padding: 40px;
          background: var(--bg-card);
          border-radius: 16px;
          box-shadow: 0 10px 40px var(--shadow-color);
          text-align: center;
          z-index: 2;
          border: 1px solid var(--border-color);
        }

        /* 四个角装饰 */
        .content-box::before,
        .content-box::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--accent-color);
          opacity: 0.5;
          z-index: 3;
        }

        .content-box::before {
          top: 10px;
          left: 10px;
          border-right: none;
          border-bottom: none;
        }

        .content-box::after {
          bottom: 10px;
          right: 10px;
          border-left: none;
          border-top: none;
        }

        .corner-top-right,
        .corner-bottom-left {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--accent-color);
          opacity: 0.5;
          z-index: 3;
        }

        .corner-top-right {
          top: 10px;
          right: 10px;
          border-left: none;
          border-bottom: none;
        }

        .corner-bottom-left {
          bottom: 10px;
          left: 10px;
          border-right: none;
          border-top: none;
        }

        .notfound-title {
          font-size: 4rem;
          margin-bottom: 20px;
          color: var(--accent-color);
          font-weight: 300;
          letter-spacing: 8px;
        }

        .poem {
          font-size: 1.2rem;
          line-height: 1.8;
          margin: 30px 0;
          padding: 20px;
          font-style: italic;
          color: var(--text-secondary);
          border-left: 3px solid var(--accent-color);
          text-align: left;
          background: var(--border-color);
          border-radius: 0 8px 8px 0;
        }

        .message {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-top: 30px;
          line-height: 1.8;
        }

        .countdown {
          font-weight: bold;
          color: var(--accent-color);
          font-size: 1.2rem;
        }

        .admin-message {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 15px;
          font-style: italic;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 30px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .back-btn {
          background: var(--border-color);
          color: var(--text-secondary);
        }

        .back-btn:hover {
          background: var(--text-muted);
          color: white;
          transform: translateY(-2px);
        }

        .home-btn {
          background: var(--accent-color);
          color: white;
        }

        .home-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px var(--shadow-color);
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .notfound-page {
            padding: 80px 16px 140px 16px;
          }

          .notfound-title {
            font-size: 2.5rem;
          }

          .poem {
            font-size: 1rem;
            padding: 15px;
          }

          .message {
            font-size: 0.9rem;
          }

          .action-buttons {
            flex-direction: column;
            gap: 12px;
          }

          .action-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .notfound-title {
            font-size: 2rem;
          }

          .content-box {
            padding: 30px 20px;
          }

          .poem {
            font-size: 0.9rem;
            margin: 20px 0;
            padding: 12px;
          }

          .message {
            font-size: 0.85rem;
            margin-top: 20px;
          }

          .admin-message {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
