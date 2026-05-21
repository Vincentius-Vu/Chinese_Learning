import React from "react";

export default function Header({
  mode,
  setMode,
  xp,
  streak,
  level,
  soundOn,
  setSoundOn,
  selectedLevel,
  setSelectedLevel,
  onOpenHelp,
  onOpenDict
}) {
  // Calculate level progress (e.g. 100 XP per level)
  const progressPercent = xp % 100;

  return (
    <header className="header-glass">
      <div className="app-container">
        <div className="header-content">
          {/* Logo Section */}
          <div className="logo-wrapper">
            <span className="logo-icon">🐃</span>
            <h1 className="logo-title">
              Học Tiếng Trung
              <span>4 Kỹ năng · HSK & TOCFL</span>
            </h1>
          </div>

          {/* Academic Selectors (Mode and Level) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Toggle between Simplified and Traditional */}
            <div className="toggle-group" title="Chuyển đổi Hệ chữ">
              <button
                className={`toggle-btn ${mode === "simplified" ? "active" : ""}`}
                onClick={() => setMode("simplified")}
              >
                Giản thể (Simplified)
              </button>
              <button
                className={`toggle-btn ${mode === "traditional" ? "active" : ""}`}
                onClick={() => setMode("traditional")}
              >
                Phồn thể (Traditional)
              </button>
            </div>

            {/* Toggle Level 1 vs Level 2 vs Level 3 */}
            <div className="toggle-group" title="Chuyển đổi Cấp độ chuẩn">
              <button
                className={`toggle-btn ${selectedLevel === 1 ? "active" : ""}`}
                onClick={() => setSelectedLevel(1)}
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {mode === "simplified" ? "Cấp độ HSK 1" : "Cấp độ TOCFL 1"}
              </button>
              <button
                className={`toggle-btn ${selectedLevel === 2 ? "active" : ""}`}
                onClick={() => setSelectedLevel(2)}
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {mode === "simplified" ? "Cấp độ HSK 2" : "Cấp độ TOCFL 2"}
              </button>
              <button
                className={`toggle-btn ${selectedLevel === 3 ? "active" : ""}`}
                onClick={() => setSelectedLevel(3)}
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {mode === "simplified" ? "Cấp độ HSK 3" : "Cấp độ TOCFL 3"}
              </button>
              <button
                className={`toggle-btn ${selectedLevel === 4 ? "active" : ""}`}
                onClick={() => setSelectedLevel(4)}
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {mode === "simplified" ? "Cấp độ HSK 4" : "Cấp độ TOCFL 4"}
              </button>
              <button
                className={`toggle-btn ${selectedLevel === 5 ? "active" : ""}`}
                onClick={() => setSelectedLevel(5)}
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {mode === "simplified" ? "Cấp độ HSK 5" : "Cấp độ TOCFL 5"}
              </button>
              <button
                className={`toggle-btn ${selectedLevel === 6 ? "active" : ""}`}
                onClick={() => setSelectedLevel(6)}
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {mode === "simplified" ? "Cấp độ HSK 6" : "Cấp độ TOCFL 6"}
              </button>
            </div>
          </div>

          {/* Gamified Stats */}
          <div className="stats-container">
            <div className="stat-item stat-streak" title="Chuỗi ngày học liên tục của bạn">
              🔥 <span>{streak}</span> ngày
            </div>
            
            <div className="stat-item stat-xp" title="Điểm kinh nghiệm tích lũy">
              ✨ <span>{xp}</span> XP
            </div>

            <div className="stat-item stat-level" title="Cấp độ hiện tại">
              🏆 Cấp <span>{level}</span>
            </div>

            {/* Sound controls */}
            <button
              className="util-btn"
              onClick={() => setSoundOn(!soundOn)}
              title={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              {soundOn ? "🔊" : "🔇"}
            </button>

            {/* Dictionary Button */}
            <button
              className="util-btn"
              onClick={onOpenDict}
              title="Tra từ điển Hán-Việt"
              style={{ background: "rgba(20, 184, 166, 0.15)", borderColor: "rgba(20, 184, 166, 0.3)" }}
            >
              🔍
            </button>

            {/* Help Button */}
            <button
              className="util-btn"
              onClick={onOpenHelp}
              title="Hướng dẫn học tập"
            >
              ❓
            </button>
          </div>
        </div>

        {/* Level Progress Indicator */}
        <div className="level-progress-section">
          <div className="level-progress-bar">
            <div
              className="level-progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
}
