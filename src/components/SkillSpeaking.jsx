import React, { useState, useEffect, useRef } from "react";
import { speakingData } from "../data/vocabulary";
import { getAdaptiveVocabulary } from "../lib/adaptiveLearning";
import { speakText } from "../lib/tts";
import { AudioRecorder } from "../lib/audioHelper";
import WhisperWorker from "../lib/whisper.worker.js?worker";

// ── Pinyin & Levenshtein Helper Functions for Homophone-Resistant Matching ──
let charPinyinLookup = null;

const buildCharPinyinMapOnce = (vocabPool = []) => {
  if (charPinyinLookup) return charPinyinLookup;
  charPinyinLookup = {};
  const syllableRegex = /([bcdfghjklmnpqrstwz]?h?[āáǎàaēéěèeīíǐìiōóǒòoūúǔùuǖǘǚǜüv]+(?:ng|n|r)?)/gi;

  vocabPool.forEach((item) => {
    const hanzi = item.simplified;
    const tradHanzi = item.traditional;
    const pinyin = item.pinyin;
    if (!hanzi || !pinyin) return;

    const syllables = pinyin.match(syllableRegex);
    if (syllables && syllables.length === hanzi.length) {
      for (let i = 0; i < hanzi.length; i++) {
        const char = hanzi[i];
        const syl = syllables[i].toLowerCase();
        if (!charPinyinLookup[char]) charPinyinLookup[char] = new Set();
        charPinyinLookup[char].add(syl);
      }
    }

    if (tradHanzi && syllables && syllables.length === tradHanzi.length) {
      for (let i = 0; i < tradHanzi.length; i++) {
        const char = tradHanzi[i];
        const syl = syllables[i].toLowerCase();
        if (!charPinyinLookup[char]) charPinyinLookup[char] = new Set();
        charPinyinLookup[char].add(syl);
      }
    }
  });

  // Convert Sets to Arrays
  for (const char in charPinyinLookup) {
    charPinyinLookup[char] = Array.from(charPinyinLookup[char]);
  }
  return charPinyinLookup;
};

const removePinyinTones = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[āáǎà]/g, "a")
    .replace(/[ēéěè]/g, "e")
    .replace(/[īíǐì]/g, "i")
    .replace(/[ōóǒò]/g, "o")
    .replace(/[ūúǔù]/g, "u")
    .replace(/[ǖǘǚǜü]/g, "v")
    .replace(/[^a-z]/g, "");
};

const levenshteinDistance = (a, b) => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

