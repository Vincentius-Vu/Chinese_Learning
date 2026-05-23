import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Mascot from "./components/Mascot";
import SkillWriting from "./components/SkillWriting";
import SkillReading from "./components/SkillReading";
import SkillListening from "./components/SkillListening";
import SkillSpeaking from "./components/SkillSpeaking";
import SkillTyping from "./components/SkillTyping";
import SkillFlashcards from "./components/SkillFlashcards";
import DictionaryModal from "./components/DictionaryModal";
import { translations } from "./data/translations";
import { writingData } from "./data/vocabulary";
import { hskCompoundWords } from "./data/hskCompoundWords";
import { calculateNewMastery } from "./lib/adaptiveLearning";

export default function App() {
  // Global States (loaded from localStorage with safe default fallbacks)
  const [mode, setMode] = useState(() => localStorage.getItem("chinese_mode") || "simplified");
  const [activeSkill, setActiveSkill] = useState(() => localStorage.getItem("chinese_skill") || "writing");
  const [selectedLevel, setSelectedLevel] = useState(() => Number(localStorage.getItem("chinese_selected_level")) || 1);
  const [xp, setXp] = useState(() => Number(localStorage.getItem("chinese_xp")) || 0);
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("chinese_streak")) || 1);
  const [soundOn, setSoundOn] = useState(() => JSON.parse(localStorage.getItem("chinese_sound")) !== false);
  const [uiLang, setUiLang] = useState(() => localStorage.getItem("chinese_ui_lang") || "vi");

  // Mastery and Review Logs states for Adaptive learning
  const [mastery, setMastery] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("chinese_mastery"));
      const defaultMastery = {
        writing: 1000,
        reading: 1000,
        listening: 1000,
        speaking: 1000,
        typing: 1000,
        flashcards: 1000
      };
      if (stored) {
        return { ...defaultMastery, ...stored };
      }
      return defaultMastery;
    } catch (e) {
      return { writing: 1000, reading: 1000, listening: 1000, speaking: 1000, typing: 1000, flashcards: 1000 };
    }
  });

  const [reviewLogs, setReviewLogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chinese_review_logs")) || [];
    } catch (e) {
      return [];
    }
  });

  // Sync mastery and reviewLogs with localStorage
  useEffect(() => {
    localStorage.setItem("chinese_mastery", JSON.stringify(mastery));
  }, [mastery]);

  useEffect(() => {
    localStorage.setItem("chinese_review_logs", JSON.stringify(reviewLogs));
  }, [reviewLogs]);

  // One-time silent unlock for Web Audio API & Web Speech API (TTS) on iOS/Mobile browsers
  useEffect(() => {
    const unlock = () => {
      // 1. Unlock Web Audio API (for sound effects)
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          if (ctx.state === "suspended") {
            ctx.resume();
          }
          // Play a quick silent buffer
          const buffer = ctx.createBuffer(1, 1, 22050);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start(0);
        }
      } catch (e) {
        console.warn("AudioContext unlock failed", e);
      }

      // 2. Unlock Web Speech API (for TTS)
      try {
        if (window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance("");
          u.volume = 0; // completely silent
          window.speechSynthesis.speak(u);
        }
      } catch (e) {
        console.warn("SpeechSynthesis unlock failed", e);
      }

      // Clean up event listeners immediately after first user interaction
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  // Combine static HSK characters with compound words
  const globalVocabularyPool = React.useMemo(() => {
    return [...writingData, ...hskCompoundWords];
  }, []);

  const updateMasteryScore = (skill, percentCorrect) => {
    setMastery(prev => {
      const currentVal = prev[skill] !== undefined ? prev[skill] : 1000;
      const newVal = calculateNewMastery(currentVal, percentCorrect);
      return {
        ...prev,
        [skill]: newVal
      };
    });
  };

  const addReviewLogs = (newLogs) => {
    setReviewLogs(prev => {
      const combined = [...prev, ...newLogs];
      if (combined.length > 1000) {
        return combined.slice(combined.length - 1000);
      }
      return combined;
    });
  };

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

  const handleUpdateCustomWord = (updatedWord) => {
    setCustomWords((prev) => prev.map((w) => w.id === updatedWord.id ? updatedWord : w));
  };

  const handleExportProgress = () => {
    const data = {
      chinese_mode: mode,
      chinese_skill: activeSkill,
      chinese_selected_level: selectedLevel,
      chinese_xp: xp,
      chinese_streak: streak,
      chinese_sound: soundOn,
      chinese_ui_lang: uiLang,
      chinese_custom_words: customWords,
      chinese_mastery: mastery,
      chinese_review_logs: reviewLogs,
      backup_time: new Date().toISOString(),
      version: "1.2"
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `chinese_learning_backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportProgress = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data && typeof data === "object") {
          if (data.chinese_xp !== undefined) localStorage.setItem("chinese_xp", Number(data.chinese_xp));
          if (data.chinese_streak !== undefined) localStorage.setItem("chinese_streak", Number(data.chinese_streak));
          if (data.chinese_mode !== undefined) localStorage.setItem("chinese_mode", data.chinese_mode);
          if (data.chinese_skill !== undefined) localStorage.setItem("chinese_skill", data.chinese_skill);
          if (data.chinese_selected_level !== undefined) localStorage.setItem("chinese_selected_level", Number(data.chinese_selected_level));
          if (data.chinese_sound !== undefined) localStorage.setItem("chinese_sound", JSON.stringify(data.chinese_sound));
          if (data.chinese_ui_lang !== undefined) localStorage.setItem("chinese_ui_lang", data.chinese_ui_lang);
          if (data.chinese_custom_words !== undefined && Array.isArray(data.chinese_custom_words)) {
            localStorage.setItem("chinese_custom_words", JSON.stringify(data.chinese_custom_words));
          }
          if (data.chinese_mastery !== undefined) {
            localStorage.setItem("chinese_mastery", JSON.stringify(data.chinese_mastery));
          }
          if (data.chinese_review_logs !== undefined) {
            localStorage.setItem("chinese_review_logs", JSON.stringify(data.chinese_review_logs));
          }
          alert(t("backupRestoreSuccess") || "Khôi phục dữ liệu học tập thành công! Trang web sẽ tải lại.");
          window.location.reload();
        } else {
          alert(t("backupRestoreInvalid") || "Tệp sao lưu không hợp lệ.");
        }
      } catch (err) {
        alert(t("backupRestoreError") || "Có lỗi xảy ra khi đọc tệp sao lưu.");
      }
    };
    reader.readAsText(file);
  };
  
  // Mascot Speech Bubble and Mood Control
  const [mascotText, setMascotText] = useState(() => (translations[localStorage.getItem("chinese_ui_lang") || "vi"]?.mascotWelcome) || "Chào mừng bạn! Hôm nay hãy cùng luyện tập Tiếng Trung thật vui nhé! 🐃");
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

  useEffect(() => {
    setMascotText(t("mascotWelcome"));
  }, [uiLang]);

  // Derived Level (100 XP per level)
  const currentLevel = Math.floor(xp / 100) + 1;

  // React to level changes (fixed level up edge-case when XP jumps dynamically)
  const prevLevelRef = useRef(currentLevel);
  useEffect(() => {
    if (currentLevel > prevLevelRef.current) {
      playSound("success");
      setMascotText(t("mascotLevelUp").replace("{level}", currentLevel));
      setMascotExpression("excited");
    }
    prevLevelRef.current = currentLevel;
  }, [currentLevel]);

  // Trigger speech updates on level selection
  useEffect(() => {
    const levelName = mode === "simplified" ? `HSK ${selectedLevel}` : `TOCFL ${selectedLevel}`;
    triggerMascotReaction(t("mascotLevelChanged").replace("{levelName}", levelName), "happy");
  }, [selectedLevel, mode, uiLang]);

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
    const activeChar = mode === "simplified" ? (charObj.simplified || charObj.traditional) : (charObj.traditional || charObj.simplified);
    triggerMascotReaction(t("mascotJumpToWriting").replace("{char}", activeChar), "excited");
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
            onUpdateCustomWord={handleUpdateCustomWord}
            autoSelectWordId={jumpedWordId}
            uiLang={uiLang}
            t={t}
            mastery={mastery.writing}
            updateMasteryScore={updateMasteryScore}
            reviewLogs={reviewLogs}
            addReviewLogs={addReviewLogs}
            globalVocabularyPool={globalVocabularyPool}
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
            uiLang={uiLang}
            t={t}
            mastery={mastery.reading}
            updateMasteryScore={updateMasteryScore}
            reviewLogs={reviewLogs}
            addReviewLogs={addReviewLogs}
            globalVocabularyPool={globalVocabularyPool}
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
            mastery={mastery.listening}
            updateMasteryScore={updateMasteryScore}
            reviewLogs={reviewLogs}
            addReviewLogs={addReviewLogs}
            globalVocabularyPool={globalVocabularyPool}
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
            uiLang={uiLang}
            t={t}
            mastery={mastery.speaking}
            updateMasteryScore={updateMasteryScore}
            reviewLogs={reviewLogs}
            addReviewLogs={addReviewLogs}
            globalVocabularyPool={globalVocabularyPool}
          />
        );
      case "typing":
        return (
          <SkillTyping
            mode={mode}
            selectedLevel={selectedLevel}
            addXp={addXpPoints}
            triggerMascot={triggerMascotReaction}
            playSound={playSound}
            uiLang={uiLang}
            t={t}
            mastery={mastery.typing}
            updateMasteryScore={updateMasteryScore}
            reviewLogs={reviewLogs}
            addReviewLogs={addReviewLogs}
            globalVocabularyPool={globalVocabularyPool}
          />
        );
      case "flashcards":
        return (
          <SkillFlashcards
            mode={mode}
            selectedLevel={selectedLevel}
            addXp={addXpPoints}
            triggerMascot={triggerMascotReaction}
            playSound={playSound}
            uiLang={uiLang}
            t={t}
            mastery={mastery.flashcards || 1000}
            updateMasteryScore={updateMasteryScore}
            reviewLogs={reviewLogs}
            addReviewLogs={addReviewLogs}
            globalVocabularyPool={globalVocabularyPool}
            customWords={customWords}
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
        onExportProgress={handleExportProgress}
        onImportProgress={handleImportProgress}
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

            <button
              className={`nav-card ${activeSkill === "typing" ? "active" : ""}`}
              onClick={() => setActiveSkill("typing")}
            >
              <span className="nav-icon">⌨️</span> {t("navTyping")}
            </button>

            <button
              className={`nav-card ${activeSkill === "flashcards" ? "active" : ""}`}
              onClick={() => setActiveSkill("flashcards")}
            >
              <span className="nav-icon">🎴</span> {t("navFlashcards")}
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
                    {activeSkill === "typing" && t("cardTitleTyping")}
                    {activeSkill === "flashcards" && t("cardTitleFlashcards")}
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
        <button
          className={`mobile-nav-btn ${activeSkill === "typing" ? "active" : ""}`}
          onClick={() => setActiveSkill("typing")}
        >
          <span className="mobile-nav-icon">⌨️</span>
          <span className="mobile-nav-label">{t("navTyping")}</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeSkill === "flashcards" ? "active" : ""}`}
          onClick={() => setActiveSkill("flashcards")}
        >
          <span className="mobile-nav-icon">🎴</span>
          <span className="mobile-nav-label">{t("navFlashcards")}</span>
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
              {t("helpModalTitle")}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px", fontSize: "0.95rem", lineHeight: 1.6 }}>
              <div>
                <strong style={{ color: "hsl(var(--primary-teal-dark))" }}>✍️ {t("helpWritingTitle")}:</strong> {t("helpWritingDesc")}
              </div>
              <div>
                <strong style={{ color: "hsl(var(--secondary-indigo))" }}>📖 {t("helpReadingTitle")}:</strong> {t("helpReadingDesc")}
              </div>
              <div>
                <strong style={{ color: "hsl(var(--accent-orange))" }}>🎧 {t("helpListeningTitle")}:</strong> {t("helpListeningDesc")}
              </div>
              <div>
                <strong style={{ color: "hsl(var(--secondary-indigo-dark))" }}>🗣️ {t("helpSpeakingTitle")}:</strong> {t("helpSpeakingDesc")}
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "25px" }}
              onClick={() => setHelpOpen(false)}
            >
              {t("helpModalCta")}
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
        uiLang={uiLang}
        t={t}
        writingData={globalVocabularyPool}
      />

      {/* Footer */}
      <footer className="footer-credits">
        {t("footerText")} <a href="https://github.com/Vincentius-Vu/Chinese_Learning/" target="_blank" rel="noopener noreferrer">Tri-Vien Vu + Antigravity</a>
      </footer>
    </div>
  );
}
