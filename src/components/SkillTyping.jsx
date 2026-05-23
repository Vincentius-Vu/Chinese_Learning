import React, { useState, useEffect, useMemo } from "react";
import { typingData } from "../data/typingData";
import { writingData } from "../data/vocabulary";
import HandwritingPad from "./HandwritingPad";
import { getAdaptiveVocabulary } from "../lib/adaptiveLearning";

// ── Pinyin tone-stripping map ────────────────────────────────────────
const TONE_MAP = {
  ā:"a", á:"a", ǎ:"a", à:"a",
  ē:"e", é:"e", ě:"e", è:"e",
  ī:"i", í:"i", ǐ:"i", ì:"i",
  ō:"o", ó:"o", ǒ:"o", ò:"o",
  ū:"u", ú:"u", ǔ:"u", ù:"u",
  ǖ:"v", ǘ:"v", ǚ:"v", ǜ:"v", ü:"v",
  ń:"n", ň:"n",
};

function normalizePinyin(str) {
  return (str || "")
    .toLowerCase()
    .split("")
    .map((c) => TONE_MAP[c] || c)
    .join("")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// ── Helper to generate 10 random vocabulary exercises ────────────────
const generateVocabExercises = (level) => {
  const levelVocab = writingData.filter((item) => item.level === level);
  if (!levelVocab.length) return [];

  // Shuffle and pick 10
  const shuffled = [...levelVocab].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10);

  return selected.map((item, index) => {
    const promptSimplified = "_".repeat(item.simplified.length);
    const promptTraditional = "_".repeat(item.traditional.length);

    return {
      id: `vocab_${item.id}_${index}`,
      level: item.level,
      sentenceSimplified: `${item.simplified} [${item.sinoViet ? item.sinoViet + ' - ' : ''}${item.translation}]`,
      sentenceTraditional: `${item.traditional} [${item.sinoViet ? item.sinoViet + ' - ' : ''}${item.translation}]`,
      promptSimplified: promptSimplified,
      promptTraditional: promptTraditional,
      translation: item.translation,
      answerSimplified: item.simplified,
      answerTraditional: item.traditional,
      pinyin: item.pinyin,
      meaning: item.translation,
      sinoViet: item.sinoViet || "",
      category: item.category || ""
    };
  });
};

