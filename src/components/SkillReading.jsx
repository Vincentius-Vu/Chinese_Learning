import React, { useState, useEffect } from "react";
import { readingData } from "../data/vocabulary";
import ZenWatercolorCover from "./ZenWatercolorCover";
import { speakText } from "../lib/tts";

export default function SkillReading({
  mode,
  selectedLevel,
  addXp,
  triggerMascot,
  playSound,
  uiLang = "vi",
  t
}) {
  const filteredReadingData = readingData.filter((r) => r.level === selectedLevel);
  const [selectedStoryId, setSelectedStoryId] = useState(() => filteredReadingData[0]?.id || "r1");
  const [showPinyin, setShowPinyin] = useState(true);
  const [selectedWord, setSelectedWord] = useState(null);
  
  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState({}); // { [questionIdx]: selectedOptionIdx }
  const [quizSubmitted, setQuizSubmitted] = useState({}); // { [questionIdx]: true/false }

  // Auto-select first story on level change
  useEffect(() => {
    if (filteredReadingData.length > 0) {
      setSelectedStoryId(filteredReadingData[0].id);
    }
  }, [selectedLevel]);

  const activeStory = filteredReadingData.find((r) => r.id === selectedStoryId) || filteredReadingData[0] || readingData[0];
  const storyTitle = mode === "simplified" ? activeStory.titleSimplified : activeStory.titleTraditional;
  const storyContent = mode === "simplified" ? activeStory.contentSimplified : activeStory.contentTraditional;

  const storiesWithCovers = [
    "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10",
    "r11", "r12", "r13", "r14", "r15", "r16", "r17", "r18", "r19", "r20",
    "r21", "r22", "r23", "r24", "r25", "r26", "r27", "r28", "r29", "r30",
    "r31", "r32", "r33", "r34", "r35", "r36", "r37", "r38", "r39", "r40",
    "r41", "r42"
  ];
  const hasCoverImage = storiesWithCovers.includes(activeStory.id);

  const getStoryCoverPath = (storyId) => {
    // 1. If running in local development mode (npm run dev), always use clean absolute root path
    if (import.meta.env.DEV) {
      return `/images/stories/${storyId}.webp`;
    }

    // 2. If running in production mode (npm run build)
    const isNative = typeof window !== "undefined" && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
    if (isNative) {
      return `./images/stories/${storyId}.webp`;
    } else {
      // For production web (GitHub Pages), resolve subfolder dynamically based on current URL path
      const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
      const pathSegments = pathname.split("/").filter(Boolean);
      // Check if there is a repository subfolder in the URL path (e.g. /Chinese_Learning/)
      const hasSubfolder = pathSegments.length > 0 && !pathname.endsWith(".html") && !pathname.endsWith(".js") && !pathname.endsWith(".css");
      const base = hasSubfolder ? `/${pathSegments[0]}/` : "/";
      return `${base}images/stories/${storyId}.webp`;
    }
  };

  const getGenerativeGradient = (storyId) => {
    let hash = 0;
    for (let i = 0; i < storyId.length; i++) {
      hash = storyId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 45%) 0%, hsl(${hue2}, 75%, 35%) 100%)`;
  };

  // Reset states when story or mode changes
  useEffect(() => {
    setSelectedWord(null);
    setQuizAnswers({});
    setQuizSubmitted({});
    triggerMascot(t("mascotReadingWelcome"), "neutral");
  }, [selectedStoryId, mode]);

  // Handle character lookup clicks
  const handleCharClick = (char) => {
    // Search in story vocabulary dataset
    const matched = activeStory.vocabulary.find(
      (v) => v.simplified === char || v.traditional === char
    );

    if (matched) {
      setSelectedWord({
        hanzi: mode === "simplified" ? matched.simplified : matched.traditional,
        pinyin: matched.pinyin,
        meaning: matched.meaning
      });
      triggerMascot(t("mascotReadingWordMeaning").replace("{char}", char).replace("{meaning}", matched.meaning), "happy");
      playSound("correct");
    } else {
      // Fallback lookup (create clean character item)
      setSelectedWord({
        hanzi: char,
        pinyin: "-",
        meaning: t("labelVocabStudy")
      });
      triggerMascot(t("mascotReadingWordDetail").replace("{char}", char), "thinking");
    }
  };

  // Speak vocabulary or full sentences using SpeechSynthesis
  const handleSpeak = (text) => {
    const targetLang = mode === "simplified" ? "zh-CN" : "zh-TW";
    speakText(text, {
      lang: targetLang,
      rate: 0.85,
      onError: () => {
        if (triggerMascot) triggerMascot(t("speechNotSupported"), "sad");
      }
    });
  };

  // Process option selection in reading quizzes
  const handleSelectOption = (qIdx, optIdx) => {
    if (quizSubmitted[qIdx]) return; // locked after submission
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  // Check and submit answers
  const handleSubmitQuiz = (qIdx, correctIdx, userIdx) => {
    if (userIdx === undefined) return;
    
    setQuizSubmitted((prev) => ({ ...prev, [qIdx]: true }));
    
    if (userIdx === correctIdx) {
      playSound("success");
      addXp(10);
      triggerMascot(t("mascotReadingCorrect"), "excited");
    } else {
      playSound("wrong");
      triggerMascot(t("mascotReadingWrong"), "sad");
    }
  };

  // Parse narrative into interactive character spans
  const renderInteractiveText = (text) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      // Match words in vocab list and group them, or just split character by character
      const chars = Array.from(line);
      return (
        <div key={lineIdx} className="reading-paragraph">
          {chars.map((char, charIdx) => {
            const isPunctuation = /[，。！？：！？\s]/.test(char);
            if (isPunctuation) {
              return (
                <span key={charIdx} style={{ fontSize: "1.6rem", color: "hsl(var(--neutral-gray))", margin: "0 2px" }}>
                  {char}
                </span>
              );
            }

            // Find Pinyin transcription
            const matchedVocab = activeStory.vocabulary.find(
              (v) => v.simplified === char || v.traditional === char
            );
            const pinyinText = matchedVocab ? matchedVocab.pinyin : "";

            return (
              <div
                key={charIdx}
                className="reading-word-block"
                onClick={() => handleCharClick(char)}
              >
                <span className="word-hanzi">{char}</span>
                {showPinyin && pinyinText && (
                  <span className="word-pinyin">{pinyinText}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="reading-layout">
      {/* Story list selector sidebar */}
      <div className="reading-menu">
        <div className="glass-panel" style={{ padding: "18px" }}>
          <h4 style={{ fontWeight: 800, fontSize: "0.9rem", color: "hsl(var(--neutral-gray))", marginBottom: "15px", textTransform: "uppercase" }}>
            {t("titleReadingList")}
          </h4>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredReadingData.map((story) => {
              const activeTitle = mode === "simplified" ? story.titleSimplified : story.titleTraditional;
              return (
                <div
                  key={story.id}
                  className={`story-card ${story.id === selectedStoryId ? "active" : ""}`}
                  onClick={() => setSelectedStoryId(story.id)}
                >
                  <div className="story-card-title">{activeTitle}</div>
                  <div className="story-card-desc">{story.translationTitle}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Vocabulary lookup explorer */}
        {selectedWord && (
          <div className="vocab-popup-card">
            <div className="vocab-popup-header">
              <span className="vocab-popup-hanzi">{selectedWord.hanzi}</span>
              <div className="vocab-popup-meta">
                <span className="vocab-popup-pinyin">{selectedWord.pinyin}</span>
                <button
                  className="util-btn"
                  onClick={() => handleSpeak(selectedWord.hanzi)}
                  style={{ width: "32px", height: "32px", fontSize: "0.85rem", marginTop: "4px" }}
                  title="Nghe phát âm từ vựng"
                >
                  🔊
                </button>
              </div>
            </div>
            <div className="vocab-popup-meaning">{selectedWord.meaning}</div>
          </div>
        )}
      </div>

      {/* Main interactive story reading card */}
      <div className="reading-pane">
        <div className="reading-body-box">
          {/* Header toolbar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <button
              className={`btn ${showPinyin ? "btn-secondary" : "btn-ghost"}`}
              onClick={() => setShowPinyin(!showPinyin)}
              style={{ padding: "8px 16px", fontSize: "0.8rem" }}
            >
              {showPinyin ? t("btnTogglePinyinHide") : t("btnTogglePinyinShow")}
            </button>
            
            <button
              className="btn btn-ghost"
              onClick={() => handleSpeak(storyContent.replace(/[A-Z]:/g, ""))}
              style={{ padding: "8px 16px", fontSize: "0.8rem" }}
            >
              {t("btnReadFullStory")}
            </button>
          </div>

          {/* Cover illustration banner header */}
          <div className="reading-cover-banner">
            <ZenWatercolorCover 
              key={`canvas-${activeStory.id}`}
              storyId={activeStory.id} 
              title={activeStory.titleSimplified} 
              level={activeStory.level}
            />
            {hasCoverImage ? (
              <img 
                key={`img-${activeStory.id}`}
                src={getStoryCoverPath(activeStory.id)}
                alt={storyTitle}
                className="reading-cover-image"
                style={{ transition: "opacity 0.5s ease" }}
                onLoad={(e) => {
                  e.target.style.opacity = 1;
                  e.target.style.pointerEvents = 'auto';
                }}
                onError={(e) => {
                  e.target.style.opacity = 0;
                  e.target.style.pointerEvents = 'none';
                }}
              />
            ) : null}
          </div>

          {/* Beautiful Story Title Header Card below the cover image */}
          <div className="reading-story-header-card">
            <span className="cover-badge">{t("levelPrefix")} {activeStory.level}</span>
            <h2 className="cover-title-zh">{storyTitle}</h2>
            <span className="cover-title-pinyin">{activeStory.pinyinTitle || ""}</span>
            <span className="cover-title-vi">{activeStory.translationTitle || ""}</span>
          </div>

          {/* Interactive Story Content */}
          <div className="story-narrative-box">
            {renderInteractiveText(storyContent)}
          </div>
        </div>

        {/* Translation Card Drawer */}
        <div className="translation-drawer">
          <div className="translation-drawer-title">{t("labelTranslation")}</div>
          <div className="translation-drawer-body">{activeStory.translationText}</div>
        </div>

        {/* Comprehension Quiz section */}
        <div className="quiz-section">
          <h3 style={{ fontWeight: 800, fontSize: "1.2rem", color: "hsl(var(--neutral-dark))" }}>
            {t("titleComprehensionQuiz")}
          </h3>
          
          {activeStory.quizzes.map((quiz, qIdx) => {
            const correctOptionIdx = quiz.options.findIndex((o) => o.isCorrect);
            const userSelection = quizAnswers[qIdx];
            const isSubmitted = quizSubmitted[qIdx];
            const isCorrect = userSelection === correctOptionIdx;

            return (
              <div key={qIdx} className="quiz-card">
                <div className="quiz-question">
                  {t("quizQuestionPrefix")} {qIdx + 1}: {quiz.question}
                </div>
                
                <div className="quiz-options-list">
                  {quiz.options.map((opt, optIdx) => {
                    let optClass = "";
                    if (isSubmitted) {
                      if (optIdx === correctOptionIdx) optClass = "correct";
                      else if (optIdx === userSelection) optClass = "wrong";
                    } else if (optIdx === userSelection) {
                      optClass = "selected";
                    }

                    return (
                      <button
                        key={optIdx}
                        className={`quiz-option-btn ${optClass}`}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>

                {/* Confirm and explain buttons */}
                <div style={{ marginTop: "15px", display: "flex", justifyContent: "flex-end" }}>
                  {!isSubmitted ? (
                    <button
                      className={`btn btn-primary ${userSelection === undefined ? "btn-disabled" : ""}`}
                      disabled={userSelection === undefined}
                      onClick={() => handleSubmitQuiz(qIdx, correctOptionIdx, userSelection)}
                    >
                      {t("btnCheckAnswer")}
                    </button>
                  ) : (
                    <div className={`quiz-feedback-box ${isCorrect ? "correct" : "wrong"}`}>
                      {isCorrect ? t("feedbackCorrect") : t("feedbackWrong")} {quiz.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
