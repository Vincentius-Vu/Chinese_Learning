import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Mascot from "./components/Mascot";
import SkillWriting from "./components/SkillWriting";
import SkillReading from "./components/SkillReading";
import SkillListening from "./components/SkillListening";
import SkillSpeaking from "./components/SkillSpeaking";
import DictionaryModal from "./components/DictionaryModal";
import { translations } from "./data/translations";

export default function App() {
  // Global States (loaded from localStorage with safe default fallbacks)
  const [mode, setMode] = useState(() => localStorage.getItem("chinese_mode") || "simplified");
  const [activeSkill, setActiveSkill] = useState(() => localStorage.getItem("chinese_skill") || "writing");
  const [selectedLevel, setSelectedLevel] = useState(() => Number(localStorage.getItem("chinese_selected_level")) || 1);
  const [xp, setXp] = useState(() => Number(localStorage.getItem("chinese_xp")) || 0);
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("chinese_streak")) || 1);
  const [soundOn, setSoundOn] = useState(() => JSON.parse(localStorage.getItem("chinese_sound")) !== false);
  const [uiLang, setUiLang] = useState(() => localStorage.getItem("chinese_ui_lang") || "vi");

  useEffect(() => {
    localStorage.setItem("chinese_ui_lang", uiLang);
  }, [uiLang]);

  const t = (key) => (translations[uiLang] && translations[uiLang][key]) || key;
  
  // Custom Vocabulary State (stored locally)
  const [customWords, setCustomWords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chinese_custom_words")) || [];
    } catch (e) {
      return [];
    }
  });

  // Sync customWords with localStorage
  useEffect(() => {
    localStorage.setItem("chinese_custom_words", JSON.stringify(customWords));
  }, [customWords]);

  const handleAddCustomWord = (newWord) => {
    setCustomWords((prev) => [newWord, ...prev]);
  };

  const handleRemoveCustomWord = (wordId) => {
    setCustomWords((prev) => prev.filter((w) => w.id !== wordId));
  };
  
  // Mascot Speech Bubble and Mood Control
  const [mascotText, setMascotText] = useState("Chào mừng bạn! Hôm nay hãy cùng luyện tập Tiếng Trung thật vui nhé! 🐃");
  const [mascotExpression, setMascotExpression] = useState("neutral");

  // Help Modal state
  const [helpOpen, setHelpOpen] = useState(false);

  // Dictionary Lookup Modal and Jump States
  const [isDictOpen, setIsDictOpen] = useState(false);
  const [jumpedWordId, setJumpedWordId] = useState(null);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem("chinese_mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("chinese_skill", activeSkill);
  }, [activeSkill]);

  useEffect(() => {
    localStorage.setItem("chinese_selected_level", selectedLevel);
  }, [selectedLevel]);

  useEffect(() => {
    localStorage.setItem("chinese_xp", xp);
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("chinese_streak", streak);
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("chinese_sound", soundOn);
  }, [soundOn]);

  // Derived Level (100 XP per level)
  const currentLevel = Math.floor(xp / 100) + 1;

  // React to level changes (fixed level up edge-case when XP jumps dynamically)
  const prevLevelRef = useRef(currentLevel);
  useEffect(() => {
    if (currentLevel > prevLevelRef.current) {
      playSound("success");
      setMascotText(`Chúc mừng! Bạn đã tích lũy đủ XP và Tăng cấp lên Cấp độ ${currentLevel}! Cực kỳ xuất sắc! 🏆`);
      setMascotExpression("excited");
    }
    prevLevelRef.current = currentLevel;
  }, [currentLevel]);

  // Trigger speech updates on level selection
  useEffect(() => {
    const levelName = mode === "simplified" ? `HSK ${selectedLevel}` : `TOCFL ${selectedLevel}`;
    triggerMascotReaction(`Bạn vừa chuyển sang chương trình học cấp độ ${levelName}. Hãy cùng chinh phục các thử thách nhé! 🐃`, "happy");
  }, [selectedLevel, mode]);

  // Helper Web Audio API sound synthesizer
  const playSound = (type) => {
    if (!soundOn) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === "correct") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "wrong") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "success") {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.15, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.2);
        });
      }
    } catch (e) {
      console.error("Web Audio API error", e);
    }
  };

  // Helper callback to trigger water buffalo reactions from child components
  const triggerMascotReaction = (text, mood) => {
    setMascotText(text);
    setMascotExpression(mood);
  };

  // Helper to add XP points dynamically
  const [tempSoundState, setTempSoundState] = useState(soundOn); // Track sound changes
  const addXpPoints = (points) => {
    setXp((prev) => prev + points);
  };

  // Jump from Dictionary to SkillWriting Practice Canvas
  const handleJumpToWriting = (charObj) => {
    setActiveSkill("writing");
    setSelectedLevel(charObj.level);
    setJumpedWordId(charObj.id);
    
    // Auto-clear jumpedWordId to ensure subsequent clicks trigger the state dependency change correctly
    setTimeout(() => {
      setJumpedWordId(null);
    }, 100);

    playSound("correct");
    triggerMascotReaction(`Bạn đã chọn chữ "${charObj.simplified || charObj.traditional}". Hãy cùng tập viết nét chuẩn nhé! 🐃`, "excited");
  };

  // Renders active skill panel
  const renderSkillComponent = () => {
    switch (activeSkill) {
      case "writing":
        return (
          <SkillWriting
            mode={mode}
            selectedLevel={selectedLevel}
            addXp={addXpPoints}
            triggerMascot={triggerMascotReaction}
            playSound={playSound}
            streak={streak}
            customWords={customWords}
            onAddCustomWord={handleAddCustomWord}
            onRemoveCustomWord={handleRemoveCustomWord}
            autoSelectWordId={jumpedWordId}
          />
        );
      case "reading":
        return (
          <SkillReading
            mode={mode}
            selectedLevel={selectedLevel}
            addXp={addXpPoints}
            triggerMascot={triggerMascotReaction}
            playSound={playSound}
          />
        );
      case "listening":
        return (
          <SkillListening
            mode={mode}
            selectedLevel={selectedLevel}
            addXp={addXpPoints}
            triggerMascot={triggerMascotReaction}
            playSound={playSound}
            uiLang={uiLang}
            t={t}
          />
        );
      case "speaking":
        return (
          <SkillSpeaking
            mode={mode}
            selectedLevel={selectedLevel}
            addXp={addXpPoints}
            triggerMascot={triggerMascotReaction}
            playSound={playSound}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Dynamic Header Stats panel */}
      <Header
        mode={mode}
        setMode={setMode}
        xp={xp}
        streak={streak}
        level={currentLevel}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenDict={() => setIsDictOpen(true)}
        uiLang={uiLang}
        setUiLang={setUiLang}
        t={t}
      />

      <main className="app-container flex-spacer" style={{ width: "100%" }}>
        <div className="main-grid">
          {/* Sidebar Menu */}
          <aside className="sidebar-panel glass-panel">
            <h2 className="sidebar-title">{t("sidebarTitle")}</h2>
            
            <button
              className={`nav-card ${activeSkill === "writing" ? "active" : ""}`}
              onClick={() => setActiveSkill("writing")}
            >
              <span className="nav-icon">✍️</span> {t("navWriting")}
            </button>

            <button
              className={`nav-card ${activeSkill === "reading" ? "active" : ""}`}
              onClick={() => setActiveSkill("reading")}
            >
              <span className="nav-icon">📖</span> {t("navReading")}
            </button>

            <button
              className={`nav-card ${activeSkill === "listening" ? "active" : ""}`}
              onClick={() => setActiveSkill("listening")}
            >
              <span className="nav-icon">🎧</span> {t("navListening")}
            </button>

            <button
              className={`nav-card ${activeSkill === "speaking" ? "active" : ""}`}
              onClick={() => setActiveSkill("speaking")}
            >
              <span className="nav-icon">🗣️</span> {t("navSpeaking")}
            </button>
          </aside>

          {/* Interactive Playground */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Mascot interaction hub */}
            <Mascot speechText={mascotText} expression={mascotExpression} />

            {/* Core learning card content wrapper */}
            <div className="main-card glass-panel">
              <div className="card-header-bar">
                <div>
                  <h2 className="card-title">
                    {activeSkill === "writing" && t("cardTitleWriting")}
                    {activeSkill === "reading" && t("cardTitleReading")}
                    {activeSkill === "listening" && t("cardTitleListening")}
                    {activeSkill === "speaking" && t("cardTitleSpeaking")}
                  </h2>
                  <p className="card-subtitle">
                    {mode === "simplified" ? `${t("levelPrefix")} ${selectedLevel} · ${t("modeSimplified")}` : `${t("levelPrefix")} ${selectedLevel} · ${t("modeTraditional")}`}
                  </p>
                </div>
                <span className="theme-badge">
                  {activeSkill}
                </span>
              </div>

              {renderSkillComponent()}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-btn ${activeSkill === "writing" ? "active" : ""}`}
          onClick={() => setActiveSkill("writing")}
        >
          <span className="mobile-nav-icon">✍️</span>
          <span className="mobile-nav-label">{t("navWriting")}</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeSkill === "reading" ? "active" : ""}`}
          onClick={() => setActiveSkill("reading")}
        >
          <span className="mobile-nav-icon">📖</span>
          <span className="mobile-nav-label">{t("navReading")}</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeSkill === "listening" ? "active" : ""}`}
          onClick={() => setActiveSkill("listening")}
        >
          <span className="mobile-nav-icon">🎧</span>
          <span className="mobile-nav-label">{t("navListening")}</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeSkill === "speaking" ? "active" : ""}`}
          onClick={() => setActiveSkill("speaking")}
        >
          <span className="mobile-nav-icon">🗣️</span>
          <span className="mobile-nav-label">{t("navSpeaking")}</span>
        </button>
      </nav>

      {/* Modern Duolingo-style instructional modal */}
      {helpOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(30, 41, 59, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setHelpOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              background: "white",
              maxWidth: "500px",
              width: "100%",
              padding: "30px",
              position: "relative",
              animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setHelpOpen(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                border: "none",
                background: "transparent",
                fontSize: "1.4rem",
                cursor: "pointer",
                color: "hsl(var(--neutral-gray))"
              }}
            >
              &times;
            </button>

            <h3 style={{ fontWeight: 800, fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "10px", color: "hsl(var(--primary-teal-dark))", marginBottom: "20px" }}>
              🎨 Hướng dẫn Học Tiếng Trung 4 Kỹ năng
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px", fontSize: "0.95rem", lineHeight: 1.6 }}>
              <div>
                <strong style={{ color: "hsl(var(--primary-teal-dark))" }}>✍️ Viết chữ Hán:</strong> Chọn một chữ Hán, nhấn <strong>Xem nét</strong> để học thứ tự nét, hoặc <strong>Luyện viết</strong> để tự tay vẽ đè trên ô lưới đỏ. Máy sẽ tự sửa lỗi nét cho bạn!
              </div>
              <div>
                <strong style={{ color: "hsl(var(--secondary-indigo))" }}>📖 Đọc hiểu:</strong> Bạn có thể bật/tắt phiên âm Pinyin. Nhấn vào bất kỳ từ nào để tra từ điển nhanh và nghe phát âm. Hoàn thành Quiz trắc nghiệm bên dưới để nhận XP.
              </div>
              <div>
                <strong style={{ color: "hsl(var(--accent-orange))" }}>🎧 Luyện nghe:</strong> Nhấn nút loa chính hoặc nút rùa 🐢 để phát âm chậm rãi, sau đó chọn câu dịch nghĩa tương ứng.
              </div>
              <div>
                <strong style={{ color: "hsl(var(--secondary-indigo-dark))" }}>🗣️ Luyện phát âm:</strong> Nghe phát âm mẫu, sau đó nhấn giữ Micro để đọc to câu mẫu. Trình duyệt Chrome/Edge sẽ phân tích giọng đọc và cho bạn điểm số phần trăm chính xác!
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "25px" }}
              onClick={() => setHelpOpen(false)}
            >
              Bắt đầu học ngay!
            </button>
          </div>
        </div>
      )}

      {/* Tra cứu Hán-Việt Dictionary Modal */}
      <DictionaryModal
        isOpen={isDictOpen}
        onClose={() => setIsDictOpen(false)}
        customWords={customWords}
        onJumpToWriting={handleJumpToWriting}
        mode={mode}
      />

      {/* Footer */}
      <footer className="footer-credits">
        Ứng dụng học tiếng Trung 4 kỹ năng · Thực hiện bởi <a href="https://github.com/Vincentius-Vu/Chinese_Learning" target="_blank" rel="noopener noreferrer"> Tri-Vien Vu + Antigravity</a>
      </footer>
    </div>
  );
}
