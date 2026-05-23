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
  onOpenDict,
  uiLang,
  setUiLang,
  onExportProgress,
  onImportProgress,
  t
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
              {t("logoTitle")}
              <span>{t("logoSubtitle")}</span>
            </h1>
          </div>

          {/* Academic Selectors (Mode and Level) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Toggle between Simplified and Traditional */}
            <div className="toggle-group" title={t("sidebarTitle")}>
              <button
                className={`toggle-btn ${mode === "simplified" ? "active" : ""}`}
                onClick={() => setMode("simplified")}
              >
                {t("modeSimplified")}
              </button>
              <button
                className={`toggle-btn ${mode === "traditional" ? "active" : ""}`}
                onClick={() => setMode("traditional")}
              >
                {t("modeTraditional")}
              </button>
            </div>

            {/* Toggle Level 1 to 6 */}
            <div className="toggle-group" title={t("levelTitle")}>
              <button
                className={`toggle-btn ${selectedLevel === 1 ? "active" : ""}`}
                onClick={() => setSelectedLevel(1)}
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {mode === "simplified" ? "HSK 1" : "TOCFL 1"}
              </button>
              <button
                className={`toggle-btn ${selectedLevel === 2 ? "active" : ""}`}
                onClick={() => setSelectedLevel(2)}
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {mode === "simplified" ? "HSK 2" : "TOCFL 2"}
              </button>
              <button
                className={`toggle-btn ${selectedLevel === 3 ? "active" : ""}`}
                onClick={() => setSelectedLevel(3)}
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {mode === "simplified" ? "HSK 3" : "TOCFL 3"}
              </button>
              <button
                className={`toggle-btn ${selectedLevel === 4 ? "active" : ""}`}
                onClick={() => setSelectedLevel(4)}
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {mode === "simplified" ? "HSK 4" : "TOCFL 4"}
              </button>
              <button
                className={`toggle-btn ${selectedLevel === 5 ? "active" : ""}`}
                onClick={() => setSelectedLevel(5)}
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {mode === "simplified" ? "HSK 5" : "TOCFL 5"}
              </button>
              <button
                className={`toggle-btn ${selectedLevel === 6 ? "active" : ""}`}
                onClick={() => setSelectedLevel(6)}
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {mode === "simplified" ? "HSK 6" : "TOCFL 6"}
              </button>
            </div>
          </div>

          {/* Gamified Stats */}
          <div className="stats-container">
            <div className="stat-item stat-streak" title={t("streakTitle")}>
              🔥 <span>{streak}</span> {t("streak")}
            </div>
            
            <div className="stat-item stat-xp" title={t("xpTitle")}>
              ✨ <span>{xp}</span> XP
            </div>

            <div className="stat-item stat-level" title={t("levelTitle")}>
              🏆 Lvl <span>{level}</span>
            </div>

            {/* Language Switcher selector */}
            <select
              value={uiLang}
              onChange={(e) => setUiLang(e.target.value)}
              className="ui-lang-select glass-select"
              title="Chọn ngôn ngữ hiển thị / Change UI Language"
            >
              <option value="vi">🇻🇳 Tiếng Việt</option>
              <option value="zh-CN">🇨🇳 简体中文</option>
              <option value="zh-TW">🇹🇼 繁體中文</option>
            </select>

            {/* Sound controls */}
            <button
              className="util-btn"
              onClick={() => setSoundOn(!soundOn)}
              title={soundOn ? t("soundOff") : t("soundOn")}
            >
              {soundOn ? "🔊" : "🔇"}
            </button>

            {/* Dictionary Button */}
            <button
              className="util-btn"
              onClick={onOpenDict}
              title={t("dictTitle")}
              style={{ background: "rgba(20, 184, 166, 0.15)", borderColor: "rgba(20, 184, 166, 0.3)" }}
            >
              🔍
            </button>

            {/* Help Button */}
            <button
              className="util-btn"
              onClick={onOpenHelp}
              title={t("helpTitle")}
            >
              ❓
            </button>

            {/* Backup Progress */}
            <button
              className="util-btn"
              onClick={onExportProgress}
              title={t("titleBackupExport")}
              style={{ background: "rgba(34, 197, 94, 0.15)", borderColor: "rgba(34, 197, 94, 0.3)" }}
            >
              💾
            </button>

            {/* Restore Progress */}
            <label
              className="util-btn"
              title={t("titleBackupImport")}
              style={{ background: "rgba(168, 85, 247, 0.15)", borderColor: "rgba(168, 85, 247, 0.3)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", margin: 0 }}
            >
              📂
              <input
                type="file"
                accept=".json"
                onChange={onImportProgress}
                style={{ display: "none" }}
              />
            </label>
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
