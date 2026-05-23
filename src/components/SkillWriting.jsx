import React, { useState, useEffect, useRef, useMemo } from "react";
import { writingData } from "../data/vocabulary";
import { etymologyData, radicalsList } from "../data/etymologyData";
import { sinoVietMap } from "../data/sinoVietMap";

export default function SkillWriting({
  mode,
  selectedLevel,
  addXp,
  triggerMascot,
  playSound,
  streak,
  customWords = [],
  onAddCustomWord,
  onRemoveCustomWord,
  onUpdateCustomWord,
  autoSelectWordId,
  uiLang = "vi",
  t,
  mastery,
  updateMasteryScore,
  reviewLogs,
  addReviewLogs,
  globalVocabularyPool
}) {
  const combinedWritingData = useMemo(() => {
    return [...writingData, ...customWords];
  }, [writingData, customWords]);

  const filteredWritingData = useMemo(() => {
    return combinedWritingData.filter((item) => item.level === selectedLevel);
  }, [combinedWritingData, selectedLevel]);

  const [selectedId, setSelectedId] = useState(() => filteredWritingData[0]?.id || "w1");
  const [writerInstance, setWriterInstance] = useState(null);
  const [isWriterLoaded, setIsWriterLoaded] = useState(false);
  const [currentMode, setCurrentMode] = useState("idle"); // 'idle', 'animating', 'quiz', 'completed'
  
  // --- Etymology & Radical System state variables ---
  const [activeTab, setActiveTab] = useState("info"); // 'info', 'etymology', 'evolution'
  const [activeRadicalSymbol, setActiveRadicalSymbol] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRadicalInDrawer, setSelectedRadicalInDrawer] = useState(null);

  // Quiz score keeping
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const [strokesWritten, setStrokesWritten] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);

  // Animation and custom ink state variables
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(-1);
  const [inkColor, setInkColor] = useState("#6366f1"); // Default to indigo

  // --- Custom Vocabulary Addition Modal States ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWordSimplified, setNewWordSimplified] = useState("");
  const [newWordTraditional, setNewWordTraditional] = useState("");
  const [newWordPinyin, setNewWordPinyin] = useState("");
  const [newWordSinoViet, setNewWordSinoViet] = useState("");
  const [newWordMeaning, setNewWordMeaning] = useState("");
  const [newWordCategory, setNewWordCategory] = useState("Từ tự thêm");

  // --- Spaced Repetition System (SRS) states ---
  const [activeWritingSubTab, setActiveWritingSubTab] = useState("practice"); // "practice" or "srs"
  const [currentSrsIndex, setCurrentSrsIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const srsDueWords = useMemo(() => {
    return customWords.filter(word => {
      if (!word.nextReviewDate) return true;
      return new Date(word.nextReviewDate) <= new Date();
    });
  }, [customWords]);

  const containerRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const confettiAnimationRef = useRef(null);

  // Auto-select first item of the new level when selectedLevel changes, jumped from dictionary, or active word is deleted
  useEffect(() => {
    if (filteredWritingData.length > 0) {
      if (autoSelectWordId && filteredWritingData.some(w => w.id === autoSelectWordId)) {
        setSelectedId(autoSelectWordId);
      } else {
        const exists = filteredWritingData.some(w => w.id === selectedId);
        if (!exists) {
          setSelectedId(filteredWritingData[0].id);
        }
      }
    }
  }, [filteredWritingData, selectedId, autoSelectWordId]);

  // Active word based on ID and mode
  const activeCharObj = filteredWritingData.find((w) => w.id === selectedId) || filteredWritingData[0] || writingData[0];
  const activeChar = mode === "simplified" ? activeCharObj.simplified : activeCharObj.traditional;

  // Load Hanzi Writer from CDN dynamically
  useEffect(() => {
    const scriptId = "hanzi-writer-cdn";
    let script = document.getElementById(scriptId);

    const initWriterStatus = () => {
      if (window.HanziWriter) {
        setIsWriterLoaded(true);
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js";
      script.async = true;
      script.onload = initWriterStatus;
      document.body.appendChild(script);
    } else {
      initWriterStatus();
    }
  }, []);

  // Initialize/Re-initialize Hanzi Writer on Character, Mode, Color, or Speed Change
  useEffect(() => {
    if (!isWriterLoaded || !window.HanziWriter || !containerRef.current) return;

    // Clear previous container contents
    containerRef.current.innerHTML = "";
    setCurrentMode("idle");
    setAttempts(0);
    setErrors(0);
    setStrokesWritten(0);
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStrokeIndex(-1);
    setActiveRadicalSymbol(null);

    const masteryVal = mastery !== undefined ? mastery : 1000;
    let computedShowOutline = true;
    let computedShowHintAfterMisses = 2;
    
    if (masteryVal < 1100) {
      computedShowOutline = true;
      computedShowHintAfterMisses = 1;
    } else if (masteryVal < 1400) {
      computedShowOutline = true;
      computedShowHintAfterMisses = 2;
    } else {
      computedShowOutline = false;
      computedShowHintAfterMisses = 3;
    }

    // Create HanziWriter instance
    const writer = window.HanziWriter.create(containerRef.current, activeChar, {
      width: 260,
      height: 260,
      showOutline: computedShowOutline,
      showCharacter: true,
      strokeAnimationSpeed: animationSpeed * 1.2,
      delayBetweenStrokes: 250,
      padding: 15,
      strokeColor: "#14b8a6",    // Teal for active strokes
      outlineColor: "#e2e8f0",   // Gray for guidelines
      drawingColor: inkColor,    // Customized ink color from palette
      drawingWidth: 20,
      showHintAfterMisses: computedShowHintAfterMisses
    });

    setWriterInstance(writer);
    
    // Safely load character strokes asynchronously to avoid mount crashes
    window.HanziWriter.loadCharacterData(activeChar).then((charData) => {
      if (charData && charData.strokes) {
        setTotalStrokes(charData.strokes.length);
      }
    }).catch((err) => {
      console.error("Error loading character strokes asynchronously:", err);
    });

    // Cleanup
    return () => {
      cancelConfetti();
    };
  }, [activeChar, isWriterLoaded, inkColor, animationSpeed, mastery]);

  // Run full Stroke Animation demo (with Play/Pause toggle)
  const handlePlayPause = () => {
    if (!writerInstance) return;

    if (currentMode === "quiz") {
      writerInstance.cancelQuiz();
    }

    if (isAnimating) {
      if (isPaused) {
        writerInstance.resumeAnimation();
        setIsPaused(false);
        triggerMascot(t("mascotWritingResumed"), "happy");
      } else {
        writerInstance.pauseAnimation();
        setIsPaused(true);
        triggerMascot(t("mascotWritingPaused"), "thinking");
      }
    } else {
      // Start fresh full animation
      setCurrentMode("animating");
      setIsAnimating(true);
      setIsPaused(false);
      setCurrentStrokeIndex(-1);
      triggerMascot(t("mascotWritingAnimateStart"), "thinking");

      writerInstance.animateCharacter({
        onComplete: () => {
          setCurrentMode("idle");
          setIsAnimating(false);
          setIsPaused(false);
          triggerMascot(t("mascotWritingAnimateComplete"), "happy");
        }
      });
    }
  };

  // Animate a single stroke step-by-step
  const handleStepStroke = (direction) => {
    if (!writerInstance || totalStrokes === 0) return;

    // Terminate full animation or quiz if running
    if (isAnimating) {
      writerInstance.cancelQuiz();
      setIsAnimating(false);
      setIsPaused(false);
    }
    if (currentMode === "quiz") {
      writerInstance.cancelQuiz();
    }

    setCurrentMode("animating");

    let nextIndex = currentStrokeIndex;
    if (direction === "next") {
      nextIndex = (currentStrokeIndex + 1) % totalStrokes;
    } else if (direction === "prev") {
      nextIndex = currentStrokeIndex <= 0 ? totalStrokes - 1 : currentStrokeIndex - 1;
    }

    setCurrentStrokeIndex(nextIndex);
    triggerMascot(t("mascotWritingAnimateStroke").replace("{index}", nextIndex + 1).replace("{char}", activeChar), "thinking");

    writerInstance.animateStroke(nextIndex, {
      onComplete: () => {
        // Keep in animating state but ready for next step
      }
    });
  };

  // Start active writing practice Quiz
  const handleStartQuiz = () => {
    if (!writerInstance) return;

    writerInstance.cancelQuiz();
    setAttempts(0);
    setErrors(0);
    setStrokesWritten(0);
    setCurrentMode("quiz");
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStrokeIndex(-1);
    playSound("correct"); // Play startup beep
    triggerMascot(t("mascotWritingQuizStart"), "excited");

    writerInstance.quiz({
      onStrokeCorrect: (strokeData) => {
        playSound("correct");
        setAttempts((prev) => prev + 1);
        setStrokesWritten((prev) => prev + 1);
        triggerMascot(t("mascotWritingQuizCorrect"), "happy");
      },
      onStrokeMissed: (strokeData) => {
        playSound("wrong");
        setAttempts((prev) => prev + 1);
        setErrors((prev) => prev + 1);
        triggerMascot(t("mascotWritingQuizWrong"), "sad");
      },
      onComplete: (summary) => {
        setCurrentMode("completed");
        playSound("success");
        // Calculate XP reward
        const xpEarned = Math.max(10, 20 - summary.totalMistakes * 2);
        addXp(xpEarned);
        triggerMascot(t("mascotWritingQuizComplete").replace("{char}", activeChar).replace("{xp}", xpEarned), "excited");
        
        // Launch custom confetti particles
        startConfetti();

        // Update adaptive mastery and review logs
        if (updateMasteryScore) {
          const totalAttempts = summary.totalMistakes + totalStrokes;
          const percentCorrect = totalAttempts > 0 ? (totalStrokes / totalAttempts) : 1.0;
          updateMasteryScore("writing", percentCorrect);
        }
        if (addReviewLogs && activeCharObj) {
          addReviewLogs([{
            wordId: activeCharObj.id,
            correct: summary.totalMistakes === 0,
            timestamp: new Date().toISOString()
          }]);
        }
      }
    });
  };

  // Reset character drawing state
  const handleReset = () => {
    if (!writerInstance) return;
    writerInstance.cancelQuiz();
    writerInstance.showOutline();
    writerInstance.showCharacter();
    setAttempts(0);
    setErrors(0);
    setStrokesWritten(0);
    setCurrentMode("idle");
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStrokeIndex(-1);
    cancelConfetti();
    triggerMascot(t("mascotWritingReset"), "neutral");
  };

  // --- Spaced Repetition Review SM-2 Handler ---
  const handleSrsReview = (word, q) => {
    let { repetitions = 0, easeFactor = 2.5, interval = 0 } = word;

    if (q >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions++;
    } else {
      repetitions = 0;
      interval = 1;
    }

    // Update easeFactor
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    // Calculate next review date
    const nextReviewDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000).toISOString();

    const updatedWord = {
      ...word,
      repetitions,
      easeFactor,
      interval,
      nextReviewDate
    };

    onUpdateCustomWord(updatedWord);

    // Play feedback sound
    if (q >= 3) {
      playSound("correct");
      addXp(5);
      triggerMascot(t("mascotSrsCorrect"), "happy");
    } else {
      playSound("wrong");
      triggerMascot(t("mascotSrsForgot"), "sad");
    }

    // Reset card state and wait for transition
    setIsCardFlipped(false);
    
    // We wait 250ms for card flip-back animation to finish before moving index
    setTimeout(() => {
      if (currentSrsIndex >= srsDueWords.length - 1) {
        setCurrentSrsIndex(0);
      }
    }, 250);
  };

  const handleJumpToPracticeWord = (word) => {
    setActiveWritingSubTab("practice");
    setSelectedId(word.id);
    const charStr = mode === "simplified" ? word.simplified : word.traditional;
    triggerMascot(t("mascotJumpToWriting").replace("{char}", charStr), "excited");
  };

  // --- Confetti particle engine ---
  const startConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    const colors = ["#14b8a6", "#6366f1", "#f97316", "#eab308", "#22c55e", "#ef4444"];
    const particles = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 30,
        radius: Math.random() * 4 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 12 - 4,
        gravity: 0.25,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        if (p.alpha > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.alpha -= p.decay;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }
      });

      if (alive) {
        confettiAnimationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const cancelConfetti = () => {
    if (confettiAnimationRef.current) {
      cancelAnimationFrame(confettiAnimationRef.current);
    }
    const canvas = confettiCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // --- Helper Functions for Radical and Etymology System ---
  const getRadicalsForChar = (char) => {
    if (etymologyData[char]) {
      const customRad = radicalsList.find(r => r.symbol === etymologyData[char].radicalSymbol);
      if (customRad) return [customRad];
    }
    
    const exactRadical = radicalsList.find(r => r.symbol === char);
    if (exactRadical) return [exactRadical];
    
    const found = [];
    const fallbackMapping = {
      "写": ["冖"],
      "师": ["巾"],
      "听": ["口", "斤"],
      "说": ["讠"],
      "读": ["讠"],
      "欢": ["欠"],
      "边": ["辶", "力"],
      "尝": ["口"],
      "间": ["门", "日"],
      "东": ["木", "一"],
      "鱼": ["鱼"],
      "旧": ["日"],
      "蓝": ["艹"],
      "绿": ["纟"],
      "容": ["宀", "谷"],
      "易": ["日"],
      "静": ["青"],
      "饱": ["饣", "包"],
      "饿": ["饣", "我"],
      "迎": ["辶"],
      "送": ["辶"],
      "甜": ["甘", "舌"],
      "酸": ["酉"],
      "极": ["木"],
      "改": ["己", "攵"],
      "变": ["亠", "又"],
      "流": ["氵"],
      "利": ["禾", "刂"],
      "商": ["亠", "口"],
      "量": ["里"],
      "单": ["十"],
      "复": ["夂", "日"],
      "杂": ["木"],
      "精": ["米", "青"],
      "神": ["礻"],
      "社": ["礻", "土"],
      "区": ["匚"],
      "效": ["交", "攵"],
      "则": ["贝", "刂"],
      "赞": ["先", "贝"],
      "成": ["戈"],
      "绩": ["纟", "责"],
      "投": ["扌"],
      "资": ["次", "贝"],
      "顾": ["雇", "页"],
      "客": ["宀"],
      "建": ["廴"],
      "议": ["讠"],
      "实": ["宀"],
      "践": ["⻊"],
      "优": ["亻"],
      "秀": ["禾"],
      "略": ["田"],
      "融": ["鬲", "虫"],
      "领": ["令", "页"],
      "导": ["巳", "寸"],
      "创": ["仓", "刂"],
      "造": ["辶"],
      "协": ["十", "力"],
      "调": ["讠"],
      "任": ["亻"],
      "责": ["主", "贝"],
      "展": ["尸"],
      "持": ["扌"],
      "续": ["纟"],
      "竞": ["立"],
      "意": ["音", "心"],
      "服": ["月"],
      "益": ["皿"]
    };
    
    const mappedSymbols = fallbackMapping[char] || [];
    mappedSymbols.forEach(sym => {
      const rad = radicalsList.find(r => r.symbol === sym);
      if (rad) found.push(rad);
    });
    
    if (found.length === 0) {
      radicalsList.forEach(rad => {
        if (char.includes(rad.symbol) && rad.symbol !== char) {
          found.push(rad);
        }
      });
    }
    
    return found;
  };

  const getEtymologyDataForChar = (char) => {
    if (etymologyData[char]) {
      return etymologyData[char];
    }
    
    const rads = getRadicalsForChar(char);
    const primaryRad = rads[0];
    
    const primaryRadDesc = primaryRad
      ? `Chữ này được thành hình từ bộ thủ "${primaryRad.symbol}" (${primaryRad.sinoViet} - mang ý nghĩa: ${primaryRad.meaning}), định hình kết cấu và định hướng học hiểu chữ.`
      : "Đây là một chữ Hán có kết cấu tạo tác hài hòa từ các nét bút tự nhiên.";
      
    return {
      radicalSymbol: primaryRad ? primaryRad.symbol : "--",
      radicalName: primaryRad ? primaryRad.sinoViet : "--",
      radicalMeaning: primaryRad ? primaryRad.meaning : "--",
      description: `${primaryRadDesc} Theo tiến trình thời gian lịch sử, tự hình chữ "${char}" đã được tinh giản hóa để đảm bảo tính đối xứng và cân đối của Hán tự hiện đại.`,
      evolution: [
        { stage: "Giáp Cốt", character: char, desc: `Hình vẽ sơ khởi thời cổ đại của chữ "${char}".` },
        { stage: "Tiểu Triện", character: char, desc: `Chữ triện cách điệu tròn đều của triều đại nhà Tần.` },
        { stage: "Khải Thư", character: char, desc: `Kiến trúc nét vẽ vuông vắn chuẩn xác của chữ viết hiện đại.` }
      ],
      story: primaryRad 
        ? `Mẹo nhớ: Chữ "${char}" có chứa bộ thủ quan trọng "${primaryRad.symbol}" (${primaryRad.sinoViet}: ${primaryRad.meaning}). Hãy tưởng tượng hình tượng này để ghi khắc sâu chữ viết!`
        : `Bạn hãy tập trung vẽ các nét chữ "${char}" đúng thứ tự trên ô lưới Mễ tự để ghi khắc vận động cơ tay tự nhiên nhé!`
    };
  };

  const renderGroupedRadicals = () => {
    const filteredRadicals = radicalsList.filter(r => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        r.symbol.includes(query) ||
        r.pinyin.toLowerCase().includes(query) ||
        r.sinoViet.toLowerCase().includes(query) ||
        r.meaning.toLowerCase().includes(query)
      );
    });

    const strokeGroups = {};
    filteredRadicals.forEach(r => {
      if (!strokeGroups[r.strokes]) {
        strokeGroups[r.strokes] = [];
      }
      strokeGroups[r.strokes].push(r);
    });

    return Object.keys(strokeGroups)
      .sort((a, b) => Number(a) - Number(b))
      .map(strokes => (
        <div key={strokes} className="radicals-strokes-group">
          <h4 className="radicals-group-title">Bộ thủ {strokes} nét</h4>
          <div className="radicals-grid">
            {strokeGroups[strokes].map(r => (
              <button
                key={r.id}
                className={`radical-grid-item ${selectedRadicalInDrawer?.id === r.id ? "active" : ""}`}
                onClick={() => setSelectedRadicalInDrawer(r)}
              >
                <span className="radical-grid-symbol">{r.symbol}</span>
                <span className="radical-grid-name">{r.sinoViet}</span>
              </button>
            ))}
          </div>
        </div>
      ));
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Subtab Selector */}
      <div className="writing-subtab-selector">
        <button
          className={`subtab-btn ${activeWritingSubTab === "practice" ? "active" : ""}`}
          onClick={() => setActiveWritingSubTab("practice")}
        >
          {t("writingSubTabPractice")}
        </button>
        <button
          className={`subtab-btn ${activeWritingSubTab === "srs" ? "active" : ""}`}
          onClick={() => {
            setActiveWritingSubTab("srs");
            setIsCardFlipped(false);
          }}
        >
          {t("writingSubTabSrs")}
          {srsDueWords.length > 0 && (
            <span className="srs-due-badge">{srsDueWords.length}</span>
          )}
        </button>
      </div>

      {activeWritingSubTab === "practice" ? (
        <div className="writing-layout">
          {/* Sandbox canvas area */}
          <div className="canvas-wrapper">
            {/* Dynamic Canvas Layer */}
            {currentMode === "completed" && (
              <div className="complete-overlay">
                <span className="complete-star">⭐</span>
                <h3 className="complete-title">{t("completeTitle")}</h3>
                <p className="complete-stats">
                  {strokesWritten} {t("unitStrokes")} · {t("labelErrors")}: {errors} {t("unitTimes")}
                </p>
                <button className="btn btn-primary" onClick={handleReset} style={{ marginTop: "10px" }}>
                  🔄 {t("btnRewrite")}
                </button>
              </div>
            )}

            {/* Confetti Overlay */}
            <canvas ref={confettiCanvasRef} className="confetti-canvas-overlay" />

            {/* Drawing Board Grid */}
            <div className="mizige-container">
              <div className="mizige-background">
                <div className="mizige-line-diagonal" />
              </div>
              <div ref={containerRef} className="hanzi-target-div" />
            </div>

            {/* Premium Playback & Mode Controls Panel */}
            <div className="writing-controls-panel glass-panel" style={{ padding: "15px", borderRadius: "16px", marginTop: "15px", display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
              
              {/* Glassmorphic Adaptive Badge */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "12px",
                background: "rgba(20, 184, 166, 0.06)",
                border: "1px solid rgba(20, 184, 166, 0.15)",
                backdropFilter: "blur(4px)"
              }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "hsl(var(--primary-teal-dark))", display: "flex", alignItems: "center", gap: "6px" }}>
                  🎯 {t("labelWritingMastery") || "Độ thành thạo viết"}: <strong style={{ fontSize: "0.95rem" }}>{mastery !== undefined ? mastery : 1000}</strong>
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
                  {(mastery !== undefined ? mastery : 1000) >= 1400 ? (t("badgeHardOutline") || "KHÓ (Ẩn Outline)") : ((mastery !== undefined ? mastery : 1000) >= 1100 ? (t("badgeMediumOutline") || "TRUNG BÌNH") : (t("badgeEasyOutline") || "DỄ"))}
                </span>
              </div>

              {/* Main Actions Row */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                {/* Play/Pause Button */}
                <button
                  className={`btn ${isAnimating ? "btn-secondary" : "btn-primary"}`}
                  onClick={handlePlayPause}
                  style={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  {isAnimating ? (isPaused ? `▶️ ${t("btnResume")}` : `⏸️ ${t("btnPause")}`) : `🖌️ ${t("btnAnimate")}`}
                </button>

                {/* Quiz Mode Button */}
                <button
                  className={`btn btn-primary ${currentMode === "quiz" ? "btn-disabled" : ""}`}
                  onClick={handleStartQuiz}
                  disabled={currentMode === "quiz"}
                  style={{ minWidth: "110px" }}
                >
                  ✏️ {t("btnPractice")}
                </button>

                {/* Clean/Reset Button */}
                <button className="btn btn-ghost" onClick={handleReset}>
                  🔄 {t("btnReset")}
                </button>
              </div>

              {/* Step-by-Step Navigation */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "hsl(var(--neutral-gray))" }}>{t("labelStepByStep")}:</span>
                
                <button
                  className="btn btn-ghost"
                  onClick={() => handleStepStroke("prev")}
                  style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                  title={t("btnPrevStroke")}
                >
                  ◀ {t("btnPrevStroke")}
                </button>
                
                <span style={{ fontSize: "0.85rem", fontWeight: 800, minWidth: "40px", textAlign: "center", color: "hsl(var(--primary-teal-dark))" }}>
                  {currentStrokeIndex >= 0 ? `${currentStrokeIndex + 1} / ${totalStrokes}` : "--"}
                </span>

                <button
                  className="btn btn-ghost"
                  onClick={() => handleStepStroke("next")}
                  style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                  title={t("btnNextStroke")}
                >
                  {t("btnNextStroke")} ▶
                </button>
              </div>

              {/* Advanced Configurations Drawer */}
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "space-between", borderTop: "1px dashed rgba(0,0,0,0.06)", paddingTop: "10px" }}>
                {/* Speed Slider */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "130px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--neutral-gray))", whiteSpace: "nowrap" }}>{t("labelSpeed")}:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.25"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "hsl(var(--primary-teal))", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "hsl(var(--neutral-dark))" }}>{animationSpeed}x</span>
                </div>

                {/* Brush Color Picker */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "130px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--neutral-gray))" }}>{t("labelInkColor")}:</span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {["#6366f1", "#14b8a6", "#f59e0b", "#ef4444", "#10b981", "#000000"].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setInkColor(color);
                          triggerMascot(t("mascotWritingInkChanged"), "happy");
                        }}
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: color,
                          border: inkColor === color ? "2px solid white" : "none",
                          boxShadow: inkColor === color ? "0 0 0 2px hsl(var(--primary-teal))" : "0 1px 3px rgba(0,0,0,0.2)",
                          cursor: "pointer",
                          transition: "transform 0.15s"
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance status card */}
            {currentMode === "quiz" && (
              <div className="glass-panel" style={{ width: "100%", display: "flex", justifyContent: "space-around", padding: "10px", marginTop: "12px" }}>
                <span style={{ fontWeight: 700, color: "hsl(var(--primary-teal-dark))" }}>
                  {t("labelStrokeProgress")}: {strokesWritten} / {totalStrokes}
                </span>
                <span style={{ fontWeight: 700, color: "hsl(var(--danger-red))" }}>
                  {t("labelErrors")}: {errors}
                </span>
              </div>
            )}
          </div>

          {/* Dictionary metadata and selector */}
          <div className="writing-sidebar">
            {/* Character Details & Tabs */}
            <div className="glass-panel" style={{ padding: "18px", marginBottom: "15px", position: "relative" }}>
              {/* Button to toggle drawer */}
              <button 
                className="directory-toggle-btn"
                onClick={() => setIsDrawerOpen(true)}
                title={t("btnRadicalsLibrary")}
              >
                📚 {t("btnRadicalsLibrary")}
              </button>

              <h3 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "15px" }}>
                {t("labelHanzi")}: <span style={{ color: "hsl(var(--primary-teal-dark))", fontSize: "1.3rem" }}>{activeChar}</span>
              </h3>

              <div className="etymology-tab-container">
                <button
                  className={`etymology-tab-btn ${activeTab === "info" ? "active" : ""}`}
                  onClick={() => setActiveTab("info")}
                >
                  ℹ️ {t("tabBasic")}
                </button>
                <button
                  className={`etymology-tab-btn ${activeTab === "etymology" ? "active" : ""}`}
                  onClick={() => setActiveTab("etymology")}
                >
                  🌱 {t("tabEtymology")}
                </button>
                <button
                  className={`etymology-tab-btn ${activeTab === "evolution" ? "active" : ""}`}
                  onClick={() => setActiveTab("evolution")}
                >
                  ⏳ {t("tabEvolution")}
                </button>
              </div>

              {activeTab === "info" && (
                <div className="char-info-tabs-content" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="char-info-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "6px" }}>
                    <span className="char-info-label" style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", fontSize: "0.85rem" }}>{t("labelHanzi")}:</span>
                    <span className="char-info-val" style={{ fontWeight: 800, fontSize: "1.2rem", color: "hsl(var(--neutral-dark))" }}>{activeChar}</span>
                  </div>
                  <div className="char-info-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "6px" }}>
                    <span className="char-info-label" style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", fontSize: "0.85rem" }}>{t("labelPinyin")}:</span>
                    <span className="char-info-val" style={{ fontWeight: 700, color: "hsl(var(--primary-teal-dark))", fontSize: "1.05rem" }}>{activeCharObj.pinyin}</span>
                  </div>
                  {activeCharObj.sinoViet && (
                    <div className="char-info-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "6px" }}>
                      <span className="char-info-label" style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", fontSize: "0.85rem" }}>{t("labelSinoViet")}:</span>
                      <span className="char-info-val" style={{ fontWeight: 700, color: "hsl(var(--secondary-indigo-dark))", fontSize: "1.05rem" }}>{activeCharObj.sinoViet}</span>
                    </div>
                  )}
                  <div className="char-info-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "6px" }}>
                    <span className="char-info-label" style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", fontSize: "0.85rem" }}>{t("labelMeaning")}:</span>
                    <span className="char-info-val" style={{ fontWeight: 700, color: "hsl(var(--neutral-dark))", fontSize: "0.95rem" }}>{activeCharObj.translation}</span>
                  </div>
                  <div className="char-info-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "6px" }}>
                    <span className="char-info-label" style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", fontSize: "0.85rem" }}>{t("labelCategory")}:</span>
                    <span className="char-info-val" style={{ fontSize: "0.85rem", color: "hsl(var(--neutral-dark))" }}>{activeCharObj.category}</span>
                  </div>
                  <div className="char-info-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="char-info-label" style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", fontSize: "0.85rem" }}>{t("labelStrokes")}:</span>
                    <span className="char-info-val" style={{ fontWeight: 700 }}>{totalStrokes} {t("unitStrokes")}</span>
                  </div>
                </div>
              )}

              {activeTab === "etymology" && (() => {
                const ety = etymologyData[activeCharObj.simplified] || etymologyData[activeCharObj.traditional];
                const parts = getRadicalsForChar(activeChar);

                return (
                  <div className="char-info-tabs-content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {parts.length > 0 && (
                      <div className="radicals-decomposition">
                        <span className="decomposition-title">{t("etymologyDecomposition")}</span>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                          {parts.map((rad, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                triggerMascot(`Bộ thủ "${rad.symbol}" (${rad.sinoViet}): ${rad.meaning}`, "happy");
                                setActiveRadicalSymbol(rad.symbol);
                              }}
                              className={`radical-badge-btn ${activeRadicalSymbol === rad.symbol ? "active" : ""}`}
                            >
                              {rad.symbol} ({rad.sinoViet})
                            </button>
                          ))}
                        </div>

                        {activeRadicalSymbol && (() => {
                          const selectedRad = parts.find(r => r.symbol === activeRadicalSymbol);
                          if (!selectedRad) return null;
                          return (
                            <div className="radical-details-box animate-pop">
                              <h5 style={{ margin: "0 0 4px 0", fontWeight: 800, fontSize: "0.8rem", color: "hsl(var(--primary-teal-dark))" }}>
                                {t("etymologyRadical")}: {selectedRad.symbol} ({selectedRad.sinoViet} - {selectedRad.pinyin}) · {selectedRad.strokes} {t("unitStrokes")}
                              </h5>
                              <p style={{ margin: 0, fontSize: "0.75rem", color: "hsl(var(--neutral-dark))", lineHeight: 1.4 }}>
                                {selectedRad.meaning}
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {ety ? (
                      <div className="etymology-description-box" style={{ borderTop: "1px dashed rgba(0,0,0,0.06)", paddingTop: "10px" }}>
                        <span className="srs-card-lbl" style={{ color: "hsl(var(--secondary-indigo-dark))", fontSize: "0.8rem" }}>📖 {t("etymologyExplanation")}</span>
                        <p style={{ fontSize: "0.8rem", color: "hsl(var(--neutral-dark))", lineHeight: 1.5, margin: "6px 0 0 0", textAlign: "justify" }}>
                          {ety.explanation}
                        </p>

                        <div className="mnemonic-tip" style={{ marginTop: "10px", background: "hsl(var(--accent-orange-light), 0.2)", borderLeft: "3px solid hsl(var(--accent-orange))", padding: "8px", borderRadius: "0 8px 8px 0" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--accent-orange-dark))", display: "block" }}>💡 {t("mnemonicTip")}</span>
                          <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "hsl(var(--neutral-dark))", lineHeight: 1.4 }}>
                            {ety.mnemonic}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div style={{ borderTop: "1px dashed rgba(0,0,0,0.06)", paddingTop: "10px" }}>
                        <span className="srs-card-lbl" style={{ color: "hsl(var(--secondary-indigo-dark))", fontSize: "0.8rem" }}>📖 {t("etymologyExplanation")}</span>
                        <p style={{ fontSize: "0.8rem", color: "hsl(var(--neutral-gray))", fontStyle: "italic", margin: "6px 0 0 0" }}>
                          {getEtymologyDataForChar(activeChar).story}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {activeTab === "evolution" && (() => {
                const ety = etymologyData[activeCharObj.simplified] || etymologyData[activeCharObj.traditional];
                
                return (
                  <div className="char-info-tabs-content">
                    <span className="srs-card-lbl" style={{ color: "hsl(var(--secondary-indigo-dark))", fontSize: "0.8rem", display: "block", marginBottom: "8px" }}>⏳ {t("evolutionAncientScripts")}</span>
                    {ety && ety.evolution ? (
                      <div className="ancient-scripts-evolution-timeline" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {Object.entries(ety.evolution).map(([era, glyph]) => (
                          <div key={era} className="era-evolution-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(0,0,0,0.02)", padding: "6px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.04)" }}>
                            <span style={{ fontSize: "1.4rem", fontFamily: "Courier New, serif", color: "#b91c1c", fontWeight: 700, margin: "4px 0" }}>{glyph}</span>
                            <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "hsl(var(--neutral-gray))", textTransform: "uppercase" }}>{era === "oracle" ? "Giáp cốt" : era === "bronze" ? "Kim văn" : "Triện thư"}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: "0.8rem", color: "hsl(var(--neutral-gray))", textAlign: "center", fontStyle: "italic", margin: "10px 0" }}>
                        {t("labelEtymologyUpdating")}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Character list selector */}
            <div className="glass-panel" style={{ padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h4 style={{ fontWeight: 800, fontSize: "0.85rem", color: "hsl(var(--neutral-gray))", textTransform: "uppercase", margin: 0 }}>
                  {t("labelStrokeHanziLevel").replace("{level}", selectedLevel)}
                </h4>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-ghost"
                  style={{
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    border: "1px solid hsl(var(--primary-teal))",
                    borderRadius: "8px",
                    background: "rgba(20, 184, 166, 0.05)",
                    color: "hsl(var(--primary-teal-dark))",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  ➕ {t("btnAddWord")}
                </button>
              </div>
              <div className="char-card-list">
                {filteredWritingData.map((item) => {
                  const displayChar = mode === "simplified" ? item.simplified : item.traditional;
                  return (
                    <div key={item.id} style={{ position: "relative", display: "inline-block" }}>
                      <button
                        className={`char-select-btn ${item.id === selectedId ? "active" : ""}`}
                        onClick={() => setSelectedId(item.id)}
                        style={{ paddingRight: item.isCustom ? "34px" : "" }}
                      >
                        <span className="char-select-hanzi">{displayChar}</span>
                        <span className="char-select-pinyin">{item.pinyin}</span>
                      </button>
                      {item.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(t("confirmDeleteCustomWord").replace("{char}", displayChar))) {
                              onRemoveCustomWord(item.id);
                              playSound("wrong");
                              triggerMascot(t("mascotWritingDeleted").replace("{char}", displayChar), "happy");
                            }
                          }}
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            padding: "4px",
                            zIndex: 2,
                            opacity: 0.7,
                            transition: "opacity 0.2s"
                          }}
                          onMouseEnter={(e) => e.target.style.opacity = 1}
                          onMouseLeave={(e) => e.target.style.opacity = 0.7}
                          title={t("titleDeleteCustomWord")}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SRS Review UI Panel */
        <div className="srs-container">
          {/* gamified stats */}
          <div className="srs-stats-row">
            <div className="srs-stat-box glass-panel" style={{ background: "rgba(20, 184, 166, 0.1)", borderColor: "rgba(20, 184, 166, 0.2)" }}>
              <div className="srs-stat-val" style={{ color: "hsl(var(--primary-teal-dark))" }}>{customWords.length}</div>
              <div className="srs-stat-lbl">{t("srsTotalWords")}</div>
            </div>
            <div className="srs-stat-box glass-panel" style={{ background: srsDueWords.length > 0 ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)", borderColor: srsDueWords.length > 0 ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)" }}>
              <div className="srs-stat-val" style={{ color: srsDueWords.length > 0 ? "hsl(var(--danger-red))" : "hsl(var(--success-green))" }}>
                {srsDueWords.length}
              </div>
              <div className="srs-stat-lbl">{t("srsDueCards")}</div>
            </div>
            <div className="srs-stat-box glass-panel" style={{ background: "rgba(99, 102, 241, 0.1)", borderColor: "rgba(99, 102, 241, 0.2)" }}>
              <div className="srs-stat-val" style={{ color: "hsl(var(--secondary-indigo-dark))" }}>
                {customWords.filter(w => w.nextReviewDate && new Date(w.nextReviewDate) > new Date()).length}
              </div>
              <div className="srs-stat-lbl">{t("srsLearningCards")}</div>
            </div>
          </div>

          <h3 style={{ fontWeight: 800, fontSize: "1.2rem", margin: "10px 0 0 0", color: "hsl(var(--neutral-dark))" }}>
            {t("srsDueTitle")}
          </h3>

          {srsDueWords.length === 0 ? (
            <div className="glass-panel" style={{ width: "100%", maxWidth: "460px", padding: "40px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", borderRadius: "24px" }}>
              <span style={{ fontSize: "3.5rem" }}>🎉</span>
              <h4 style={{ fontWeight: 800, fontSize: "1.3rem", color: "hsl(var(--primary-teal-dark))", margin: 0 }}>
                {t("srsEmptyTitle")}
              </h4>
              <p style={{ fontSize: "0.9rem", color: "hsl(var(--neutral-gray))", margin: 0, lineHeight: 1.6 }}>
                {t("srsEmptyDesc")}
              </p>
              <button className="btn btn-primary" onClick={() => setActiveWritingSubTab("practice")} style={{ marginTop: "10px" }}>
                ✍️ {t("writingSubTabPractice")}
              </button>
            </div>
          ) : (() => {
            const activeCard = srsDueWords[currentSrsIndex >= srsDueWords.length ? 0 : currentSrsIndex];
            if (!activeCard) return null;
            const displayChar = mode === "simplified" ? activeCard.simplified : activeCard.traditional;
            const sinoViet = activeCard.sinoViet || sinoVietMap[activeCard.simplified] || "";

            return (
              <>
                <div className="srs-card-outer">
                  <div 
                    className={`srs-card-container ${isCardFlipped ? "flipped" : ""}`}
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                  >
                    {/* Front side */}
                    <div className="srs-card-side srs-card-front">
                      <span className="srs-card-lbl">{activeCard.category || "Từ tự thêm"}</span>
                      <div className="srs-card-front-content">
                        <div className="srs-card-hanzi">{displayChar}</div>
                        <div className="srs-card-flip-prompt">
                          <span>👆</span> {t("srsFlipPrompt")}
                        </div>
                      </div>
                      <div style={{ height: "20px" }} /> {/* spacer */}
                    </div>

                    {/* Back side */}
                    <div className="srs-card-side srs-card-back" onClick={(e) => e.stopPropagation()}>
                      <span className="srs-card-lbl">{activeCard.category || "Từ tự thêm"}</span>
                      
                      <div className="srs-card-back-scroll">
                        <div className="srs-card-row">
                          <span className="srs-card-lbl">{t("labelHanzi")}</span>
                          <span className="srs-card-val-hanzi">{displayChar}</span>
                        </div>
                        <div className="srs-card-row">
                          <span className="srs-card-lbl">{t("labelPinyin")}</span>
                          <span className="srs-card-val-pinyin">{activeCard.pinyin}</span>
                        </div>
                        {sinoViet && (
                          <div className="srs-card-row">
                            <span className="srs-card-lbl">{t("labelSinoViet")}</span>
                            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "hsl(var(--secondary-indigo-dark))" }}>{sinoViet}</span>
                          </div>
                        )}
                        <div className="srs-card-row">
                          <span className="srs-card-lbl">{t("labelMeaning")}</span>
                          <span className="srs-card-val-trans">{activeCard.translation}</span>
                        </div>
                      </div>

                      {/* Interactive SM-2 ratings */}
                      <div className="srs-rating-section">
                        <div className="srs-rating-title">{t("srsScoreRatingTitle")}</div>
                        <div className="srs-rating-buttons">
                          {[0, 1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              className={`srs-rating-btn score-${score}`}
                              onClick={() => handleSrsReview(activeCard, score)}
                            >
                              <span className="srs-rating-score">{score}</span>
                              <span className="srs-rating-desc">{t(`srsRating${score}`)}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="srs-action-buttons">
                  <button 
                    className="btn btn-ghost" 
                    onClick={() => handleJumpToPracticeWord(activeCard)}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    {t("srsBtnPracticeThis")}
                  </button>
                  {srsDueWords.length > 1 && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsCardFlipped(false);
                        setTimeout(() => {
                          setCurrentSrsIndex((prev) => (prev + 1) % srsDueWords.length);
                        }, 200);
                      }}
                    >
                      {t("srsBtnNextCard")}
                    </button>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* 214 Radicals Drawer Overlay */}
      {isDrawerOpen && (
        <div className="radicals-drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="radicals-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="radicals-drawer-header">
              <h3 className="radicals-drawer-title">📚 {t("btnRadicalsLibrary")}</h3>
              <button className="radicals-close-btn" onClick={() => setIsDrawerOpen(false)}>✕</button>
            </div>
            
            <div className="radicals-drawer-search">
              <input
                type="text"
                className="radicals-search-input"
                placeholder={t("placeholderInputSearchDict")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="radicals-drawer-scroll">
              {selectedRadicalInDrawer && (() => {
                const matchingChars = filteredWritingData.filter(item => {
                  const charStr = mode === "simplified" ? item.simplified : item.traditional;
                  const rads = getRadicalsForChar(charStr);
                  return rads.some(r => r.symbol === selectedRadicalInDrawer.symbol) || charStr.includes(selectedRadicalInDrawer.symbol);
                });
                
                return (
                  <div className="radical-popup-card" style={{ marginBottom: "20px" }}>
                    <div className="radical-popup-head">
                      <span className="radical-popup-sym">{selectedRadicalInDrawer.symbol}</span>
                      <div className="radical-popup-meta">
                        <span className="radical-popup-name">{selectedRadicalInDrawer.sinoViet}</span>
                        <span className="radical-popup-pinyin">pinyin: {selectedRadicalInDrawer.pinyin}</span>
                      </div>
                    </div>
                    <div className="radical-popup-body">
                      <p style={{ margin: "0 0 10px 0" }}>
                        {t("labelMeaning")}: <strong>{selectedRadicalInDrawer.meaning}</strong> · {t("labelStrokes")}: <strong>{selectedRadicalInDrawer.strokes} {t("unitStrokes")}</strong>
                      </p>
                      
                      {matchingChars.length > 0 ? (
                        <div style={{ marginTop: "12px", borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "10px" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--neutral-gray))", display: "block", marginBottom: "6px" }}>
                            {t("labelStrokeHanziLevel").replace("{level}", selectedLevel)}:
                          </span>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {matchingChars.map(item => {
                              const charStr = mode === "simplified" ? item.simplified : item.traditional;
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    setSelectedId(item.id);
                                    setIsDrawerOpen(false);
                                  }}
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                    borderRadius: "6px",
                                    border: "1px solid hsl(var(--primary-teal))",
                                    background: "hsl(var(--primary-teal-light))",
                                    color: "hsl(var(--primary-teal-dark))",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                  }}
                                >
                                  {charStr} ({item.pinyin})
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginTop: "12px", borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "10px", fontSize: "0.75rem", color: "hsl(var(--neutral-gray))", fontStyle: "italic" }}>
                          {t("labelNoVocabularyWithRadical").replace("{level}", selectedLevel)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
              
              {renderGroupedRadicals()}
            </div>
          </div>
        </div>
      )}

      {/* Glassmorphic Modal for Adding Custom Word */}
      {isAddModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              maxWidth: "460px",
              width: "100%",
              padding: "28px",
              position: "relative",
              boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                border: "none",
                background: "transparent",
                fontSize: "1.4rem",
                cursor: "pointer",
                color: "hsl(var(--neutral-gray))"
              }}
            >
              &times;
            </button>

            <h3 style={{ fontWeight: 800, fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px", color: "hsl(var(--primary-teal-dark))", marginBottom: "20px" }}>
              ➕ {t("titleAddCustomWord")}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Simplified Hán tự */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "hsl(var(--neutral-dark))", marginBottom: "6px" }}>
                  {t("labelCustomWordSimplified")} <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  maxLength={1}
                  placeholder={t("placeholderCustomWordSimplified")}
                  value={newWordSimplified}
                  onChange={(e) => setNewWordSimplified(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "hsl(var(--primary-teal))"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.12)"}
                />
              </div>

              {/* Traditional Hán tự */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "hsl(var(--neutral-dark))", marginBottom: "6px" }}>
                  {t("labelCustomWordTraditional")}
                </label>
                <input
                  type="text"
                  maxLength={1}
                  placeholder={t("placeholderCustomWordTraditional")}
                  value={newWordTraditional}
                  onChange={(e) => setNewWordTraditional(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "hsl(var(--primary-teal))"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.12)"}
                />
              </div>

              {/* Pinyin */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "hsl(var(--neutral-dark))", marginBottom: "6px" }}>
                  {t("labelCustomWordPinyin")} <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder={t("placeholderCustomWordPinyin")}
                  value={newWordPinyin}
                  onChange={(e) => setNewWordPinyin(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Phiên âm Hán-Việt */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "hsl(var(--neutral-dark))", marginBottom: "6px" }}>
                  {t("labelCustomWordSinoViet")}
                </label>
                <input
                  type="text"
                  placeholder={t("placeholderCustomWordSinoViet")}
                  value={newWordSinoViet}
                  onChange={(e) => setNewWordSinoViet(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "hsl(var(--primary-teal))"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.12)"}
                />
              </div>

              {/* Meaning */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "hsl(var(--neutral-dark))", marginBottom: "6px" }}>
                  {t("labelCustomWordMeaning")} <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder={t("placeholderCustomWordMeaning")}
                  value={newWordMeaning}
                  onChange={(e) => setNewWordMeaning(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "hsl(var(--neutral-dark))", marginBottom: "6px" }}>
                  {t("labelCustomWordCategory")}
                </label>
                <input
                  type="text"
                  placeholder={t("placeholderCustomWordCategory")}
                  value={newWordCategory}
                  onChange={(e) => setNewWordCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Form Actions */}
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                >
                  {t("btnCancel")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const simplifiedTrim = newWordSimplified.trim();
                    const pinyinTrim = newWordPinyin.trim();
                    const meaningTrim = newWordMeaning.trim();

                    if (!simplifiedTrim) {
                      playSound("wrong");
                      triggerMascot(t("mascotWritingAddEmptySimplified"), "sad");
                      return;
                    }
                    if (simplifiedTrim.length !== 1) {
                      playSound("wrong");
                      triggerMascot(t("mascotWritingAddNotSingleChar"), "sad");
                      return;
                    }
                    if (!pinyinTrim) {
                      playSound("wrong");
                      triggerMascot(t("mascotWritingAddEmptyPinyin"), "sad");
                      return;
                    }
                    if (!meaningTrim) {
                      playSound("wrong");
                      triggerMascot(t("mascotWritingAddEmptyMeaning"), "sad");
                      return;
                    }

                    const addedWord = {
                      id: `custom-${Date.now()}`,
                      simplified: simplifiedTrim,
                      traditional: newWordTraditional.trim() || simplifiedTrim,
                      pinyin: pinyinTrim,
                      sinoViet: newWordSinoViet.trim(),
                      translation: meaningTrim,
                      level: selectedLevel,
                      category: newWordCategory.trim() || "Từ tự thêm",
                      isCustom: true
                    };

                    onAddCustomWord(addedWord);
                    playSound("success");
                    triggerMascot(t("mascotWritingAddSuccess").replace("{char}", addedWord.simplified).replace("{level}", selectedLevel), "excited");
                    setSelectedId(addedWord.id);
                    setIsAddModalOpen(false);

                    // Reset fields
                    setNewWordSimplified("");
                    setNewWordTraditional("");
                    setNewWordPinyin("");
                    setNewWordSinoViet("");
                    setNewWordMeaning("");
                    setNewWordCategory("Từ tự thêm");
                  }}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  {t("btnSaveWord")}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
