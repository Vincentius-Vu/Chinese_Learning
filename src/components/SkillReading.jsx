import React, { useState, useEffect } from "react";
import { readingData } from "../data/vocabulary";

export default function SkillReading({
  mode,
  selectedLevel,
  addXp,
  triggerMascot,
  playSound
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

  // Reset states when story or mode changes
  useEffect(() => {
    setSelectedWord(null);
    setQuizAnswers({});
    setQuizSubmitted({});
    triggerMascot("Hãy đọc kỹ đoạn văn dưới đây. Bạn có thể nhấn vào bất kỳ từ nào để tra cứu nghĩa và phát âm nhé! 📖", "neutral");
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
      triggerMascot(`Từ "${char}" có nghĩa là: ${matched.meaning}. Nhấn nút 🔊 để nghe phát âm!`, "happy");
      playSound("correct");
    } else {
      // Fallback lookup (create clean character item)
      setSelectedWord({
        hanzi: char,
        pinyin: "-",
        meaning: "Từ vựng bổ trợ trong câu"
      });
      triggerMascot(`Bạn đang xem từ "${char}". Hãy xem các từ vựng cốt lõi bên dưới nhé!`, "thinking");
    }
  };

  // Speak vocabulary or full sentences using SpeechSynthesis
  const handleSpeak = (text) => {
    if (!window.speechSynthesis) {
      triggerMascot("Trình duyệt không hỗ trợ tổng hợp giọng nói.", "sad");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = mode === "simplified" ? "zh-CN" : "zh-TW";
    utterance.rate = 0.85; // slightly slower for beginners
    window.speechSynthesis.speak(utterance);
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
      triggerMascot("Đáp án hoàn toàn chính xác! Tuyệt vời lắm bạn ơi, +10 XP! 🏆", "excited");
    } else {
      playSound("wrong");
      triggerMascot("Câu trả lời chưa chính xác rồi. Hãy đọc lại bài và thử lại nhé! 🐃", "sad");
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
            Danh sách bài đọc
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
              {showPinyin ? "🙈 Ẩn phiên âm (Pinyin)" : "👁️ Hiện phiên âm (Pinyin)"}
            </button>
            
            <button
              className="btn btn-ghost"
              onClick={() => handleSpeak(storyContent.replace(/[A-Z]:/g, ""))}
              style={{ padding: "8px 16px", fontSize: "0.8rem" }}
            >
              🔊 Đọc cả bài thoại
            </button>
          </div>

          <h2 className="reading-interactive-title">{storyTitle}</h2>

          {/* Interactive Story Content */}
          <div className="story-narrative-box">
            {renderInteractiveText(storyContent)}
          </div>
        </div>

        {/* Translation Card Drawer */}
        <div className="translation-drawer">
          <div className="translation-drawer-title">Bản dịch Tiếng Việt:</div>
          <div className="translation-drawer-body">{activeStory.translationText}</div>
        </div>

        {/* Comprehension Quiz section */}
        <div className="quiz-section">
          <h3 style={{ fontWeight: 800, fontSize: "1.2rem", color: "hsl(var(--neutral-dark))" }}>
            🎯 Trắc Nghiệm Đọc Hiểu
          </h3>
          
          {activeStory.quizzes.map((quiz, qIdx) => {
            const correctOptionIdx = quiz.options.findIndex((o) => o.isCorrect);
            const userSelection = quizAnswers[qIdx];
            const isSubmitted = quizSubmitted[qIdx];
            const isCorrect = userSelection === correctOptionIdx;

            return (
              <div key={qIdx} className="quiz-card">
                <div className="quiz-question">
                  Câu {qIdx + 1}: {quiz.question}
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
                      ✓ Kiểm tra
                    </button>
                  ) : (
                    <div className={`quiz-feedback-box ${isCorrect ? "correct" : "wrong"}`}>
                      {isCorrect ? "🎉 Chính xác!" : "❌ Chưa đúng!"} {quiz.explanation}
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
