import React, { useState, useEffect } from "react";
import { sinoVietMap } from "../data/sinoVietMap";
import { typingData } from "../data/typingData";

export default function SkillFlashcards({
  mode,
  selectedLevel,
  addXp,
  triggerMascot,
  playSound,
  uiLang = "vi",
  t,
  mastery = 1000,
  updateMasteryScore,
  reviewLogs = [],
  addReviewLogs,
  globalVocabularyPool = [],
  customWords = []
}) {
  // Deck selection states
  const [activeDeck, setActiveDeck] = useState(null); // 'level' | 'custom' | 'weakness' | null
  const [deckCards, setDeckCards] = useState([]);
  
  // Phase states
  const [sessionMode, setSessionMode] = useState("study"); // 'study' | 'ready-to-test' | 'test' | 'report'
  const [cardAnimation, setCardAnimation] = useState(""); // 'card-shake' | 'card-slide-out-right' | 'card-slide-in' | ''

  // STUDY PHASE STATES (Leitner SRS style queue)
  const [deckQueue, setDeckQueue] = useState([]); // Active cards left to study
  const [completedStudyList, setCompletedStudyList] = useState([]); // Unique cards finished studying
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // TEST PHASE STATES
  const [testQueue, setTestQueue] = useState([]); // Unique list of words to test
  const [testCurrentIndex, setTestCurrentIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState({}); // { [wordId]: { selectedText: string, isCorrect: boolean } }
  
  // Dynamic test multiple choice quiz options
  const [quizOptions, setQuizOptions] = useState([]);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // REPORT PHASE STATES
  const [selectedReportWord, setSelectedReportWord] = useState(null);
  const [roundStats, setRoundStats] = useState({
    totalStudied: 0,
    correctCount: 0,
    xpEarned: 0
  });

  // Mascot first entry speech
  useEffect(() => {
    if (!activeDeck) {
      triggerMascot(t("mascotFlashcardsWelcome"), "excited");
    }
  }, [activeDeck, uiLang]);

  // Build local Sino-Vietnamese reading
  const getSinoViet = (word) => {
    if (word.sinoViet) return word.sinoViet;
    const text = word.simplified || "";
    const parts = [];
    for (const char of text) {
      if (sinoVietMap[char]) {
        const raw = sinoVietMap[char];
        const primary = raw.split("/")[0].trim();
        parts.push(primary);
      } else {
        parts.push(char);
      }
    }
    return parts.join(" ");
  };

  // Find example sentence from typingData
  const getExampleSentence = (wordObj) => {
    if (!wordObj) return null;
    const target = wordObj.simplified;
    const match = typingData.find(item => 
      item.sentenceSimplified && item.sentenceSimplified.includes(target)
    );
    if (match) {
      return {
        zh: mode === "simplified" ? match.sentenceSimplified : match.sentenceTraditional,
        vi: match.translation
      };
    }
    return null;
  };

  // Tone color-coded pinyin syllabic generator
  const renderColorCodedPinyin = (pinyinStr) => {
    if (!pinyinStr) return "";
    const syllables = pinyinStr.split(/\s+/);
    return (
      <span className="flashcard-pinyin-display">
        {syllables.map((syllable, idx) => {
          let toneClass = "tone-5";
          const lower = syllable.toLowerCase();
          
          if (/[āēīōūǖ]/.test(lower)) {
            toneClass = "tone-1";
          } else if (/[áéíóúǘ]/.test(lower)) {
            toneClass = "tone-2";
          } else if (/[ǎěǐǒǔǚ]/.test(lower)) {
            toneClass = "tone-3";
          } else if (/[àèìòùǜ]/.test(lower)) {
            toneClass = "tone-4";
          }
          
          return (
            <span key={idx} className={toneClass} style={{ marginRight: idx < syllables.length - 1 ? "6px" : "0" }}>
              {syllable}
            </span>
          );
        })}
      </span>
    );
  };

  // TTS Voice Synthesis
  const speakHanzi = (text) => {
    if (!window.speechSynthesis) return;
    
    // Safely cancel only if already speaking to avoid iOS deadlock
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.85;
    
    // Select correct Chinese voice dynamically (crucial for mobile/iOS Safari)
    try {
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(v => v.lang.toLowerCase() === "zh-cn" || v.lang.toLowerCase().replace("_", "-") === "zh-cn") || 
                      voices.find(v => v.lang.toLowerCase().startsWith("zh"));
      if (zhVoice) {
        utterance.voice = zhVoice;
      }
    } catch (e) {
      console.warn("Failed to find voice dynamically", e);
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Handle deck selection and creation
  const handleSelectDeck = (deckType) => {
    let pool = [];
    if (deckType === "level") {
      pool = globalVocabularyPool.filter(w => w.level === selectedLevel);
      // Shuffle & pull up to 10 words for the session to make it highly digestable
      pool = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    } else if (deckType === "custom") {
      pool = customWords;
    } else if (deckType === "weakness") {
      const logs = reviewLogs || [];
      const latestWordStatus = {};
      logs.forEach(log => {
        if (log && log.wordId && log.correct !== undefined) {
          latestWordStatus[String(log.wordId)] = log.correct;
        }
      });
      const failedIds = new Set();
      Object.entries(latestWordStatus).forEach(([wordId, isCorrect]) => {
        if (isCorrect === false) {
          failedIds.add(wordId);
        }
      });
      pool = globalVocabularyPool.filter(w => w && w.id && failedIds.has(String(w.id)));
      pool = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    }

    if (!pool.length) {
      playSound("wrong");
      return;
    }

    setActiveDeck(deckType);
    setDeckCards(pool);
    
    // Initialize Study phase
    setSessionMode("study");
    setCardAnimation("");
    setDeckQueue(pool.map(word => ({ ...word, failCount: 0 })));
    setCompletedStudyList([]);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSelectedReportWord(null);

    triggerMascot(t("mascotFlashcardsWelcome"), "happy");
    playSound("success");
  };

  // Study phase rating handler (Leitner SRS style queue)
  const handleStudyRate = (isCorrect) => {
    if (cardAnimation !== "") return;
    const currentQueueCard = deckQueue[currentCardIndex];
    if (!currentQueueCard) return;

    if (isCorrect) {
      // MASTERED / STUDIED SUCCESSFULLY
      playSound("correct");
      setCardAnimation("card-slide-out-right");
      
      triggerMascot(t("mascotFlashcardsCorrect") || "Tuyệt vời, bạn đã nhớ chữ này!", "excited");

      // Add to completedStudyList unique list
      setCompletedStudyList(prev => {
        if (prev.find(w => w.id === currentQueueCard.id)) return prev;
        return [...prev, currentQueueCard];
      });

      setTimeout(() => {
        // Filter out studied card from queue
        const nextQueue = deckQueue.filter((_, idx) => idx !== currentCardIndex);
        setDeckQueue(nextQueue);
        setIsFlipped(false);
        setCardAnimation("card-slide-in");
        
        if (nextQueue.length === 0) {
          // Study phase complete! Enter Ready to Test transition
          setSessionMode("ready-to-test");
          setCardAnimation("");
          triggerMascot("Tuyệt vời! Bạn đã xem qua toàn bộ nhóm từ. Hãy làm bài kiểm tra để xem mình nhớ thực tế được bao nhiêu từ nhé! ✍️", "excited");
        } else {
          // Adjust index safely
          setCurrentCardIndex(0);
          setTimeout(() => setCardAnimation(""), 350);
        }
      }, 300);

    } else {
      // NOT MEMORIZED YET
      playSound("wrong");
      setCardAnimation("card-shake");
      
      triggerMascot("Không sao, chúng ta sẽ ôn lại từ này ở cuối nhóm nhé! Cố lên!", "sad");

      // Move card to the end of the queue
      const updatedQueue = [...deckQueue];
      const [movedCard] = updatedQueue.splice(currentCardIndex, 1);
      updatedQueue.push(movedCard);
      setDeckQueue(updatedQueue);

      setTimeout(() => {
        setCardAnimation("");
        setIsFlipped(false);
        setCurrentCardIndex(0); // Focus on the next card in queue
      }, 500);
    }
  };

  // Switch from Study Phase to Test Phase
  const handleStartTest = () => {
    setSessionMode("test");
    setTestQueue([...completedStudyList].sort(() => Math.random() - 0.5)); // Shuffle for test
    setTestCurrentIndex(0);
    setTestAnswers({});
    setIsFlipped(false);
    triggerMascot("Bắt đầu bài kiểm tra trắc nghiệm! Hãy lật thẻ và chọn đáp án chính xác nhé!", "thinking");
  };

  // Generate verification quiz options dynamically for Test Mode
  const generateTestOptions = (wordObj) => {
    const correctText = wordObj.translation;
    const pool = [...deckCards, ...globalVocabularyPool];
    const otherTranslations = pool
      .map(w => w.translation)
      .filter(t => t && t.trim() !== "" && t.trim() !== correctText.trim());

    // Deduplicate distractors
    const uniqueDistractors = Array.from(new Set(otherTranslations));
    
    // Fallback if not enough other cards
    if (uniqueDistractors.length < 2) {
      uniqueDistractors.push("Học tập hằng ngày", "Hoa quả tươi ngon");
    }

    // Shuffle and pick 2
    const shuffledDistractors = uniqueDistractors.sort(() => Math.random() - 0.5).slice(0, 2);

    // Merge correct with distractors and shuffle
    return [
      { text: correctText, isCorrect: true },
      ...shuffledDistractors.map(d => ({ text: d, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);
  };

  // Listen to test card change to rebuild options
  useEffect(() => {
    if (sessionMode === "test" && testQueue[testCurrentIndex]) {
      const currentTestWord = testQueue[testCurrentIndex];
      const options = generateTestOptions(currentTestWord);
      setQuizOptions(options);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
    }
  }, [testCurrentIndex, sessionMode, testQueue]);

  // Test Quiz selection handler
  const handleTestSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOptionIdx(idx);
    setIsAnswered(true);
    
    const currentTestWord = testQueue[testCurrentIndex];
    const selected = quizOptions[idx];
    const isCorrect = selected.isCorrect;

    // Record response
    setTestAnswers(prev => ({
      ...prev,
      [currentTestWord.id]: {
        selectedText: selected.text,
        isCorrect: isCorrect
      }
    }));

    // Record logs to database for ZPD/DDA adaptation
    const newLog = {
      wordId: currentTestWord.id,
      skill: "flashcards",
      correct: isCorrect,
      timestamp: new Date().toISOString()
    };
    addReviewLogs([newLog]);

    if (isCorrect) {
      playSound("correct");
      triggerMascot("Chính xác! Bạn nhớ từ rất tốt! 🟢", "excited");
    } else {
      playSound("wrong");
      triggerMascot("Opps! Đáp án chưa chính xác rồi. 🔴", "sad");
    }

    // Auto-advance to next question after 750ms
    setTimeout(() => {
      const nextIdx = testCurrentIndex + 1;
      if (nextIdx >= testQueue.length) {
        handleFinishTest(nextIdx);
      } else {
        setTestCurrentIndex(nextIdx);
        setIsFlipped(false);
      }
    }, 750);
  };

  // Bypass option in test (Counts as wrong)
  const handleTestBypass = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOptionIdx(-1);

    const currentTestWord = testQueue[testCurrentIndex];
    
    setTestAnswers(prev => ({
      ...prev,
      [currentTestWord.id]: {
        selectedText: "Không nhớ",
        isCorrect: false
      }
    }));

    const newLog = {
      wordId: currentTestWord.id,
      skill: "flashcards",
      correct: false,
      timestamp: new Date().toISOString()
    };
    addReviewLogs([newLog]);

    playSound("wrong");
    triggerMascot("Không sao, chúng ta sẽ ôn lại sau nhé!", "neutral");

    setTimeout(() => {
      const nextIdx = testCurrentIndex + 1;
      if (nextIdx >= testQueue.length) {
        handleFinishTest(nextIdx);
      } else {
        setTestCurrentIndex(nextIdx);
        setIsFlipped(false);
      }
    }, 750);
  };

  // Compile test statistics and award XP
  const handleFinishTest = (totalCount) => {
    playSound("success");

    // Compute accuracy
    const answersList = Object.values(testAnswers);
    const correctCount = answersList.filter(a => a.isCorrect).length;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 100;
    const xp = correctCount * 5; // +5 XP per correct tested answer

    // Update global ZPD mastery
    updateMasteryScore("flashcards", accuracy);

    // Save final stats
    setRoundStats({
      totalStudied: totalCount,
      correctCount: correctCount,
      xpEarned: xp
    });

    addXp(xp);
    setSessionMode("report");

    const mascotMsg = `Bài kiểm tra hoàn tất! Độ thuộc bài: ${accuracy}%.\nBạn đã ghi nhớ được ${correctCount}/${totalCount} từ và nhận thêm +${xp} XP! 🏆`;
    triggerMascot(mascotMsg, accuracy >= 80 ? "excited" : "happy");
  };

  // Exit back to selector
  const handleExitDeck = () => {
    setActiveDeck(null);
    setDeckCards([]);
    setDeckQueue([]);
    setCompletedStudyList([]);
    setSessionMode("study");
    setCardAnimation("");
    triggerMascot(t("mascotFlashcardsWelcome"), "neutral");
  };

  // Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeDeck || sessionMode === "report" || cardAnimation !== "") return;
      
      if (e.code === "Space") {
        e.preventDefault();
        if (sessionMode === "ready-to-test") {
          handleStartTest();
        } else {
          setIsFlipped(prev => !prev);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (sessionMode === "study" && isFlipped) {
          handleStudyRate(false);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (sessionMode === "study" && isFlipped) {
          handleStudyRate(true);
        }
      } else if (e.key === "1") {
        e.preventDefault();
        if (sessionMode === "test" && isFlipped && !isAnswered && quizOptions[0]) {
          handleTestSelectOption(0);
        }
      } else if (e.key === "2") {
        e.preventDefault();
        if (sessionMode === "test" && isFlipped && !isAnswered && quizOptions[1]) {
          handleTestSelectOption(1);
        }
      } else if (e.key === "3") {
        e.preventDefault();
        if (sessionMode === "test" && isFlipped && !isAnswered && quizOptions[2]) {
          handleTestSelectOption(2);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (sessionMode === "test" && isFlipped && !isAnswered) {
          handleTestBypass();
        }
      } else if (e.key === "ArrowUp" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        let word = null;
        if (sessionMode === "study") {
          word = deckQueue[currentCardIndex];
        } else if (sessionMode === "test") {
          word = testQueue[testCurrentIndex];
        }
        if (word) {
          speakHanzi(mode === "simplified" ? (word.simplified || word.traditional) : (word.traditional || word.simplified));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeDeck, sessionMode, currentCardIndex, testCurrentIndex, isFlipped, cardAnimation, deckQueue, testQueue, isAnswered, quizOptions]);

  // Render Selector Hub View
  if (!activeDeck) {
    const totalLevelWords = globalVocabularyPool.filter(w => w.level === selectedLevel).length;
    const totalCustomWords = customWords.length;
    const logs = reviewLogs || [];
    const latestWordStatus = {};
    logs.forEach(log => {
      if (log && log.wordId && log.correct !== undefined) {
        latestWordStatus[String(log.wordId)] = log.correct;
      }
    });
    const failedIds = new Set();
    Object.entries(latestWordStatus).forEach(([wordId, isCorrect]) => {
      if (isCorrect === false) {
        failedIds.add(wordId);
      }
    });
    const totalWeakWords = globalVocabularyPool.filter(w => w && w.id && failedIds.has(String(w.id))).length;

    return (
      <div className="deck-hub-container">
        <h3 className="typing-prompt-label" style={{ marginBottom: "5px" }}>{t("deckSelectTitle")}</h3>
        <div className="deck-grid">
          {/* Level Deck */}
          <div 
            className="deck-card active" 
            onClick={() => handleSelectDeck("level")}
          >
            <div className="deck-card-header">
              <div className="deck-card-title">
                {t("deckLevelPrefix")} {selectedLevel}
              </div>
              <span className="badge-easy flashcard-category-badge" style={{ background: "hsl(var(--primary-teal-light))", color: "hsl(var(--primary-teal-dark))" }}>
                {t("badgeEasyFlashcards")}
              </span>
            </div>
            <div className="deck-card-stats">
              Số từ: {totalLevelWords}
            </div>
            <button 
              className="btn btn-primary deck-card-btn"
              onClick={(e) => { e.stopPropagation(); handleSelectDeck("level"); }}
            >
              ⚡ Học & Kiểm tra
            </button>
          </div>

          {/* Custom Words Deck */}
          <div 
            className={`deck-card ${totalCustomWords > 0 ? "active" : "btn-disabled"}`} 
            onClick={() => totalCustomWords > 0 && handleSelectDeck("custom")}
            style={{ opacity: totalCustomWords > 0 ? 1 : 0.6 }}
          >
            <div className="deck-card-header">
              <div className="deck-card-title">
                {t("deckCustom")}
              </div>
              <span className="flashcard-category-badge" style={{ background: "hsl(var(--accent-orange-light))", color: "hsl(var(--accent-orange))" }}>
                CÁ NHÂN
              </span>
            </div>
            <div className="deck-card-stats">
              Số từ: {totalCustomWords}
            </div>
            <button 
              className="btn btn-secondary deck-card-btn" 
              disabled={totalCustomWords === 0}
              onClick={(e) => { e.stopPropagation(); handleSelectDeck("custom"); }}
            >
              ⭐ Vào học
            </button>
          </div>

          {/* Weakness Deck */}
          <div 
            className={`deck-card ${totalWeakWords > 0 ? "active" : "btn-disabled"}`}
            onClick={() => totalWeakWords > 0 && handleSelectDeck("weakness")}
            style={{ opacity: totalWeakWords > 0 ? 1 : 0.6 }}
          >
            <div className="deck-card-header">
              <div className="deck-card-title">
                {t("deckWeakness")}
              </div>
              <span className="flashcard-category-badge" style={{ background: "rgba(239, 68, 68, 0.1)", color: "hsl(var(--danger-red))" }}>
                {t("badgeHardFlashcards")}
              </span>
            </div>
            <div className="deck-card-stats">
              Số từ: {totalWeakWords}
            </div>
            <button 
              className="btn btn-danger deck-card-btn" 
              disabled={totalWeakWords === 0} 
              style={{ color: totalWeakWords > 0 ? "white" : "" }}
              onClick={(e) => { e.stopPropagation(); handleSelectDeck("weakness"); }}
            >
              🔴 Ôn tập
            </button>
          </div>
        </div>

        {totalCustomWords === 0 && (
          <p className="typing-paste-hint" style={{ marginTop: "10px" }}>
            💡 Gợi ý: Hãy thêm từ vựng mới tại kỹ năng <strong>Viết chữ Hán</strong> để mở khóa bộ từ Tự thêm nhé!
          </p>
        )}
      </div>
    );
  }

  // Render Transition: Ready to Test
  if (sessionMode === "ready-to-test") {
    return (
      <div className="typing-finish-card glass-panel" style={{ padding: "35px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
        <span style={{ fontSize: "3.5rem", display: "block", marginBottom: "15px" }}>✍️</span>
        <h3 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "15px" }}>Sẵn Sàng Kiểm Tra!</h3>
        <p className="typing-paste-hint" style={{ fontSize: "1.05rem", marginBottom: "25px", lineHeight: "1.6" }}>
          Bạn đã hoàn thành phần học nhóm từ gồm <strong>{completedStudyList.length} từ</strong>. Bây giờ hãy làm bài kiểm tra trắc nghiệm để xem mức độ thuộc từ thực tế nhé!
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={handleStartTest} style={{ padding: "12px 28px", fontSize: "1rem" }}>
            🚀 Bắt đầu làm bài Kiểm tra ➔
          </button>
        </div>
      </div>
    );
  }

  // Render Report view (After completing the test)
  if (sessionMode === "report") {
    const accuracy = roundStats.totalStudied > 0 ? Math.round((roundStats.correctCount / roundStats.totalStudied) * 100) : 100;
    
    // Sort words into correct and incorrect lists
    const masteredList = testQueue.filter(w => testAnswers[w.id]?.isCorrect);
    const needPracticeList = testQueue.filter(w => !testAnswers[w.id]?.isCorrect);

    return (
      <div className="typing-finish-card glass-panel" style={{ padding: "24px", maxWidth: "750px", width: "100%", margin: "0 auto" }}>
        <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "10px", textAlign: "center" }}>📊 Báo Cáo Kết Quả Kiểm Tra</h3>
        <p className="typing-paste-hint" style={{ fontSize: "0.95rem", marginBottom: "20px", textAlign: "center" }}>
          Đánh giá năng lực ghi nhớ từ vựng khách quan
        </p>

        {/* Highlight Score Box */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
          <div style={{ background: "rgba(20, 184, 166, 0.08)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(20, 184, 166, 0.15)", textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--neutral-gray))", display: "block", textTransform: "uppercase" }}>Tỉ lệ thuộc bài</span>
            <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "hsl(var(--primary-teal-dark))" }}>{accuracy}%</span>
          </div>
          <div style={{ background: "rgba(245, 158, 11, 0.08)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(245, 158, 11, 0.15)", textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--neutral-gray))", display: "block", textTransform: "uppercase" }}>Kinh nghiệm nhận</span>
            <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "hsl(var(--accent-orange))" }}>+{roundStats.xpEarned} XP</span>
          </div>
        </div>

        {/* Word Lists side-by-side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
          {/* Mastered Column */}
          <div style={{ background: "rgba(34, 197, 94, 0.04)", border: "1px solid rgba(34, 197, 94, 0.12)", borderRadius: "12px", padding: "15px" }}>
            <h4 style={{ fontSize: "0.9rem", color: "hsl(var(--success-green))", fontWeight: 800, borderBottom: "1px solid rgba(34, 197, 94, 0.15)", paddingBottom: "8px", marginBottom: "10px" }}>
              🟢 ĐÃ THUỘC ({masteredList.length})
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "150px", overflowY: "auto", paddingRight: "4px" }}>
              {masteredList.length === 0 ? <span style={{ fontSize: "0.8rem", color: "hsl(var(--neutral-gray))", fontStyle: "italic" }}>Trống</span> : 
                masteredList.map(w => (
                  <button 
                    key={w.id} 
                    className="btn btn-ghost" 
                    style={{ padding: "4px 8px", fontSize: "0.9rem", background: "white", border: "1px solid rgba(0,0,0,0.05)" }}
                    onClick={() => setSelectedReportWord(w)}
                  >
                    {mode === "simplified" ? w.simplified : w.traditional}
                  </button>
                ))
              }
            </div>
          </div>

          {/* Practice Column */}
          <div style={{ background: "rgba(239, 68, 68, 0.04)", border: "1px solid rgba(239, 68, 68, 0.12)", borderRadius: "12px", padding: "15px" }}>
            <h4 style={{ fontSize: "0.9rem", color: "hsl(var(--danger-red))", fontWeight: 800, borderBottom: "1px solid rgba(239, 68, 68, 0.15)", paddingBottom: "8px", marginBottom: "10px" }}>
              🔴 CHƯA THUỘC ({needPracticeList.length})
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "150px", overflowY: "auto", paddingRight: "4px" }}>
              {needPracticeList.length === 0 ? <span style={{ fontSize: "0.8rem", color: "hsl(var(--neutral-gray))", fontStyle: "italic" }}>Trống</span> : 
                needPracticeList.map(w => (
                  <button 
                    key={w.id} 
                    className="btn btn-ghost" 
                    style={{ padding: "4px 8px", fontSize: "0.9rem", background: "white", border: "1px solid rgba(0,0,0,0.05)" }}
                    onClick={() => setSelectedReportWord(w)}
                  >
                    {mode === "simplified" ? w.simplified : w.traditional}
                  </button>
                ))
              }
            </div>
          </div>
        </div>

        {/* Dynamic Details Explorer Widget below */}
        {selectedReportWord && (
          <div className="vocab-popup-card" style={{ marginTop: "0", marginBottom: "25px", border: "1px solid hsl(var(--primary-teal))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <span style={{ fontSize: "2rem", fontWeight: 900, color: "hsl(var(--neutral-dark))" }}>
                  {mode === "simplified" ? selectedReportWord.simplified : selectedReportWord.traditional}
                </span>
                <div style={{ marginTop: "4px" }}>
                  {renderColorCodedPinyin(selectedReportWord.pinyin)}
                  <span style={{ fontSize: "0.8rem", color: "hsl(var(--neutral-gray))", marginLeft: "10px" }}>
                    Hán-Việt: {getSinoViet(selectedReportWord)}
                  </span>
                </div>
              </div>
              <button 
                className="btn btn-secondary" 
                onClick={() => speakHanzi(mode === "simplified" ? selectedReportWord.simplified : selectedReportWord.traditional)}
                style={{ padding: "8px 12px", fontSize: "0.8rem" }}
              >
                🔊 Nghe đọc
              </button>
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, margin: "10px 0", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px" }}>
              Nghĩa: {selectedReportWord.translation}
            </div>
            {getExampleSentence(selectedReportWord) && (
              <div style={{ background: "rgba(0,0,0,0.02)", padding: "10px", borderRadius: "8px", fontSize: "0.85rem", marginTop: "5px" }}>
                <strong>Ví dụ: </strong>{getExampleSentence(selectedReportWord).zh} ({getExampleSentence(selectedReportWord).vi})
              </div>
            )}
          </div>
        )}

        {/* Control actions */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => handleSelectDeck(activeDeck)}>
            🔄 Học lại bộ này
          </button>
          <button className="btn btn-secondary" onClick={handleExitDeck}>
            🎴 Về trang chủ bộ thẻ
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE CARD STUDY / TEST VIEW RENDERING
  const activeWord = sessionMode === "study" ? deckQueue[currentCardIndex] : testQueue[testCurrentIndex];
  if (!activeWord) return null;

  const chineseText = mode === "simplified" ? (activeWord.simplified || activeWord.traditional) : (activeWord.traditional || activeWord.simplified);
  const example = getExampleSentence(activeWord);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "15px" }}>
      {/* Top Header stats bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", fontSize: "0.85rem", fontWeight: 700, color: "hsl(var(--neutral-gray))" }}>
        <span>
          {sessionMode === "study" 
            ? `📖 Đang Học: Còn lại ${deckQueue.length} từ` 
            : `✍️ Kiểm Tra: ${testCurrentIndex + 1}/${testQueue.length} từ`
          }
        </span>
        <span>Bộ thẻ: {activeDeck === "level" ? `HSK ${selectedLevel}` : activeDeck === "custom" ? "Tự thêm" : "Yếu điểm"}</span>
      </div>

      {/* 3D Flip Card */}
      <div className={`flashcard-wrapper ${isFlipped ? "is-flipped" : ""} ${cardAnimation}`} onClick={() => setIsFlipped(!isFlipped)}>
        <div className="flashcard-inner">
          
          {/* FRONT FACE */}
          <div className="flashcard-front">
            <div className="flashcard-badge-row">
              <span className="flashcard-level-badge">HSK {activeWord.level}</span>
              <span className="flashcard-category-badge">{activeWord.category || "Từ vựng"}</span>
            </div>

            <div className="flashcard-hanzi-display">
              {chineseText}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <button 
                className="btn btn-secondary" 
                onClick={(e) => {
                  e.stopPropagation(); // Stop flip trigger
                  speakHanzi(chineseText);
                }}
                style={{ borderRadius: "50%", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
              >
                🔊
              </button>
              <span className="flashcard-flip-prompt">
                {t("flashcardFlipTip")}
              </span>
            </div>
          </div>

          {/* BACK FACE */}
          <div className="flashcard-back" onClick={(e) => e.stopPropagation()}>
            <div className="flashcard-badge-row">
              <span className="flashcard-level-badge">HSK {activeWord.level}</span>
              <span className="flashcard-category-badge">{activeWord.category || "Từ vựng"}</span>
            </div>

            {/* STUDY MODE: FULL INFORMATION VISIBLE (Pinyin, Meaning, Example, Subjective Buttons) */}
            {sessionMode === "study" ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", justifyContent: "space-between" }}>
                <div className="flashcard-back-header">
                  {renderColorCodedPinyin(activeWord.pinyin)}
                  <span className="flashcard-sinoviet-display">
                    Hán-Việt: {getSinoViet(activeWord)}
                  </span>
                </div>

                <div className="flashcard-meaning-display" style={{ margin: "5px 0" }}>
                  {activeWord.translation}
                </div>

                {/* Example sentence box if found */}
                {example ? (
                  <div className="flashcard-example-box" onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "5px" }}>
                      <span className="flashcard-example-zh">{example.zh}</span>
                      <button 
                        onClick={() => speakHanzi(example.zh)} 
                        style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1rem" }}
                      >
                        🔊
                      </button>
                    </div>
                    <span className="flashcard-example-vi">{example.vi}</span>
                  </div>
                ) : (
                  <div style={{ flexGrow: 1 }} />
                )}

                {/* Study Self-Rating Action Buttons */}
                <div className="card-rating-bar" style={{ marginTop: "10px" }}>
                  <button 
                    className="rating-btn rating-btn-need" 
                    onClick={() => handleStudyRate(false)}
                    style={{ fontSize: "0.8rem" }}
                  >
                    🔴 Chưa thuộc (Ôn lại)
                  </button>
                  <button 
                    className="rating-btn rating-btn-mastered" 
                    onClick={() => handleStudyRate(true)}
                    style={{ fontSize: "0.8rem" }}
                  >
                    🟢 Đã thuộc (Xong)
                  </button>
                </div>
              </div>
            ) : (
              /* TEST MODE: 3-CHOICE MUTIPLE CHOICE QUIZ ONLY (Pinyin/meaning are hidden until answered) */
              <div className="flashcard-quiz-container">
                <div className="flashcard-quiz-question">Nghĩa của từ vựng này là gì?</div>
                {quizOptions.map((opt, oIdx) => {
                  let btnClass = "flashcard-choice-btn";
                  if (isAnswered) {
                    if (opt.isCorrect) btnClass += " correct";
                    else if (oIdx === selectedOptionIdx) btnClass += " incorrect";
                  }
                  return (
                    <button
                      key={oIdx}
                      className={btnClass}
                      onClick={() => handleTestSelectOption(oIdx)}
                      disabled={isAnswered}
                    >
                      <span>
                        <span className="choice-badge">{oIdx + 1}</span>
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
                <button 
                  className="btn btn-ghost" 
                  onClick={handleTestBypass}
                  disabled={isAnswered}
                  style={{ fontSize: "0.8rem", color: "hsl(var(--neutral-gray))", marginTop: "5px" }}
                >
                  Không nhớ, bỏ qua
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Under Card Keyboard Shortcuts Hint */}
      <div className="keyboard-shortcuts-bar">
        {sessionMode === "study" ? (
          !isFlipped 
            ? "Phím [Space]: Lật thẻ học | Phím [↑]: Nghe phát âm" 
            : "Phím [← Trái]: Chưa thuộc | Phím [→ Phải]: Đã thuộc | Phím [↑]: Nghe phát âm | Phím [Space]: Lật lại"
        ) : (
          !isFlipped 
            ? "Phím [Space]: Lật thẻ kiểm tra | Phím [↑]: Nghe phát âm" 
            : "Phím [1, 2, 3]: Chọn đáp án | Phím [↓]: Xem đáp án/Bỏ qua | Phím [Space]: Lật lại"
        )}
      </div>

      {/* Exit Button */}
      <button className="btn btn-secondary" onClick={handleExitDeck} style={{ marginTop: "5px", width: "100%", maxWidth: "200px" }}>
        🚪 Thoát bộ thẻ
      </button>
    </div>
  );
}