// ── Component ────────────────────────────────────────────────────────
export default function SkillTyping({
  mode,
  selectedLevel,
  addXp,
  triggerMascot,
  playSound,
  uiLang = "vi",
  t,
  mastery,
  updateMasteryScore,
  reviewLogs,
  addReviewLogs,
  globalVocabularyPool
}) {
  const [exerciseMode, setExerciseMode] = useState("sentence"); // "sentence" | "vocab"
  const [vocabExercises, setVocabExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVocabRoundFinished, setIsVocabRoundFinished] = useState(false);

  const [inputMode,     setInputMode]     = useState("pinyin"); // "pinyin"|"paste"|"handwriting"
  const [pinyinQuery,   setPinyinQuery]   = useState("");
  const [pasteInput,    setPasteInput]    = useState("");
  const [selectedChar,  setSelectedChar]  = useState(""); // from pinyin candidates
  const [hwChar,        setHwChar]        = useState(""); // from handwriting pad
  const [candidates,    setCandidates]    = useState([]);
  const [isSubmitted,   setIsSubmitted]   = useState(false);
  const [isCorrect,     setIsCorrect]     = useState(false);
  const [correctCount,  setCorrectCount]  = useState(0); // Cumulative count of correct matches

  // ── Exercises Resolver ───────────────────────────────────────────────
  const activeExercises = useMemo(() => {
    if (exerciseMode === "vocab") {
      return vocabExercises;
    } else {
      return typingData.filter((d) => d.level === selectedLevel);
    }
  }, [exerciseMode, vocabExercises, selectedLevel]);

  // ── Helpers ──────────────────────────────────────────────────────────
  const resetExercise = () => {
    setPinyinQuery("");
    setPasteInput("");
    setSelectedChar("");
    setHwChar("");
    setCandidates([]);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  // Generate vocabulary exercises based on ZPD
  const generateAdaptiveVocabExercises = () => {
    const vocabPool = globalVocabularyPool || [];
    const logs = reviewLogs || [];
    const masteryVal = mastery !== undefined ? mastery : 1000;

    const targetWords = getAdaptiveVocabulary("typing", selectedLevel, vocabPool, logs, masteryVal);
    if (!targetWords.length) return [];

    return targetWords.map((item, index) => {
      const promptSimplified = "_".repeat(item.simplified.length);
      const promptTraditional = "_".repeat(item.traditional.length);

      return {
        id: `vocab_type_${item.id}_${index}`,
        wordId: item.id,
        level: item.level,
        sentenceSimplified: `${item.simplified} [${item.sinoViet ? item.sinoViet + ' - ' : ''}${item.translation}]`,
        sentenceTraditional: `${item.traditional} [${item.sinoViet ? item.sinoViet + ' - ' : ''}${item.translation}]`,
        promptSimplified: promptSimplified,
        promptTraditional: promptTraditional,
        translation: item.translation,
        answerSimplified: item.simplified,
        answerTraditional: item.traditional,
        pinyin: item.pinyin,
        meaning: item.translation,
        sinoViet: item.sinoViet || "",
        category: item.category || ""
      };
    });
  };

  // Generate vocabulary exercises when entering vocab mode or changing level
  useEffect(() => {
    if (exerciseMode === "vocab") {
      const fresh = generateAdaptiveVocabExercises();
      setVocabExercises(fresh);
    }
    setIsVocabRoundFinished(false);
    setCurrentIndex(0);
    setCorrectCount(0);
    resetExercise();
  }, [selectedLevel, exerciseMode, mastery]);

  useEffect(() => {
    resetExercise();
  }, [currentIndex]);

  useEffect(() => {
    triggerMascot(t("mascotTypingWelcome"), "neutral");
  }, [selectedLevel]);

  // Live pinyin candidate search
  useEffect(() => {
    if (!pinyinQuery.trim()) { setCandidates([]); return; }
    const norm = normalizePinyin(pinyinQuery);
    if (!norm) { setCandidates([]); return; }

    const seen = new Set();
    const results = [];
    const searchPool = globalVocabularyPool || writingData;
    searchPool.forEach((item) => {
      const char = mode === "simplified" ? item.simplified : item.traditional;
      const itemNorm = normalizePinyin(item.pinyin);
      if (char && !seen.has(char) && itemNorm.startsWith(norm)) {
        seen.add(char);
        results.push({ char, pinyin: item.pinyin, meaning: item.translation });
      }
    });
    setCandidates(results.slice(0, 12));
  }, [pinyinQuery, mode, globalVocabularyPool]);

  if (!activeExercises.length) return (
    <p style={{ textAlign: "center", color: "hsl(var(--neutral-gray))", padding: "40px 0" }}>
      Chưa có bài luyện gõ cho cấp độ này.
    </p>
  );

  const masteryVal = mastery !== undefined ? mastery : 1000;
  const showCharacterGuide = masteryVal < 1100;
  const showPinyinGuide = masteryVal < 1300;

  const exercise    = activeExercises[currentIndex] || activeExercises[0];
  const answer      = mode === "simplified" ? exercise.answerSimplified : exercise.answerTraditional;
  const prompt      = mode === "simplified" ? exercise.promptSimplified : exercise.promptTraditional;
  const fullSentence = mode === "simplified" ? exercise.sentenceSimplified : exercise.sentenceTraditional;

  // Resolve which input counts as the user's current answer
  const currentInput =
    inputMode === "pinyin"      ? selectedChar :
    inputMode === "paste"       ? pasteInput.trim() :
    /* handwriting */             hwChar;

  // ── Sentence with animated blank ─────────────────────────────────────
  const renderPrompt = () => {
    if (exerciseMode === "vocab") {
      let blankClass = "typing-blank-dashes";
      if (isSubmitted) blankClass += isCorrect ? " correct" : " wrong";
      else if (currentInput) blankClass += " filled";
      else blankClass += " empty";

      return (
        <span className={blankClass}>
          {currentInput || "_ ".repeat(answer.length).trim()}
        </span>
      );
    }

    const parts = prompt.split("___");
    if (parts.length !== 2) {
      if (!showCharacterGuide) {
        const maskedPrompt = prompt.replace(/[\u4e00-\u9fa5]/g, "●");
        return <span className="typing-sentence-hanzi">{maskedPrompt}</span>;
      }
      return <span className="typing-sentence-hanzi">{prompt}</span>;
    }

    let blankClass = "typing-blank";
    if (isSubmitted) blankClass += isCorrect ? " correct" : " wrong";
    else if (currentInput) blankClass += " filled";
    else blankClass += " empty";

    const leftPart = showCharacterGuide ? parts[0] : parts[0].replace(/[\u4e00-\u9fa5]/g, "●");
    const rightPart = showCharacterGuide ? parts[1] : parts[1].replace(/[\u4e00-\u9fa5]/g, "●");

    return (
      <span>
        <span className="typing-sentence-hanzi">{leftPart}</span>
        <span className={blankClass}>{currentInput || "\u00a0\u00a0"}</span>
        <span className="typing-sentence-hanzi">{rightPart}</span>
      </span>
    );
  };

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!currentInput) { triggerMascot(t("mascotTypingNoInput"), "thinking"); return; }
    const correct = currentInput === answer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    if (correct) {
      playSound("success");
      setCorrectCount((prev) => prev + 1);
      addXp(15);
      triggerMascot(t("mascotTypingCorrect"), "excited");
    } else {
      playSound("wrong");
      triggerMascot(t("mascotTypingWrong"), "sad");
    }

    if (addReviewLogs && exercise && exerciseMode === "vocab") {
      const wordId = exercise.wordId;
      if (wordId) {
        addReviewLogs([{
          wordId: wordId,
          correct: correct,
          timestamp: new Date().toISOString()
        }]);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < activeExercises.length - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      if (exerciseMode === "vocab") {
        setIsVocabRoundFinished(true);
        triggerMascot(t("vocabRoundClear") || "Hoàn thành vòng gõ chữ thích ứng!", "excited");
        if (updateMasteryScore) {
          updateMasteryScore("typing", correctCount / activeExercises.length);
        }
      } else {
        setCurrentIndex(0);
        triggerMascot(t("mascotTypingFinish") || "Xuất sắc! Bạn đã gõ thành thạo toàn bộ các câu trong phần này! 🏆", "excited");
        if (updateMasteryScore) {
          updateMasteryScore("typing", correctCount / activeExercises.length);
        }
      }
    }
  };

  // ── Tab switch helpers ────────────────────────────────────────────────
  const switchTab = (mode) => {
    setInputMode(mode);
    // Clear other modes' state
    if (mode !== "pinyin")      { setPinyinQuery(""); setCandidates([]); setSelectedChar(""); }
    if (mode !== "paste")       { setPasteInput(""); }
    if (mode !== "handwriting") { setHwChar(""); }
  };

  // ── Vocabulary Round Clear Render ─────────────────────────────────────
  if (isVocabRoundFinished) {
    return (
      <div className="glass-panel typing-finish-card text-center" style={{ padding: "40px 20px", borderRadius: "16px", animation: "slideInUp 0.5s ease" }}>
        <div className="finish-icon" style={{ fontSize: "5rem", marginBottom: "20px" }}>🏆</div>
        <h3 className="gradient-text" style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "15px" }}>
          {t("vocabRoundClear")}
        </h3>
        <p style={{ margin: "16px 0", color: "hsl(var(--neutral-gray))", fontSize: "1.1rem", lineHeight: "1.6" }}>
          {uiLang === "vi" 
            ? `Chúc mừng bạn đã rèn luyện thành thạo kỹ năng gõ và ghi nhớ 10 từ vựng ngẫu nhiên cấp độ ${selectedLevel}!`
            : uiLang === "zh-CN"
            ? `恭喜你成功掌握了 10 个随机选择的 ${selectedLevel} 级词汇！`
            : `恭喜你成功掌握了 10 個隨機選擇的 ${selectedLevel} 級詞彙！`}
        </p>
        <button
          className="btn btn-primary"
          onClick={() => {
            const fresh = generateAdaptiveVocabExercises();
            setVocabExercises(fresh);
            setIsVocabRoundFinished(false);
            setCurrentIndex(0);
            setCorrectCount(0);
            resetExercise();
          }}
          style={{ padding: "12px 24px", fontSize: "1.1rem", borderRadius: "10px", marginTop: "15px" }}
        >
          {t("btnPlayAgain")}
        </button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="typing-layout">

      {/* Mode Selector Tabs */}
      <div className="typing-mode-selector">
        <button
          className={`mode-btn ${exerciseMode === "sentence" ? "active" : ""}`}
          onClick={() => setExerciseMode("sentence")}
        >
          {t("modeSentence")}
        </button>
        <button
          className={`mode-btn ${exerciseMode === "vocab" ? "active" : ""}`}
          onClick={() => setExerciseMode("vocab")}
        >
          {t("modeVocabulary")}
        </button>
      </div>

      {/* Glassmorphic Adaptive Badge */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: "12px",
        background: "rgba(99, 102, 241, 0.06)",
        border: "1px solid rgba(99, 102, 241, 0.15)",
        backdropFilter: "blur(4px)",
        marginBottom: "15px"
      }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "hsl(var(--secondary-indigo-dark))", display: "flex", alignItems: "center", gap: "6px" }}>
          🎯 {t("labelTypingMastery") || "Độ thành thạo gõ"}: <strong style={{ fontSize: "0.95rem" }}>{mastery !== undefined ? mastery : 1000}</strong>
        </span>
        <span style={{
          background: (mastery !== undefined ? mastery : 1000) >= 1300 ? "hsl(var(--danger-red))" : ((mastery !== undefined ? mastery : 1000) >= 1100 ? "hsl(var(--secondary-indigo))" : "hsl(var(--primary-teal))"),
          color: "white",
          fontSize: "0.75rem",
          fontWeight: 800,
          padding: "3px 10px",
          borderRadius: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          {(mastery !== undefined ? mastery : 1000) >= 1300 ? (t("badgeHardTyping") || "KHÓ (Ẩn Chữ & Pinyin)") : ((mastery !== undefined ? mastery : 1000) >= 1100 ? (t("badgeMediumTyping") || "TRUNG BÌNH (Ẩn Chữ)") : (t("badgeEasyTyping") || "DỄ"))}
        </span>
      </div>

      {/* Progress bar */}
      <div className="typing-progress-bar">
        <span className="typing-progress-label">
          {t("labelExerciseCount")} {currentIndex + 1} / {activeExercises.length}
        </span>
        <div className="typing-progress-track">
          <div
            className="typing-progress-fill"
            style={{ width: `${((currentIndex + 1) / activeExercises.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Sentence card */}
      <div className="glass-panel typing-sentence-card">
        <div className="typing-prompt-label">
          {exerciseMode === "vocab" ? t("labelHanziMask") : t("labelTypingPrompt")}
        </div>
        <div className="typing-sentence-wrapper">{renderPrompt()}</div>
        <div className="typing-meta-row">
          {showPinyinGuide && (
            <div className="typing-pinyin-hint">
              <span className="typing-hint-badge">📌 Pinyin</span>
              <span className="typing-hint-value">{exercise.pinyin}</span>
            </div>
          )}
          {showPinyinGuide && exercise.sinoViet && (
            <div className="typing-sinoviet-hint">
              <span className="typing-hint-badge purple">🇨🇳 {t("labelSinoViet")}</span>
              <span className="typing-hint-value">{exercise.sinoViet}</span>
            </div>
          )}
          <div className="typing-translation">{exercise.translation}</div>
        </div>
      </div>

      {/* Input section */}
      {!isSubmitted && (
        <div className="typing-input-section">

          {/* Mode tabs — Pinyin / Handwriting / Paste */}
          <div className="typing-mode-tabs">
            <button
              id="tab-pinyin"
              className={`typing-tab-btn ${inputMode === "pinyin" ? "active" : ""}`}
              onClick={() => switchTab("pinyin")}
            >
              ⌨️ {t("tabPinyin")}
            </button>
            <button
              id="tab-handwriting"
              className={`typing-tab-btn ${inputMode === "handwriting" ? "active" : ""}`}
              onClick={() => switchTab("handwriting")}
            >
              ✍️ {t("tabHandwriting")}
            </button>
            <button
              id="tab-paste"
              className={`typing-tab-btn ${inputMode === "paste" ? "active" : ""}`}
              onClick={() => switchTab("paste")}
            >
              📋 {t("tabPaste")}
            </button>
          </div>

          {/* ── Pinyin Mode ── */}
          {inputMode === "pinyin" && (
            <div className="typing-pinyin-mode">
              <input
                type="text"
                className="typing-pinyin-input"
                placeholder={t("placeholderTypePinyin")}
                value={pinyinQuery}
                onChange={(e) => { setPinyinQuery(e.target.value); setSelectedChar(""); }}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
              />
              {candidates.length > 0 ? (
                <div className="candidate-grid">
                  {candidates.map((cand, idx) => (
                    <button
                      key={idx}
                      className={`candidate-btn ${selectedChar === cand.char ? "selected" : ""}`}
                      onClick={() => setSelectedChar(cand.char)}
                      title={`${cand.pinyin} — ${cand.meaning}`}
                    >
                      <span className="cand-hanzi">{cand.char}</span>
                      <span className="cand-pinyin">{cand.pinyin}</span>
                    </button>
                  ))}
                </div>
              ) : pinyinQuery.trim() ? (
                <p className="typing-no-candidates">{t("labelNoCandidates")}</p>
              ) : null}

              {selectedChar && (
                <div className="typing-selected-preview">
                  ✅ {t("labelSelected")}: <strong className="typing-selected-char">{selectedChar}</strong>
                </div>
              )}
            </div>
          )}

          {/* ── Handwriting Mode ── */}
          {inputMode === "handwriting" && (
            <HandwritingPad
              key={`hw-${currentIndex}`}
              onSelect={(char) => setHwChar(char)}
              onClearSelection={() => setHwChar("")}
              uiLang={uiLang}
              t={t}
            />
          )}

          {/* ── Paste / Direct Mode ── */}
          {inputMode === "paste" && (
            <div className="typing-paste-mode">
              <input
                type="text"
                className="typing-paste-input"
                placeholder={t("placeholderPasteHanzi")}
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                maxLength={10}
                autoComplete="off"
                lang="zh"
              />
              <p className="typing-paste-hint">
                💡 {uiLang === "vi"
                  ? "Dùng bàn phím Trung văn của hệ thống, hoặc copy-paste chữ Hán từ nơi khác."
                  : uiLang === "zh-CN" ? "使用系统中文输入法，或直接粘贴汉字。"
                  : "使用系統中文輸入法，或直接貼上漢字。"}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            className={`btn btn-primary typing-submit-btn${!currentInput ? " btn-disabled" : ""}`}
            disabled={!currentInput}
            onClick={handleSubmit}
          >
            ✓ {t("btnCheckTyping")}
          </button>
        </div>
      )}

      {/* Result box */}
      {isSubmitted && (
        <div className={`typing-result-box ${isCorrect ? "correct" : "wrong"}`}>
          <div className="typing-result-header">
            <span className="typing-result-verdict">
              {isCorrect ? t("feedbackTypingCorrect") : t("feedbackTypingWrong")}
            </span>
            {isCorrect && <span className="typing-xp-badge">+15 XP ⭐</span>}
          </div>

          {!isCorrect && (
            <div className="typing-correct-answer" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "hsl(var(--neutral-gray))" }}>{t("labelTypingAnswer")}:</span>
              <strong className="typing-answer-char">{answer}</strong>
              <span className="typing-answer-pinyin">({exercise.pinyin})</span>
              {exercise.sinoViet && (
                <span className="typing-answer-sinoviet" style={{ color: "hsl(var(--primary-purple))", fontWeight: "600" }}>
                  [{exercise.sinoViet}]
                </span>
              )}
              <span style={{ color: "hsl(var(--neutral-gray))" }}>— {exercise.meaning}</span>
            </div>
          )}

          <div className="typing-full-sentence">
            <span style={{ fontSize: "1rem" }}>📖</span>
            <span className="typing-sentence-hanzi" style={{ fontSize: "1.4rem" }}>{fullSentence}</span>
          </div>

          <div className="typing-result-actions">
            {!isCorrect && (
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedChar("");
                  setPasteInput("");
                  setHwChar("");
                }}
              >
                🔄 {t("btnRetryTyping")}
              </button>
            )}
            <button className="btn btn-primary" onClick={handleNext}>
              {currentIndex === activeExercises.length - 1
                ? (exerciseMode === "vocab" ? "🏆 " + t("btnNextExercise") : "🏆 " + t("btnFinishRestart"))
                : t("btnNextExercise")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
