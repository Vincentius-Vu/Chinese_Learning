import React, { useState, useEffect } from "react";
import { listeningData } from "../data/listeningData";
import { getAdaptiveVocabulary } from "../lib/adaptiveLearning";
import { speakText } from "../lib/tts";

export default function SkillListening({
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
  const [vocabQuizzes, setVocabQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isVocabRoundFinished, setIsVocabRoundFinished] = useState(false);

  // Generate quizzes based on adaptive vocabulary (ZPD + DDA)
  const generateAdaptiveQuizzes = () => {
    const vocabPool = globalVocabularyPool || [];
    const logs = reviewLogs || [];
    const masteryVal = mastery !== undefined ? mastery : 1000;

    // Use ZPD to select 10 words
    const targetWords = getAdaptiveVocabulary("listening", selectedLevel, vocabPool, logs, masteryVal);
    if (!targetWords.length) return [];

    // Determine choices based on DDA
    let numChoices = 4;
    if (masteryVal < 1100) {
      numChoices = 3;
    } else if (masteryVal >= 1400) {
      numChoices = 5;
    }

    return targetWords.map((target) => {
      const correctTranslation = target.translation;

      // Distractor candidates (excluding the target correct answer)
      const distractorCandidates = vocabPool.filter(
        (item) => item.translation !== correctTranslation && item.translation.trim() !== ""
      );

      let distractors = [];
      if (masteryVal >= 1400) {
        // HARD: Prioritize similar distractors
        const similarDistractors = distractorCandidates.filter((item) => {
          // Check if they share any character
          for (const char of target.simplified || "") {
            if (item.simplified && item.simplified.includes(char)) return true;
          }
          // Check if Pinyin sounds similar (e.g. shares first 2 chars of pinyin)
          if (target.pinyin && item.pinyin) {
            const pyA = target.pinyin.toLowerCase().replace(/[^a-z]/g, "");
            const pyB = item.pinyin.toLowerCase().replace(/[^a-z]/g, "");
            if (pyA.slice(0, 2) === pyB.slice(0, 2)) return true;
          }
          return false;
        });

        // Mix in some similar distractors, then fill with general distractors of the same level
        const levelDistractors = distractorCandidates.filter((item) => item.level === selectedLevel);
        const candidates = [...similarDistractors, ...levelDistractors, ...distractorCandidates];
        
        const uniqueDist = new Set();
        for (const cand of candidates) {
          if (uniqueDist.size >= numChoices - 1) break;
          uniqueDist.add(cand.translation);
        }
        distractors = Array.from(uniqueDist);
      } else if (masteryVal >= 1100) {
        // MEDIUM: Normal distractors from same level
        const levelDistractors = distractorCandidates.filter((item) => item.level === selectedLevel);
        const candidates = [...levelDistractors, ...distractorCandidates];
        
        const uniqueDist = new Set();
        for (const cand of candidates) {
          if (uniqueDist.size >= numChoices - 1) break;
          uniqueDist.add(cand.translation);
        }
        distractors = Array.from(uniqueDist);
      } else {
        // EASY: Pick random distractors from different levels to be very distinct
        const easyCandidates = distractorCandidates.filter((item) => item.level !== selectedLevel);
        const candidates = [...easyCandidates, ...distractorCandidates];
        
        const uniqueDist = new Set();
        for (const cand of candidates) {
          if (uniqueDist.size >= numChoices - 1) break;
          uniqueDist.add(cand.translation);
        }
        distractors = Array.from(uniqueDist);
      }

      // Safe fallback if not enough distractors
      while (distractors.length < numChoices - 1) {
        distractors.push("Đáp án gây nhiễu " + (distractors.length + 1));
      }

      // Mix correct answer with distractors and shuffle
      const choices = [correctTranslation, ...distractors].sort(() => 0.5 - Math.random());

      return {
        id: `vocab_listen_${target.id}_${Math.random().toString(36).substr(2, 9)}`,
        wordId: target.id, // Keep a reference to original HSK word ID for review logs
        level: target.level,
        simplified: target.simplified,
        traditional: target.traditional,
        pinyin: target.pinyin,
        translation: target.translation,
        sinoViet: target.sinoViet || "",
        choices: choices
      };
    });
  };

  // Filter based on selectedLevel for Sentence mode
  const filteredListeningData = listeningData.filter((item) => item.level === selectedLevel);

  // Active exercises pool
  const activeQuizzes = exerciseMode === "vocab" ? vocabQuizzes : filteredListeningData;
  const activeQuestion = activeQuizzes[currentIndex] || activeQuizzes[0];
  const targetText = activeQuestion ? (mode === "simplified" ? activeQuestion.simplified : activeQuestion.traditional) : "";

  // Reset indices and cards when level or mode changes
  useEffect(() => {
    if (exerciseMode === "vocab") {
      const fresh = generateAdaptiveQuizzes();
      setVocabQuizzes(fresh);
    }
    setCurrentIndex(0);
    resetCard();
    setScore(0);
    setQuizFinished(false);
    setIsVocabRoundFinished(false);
  }, [selectedLevel, exerciseMode, mastery]);

  useEffect(() => {
    resetCard();
    triggerMascot(t("mascotListeningPrompt"), "neutral");
  }, [currentIndex, mode, exerciseMode]);

  // Reset states
  const resetCard = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // Play Speech Synthesis TTS audio
  const handlePlayAudio = (rate = 0.9) => {
    const targetLang = mode === "simplified" ? "zh-CN" : "zh-TW";
    
    speakText(targetText, {
      lang: targetLang,
      rate: rate,
      onError: () => {
        if (triggerMascot) {
          triggerMascot(t("speechNotSupported") || "Trình duyệt của bạn không hỗ trợ tổng hợp giọng nói.", "sad");
        }
      }
    });
    
    if (rate < 0.7) {
      triggerMascot(t("mascotListeningSlow") || "Chế độ rùa 🐢 đang phát âm chậm rãi từng chữ một, hãy chú ý nghe rõ nhé!", "thinking");
    } else {
      triggerMascot(t("mascotListeningNormal") || "Đang phát âm ở tốc độ giao tiếp tiêu chuẩn. Bạn nghe rõ không? 🔊", "happy");
    }
  };

  // Process choice verification
  const handleSelectChoice = (choiceText) => {
    if (isAnswered) return;
    setSelectedOption(choiceText);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    
    setIsAnswered(true);
    const isCorrect = selectedOption === activeQuestion.translation;

    // Log this vocabulary item review result
    if (addReviewLogs && activeQuestion && exerciseMode === "vocab") {
      addReviewLogs([{
        wordId: activeQuestion.wordId,
        correct: isCorrect,
        timestamp: new Date().toISOString()
      }]);
    }

    if (isCorrect) {
      playSound("success");
      setScore((prev) => prev + 1);
      addXp(15);

      let mascotMsg = t("mascotListeningCorrect") || "Xuất sắc! Bạn đã nghe và chọn cực kỳ chính xác! Nhận +15 XP! 🏆";
      if (exerciseMode === "vocab" && activeQuestion.sinoViet) {
        mascotMsg = `Xuất sắc! Bạn đã nghe chính xác từ "${targetText}" (${activeQuestion.pinyin}) - Hán Việt: "${activeQuestion.sinoViet}". Nhận +15 XP! 🏆`;
      }
      triggerMascot(mascotMsg, "excited");
    } else {
      playSound("wrong");
      
      let mascotMsg = t("mascotListeningWrong")?.replace("{answer}", activeQuestion.translation) || `Tiếc quá! Câu trả lời chính xác phải là: "${activeQuestion.translation}". Hãy thử nghe lại nhé! 🐃`;
      if (exerciseMode === "vocab" && activeQuestion.sinoViet) {
        mascotMsg = `Tiếc quá! Đáp án đúng cho từ "${targetText}" (${activeQuestion.pinyin} - Hán Việt: "${activeQuestion.sinoViet}") phải là: "${activeQuestion.translation}". Hãy luyện nghe lại nhé! 🐃`;
      }
      triggerMascot(mascotMsg, "sad");
    }
  };

  // Step to next question
  const handleNext = () => {
    if (currentIndex < activeQuizzes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (exerciseMode === "vocab") {
        setIsVocabRoundFinished(true);
        playSound("success");
        // Update mastery score for listening
        if (updateMasteryScore) {
          updateMasteryScore("listening", score / activeQuizzes.length);
        }
        triggerMascot(
          uiLang === "vi" 
            ? `Xuất sắc! Bạn đã hoàn thành lượt luyện nghe 10 từ vựng ngẫu nhiên này! 🎉`
            : uiLang === "zh-CN"
            ? `太棒了！你已成功完成了这组 10 个随机词汇的听力练习！🎉`
            : `太棒了！你已成功完成了這組 10 個隨機詞彙的聽力練習！🎉`,
          "excited"
        );
      } else {
        setQuizFinished(true);
        playSound("success");
        // Update mastery score for listening
        if (updateMasteryScore) {
          updateMasteryScore("listening", score / activeQuizzes.length);
        }
        triggerMascot(t("mascotListeningFinish")?.replace("{score}", score).replace("{total}", activeQuizzes.length) || `Hoàn thành thử thách luyện nghe! Bạn đã làm đúng ${score}/${activeQuizzes.length} câu. Quá tuyệt vời! 🎉`, "excited");
      }
    }
  };

  // Restart full quiz
  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
    setIsVocabRoundFinished(false);
    resetCard();
    if (exerciseMode === "vocab") {
      const fresh = generateAdaptiveQuizzes();
      setVocabQuizzes(fresh);
    }
  };

  if (!activeQuizzes.length) {
    return (
      <div className="listening-layout glass-panel" style={{ padding: "40px", textAlign: "center" }}>
        <p style={{ color: "hsl(var(--neutral-gray))", fontWeight: "700" }}>
          Chưa có bài luyện nghe cho cấp độ này.
        </p>
      </div>
    );
  }

  // Render Finish screen for Vocabulary Mode
  if (isVocabRoundFinished) {
    return (
      <div className="listening-layout glass-panel listening-finish-card" style={{ padding: "40px 20px", borderRadius: "16px", animation: "slideInUp 0.5s ease" }}>
        <span style={{ fontSize: "5rem", display: "block", marginBottom: "20px" }}>🏆</span>
        <h3 className="gradient-text" style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "15px" }}>
          {t("vocabListeningRoundClear")}
        </h3>
        <p style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", marginBottom: "25px", fontSize: "1.1rem" }}>
          {t("listeningResult")}: {score} / {activeQuizzes.length}
        </p>
        <p style={{ margin: "-10px 0 25px 0", color: "hsl(var(--neutral-gray))", fontSize: "1rem", lineHeight: "1.6" }}>
          {uiLang === "vi" 
            ? `Chúc mừng bạn đã luyện nghe và ghi nhớ thành thạo 10 từ vựng ngẫu nhiên cấp độ ${selectedLevel}!`
            : uiLang === "zh-CN"
            ? `恭喜你成功掌握了 10 个随机选择的 ${selectedLevel} 级词汇听力！`
            : `恭喜你成功掌握了 10 個隨機選擇的 ${selectedLevel} 級詞彙聽力！`}
        </p>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={handleRestart} style={{ padding: "12px 24px", fontSize: "1.1rem", borderRadius: "10px" }}>
            {t("btnPlayAgainListening")}
          </button>
        </div>
      </div>
    );
  }

  // Render Finish screen for Sentence Mode
  if (quizFinished) {
    return (
      <div className="listening-layout glass-panel" style={{ padding: "40px", textAlign: "center" }}>
        <span style={{ fontSize: "4.5rem", display: "block", marginBottom: "15px" }}>🏆</span>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "hsl(var(--primary-teal-dark))", marginBottom: "10px" }}>
          {t("listeningTitle")}
        </h2>
        <p style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", marginBottom: "25px", fontSize: "1.05rem" }}>
          {t("listeningResult")}: {score} / {activeQuizzes.length}
        </p>
        
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={handleRestart}>
            {t("btnRestart")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="listening-layout">
      {/* Mode Selector Tabs */}
      <div className="listening-mode-selector">
        <button
          className={`mode-btn ${exerciseMode === "sentence" ? "active" : ""}`}
          onClick={() => setExerciseMode("sentence")}
        >
          {t("modeSentenceListening")}
        </button>
        <button
          className={`mode-btn ${exerciseMode === "vocab" ? "active" : ""}`}
          onClick={() => setExerciseMode("vocab")}
        >
          {t("modeVocabularyListening")}
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
          🎯 {t("labelListeningMastery") || "Độ thành thạo nghe"}: <strong style={{ fontSize: "0.95rem" }}>{mastery !== undefined ? mastery : 1000}</strong>
        </span>
        <span style={{
          background: (mastery !== undefined ? mastery : 1000) >= 1400 ? "hsl(var(--danger-red))" : ((mastery !== undefined ? mastery : 1000) >= 1100 ? "hsl(var(--secondary-indigo))" : "hsl(var(--primary-teal))"),
          color: "white",
          fontSize: "0.75rem",
          fontWeight: 800,
          padding: "3px 10px",
          borderRadius: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          {(mastery !== undefined ? mastery : 1000) >= 1400 ? (t("badgeHardListening") || "KHÓ (5 Đáp án + Gây nhiễu âm/bộ)") : ((mastery !== undefined ? mastery : 1000) >= 1100 ? (t("badgeMediumListening") || "TRUNG BÌNH (4 Đáp án)") : (t("badgeEasyListening") || "DỄ (3 Đáp án)"))}
        </span>
      </div>

      {/* Visual Progress Dot Indicators */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "15px" }}>
        {activeQuizzes.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: idx === currentIndex ? "hsl(var(--primary-teal))" : idx < currentIndex ? "hsl(var(--primary-teal-dark))" : "rgba(0,0,0,0.06)",
              transform: idx === currentIndex ? "scale(1.2)" : "scale(1)",
              transition: "all 0.25s ease"
            }}
          />
        ))}
      </div>

      <div className="listening-question-prompt">
        {t("quizQuestionPrefix") || "Câu"} {currentIndex + 1} / {activeQuizzes.length}: {exerciseMode === "vocab" ? t("labelVocabListeningPrompt") : t("listeningPrompt")}
      </div>

      {/* Main Speakers */}
      <div className="audio-trigger-box">
        {/* Slow Turtle speaker */}
        <button
          className="audio-btn audio-btn-slow"
          onClick={() => handlePlayAudio(0.5)}
          title={t("listeningSlowTitle")}
        >
          🐢
        </button>

        {/* Standard speaker */}
        <button
          className="audio-btn audio-btn-main"
          onClick={() => handlePlayAudio(0.9)}
          title={t("listeningNormalTitle")}
        >
          🔊
        </button>
      </div>

      {/* Multiple-choice responses */}
      <div className="listening-options-grid">
        {activeQuestion.choices.map((choice, oIdx) => {
          let optionClass = "";
          if (isAnswered) {
            if (choice === activeQuestion.translation) optionClass = "correct";
            else if (choice === selectedOption) optionClass = "wrong";
          } else if (choice === selectedOption) {
            optionClass = "selected";
          }

          return (
            <button
              key={oIdx}
              className={`listening-option-card ${optionClass}`}
              onClick={() => handleSelectChoice(choice)}
              disabled={isAnswered}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {/* Detail Block for Vocabulary Mode under answered card */}
      {isAnswered && exerciseMode === "vocab" && (
        <div className="explanation-card glass-panel" style={{ marginTop: "20px", padding: "15px 20px", borderLeft: "4px solid hsl(var(--secondary-indigo))", background: "rgba(99, 102, 241, 0.05)", borderRadius: "8px", textAlign: "left", animation: "slideInUp 0.3s ease" }}>
          <h4 style={{ fontWeight: 800, color: "hsl(var(--secondary-indigo-dark))", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem" }}>
            📚 Chi tiết từ vựng Hán tự:
          </h4>
          <div style={{ fontSize: "0.9rem", color: "hsl(var(--neutral-gray-dark))", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div><strong>Từ đang nghe:</strong> <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "hsl(var(--neutral-dark))" }}>{targetText}</span></div>
            <div><strong>Phiên âm Pinyin:</strong> <span style={{ fontFamily: "monospace", fontSize: "0.95rem", color: "hsl(var(--primary-teal-dark))", fontWeight: "700" }}>{activeQuestion.pinyin}</span></div>
            {activeQuestion.sinoViet && (
              <div><strong>Hán-Việt:</strong> <span className="listening-sinoviet-badge">{activeQuestion.sinoViet}</span></div>
            )}
            <div><strong>Ý nghĩa:</strong> <span>{activeQuestion.translation}</span></div>
          </div>
        </div>
      )}

      {/* Explanation Block for Levels 1, 2, 3 in sentence mode */}
      {isAnswered && exerciseMode === "sentence" && selectedLevel <= 3 && activeQuestion.explanation && (
        <div className="explanation-card glass-panel" style={{ marginTop: "20px", padding: "15px 20px", borderLeft: "4px solid hsl(var(--primary-teal))", background: "rgba(20, 184, 166, 0.05)", borderRadius: "8px", textAlign: "left", animation: "slideInUp 0.3s ease" }}>
          <h4 style={{ fontWeight: 800, color: "hsl(var(--primary-teal-dark))", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem" }}>
            {t("explanationTitle") || "📚 Giải thích đáp án:"}
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "hsl(var(--neutral-gray-dark))", margin: 0 }}>
            {activeQuestion.explanation}
          </p>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="status-bar-interactive">
        {!isAnswered ? (
          <button
            className={`btn btn-primary ${selectedOption === null ? "btn-disabled" : ""}`}
            disabled={selectedOption === null}
            onClick={handleCheckAnswer}
          >
            {t("btnSubmit")}
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleNext}>
            {currentIndex === activeQuizzes.length - 1 ? t("btnFinish") : t("btnNext")}
          </button>
        )}
      </div>
    </div>
  );
}