export default function SkillSpeaking({
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
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState(null);
  const [correctCount, setCorrectCount] = useState(0); // Cumulative count of correct matches
  const [errorMsg, setErrorMsg] = useState("");
  const [hasMicSupport, setHasMicSupport] = useState(true);
  const [isVocabRoundFinished, setIsVocabRoundFinished] = useState(false);

  // Whisper offline AI states
  const [modelStatus, setModelStatus] = useState("idle"); // 'idle' | 'loading' | 'ready' | 'transcribing'
  const [loadProgress, setLoadProgress] = useState(0);
  const workerRef = useRef(null);
  const recorderRef = useRef(null);

  // Generate exercises based on adaptive vocabulary (ZPD)
  const generateAdaptiveSpeakingExercises = () => {
    const vocabPool = globalVocabularyPool || [];
    const logs = reviewLogs || [];
    const masteryVal = mastery !== undefined ? mastery : 1000;

    const targetWords = getAdaptiveVocabulary("speaking", selectedLevel, vocabPool, logs, masteryVal);
    if (!targetWords.length) return [];

    return targetWords.map((item, index) => {
      return {
        id: `vocab_speak_${item.id}_${index}`,
        wordId: item.id,
        level: item.level,
        simplified: item.simplified,
        traditional: item.traditional,
        pinyin: item.pinyin,
        translation: item.translation,
        sinoViet: item.sinoViet || "",
        category: item.category || ""
      };
    });
  };

  // Filter based on selectedLevel for Sentence mode
  const filteredSpeakingData = speakingData.filter((item) => item.level === selectedLevel);

  // Active exercises pool
  const activeExercises = exerciseMode === "vocab" ? vocabExercises : filteredSpeakingData;
  const activeQuestion = activeExercises[currentIndex] || activeExercises[0];
  const targetText = activeQuestion ? (mode === "simplified" ? activeQuestion.simplified : activeQuestion.traditional) : "";

  // Reset states when level or mode changes
  useEffect(() => {
    if (exerciseMode === "vocab") {
      const fresh = generateAdaptiveSpeakingExercises();
      setVocabExercises(fresh);
    }
    setCurrentIndex(0);
    setScore(null);
    setCorrectCount(0);
    setTranscript("");
    setErrorMsg("");
    setIsVocabRoundFinished(false);
  }, [selectedLevel, exerciseMode, mastery]);

  // Initialize Whisper Web Worker & AudioRecorder
  useEffect(() => {
    recorderRef.current = new AudioRecorder();

    // Check microphone availability to set correct support flag
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        setHasMicSupport(true);
      })
      .catch((err) => {
        console.warn("Microphone not available or permission denied:", err);
        setHasMicSupport(false);
      });

    // Load Whisper Web Worker via Vite's robust worker bundler query
    const worker = new WhisperWorker();
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const { status, data, text, error } = event.data;

      if (status === "progress") {
        if (data.status === "progress" && data.progress !== undefined) {
          setModelStatus("loading");
          setLoadProgress(Math.round(data.progress));
        } else if (data.status === "ready") {
          setModelStatus("ready");
        }
      } else if (status === "started") {
        setModelStatus("transcribing");
      } else if (status === "completed") {
        setModelStatus("ready");
        setIsRecording(false);
        const transcribedText = text ? text.trim() : "";
        setTranscript(transcribedText);
        gradeUserSpeech(transcribedText);
      } else if (status === "error") {
        setModelStatus("ready");
        setIsRecording(false);
        setErrorMsg(`Lỗi AI Whisper: ${error}`);
        
        // Auto-clear corrupted browser cache storage in the background to self-heal
        try {
          if (typeof caches !== "undefined") {
            caches.keys().then((keys) => {
              keys.forEach((key) => {
                if (key.includes("transformer")) {
                  caches.delete(key).then(() => {
                    console.log("Automatically cleared outdated/corrupted AI cache:", key);
                  });
                }
              });
            });
          }
        } catch (e) {
          console.warn("Failed to auto-clear CacheStorage", e);
        }
      }
    };

    const mascotWelcomeText = exerciseMode === "vocab" 
      ? (t("labelVocabSpeakingWelcome") || "Luyện phát âm từ vựng chuẩn! Nhấn giữ nút Micro, lắng nghe âm mẫu, sau đó đọc to từ mục tiêu để nhận điểm nhé! 🎙️")
      : t("mascotSpeakingWelcome");
    triggerMascot(mascotWelcomeText, "neutral");

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [currentIndex, mode, exerciseMode]);

  // Clean active speech job on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Compare transcript and target phrase
  const gradeUserSpeech = (spoken) => {
    // Strip punctuations and spaces
    const cleanSpoken = spoken.replace(/[，。！？：、.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, "");
    const cleanTarget = targetText.replace(/[，。！？：、.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, "");

    if (cleanSpoken.length === 0) {
      setScore(0);
      triggerMascot(t("mascotSpeakingNotClear"), "sad");
      playSound("wrong");
      return;
    }

    // Determine difficulty configurations based on Mastery DDA
    const masteryVal = mastery !== undefined ? mastery : 1000;
    let targetThreshold = 80;
    let useStrictTones = false;

    if (masteryVal < 1100) {
      targetThreshold = 70;
      useStrictTones = false;
    } else if (masteryVal < 1400) {
      targetThreshold = 80;
      useStrictTones = false;
    } else {
      targetThreshold = 90;
      useStrictTones = true;
    }

    // 1. Character-based matching (exact matches)
    let charMatches = 0;
    const spokenChars = Array.from(cleanSpoken);
    const targetChars = Array.from(cleanTarget);

    targetChars.forEach((char) => {
      if (spokenChars.includes(char)) {
        charMatches++;
      }
    });
    const charSimilarity = Math.min(100, Math.round((charMatches / targetChars.length) * 100));

    // 2. Pinyin-based homophone-resistant matching
    const pinyinMap = buildCharPinyinMapOnce(globalVocabularyPool || []);
    
    // Target Pinyin: strip punctuation & spaces
    const targetPinyinCleaned = activeQuestion.pinyin.replace(/[，。！？：、.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, "");
    const cleanTargetPinyin = useStrictTones 
      ? targetPinyinCleaned.toLowerCase()
      : removePinyinTones(targetPinyinCleaned);
    
    // Spoken Pinyin: convert spoken hanzi character-by-character to tone-free pinyin (or strict tone pinyin)
    let cleanSpokenPinyin = "";
    for (let i = 0; i < cleanSpoken.length; i++) {
      const char = cleanSpoken[i];
      const pinyins = pinyinMap[char];
      if (pinyins && pinyins.length > 0) {
        cleanSpokenPinyin += useStrictTones 
          ? pinyins[0].toLowerCase().replace(/[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, "")
          : removePinyinTones(pinyins[0]);
      } else {
        cleanSpokenPinyin += char.toLowerCase();
      }
    }

    let pinyinSimilarity = 0;
    if (cleanTargetPinyin.length > 0 && cleanSpokenPinyin.length > 0) {
      const distance = levenshteinDistance(cleanTargetPinyin, cleanSpokenPinyin);
      const maxLength = Math.max(cleanTargetPinyin.length, cleanSpokenPinyin.length);
      pinyinSimilarity = Math.min(100, Math.round(((maxLength - distance) / maxLength) * 100));
    }

    // Take the maximum of both similarity engines!
    const similarityScore = Math.max(charSimilarity, pinyinSimilarity);
    setScore(similarityScore);

    const isCorrect = similarityScore >= targetThreshold;

    // Log the result
    if (addReviewLogs && activeQuestion && exerciseMode === "vocab") {
      addReviewLogs([{
        wordId: activeQuestion.wordId,
        correct: isCorrect,
        timestamp: new Date().toISOString()
      }]);
    }

    if (isCorrect) {
      playSound("success");
      setCorrectCount((prev) => prev + 1);
      addXp(20);
      let mascotMsg = t("mascotSpeakingExcellent").replace("{score}", similarityScore);
      if (exerciseMode === "vocab" && activeQuestion.sinoViet) {
        mascotMsg = `Xuất sắc! Bạn phát âm từ "${targetText}" (${activeQuestion.pinyin} - Hán Việt: "${activeQuestion.sinoViet}") cực kỳ chuẩn xác (${similarityScore}% khớp). Nhận +20 XP! 🏆`;
      }
      triggerMascot(mascotMsg, "excited");
    } else if (similarityScore >= 50) {
      playSound("correct");
      addXp(10);
      let mascotMsg = t("mascotSpeakingGood").replace("{score}", similarityScore);
      if (exerciseMode === "vocab" && activeQuestion.sinoViet) {
        mascotMsg = `Khá tốt! Phát âm từ "${targetText}" khớp ${similarityScore}% (Cần >= ${targetThreshold}% ở độ khó này). Hãy đọc rõ từng thanh điệu hơn nhé! 👍 (+10 XP)`;
      }
      triggerMascot(mascotMsg, "happy");
    } else {
      playSound("wrong");
      let mascotMsg = t("mascotSpeakingTryAgain").replace("{score}", similarityScore);
      if (exerciseMode === "vocab" && activeQuestion.sinoViet) {
        mascotMsg = `Bạn nói được ${similarityScore}% (Cần >= ${targetThreshold}% ở độ khó này). Cần luyện tập thêm một chút, hãy nghe phát âm mẫu của từ "${targetText}" và nói lại nhé! 💪`;
      }
      triggerMascot(mascotMsg, "sad");
    }
  };

  // Play target voice sample
  const handlePlaySample = () => {
    const targetLang = mode === "simplified" ? "zh-CN" : "zh-TW";
    
    speakText(targetText, {
      lang: targetLang,
      rate: 0.85
    });
    
    triggerMascot(t("mascotSpeakingModelDemo"), "thinking");
  };

  // Trigger microphone recording
  const handleToggleRecord = async () => {
    if (isRecording) {
      setIsRecording(false);
      setModelStatus("transcribing");
      try {
        const float32Array = await recorderRef.current.stop();
        if (workerRef.current) {
          workerRef.current.postMessage({
            audio: float32Array,
            language: "chinese"
          });
        }
      } catch (err) {
        console.error("Ghi âm thất bại:", err);
        setErrorMsg(`Lỗi thu âm: ${err.message}`);
        setModelStatus("ready");
      }
    } else {
      setErrorMsg("");
      setTranscript("");
      setScore(null);
      try {
        await recorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Không truy cập được Micro:", err);
        setErrorMsg("Không truy cập được Micro. Vui lòng cấp quyền ghi âm.");
      }
    }
  };

  // Simulation fallback trigger
  const simulateSpeaking = () => {
    setIsRecording(true);
    setTranscript("");
    setScore(null);
    setErrorMsg("");
    triggerMascot(t("mascotSpeakingRecording"), "thinking");

    setTimeout(() => {
      setIsRecording(false);
      const spokenMock = targetText;
      setTranscript(spokenMock);
      gradeUserSpeech(spokenMock);
    }, 2500);
  };

  const handleNext = () => {
    setScore(null);
    setTranscript("");
    setErrorMsg("");
    if (currentIndex < activeExercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (exerciseMode === "vocab") {
        setIsVocabRoundFinished(true);
        playSound("success");
        if (updateMasteryScore) {
          updateMasteryScore("speaking", correctCount / activeExercises.length);
        }
      } else {
        setCurrentIndex(0);
        if (updateMasteryScore) {
          updateMasteryScore("speaking", correctCount / activeExercises.length);
        }
        triggerMascot(t("mascotSpeakingFinish") || "Xuất sắc! Bạn đã hoàn thành tất cả bài luyện nói ở cấp độ này! 🏆", "excited");
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(null);
    setCorrectCount(0);
    setTranscript("");
    setErrorMsg("");
    setIsVocabRoundFinished(false);
    if (exerciseMode === "vocab") {
      const fresh = generateAdaptiveSpeakingExercises();
      setVocabExercises(fresh);
    }
  };

  if (!activeExercises.length) {
    return (
      <div className="speaking-layout glass-panel" style={{ padding: "40px", textAlign: "center" }}>
        <p style={{ color: "hsl(var(--neutral-gray))", fontWeight: "700" }}>
          Chưa có bài luyện phát âm cho cấp độ này.
        </p>
      </div>
    );
  }

  // Render Finish screen for Vocabulary Mode
  if (isVocabRoundFinished) {
    return (
      <div className="speaking-layout glass-panel speaking-finish-card" style={{ padding: "40px 20px", borderRadius: "16px", animation: "slideInUp 0.5s ease" }}>
        <span style={{ fontSize: "5rem", display: "block", marginBottom: "20px" }}>🏆</span>
        <h3 className="gradient-text" style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "15px" }}>
          {t("vocabSpeakingRoundClear")}
        </h3>
        <p style={{ margin: "16px 0 25px 0", color: "hsl(var(--neutral-gray))", fontSize: "1.1rem", lineHeight: "1.6", fontWeight: "700" }}>
          {uiLang === "vi" 
            ? `Chúc mừng bạn đã luyện đọc và phát âm thành thạo 10 từ vựng ngẫu nhiên cấp độ ${selectedLevel}!`
            : uiLang === "zh-CN"
            ? `恭喜你成功掌握了 10 个随机选择的 ${selectedLevel} 级词汇发音！`
            : `恭喜你成功掌握了 10 個隨機選擇的 ${selectedLevel} 級詞彙發音！`}
        </p>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={handleRestart} style={{ padding: "12px 24px", fontSize: "1.1rem", borderRadius: "10px" }}>
            {t("btnPlayAgainSpeaking")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="speaking-layout">
      {/* Whisper AI Model loading / processing indicator */}
      {modelStatus === "loading" && (
        <div className="glass-panel" style={{
          padding: "15px 20px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(20, 184, 166, 0.05) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          marginBottom: "15px",
          textAlign: "center",
          boxShadow: "0 8px 32px 0 rgba(99, 102, 241, 0.1)"
        }}>
          <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "hsl(var(--secondary-indigo-dark))", display: "flex", alignItems: "center", gap: "6px" }}>
              🤖 Đang tải mô hình trí tuệ nhân tạo (AI Whisper Offline)...
            </span>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "hsl(var(--primary-teal-dark))" }}>
              {loadProgress}%
            </span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.06)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ width: `${loadProgress}%`, height: "100%", background: "linear-gradient(90deg, hsl(var(--secondary-indigo)) 0%, hsl(var(--primary-teal)) 100%)", transition: "width 0.3s ease" }} />
          </div>
          <p style={{ margin: "6px 0 0", fontSize: "0.7rem", color: "hsl(var(--neutral-gray))", fontStyle: "italic", fontWeight: 650 }}>
            * Tải mô hình ~75MB. Các bài học tiếp theo sẽ hoạt động NGOẠI TUYẾN 100% không cần internet.
          </p>
        </div>
      )}

      {modelStatus === "transcribing" && (
        <div className="glass-panel" style={{
          padding: "15px 20px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)",
          border: "1px solid rgba(20, 184, 166, 0.25)",
          marginBottom: "15px",
          textAlign: "center",
          boxShadow: "0 8px 32px 0 rgba(20, 184, 166, 0.1)",
          animation: "pulse 2s infinite ease-in-out"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.4rem", animation: "spin 1s infinite linear", display: "inline-block" }}>🌀</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "hsl(var(--primary-teal-dark))" }}>
              Trí tuệ nhân tạo (AI Whisper) đang phân tích giọng đọc ngoại tuyến...
            </span>
          </div>
        </div>
      )}
      {/* Mode Selector Tabs */}
      <div className="speaking-mode-selector">
        <button
          className={`mode-btn ${exerciseMode === "sentence" ? "active" : ""}`}
          onClick={() => setExerciseMode("sentence")}
        >
          {t("modeSentenceSpeaking")}
        </button>
        <button
          className={`mode-btn ${exerciseMode === "vocab" ? "active" : ""}`}
          onClick={() => setExerciseMode("vocab")}
        >
          {t("modeVocabularySpeaking")}
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
          🎯 {t("labelSpeakingMastery") || "Độ thành thạo nói"}: <strong style={{ fontSize: "0.95rem" }}>{mastery !== undefined ? mastery : 1000}</strong>
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
          {(mastery !== undefined ? mastery : 1000) >= 1400 ? (t("badgeHardSpeaking") || "KHÓ (Khớp 90% + Thanh điệu)") : ((mastery !== undefined ? mastery : 1000) >= 1100 ? (t("badgeMediumSpeaking") || "TRUNG BÌNH (Khớp 80%)") : (t("badgeEasySpeaking") || "DỄ (Khớp 70%)"))}
        </span>
      </div>

      {/* Visual Progress Dot Indicators for Vocabulary mode */}
      {exerciseMode === "vocab" && (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "15px" }}>
          {vocabExercises.map((_, idx) => (
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
      )}

      {/* Visual sentence / word display */}
      <div className="speak-prompt-card">
        <span className="theme-badge" style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>{exerciseMode === "vocab" ? "Từ vựng" : t("labelSampleSentence")} {currentIndex + 1} / {activeExercises.length}</span>
          {exerciseMode === "vocab" && activeQuestion.category && (
            <span style={{ opacity: 0.8, fontSize: "0.75rem", borderLeft: "1px solid rgba(255,255,255,0.4)", paddingLeft: "6px" }}>
              🏷️ {activeQuestion.category}
            </span>
          )}
        </span>
        
        <div className="speak-target-hanzi" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <span>{targetText}</span>
          {exerciseMode === "vocab" && activeQuestion.sinoViet && (
            <span className="speaking-sinoviet-badge" style={{ fontSize: "0.9rem", padding: "4px 10px" }}>
              {activeQuestion.sinoViet}
            </span>
          )}
        </div>
        <div className="speak-target-pinyin" style={{ color: "hsl(var(--primary-teal-dark))", fontWeight: "700" }}>
          {activeQuestion.pinyin}
        </div>
        <div className="speak-target-translation">"{activeQuestion.translation}"</div>

        {/* Audio helper button */}
        <button
          className="util-btn"
          onClick={handlePlaySample}
          style={{ marginTop: "10px", width: "42px", height: "42px", fontSize: "1.2rem" }}
          title={t("titleSampleSpeech")}
        >
          🔊
        </button>
      </div>

      {/* Record button */}
      <div className="mic-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            className={`mic-btn ${isRecording ? "recording" : ""} ${modelStatus === "loading" || modelStatus === "transcribing" ? "btn-disabled" : ""}`}
            onClick={handleToggleRecord}
            disabled={modelStatus === "loading" || modelStatus === "transcribing"}
            title={isRecording ? t("titleStopRecording") : t("titleStartRecording")}
          >
            {modelStatus === "transcribing" ? "🌀" : isRecording ? "🛑" : "🎙️"}
          </button>
          
          {!isRecording && (
            <button
              onClick={simulateSpeaking}
              style={{
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                background: "rgba(20, 184, 166, 0.08)",
                border: "1px dashed hsl(var(--primary-teal))",
                boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
              title="Mô phỏng phát âm (Dành cho nơi ồn ào/Không tiện nói)"
              onMouseEnter={(e) => e.target.style.transform = "scale(1.08)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              🤫
            </button>
          )}
        </div>
        <span className="mic-btn-label">
          {isRecording ? t("labelListeningSpoken") : t("labelClickToRecord")}
        </span>
      </div>

      {/* Speech grading score box */}
      {score !== null && (
        <div className="speech-result-box">
          <div className="speech-result-header">
            <span style={{ fontWeight: 800, color: "hsl(var(--neutral-gray))" }}>{t("labelRecognitionResult")}</span>
            <span
              className={`speech-score-badge ${
                score >= 80 ? "high" : score >= 50 ? "mid" : "low"
              }`}
            >
              {score >= 80 ? "Excellent 🌟" : score >= 50 ? "Good 👍" : "Try Again 💪"} ({score}%)
            </span>
          </div>

          <div className="speech-transcript-text">
            "{transcript || t("labelSpokenNoHanziMatched")}"
          </div>

          {score < 50 && (
            <p style={{ fontSize: "0.8rem", color: "hsl(var(--danger-red))", fontWeight: 700 }}>
              {t("labelSpeakingTip")}
            </p>
          )}
        </div>
      )}

      {errorMsg && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginTop: "15px" }}>
          <div style={{ color: "hsl(var(--danger-red))", fontWeight: 700, fontSize: "0.85rem", textAlign: "center", maxWidth: "450px", lineHeight: "1.4" }}>
            ⚠️ {errorMsg.includes("network") 
              ? "Lỗi mạng: Không kết nối được dịch vụ nhận dạng của Google. Vui lòng kiểm tra kết nối mạng."
              : errorMsg.includes("session") || errorMsg.includes("Whisper")
              ? "Lỗi bộ nhớ đệm AI (Corrupted Cache): Trình duyệt đang lưu bản nén lượng tử hóa bị lỗi cũ."
              : errorMsg}
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (typeof caches !== "undefined") {
                  caches.keys().then((keys) => {
                    Promise.all(keys.map(key => {
                      if (key.includes("transformer")) {
                        return caches.delete(key);
                      }
                      return Promise.resolve();
                    })).then(() => {
                      window.location.reload();
                    });
                  }).catch(() => {
                    window.location.reload();
                  });
                } else {
                  window.location.reload();
                }
              }}
              style={{ padding: "8px 16px", fontSize: "0.75rem", borderRadius: "8px", background: "hsl(var(--secondary-indigo))", color: "white" }}
            >
              🔄 Sửa lỗi tự động (Dọn dẹp & Thử lại)
            </button>
            <button
              className="btn btn-secondary"
              onClick={simulateSpeaking}
              style={{ padding: "8px 16px", fontSize: "0.75rem", borderRadius: "8px", background: "rgba(20, 184, 166, 0.06)", border: "1px solid hsl(var(--primary-teal))", color: "hsl(var(--primary-teal-dark))" }}
            >
              🤖 Bỏ qua & Chuyển mô phỏng
            </button>
          </div>
        </div>
      )}

      {/* Fallback notification */}
      {!hasMicSupport && (
        <p className="speaking-fallback-text">
          {t("labelSpeakingFallback")}
        </p>
      )}

      {/* Footer Navigation */}
      <div className="status-bar-interactive">
        <button
          className={`btn btn-secondary ${score === null ? "btn-disabled" : ""}`}
          disabled={score === null}
          onClick={handleNext}
        >
          {currentIndex === activeExercises.length - 1 
            ? (exerciseMode === "vocab" ? t("btnFinish") : t("btnFinishRestart")) 
            : t("btnNextSentence") || "Tiếp theo ➜"}
        </button>
      </div>
    </div>
  );
}
