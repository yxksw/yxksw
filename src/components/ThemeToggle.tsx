import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="#eab308"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"
    />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="#0284c7"
      strokeDasharray="56"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 6c0 6.08 4.92 11 11 11c0.53 0 1.05 -0.04 1.56 -0.11c-1.61 2.47 -4.39 4.11 -7.56 4.11c-4.97 0 -9 -4.03 -9 -9c0 -3.17 1.64 -5.95 4.11 -7.56c-0.07 0.51 -0.11 1.03 -0.11 1.56Z"
    >
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="56;0" />
    </path>
    <g fill="#0284c7">
      <path d="M15.22 6.03l2.53 -1.94l-3.19 -0.09l-1.06 -3l-1.06 3l-3.19 0.09l2.53 1.94l-0.91 3.06l2.63 -1.81l2.63 1.81l-0.91 -3.06Z" opacity="0">
        <animate fill="freeze" attributeName="opacity" begin="0.7s" dur="0.4s" to="1" />
      </path>
      <path d="M19.61 12.25l1.64 -1.25l-2.06 -0.05l-0.69 -1.95l-0.69 1.95l-2.06 0.05l1.64 1.25l-0.59 1.98l1.7 -1.17l1.7 1.17l-0.59 -1.98Z" opacity="0">
        <animate fill="freeze" attributeName="opacity" begin="1.1s" dur="0.4s" to="1" />
      </path>
    </g>
  </svg>
);

const SystemIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="#ea580c"
      strokeWidth="2"
      d="M1 19h22V1H1zm4 4h14zm3 0h8v-4H8zM7.757 5.757l2.122 2.122zM9 10H6zm.879 2.121l-2.122 2.122zM12 13v3zm2.121-.879l2.122 2.122zM18 10h-3zm-1.757-4.243l-2.122 2.122zM12 7V4zm0 0a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z"
    />
  </svg>
);

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: "light" as const, icon: <SunIcon />, label: "明亮模式" },
    { value: "dark" as const, icon: <MoonIcon />, label: "深色模式" },
    { value: "system" as const, icon: <SystemIcon />, label: "跟随系统" },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[2];

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    setTheme(value);
    setIsOpen(false);
  };

  return (
    <div className="theme-toggle-container">
      <button
        className="theme-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="切换主题"
      >
        {currentTheme.icon}
      </button>

      {isOpen && (
        <>
          <div className="theme-toggle-overlay" onClick={() => setIsOpen(false)} />
          <div className="theme-toggle-menu">
            {themes.map((t) => (
              <button
                key={t.value}
                className={`theme-menu-item ${theme === t.value ? "active" : ""}`}
                onClick={() => handleThemeChange(t.value)}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <style>{`
        .theme-toggle-container {
          position: fixed;
          left: 20px;
          bottom: 120px;
          z-index: 1000;
        }

        .theme-toggle-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: var(--theme-toggle-bg, rgba(255, 255, 255, 0.9));
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .theme-toggle-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
        }

        .theme-toggle-overlay {
          position: fixed;
          inset: 0;
          z-index: -1;
        }

        .theme-toggle-menu {
          position: absolute;
          bottom: 60px;
          left: 0;
          background: var(--theme-menu-bg, rgba(255, 255, 255, 0.95));
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          padding: 8px;
          min-width: 140px;
          backdrop-filter: blur(10px);
          animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .theme-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: var(--theme-text, #333);
          transition: all 0.2s;
        }

        .theme-menu-item:hover {
          background: var(--theme-hover-bg, rgba(0, 0, 0, 0.05));
        }

        .theme-menu-item.active {
          background: var(--theme-active-bg, rgba(102, 126, 234, 0.1));
          color: #667eea;
        }

        :root.dark .theme-toggle-button {
          --theme-toggle-bg: rgba(30, 30, 40, 0.9);
        }

        :root.dark .theme-toggle-menu {
          --theme-menu-bg: rgba(30, 30, 40, 0.95);
          --theme-text: #e0e0e0;
          --theme-hover-bg: rgba(255, 255, 255, 0.1);
          --theme-active-bg: rgba(102, 126, 234, 0.2);
        }
      `}</style>
    </div>
  );
}
