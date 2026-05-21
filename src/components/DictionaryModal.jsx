import React, { useState, useMemo, useEffect, useRef } from "react";
import { writingData } from "../data/vocabulary";
import { sinoVietMap } from "../data/sinoVietMap";
import { etymologyData, radicalsList } from "../data/etymologyData";

export default function DictionaryModal({
  isOpen,
  onClose,
  customWords = [],
  onJumpToWriting,
  mode
}) {
  const [dictSearchQuery, setDictSearchQuery] = useState("");
  const [selectedChar, setSelectedChar] = useState(null);
  
  // Combine core vocabulary and custom words
  const allWords = useMemo(() => {
    // Prevent duplicate entries for characters
    const seen = new Set();
    const list = [];
    
    // Add custom words first (user preferences)
    customWords.forEach(w => {
      const char = mode === "simplified" ? w.simplified : w.traditional;
      if (!seen.has(char)) {
        seen.add(char);
        list.push({ ...w, source: "custom" });
      }
    });
    
    // Add default HSK 1-6 vocabulary
    writingData.forEach(w => {
      const char = mode === "simplified" ? w.simplified : w.traditional;
      if (!seen.has(char)) {
        seen.add(char);
        list.push({ ...w, source: "core" });
      }
    });
    
    return list;
  }, [customWords, writingData, mode]);

  // Normalize search helper to strip tones and Vietnamese accents
  const normalizeStr = (str) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[āáǎà]/g, "a")
      .replace(/[ēéěè]/g, "e")
      .replace(/[īíǐì]/g, "i")
      .replace(/[ōóǒò]/g, "o")
      .replace(/[ūúǔùüǘǚǜ]/g, "u")
      .toLowerCase()
      .trim();
  };

  // Filter words in real time
  const filteredWords = useMemo(() => {
    const q = normalizeStr(dictSearchQuery);
    if (!q) {
      // If query is empty, show first 20 popular words as recommendations
      return allWords.slice(0, 30);
    }
    
    return allWords.filter(item => {
      const charSimplified = item.simplified || "";
      const charTraditional = item.traditional || "";
      const py = item.pinyin || "";
      const meaning = item.translation || "";
      const category = item.category || "";
      
      const lookupSinoViet = item.sinoViet || sinoVietMap[charSimplified] || sinoVietMap[charTraditional] || "";
      
      // Match against: Char, Pinyin, Sino-Viet, and Translation
      return (
        charSimplified.includes(dictSearchQuery) ||
        charTraditional.includes(dictSearchQuery) ||
        normalizeStr(charSimplified).includes(q) ||
        normalizeStr(py).includes(q) ||
        normalizeStr(lookupSinoViet).includes(q) ||
        normalizeStr(meaning).includes(q) ||
        normalizeStr(category).includes(q)
      );
    });
  }, [allWords, dictSearchQuery]);

  // Set initial selected character when modal opens or results change
  useEffect(() => {
    if (isOpen) {
      if (filteredWords.length > 0) {
        setSelectedChar(filteredWords[0]);
      } else {
        setSelectedChar(null);
      }
    }
  }, [isOpen, filteredWords]);

  // Audio vocalizer using HTML5 Web Speech Synthesis API
  const handleSpeak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = mode === "simplified" ? "zh-CN" : "zh-TW";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  // Helper to extract radicals for selected character
  const getRadicalsForChar = (char) => {
    if (!char) return [];
    if (etymologyData[char]) {
      const customRad = radicalsList.find(r => r.symbol === etymologyData[char].radicalSymbol);
      if (customRad) return [customRad];
    }
    const exactRadical = radicalsList.find(r => r.symbol === char);
    if (exactRadical) return [exactRadical];
    
    // Static fallbacks for quick lookup
    const fallbackMapping = {
      "写": ["冖"], "师": ["巾"], "听": ["口", "斤"], "说": ["讠"], "读": ["讠"],
      "欢": ["欠"], "边": ["辶", "力"], "尝": ["口"], "间": ["门", "日"], "东": ["木", "一"]
    };
    if (fallbackMapping[char]) {
      return fallbackMapping[char].map(sym => radicalsList.find(r => r.symbol === sym)).filter(Boolean);
    }
    return [];
  };

  if (!isOpen) return null;

  const activeChar = selectedChar 
    ? (mode === "simplified" ? selectedChar.simplified : selectedChar.traditional)
    : "";
  const activeCharSinoViet = selectedChar 
    ? (selectedChar.sinoViet || sinoVietMap[selectedChar.simplified] || sinoVietMap[selectedChar.traditional] || "")
    : "";
  const activeCharEtymology = selectedChar ? etymologyData[selectedChar.simplified] : null;
  const activeCharRadicals = selectedChar ? getRadicalsForChar(selectedChar.simplified) : [];

  return (
    <div
      className="dict-modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(12px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        padding: "20px"
      }}
    >
      <div
        className="dict-modal-content glass"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "1050px",
          height: "85vh",
          minHeight: "550px",
          background: "rgba(255, 255, 255, 0.88)",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.45)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "20px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(0, 0, 0, 0.05)",
            border: "none",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.background = "rgba(0, 0, 0, 0.1)"}
          onMouseLeave={(e) => e.target.style.background = "rgba(0, 0, 0, 0.05)"}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ padding: "20px 25px 15px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.6rem" }}>🔍</span>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: "hsl(var(--primary-teal-dark))" }}>
              Từ điển Tra cứu Hán-Việt
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "hsl(var(--neutral-gray))", fontWeight: 600 }}>
              Tìm kiếm nhanh theo chữ Hán, Pinyin, âm Hán-Việt hoặc nghĩa Tiếng Việt
            </p>
          </div>
        </div>

        {/* Modal Body Container */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }} className="dict-flex-container">
          
          {/* Left Column: Search box & Results Grid */}
          <div style={{ width: "42%", borderRight: "1px solid rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", padding: "18px" }} className="dict-col-left">
            <div style={{ marginBottom: "15px", position: "relative" }}>
              <input
                type="text"
                placeholder="Tìm kiếm: wo, nga, toi, 你..."
                value={dictSearchQuery}
                onChange={(e) => setDictSearchQuery(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 40px",
                  borderRadius: "10px",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  background: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  outline: "none",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "hsl(var(--primary-teal))"}
                onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.1)"}
              />
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "0.95rem", opacity: 0.5 }}>🔍</span>
              {dictSearchQuery && (
                <button
                  onClick={() => setDictSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    opacity: 0.5
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results Title Count */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.75rem", color: "hsl(var(--neutral-gray))", fontWeight: 700 }}>
              <span>{dictSearchQuery ? "Kết quả tìm kiếm" : "Gợi ý từ thông dụng"}</span>
              <span>Đang hiển thị {filteredWords.length} chữ</span>
            </div>

            {/* Results Scrollable Area */}
            <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }} className="custom-scrollbar">
              {filteredWords.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 10px", color: "hsl(var(--neutral-gray))" }}>
                  <p style={{ fontSize: "2rem", margin: 0 }}>🐃</p>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "8px" }}>Không tìm thấy chữ Hán nào phù hợp rồi bạn ơi!</p>
                  <p style={{ fontSize: "0.75rem", margin: "4px 0 0" }}>Hãy thử nhập từ khóa tìm kiếm khác nhé.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
                  {filteredWords.map((item) => {
                    const char = mode === "simplified" ? item.simplified : item.traditional;
                    const sino = item.sinoViet || sinoVietMap[item.simplified] || sinoVietMap[item.traditional] || "";
                    const isSelected = selectedChar && selectedChar.id === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedChar(item)}
                        style={{
                          background: isSelected ? "hsl(var(--primary-teal-light))" : "rgba(255, 255, 255, 0.6)",
                          border: isSelected ? "2px solid hsl(var(--primary-teal))" : "1px solid rgba(0,0,0,0.06)",
                          borderRadius: "10px",
                          padding: "10px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          textAlign: "center",
                          boxShadow: isSelected ? "0 4px 12px rgba(20, 184, 166, 0.15)" : "none"
                        }}
                      >
                        <span style={{ fontSize: "1.8rem", fontWeight: 800, color: isSelected ? "hsl(var(--primary-teal-dark))" : "hsl(var(--neutral-dark))", margin: "2px 0 6px" }}>
                          {char}
                        </span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "hsl(var(--accent-orange))", lineHeight: 1.2 }}>
                          {item.pinyin}
                        </span>
                        {sino && (
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--primary-teal-dark))", marginTop: "2px" }}>
                            {sino}
                          </span>
                        )}
                        <span style={{ fontSize: "0.7rem", color: "hsl(var(--neutral-gray))", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", marginTop: "4px", fontWeight: 600 }}>
                          {item.translation}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Character Detailed Panel */}
          <div style={{ width: "58%", display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.4)" }} className="dict-col-right">
            {selectedChar ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                
                {/* Detail Content Scroll Area */}
                <div style={{ flex: 1, overflowY: "auto", padding: "25px" }} className="custom-scrollbar">
                  
                  {/* Top Character Main Section */}
                  <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }} className="dict-detail-top">
                    {/* Big Hán tự square wrapper */}
                    <div style={{
                      width: "110px",
                      height: "110px",
                      background: "white",
                      border: "2px solid hsl(var(--primary-teal), 0.3)",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3.8rem",
                      fontWeight: 800,
                      color: "hsl(var(--primary-teal-dark))",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.04)"
                    }}>
                      {activeChar}
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <h3 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 850 }}>
                          {activeCharSinoViet || "Chưa có âm Hán-Việt"}
                        </h3>
                        <button
                          onClick={() => handleSpeak(activeChar)}
                          style={{
                            border: "none",
                            background: "hsl(var(--primary-teal-light))",
                            color: "hsl(var(--primary-teal-dark))",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                          }}
                          title="Nghe phát âm bản xứ"
                        >
                          🔊
                        </button>

                        {/* Level badge */}
                        <span style={{
                          fontSize: "0.65rem",
                          fontWeight: 800,
                          background: selectedChar.source === "custom" ? "hsl(var(--accent-orange-light, 20, 100%, 95%))" : "rgba(99, 102, 241, 0.08)",
                          color: selectedChar.source === "custom" ? "hsl(var(--accent-orange))" : "hsl(var(--secondary-indigo))",
                          padding: "3px 8px",
                          borderRadius: "20px",
                          border: "1px solid rgba(0,0,0,0.04)"
                        }}>
                          {selectedChar.source === "custom" ? "Từ vựng tùy chỉnh" : `HSK / TOCFL Cấp ${selectedChar.level}`}
                        </span>
                      </div>

                      <div style={{ display: "flex", gap: "12px", marginTop: "8px", fontSize: "0.85rem" }}>
                        <span>Pinyin: <strong style={{ color: "hsl(var(--accent-orange))", fontWeight: 800 }}>{selectedChar.pinyin}</strong></span>
                        <span style={{ color: "rgba(0,0,0,0.15)" }}>|</span>
                        <span>Ý nghĩa: <strong>{selectedChar.translation}</strong></span>
                      </div>

                      <div style={{ fontSize: "0.75rem", color: "hsl(var(--neutral-gray))", fontWeight: 700, marginTop: "6px" }}>
                        Nhóm: <span style={{ color: "hsl(var(--neutral-dark))" }}>{selectedChar.category || "Chưa phân nhóm"}</span>
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 0, borderBottom: "1px solid rgba(0,0,0,0.06)", margin: "0 0 20px" }} />

                  {/* Radical Decompositions */}
                  {activeCharRadicals && activeCharRadicals.length > 0 && (
                    <div style={{ marginBottom: "22px" }}>
                      <h4 style={{ margin: "0 0 8px", fontSize: "0.85rem", fontWeight: 800, color: "hsl(var(--neutral-dark))" }}>
                        🧱 Cấu tạo bộ thủ chính:
                      </h4>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {activeCharRadicals.map((rad) => (
                          <div
                            key={rad.id}
                            style={{
                              background: "white",
                              border: "1px solid rgba(0,0,0,0.08)",
                              borderRadius: "8px",
                              padding: "8px 12px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
                            }}
                          >
                            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "hsl(var(--primary-teal-dark))" }}>{rad.symbol}</span>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ fontSize: "0.75rem", fontWeight: 800 }}>{rad.sinoViet} ({rad.pinyin})</span>
                              <span style={{ fontSize: "0.65rem", color: "hsl(var(--neutral-gray))", fontWeight: 600 }}>Bộ nghĩa: {rad.meaning}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Character Etymology Origin */}
                  {activeCharEtymology && (
                    <div style={{ marginBottom: "22px" }}>
                      <h4 style={{ margin: "0 0 8px", fontSize: "0.85rem", fontWeight: 800, color: "hsl(var(--neutral-dark))" }}>
                        🌱 Giải nghĩa nguồn gốc tự hình:
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "hsl(var(--neutral-dark))", lineHeight: "1.5", fontWeight: 500, background: "white", padding: "12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.05)" }}>
                        {activeCharEtymology.description}
                      </p>
                    </div>
                  )}

                  {/* Mnemonic Story */}
                  {activeCharEtymology && activeCharEtymology.story && (
                    <div style={{ marginBottom: "22px" }}>
                      <h4 style={{ margin: "0 0 8px", fontSize: "0.85rem", fontWeight: 800, color: "hsl(var(--neutral-dark))" }}>
                        💡 Mẹo ghi nhớ dễ dàng:
                      </h4>
                      <div
                        style={{
                          background: "linear-gradient(135deg, rgba(234, 179, 8, 0.06) 0%, rgba(249, 115, 22, 0.04) 100%)",
                          border: "1px solid rgba(234, 179, 8, 0.2)",
                          borderRadius: "10px",
                          padding: "12px",
                          display: "flex",
                          gap: "8px"
                        }}
                      >
                        <span style={{ fontSize: "1rem" }}>💡</span>
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "hsl(var(--neutral-dark))", fontWeight: 600, lineHeight: 1.4 }}>
                          {activeCharEtymology.story}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Evolution timeline ancient scripts */}
                  {activeCharEtymology && activeCharEtymology.evolution && activeCharEtymology.evolution.length > 0 && (
                    <div style={{ marginBottom: "15px" }}>
                      <h4 style={{ margin: "0 0 10px", fontSize: "0.85rem", fontWeight: 800, color: "hsl(var(--neutral-dark))" }}>
                        ⏳ Tiến hóa chữ viết cổ đại:
                      </h4>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        background: "white",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(0,0,0,0.05)",
                        flexWrap: "wrap",
                        gap: "10px"
                      }}>
                        {activeCharEtymology.evolution.map((stage, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              flex: 1,
                              minWidth: "70px",
                              textAlign: "center"
                            }}
                          >
                            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "hsl(var(--neutral-gray))", textTransform: "uppercase", marginBottom: "4px" }}>
                              {stage.stage}
                            </span>
                            <div
                              className={`timeline-marker ${
                                stage.stage.includes("Giáp Cốt") ? "stage-giap-cot" :
                                stage.stage.includes("Kim Văn") ? "stage-kim-van" :
                                (stage.stage.includes("Tiểu Triện") || stage.stage.includes("Triện")) ? "stage-tieu-trien" :
                                "stage-khai-thu"
                              }`}
                              style={{
                                width: "42px",
                                height: "42px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s ease"
                              }}
                            >
                              {stage.character}
                            </div>
                            <span style={{ fontSize: "0.55rem", color: "hsl(var(--neutral-gray))", marginTop: "4px", lineHeight: 1.1, maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }} title={stage.desc}>
                              {stage.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fallback info for custom characters */}
                  {selectedChar.source === "custom" && !activeCharEtymology && (
                    <div style={{ textAlign: "center", padding: "20px", color: "hsl(var(--neutral-gray))", background: "white", borderRadius: "10px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700 }}>Chữ Hán tự tùy chỉnh của bạn</p>
                      <p style={{ margin: "4px 0 0", fontSize: "0.75rem" }}>Không có dữ liệu chi tiết nguồn gốc của chữ này. Bạn vẫn có thể luyện tập nét vẽ và ghi nhớ nghĩa bên dưới.</p>
                    </div>
                  )}

                </div>

                {/* Bottom jump action toolbar */}
                <div style={{ padding: "15px 25px", background: "rgba(0,0,0,0.02)", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      onJumpToWriting(selectedChar);
                      onClose();
                    }}
                    className="btn btn-primary"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 24px",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      boxShadow: "0 4px 14px rgba(20, 184, 166, 0.25)",
                      borderRadius: "8px"
                    }}
                  >
                    <span>✍️ Tập viết chữ này ngay</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "hsl(var(--neutral-gray))" }}>
                <p style={{ fontSize: "2.5rem", margin: 0 }}>📚</p>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "10px" }}>Chọn một chữ Hán ở danh sách bên trái</p>
                <p style={{ fontSize: "0.75rem", margin: "4px 0 0" }}>Để xem chi tiết âm Hán-Việt, phát âm và nguồn gốc tự hình.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
