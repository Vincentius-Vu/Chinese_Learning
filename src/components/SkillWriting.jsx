import React, { useState, useEffect, useRef, useMemo } from "react";
import { writingData } from "../data/vocabulary";
import { etymologyData, radicalsList } from "../data/etymologyData";

export default function SkillWriting({
  mode,
  selectedLevel,
  addXp,
  triggerMascot,
  playSound,
  streak,
  customWords = [],
  onAddCustomWord,
  onRemoveCustomWord
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
  const [newWordMeaning, setNewWordMeaning] = useState("");
  const [newWordCategory, setNewWordCategory] = useState("Từ tự thêm");

  const containerRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const confettiAnimationRef = useRef(null);

  // Auto-select first item of the new level when selectedLevel changes or active word is deleted
  useEffect(() => {
    if (filteredWritingData.length > 0) {
      const exists = filteredWritingData.some(w => w.id === selectedId);
      if (!exists) {
        setSelectedId(filteredWritingData[0].id);
      }
    }
  }, [filteredWritingData, selectedId]);

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

    // Create HanziWriter instance
    const writer = window.HanziWriter.create(containerRef.current, activeChar, {
      width: 260,
      height: 260,
      showOutline: true,
      showCharacter: true,
      strokeAnimationSpeed: animationSpeed * 1.2,
      delayBetweenStrokes: 250,
      padding: 15,
      strokeColor: "#14b8a6",    // Teal for active strokes
      outlineColor: "#e2e8f0",   // Gray for guidelines
      drawingColor: inkColor,    // Customized ink color from palette
      drawingWidth: 20,
      showHintAfterMisses: 2     // Show guide after 2 mistakes
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
  }, [activeChar, isWriterLoaded, inkColor, animationSpeed]);

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
        triggerMascot("Đang tiếp tục chạy minh họa nét vẽ! 🎨", "happy");
      } else {
        writerInstance.pauseAnimation();
        setIsPaused(true);
        triggerMascot("Đã tạm dừng hoạt ảnh vẽ. Nhấp vào nút Phát tiếp để xem tiếp nha! ⏸️", "thinking");
      }
    } else {
      // Start fresh full animation
      setCurrentMode("animating");
      setIsAnimating(true);
      setIsPaused(false);
      setCurrentStrokeIndex(-1);
      triggerMascot("Bắt đầu mô phỏng thứ tự nét bút chuẩn. Hãy chú ý hướng đi! 🖌️", "thinking");

      writerInstance.animateCharacter({
        onComplete: () => {
          setCurrentMode("idle");
          setIsAnimating(false);
          setIsPaused(false);
          triggerMascot("Xem nét hoàn tất! Hãy nhấp 'Luyện viết' để thử sức nhé! 🐃", "happy");
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
    triggerMascot(`Mô phỏng nét bút thứ ${nextIndex + 1} của chữ "${activeChar}"! 🖌️`, "thinking");

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
    triggerMascot("Hãy dùng chuột hoặc ngón tay để vẽ các nét chữ Hán theo đúng thứ tự! Bạn làm được mà! 💪", "excited");

    writerInstance.quiz({
      onStrokeCorrect: (strokeData) => {
        playSound("correct");
        setAttempts((prev) => prev + 1);
        setStrokesWritten((prev) => prev + 1);
        triggerMascot("Nét vẽ rất chuẩn! Hãy tiếp tục nét tiếp theo nào! 🌟", "happy");
      },
      onStrokeMissed: (strokeData) => {
        playSound("wrong");
        setAttempts((prev) => prev + 1);
        setErrors((prev) => prev + 1);
        triggerMascot("Ui da, nét này viết chưa đúng hướng hoặc thứ tự rồi. Nhìn gợi ý màu đỏ vẽ lại nha! 🐃", "sad");
      },
      onComplete: (summary) => {
        setCurrentMode("completed");
        playSound("success");
        // Calculate XP reward
        const xpEarned = Math.max(10, 20 - summary.totalMistakes * 2);
        addXp(xpEarned);
        triggerMascot(`Xuất sắc! Bạn đã viết thành công chữ "${activeChar}" và nhận được +${xpEarned} XP! 🎉`, "excited");
        
        // Launch custom confetti particles
        startConfetti();
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
    triggerMascot("Đã làm sạch ô vẽ. Nhấp 'Luyện viết' hoặc chọn xem nét để bắt đầu nha!", "neutral");
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
    <div className="writing-layout">
      {/* Sandbox canvas area */}
      <div className="canvas-wrapper">
        {/* Dynamic Canvas Layer */}
        {currentMode === "completed" && (
          <div className="complete-overlay">
            <span className="complete-star">⭐</span>
            <h3 className="complete-title">Hoàn Thành!</h3>
            <p className="complete-stats">
              {strokesWritten} nét · Lỗi: {errors} lần sai
            </p>
            <button className="btn btn-primary" onClick={handleReset} style={{ marginTop: "10px" }}>
              🔄 Viết lại chữ này
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
          
          {/* Main Actions Row */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            {/* Play/Pause Button */}
            <button
              className={`btn ${isAnimating ? "btn-secondary" : "btn-primary"}`}
              onClick={handlePlayPause}
              style={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              {isAnimating ? (isPaused ? "▶️ Phát tiếp" : "⏸️ Tạm dừng") : "🖌️ Xem nét động"}
            </button>

            {/* Quiz Mode Button */}
            <button
              className={`btn btn-primary ${currentMode === "quiz" ? "btn-disabled" : ""}`}
              onClick={handleStartQuiz}
              disabled={currentMode === "quiz"}
              style={{ minWidth: "110px" }}
            >
              ✏️ Luyện viết
            </button>

            {/* Clean/Reset Button */}
            <button className="btn btn-ghost" onClick={handleReset}>
              🔄 Làm lại
            </button>
          </div>

          {/* Step-by-Step Navigation */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "hsl(var(--neutral-gray))" }}>Xem từng nét:</span>
            
            <button
              className="btn btn-ghost"
              onClick={() => handleStepStroke("prev")}
              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
              title="Nét trước"
            >
              ◀ Nét trước
            </button>
            
            <span style={{ fontSize: "0.85rem", fontWeight: 800, minWidth: "40px", textAlign: "center", color: "hsl(var(--primary-teal-dark))" }}>
              {currentStrokeIndex >= 0 ? `${currentStrokeIndex + 1} / ${totalStrokes}` : "--"}
            </span>

            <button
              className="btn btn-ghost"
              onClick={() => handleStepStroke("next")}
              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
              title="Nét sau"
            >
              Nét sau ▶
            </button>
          </div>

          {/* Speed & Custom Ink Customizers */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", paddingTop: "8px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            
            {/* Speed Slider */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "140px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--neutral-gray))", whiteSpace: "nowrap" }}>Tốc độ:</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.25"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                style={{ width: "100%", accentColor: "hsl(var(--primary-teal))", cursor: "pointer", height: "6px", borderRadius: "3px" }}
              />
              <span style={{ fontSize: "0.75rem", fontWeight: 800, minWidth: "35px", color: "hsl(var(--primary-teal))" }}>
                {animationSpeed.toFixed(2)}x
              </span>
            </div>

            {/* Ink Color Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--neutral-gray))" }}>Màu mực:</span>
              <div style={{ display: "flex", gap: "6px" }}>
                {[
                  { name: "Teal", color: "#14b8a6" },
                  { name: "Indigo", color: "#6366f1" },
                  { name: "Charcoal", color: "#1e293b" }
                ].map((palette) => (
                  <button
                    key={palette.color}
                    onClick={() => setInkColor(palette.color)}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: palette.color,
                      border: inkColor === palette.color ? "2px solid white" : "none",
                      outline: inkColor === palette.color ? "2px solid hsl(var(--primary-teal))" : "none",
                      cursor: "pointer",
                      padding: 0,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                    title={palette.name}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Active Writing Stats */}
        {currentMode === "quiz" && (
          <div className="status-bar-interactive" style={{ marginTop: "20px", border: "none" }}>
            <span style={{ fontWeight: 700 }}>
              Tiến độ nét: {strokesWritten} / {totalStrokes}
            </span>
            <span style={{ fontWeight: 700, color: "hsl(var(--danger-red))" }}>
              Lỗi sai: {errors}
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
            title="Mở Thư viện 214 Bộ thủ"
          >
            📚 214 Bộ thủ
          </button>

          <h3 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "15px" }}>
            Chữ Hán: <span style={{ color: "hsl(var(--primary-teal-dark))", fontSize: "1.3rem" }}>{activeChar}</span>
          </h3>

          <div className="etymology-tab-container">
            <button
              className={`etymology-tab-btn ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              ℹ️ Cơ bản
            </button>
            <button
              className={`etymology-tab-btn ${activeTab === "etymology" ? "active" : ""}`}
              onClick={() => setActiveTab("etymology")}
            >
              🌱 Nguồn gốc
            </button>
            <button
              className={`etymology-tab-btn ${activeTab === "evolution" ? "active" : ""}`}
              onClick={() => setActiveTab("evolution")}
            >
              ⏳ Lịch sử
            </button>
          </div>

          {activeTab === "info" && (
            <div className="char-info-tabs-content" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="char-info-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "6px" }}>
                <span className="char-info-label" style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", fontSize: "0.85rem" }}>Chữ Hán:</span>
                <span className="char-info-val" style={{ fontSize: "1.4rem", fontWeight: 800, color: "hsl(var(--primary-teal-dark))" }}>
                  {activeChar}
                </span>
              </div>

              <div className="char-info-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "6px" }}>
                <span className="char-info-label" style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", fontSize: "0.85rem" }}>Phiên âm:</span>
                <span className="char-info-val" style={{ color: "hsl(var(--accent-orange))", fontWeight: 800 }}>
                  {activeCharObj.pinyin}
                </span>
              </div>

              <div className="char-info-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "6px" }}>
                <span className="char-info-label" style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", fontSize: "0.85rem" }}>Ý nghĩa:</span>
                <span className="char-info-val" style={{ fontSize: "0.9rem", fontWeight: 700, textAlign: "right" }}>
                  {activeCharObj.translation}
                </span>
              </div>

              <div className="char-info-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "6px" }}>
                <span className="char-info-label" style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", fontSize: "0.85rem" }}>Chủ đề:</span>
                <span className="char-info-val" style={{ fontWeight: 700 }}>{activeCharObj.category}</span>
              </div>

              <div className="char-info-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "4px" }}>
                <span className="char-info-label" style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", fontSize: "0.85rem" }}>Số nét bút:</span>
                <span className="char-info-val" style={{ fontWeight: 700 }}>{totalStrokes} nét</span>
              </div>
            </div>
          )}

          {activeTab === "etymology" && (() => {
            const charEtymology = getEtymologyDataForChar(activeChar);
            const charRadicals = getRadicalsForChar(activeChar);
            return (
              <div className="char-etymology-content" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <p style={{ fontSize: "0.85rem", color: "hsl(var(--neutral-dark))", lineHeight: "1.5", fontWeight: 500, background: "rgba(0,0,0,0.02)", padding: "10px", borderRadius: "8px", margin: 0 }}>
                  {charEtymology.description}
                </p>

                {charRadicals && charRadicals.length > 0 && (
                  <div className="decomposition-container">
                    <span className="decomposition-title">Cấu tạo bộ thủ</span>
                    <div className="decomposition-bubbles">
                      {charRadicals.map((rad) => (
                        <button
                          key={rad.id}
                          className={`decomp-bubble-item ${activeRadicalSymbol === rad.symbol ? "active" : ""}`}
                          onClick={() => setActiveRadicalSymbol(activeRadicalSymbol === rad.symbol ? null : rad.symbol)}
                        >
                          <span className="decomp-symbol">{rad.symbol}</span>
                          <div className="decomp-info">
                            <span className="decomp-name">{rad.sinoViet}</span>
                            <span className="decomp-pinyin">{rad.pinyin}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {activeRadicalSymbol && (() => {
                      const selectedRad = charRadicals.find(r => r.symbol === activeRadicalSymbol);
                      if (!selectedRad) return null;
                      return (
                        <div className="radical-detail-pop">
                          <div className="radical-detail-title">
                            Bộ: {selectedRad.symbol} ({selectedRad.sinoViet} - {selectedRad.pinyin}) · {selectedRad.strokes} nét
                          </div>
                          <div className="radical-detail-desc">
                            Ý nghĩa: <strong>{selectedRad.meaning}</strong>. {selectedRad.meaning ? `Bộ này biểu thị hình ảnh/khái niệm "${selectedRad.meaning}" góp phần tạo nghĩa cho chữ "${activeChar}".` : ""}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {charEtymology.story && (
                  <div className="mnemonic-card">
                    <span className="mnemonic-icon">💡</span>
                    <div className="mnemonic-text-wrapper">
                      <span className="mnemonic-title">Mẹo ghi nhớ</span>
                      <p className="mnemonic-body">{charEtymology.story}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === "evolution" && (() => {
            const charEtymology = getEtymologyDataForChar(activeChar);
            return (
              <div className="char-evolution-content">
                {charEtymology.evolution && charEtymology.evolution.length > 0 ? (
                  <div className="evolution-timeline">
                     {charEtymology.evolution.map((stage, idx) => (
                       <div key={idx} className="timeline-node">
                         <div className={`timeline-marker ${
                           stage.stage.includes("Giáp Cốt") ? "stage-giap-cot" :
                           stage.stage.includes("Kim Văn") ? "stage-kim-van" :
                           (stage.stage.includes("Tiểu Triện") || stage.stage.includes("Triện")) ? "stage-tieu-trien" :
                           "stage-khai-thu"
                         }`}>
                           {stage.character || activeChar}
                         </div>
                        <div className="timeline-content">
                          <div className="timeline-stage-title">
                            {stage.stage}
                            <span style={{ fontSize: "0.7rem", color: "hsl(var(--neutral-gray))", marginLeft: "6px" }}>
                              ({stage.stage === "Giáp Cốt" ? "Hình vẽ sơ khởi" : stage.stage === "Kim Văn" ? "Chu triều kim văn" : stage.stage === "Tiểu Triện" ? "Tần triều tự" : "Khải thư hiện đại"})
                            </span>
                          </div>
                          <div className="timeline-stage-desc">
                            {stage.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "0.8rem", color: "hsl(var(--neutral-gray))", textAlign: "center", fontStyle: "italic", margin: "10px 0" }}>
                    Tiến trình tự hình đang được cập nhật khảo cổ thêm...
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
              Nét chữ Hán (Lvl {selectedLevel})
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
              ➕ Thêm từ
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
                        if (confirm(`Bạn có chắc chắn muốn xóa từ "${displayChar}" khỏi danh sách tự thêm?`)) {
                          onRemoveCustomWord(item.id);
                          playSound("wrong");
                          triggerMascot(`Đã xóa chữ "${displayChar}" thành công! 🗑️`, "happy");
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
                      title="Xóa từ vựng này"
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

      {/* 214 Radicals Drawer Overlay */}
      {isDrawerOpen && (
        <div className="radicals-drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="radicals-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="radicals-drawer-header">
              <h3 className="radicals-drawer-title">📚 Thư viện 214 Bộ thủ</h3>
              <button className="radicals-close-btn" onClick={() => setIsDrawerOpen(false)}>✕</button>
            </div>
            
            <div className="radicals-drawer-search">
              <input
                type="text"
                className="radicals-search-input"
                placeholder="Tìm bộ thủ bằng Hán tự, Pinyin, Hán-Việt hoặc ý nghĩa..."
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
                        Ý nghĩa: <strong>{selectedRadicalInDrawer.meaning}</strong> · Số nét: <strong>{selectedRadicalInDrawer.strokes} nét</strong>
                      </p>
                      
                      {matchingChars.length > 0 ? (
                        <div style={{ marginTop: "12px", borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "10px" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--neutral-gray))", display: "block", marginBottom: "6px" }}>
                            Từ vựng Level {selectedLevel} chứa bộ này:
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
                          Không có chữ Hán nào ở Level {selectedLevel} sử dụng bộ này.
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
              ➕ Thêm từ vựng tùy chỉnh mới
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Simplified Hán tự */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "hsl(var(--neutral-dark))", marginBottom: "6px" }}>
                  Chữ Giản thể (Simplified) <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  maxLength={1}
                  placeholder="Nhập 1 chữ Giản thể (ví dụ: 猫)"
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
                  Chữ Phồn thể (Traditional - Để trống nếu giống Giản thể)
                </label>
                <input
                  type="text"
                  maxLength={1}
                  placeholder="Nhập chữ Phồn thể nếu khác (ví dụ: 貓)"
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
                  Phiên âm Pinyin <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: māo"
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

              {/* Meaning */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "hsl(var(--neutral-dark))", marginBottom: "6px" }}>
                  Ý nghĩa tiếng Việt <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Con mèo"
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
                  Chủ đề / Nhóm từ
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Động vật (Mặc định: Từ tự thêm)"
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
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const simplifiedTrim = newWordSimplified.trim();
                    const pinyinTrim = newWordPinyin.trim();
                    const meaningTrim = newWordMeaning.trim();

                    if (!simplifiedTrim) {
                      playSound("wrong");
                      triggerMascot("Bạn ơi, bạn chưa nhập chữ Giản thể kìa! Hãy điền vào nha. 🐃", "sad");
                      alert("Vui lòng nhập chữ Giản thể!");
                      return;
                    }
                    if (simplifiedTrim.length !== 1) {
                      playSound("wrong");
                      triggerMascot("Lỗi rồi! Chữ tùy chỉnh bắt buộc phải là duy nhất 1 ký tự để tập viết trên ô lưới nhé! 🐃", "sad");
                      alert("Chữ tùy chỉnh bắt buộc phải dài đúng 1 ký tự!");
                      return;
                    }
                    if (!pinyinTrim) {
                      playSound("wrong");
                      triggerMascot("Bạn chưa nhập phiên âm Pinyin của chữ rồi kìa! 🐃", "sad");
                      alert("Vui lòng nhập phiên âm Pinyin!");
                      return;
                    }
                    if (!meaningTrim) {
                      playSound("wrong");
                      triggerMascot("Bạn chưa điền nghĩa tiếng Việt của chữ đấy! Điền vào để dễ ghi nhớ nha. 🐃", "sad");
                      alert("Vui lòng nhập ý nghĩa tiếng Việt!");
                      return;
                    }

                    const addedWord = {
                      id: `custom-${Date.now()}`,
                      simplified: simplifiedTrim,
                      traditional: newWordTraditional.trim() || simplifiedTrim,
                      pinyin: pinyinTrim,
                      translation: meaningTrim,
                      level: selectedLevel,
                      category: newWordCategory.trim() || "Từ tự thêm",
                      isCustom: true
                    };

                    onAddCustomWord(addedWord);
                    playSound("success");
                    triggerMascot(`Tuyệt vời! Thêm thành công chữ "${addedWord.simplified}" vào danh sách Level ${selectedLevel}! Luyện tập ngay nào! 🎉`, "excited");
                    setSelectedId(addedWord.id);
                    setIsAddModalOpen(false);

                    // Reset fields
                    setNewWordSimplified("");
                    setNewWordTraditional("");
                    setNewWordPinyin("");
                    setNewWordMeaning("");
                    setNewWordCategory("Từ tự thêm");
                  }}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  Lưu từ vựng
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
