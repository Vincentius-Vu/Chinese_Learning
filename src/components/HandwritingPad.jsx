import React, { useRef, useState, useEffect, useCallback } from "react";

// ── HanziLookupJS CDN (jsDelivr from gugray/HanziLookupJS) ────────────────
// The "mmah" dataset is derived from Make Me a Hanzi (same as HanziWriter)
const HZ_SCRIPT = "https://cdn.jsdelivr.net/gh/gugray/HanziLookupJS@master/dist/hanzilookup.min.js";
const HZ_DATA   = "https://cdn.jsdelivr.net/gh/gugray/HanziLookupJS@master/dist/mmah.json";

// Canvas is always square; stroke coords are raw pixel values on this size.
const CANVAS_PX = 260;

// ── Inline locale helper (avoids adding dozens of translation keys) ────────
const L = (uiLang, vi, cn, tw) => {
  if (uiLang === "zh-CN") return cn;
  if (uiLang === "zh-TW") return tw;
  return vi;
};

// ── Component ─────────────────────────────────────────────────────────────
export default function HandwritingPad({ onSelect, onClearSelection, uiLang = "vi", t }) {
  const canvasRef     = useRef(null);
  const isDrawingRef  = useRef(false);
  const liveRef       = useRef([]); // current stroke points (raw pixels)

  // All completed strokes: each is an array of [x, y] pairs (raw pixels)
  const [strokes,      setStrokes]      = useState([]);
  const [candidates,   setCandidates]   = useState([]);
  const [selectedChar, setSelectedChar] = useState("");
  const [libStatus,    setLibStatus]    = useState("idle"); // idle|loading|ready|error

  // ── Load HanziLookupJS from CDN ─────────────────────────────────────────
  useEffect(() => {
    // Already loaded in a previous mount
    if (window._hzReady) { setLibStatus("ready"); return; }

    setLibStatus("loading");

    const addScript = () => new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${HZ_SCRIPT}"]`)) { resolve(); return; }
      const s = document.createElement("script");
      s.src = HZ_SCRIPT;
      s.onload  = resolve;
      s.onerror = () => reject(new Error("Script failed to load"));
      document.head.appendChild(s);
    });

    addScript()
      .then(() => {
        // HanziLookupJS init takes: (datasetName, jsonUrl, callback)
        window.HanziLookup.init("mmah", HZ_DATA, (success) => {
          if (success) {
            window._hzReady = true;
            setLibStatus("ready");
          } else {
            setLibStatus("error");
          }
        });
      })
      .catch((err) => {
        console.error("[HandwritingPad] Load error:", err);
        setLibStatus("error");
      });
  }, []);

  // ── Canvas drawing ───────────────────────────────────────────────────────
  const redraw = useCallback((done = [], live = []) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background: thin cross guide lines
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);  ctx.lineTo(W / 2, H);
    ctx.moveTo(0, H / 2);  ctx.lineTo(W, H / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Completed strokes — dark ink
    done.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = "hsl(215, 40%, 18%)";
      ctx.lineWidth   = 5;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
      ctx.moveTo(stroke[0][0], stroke[0][1]);
      for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i][0], stroke[i][1]);
      ctx.stroke();
    });

    // Live stroke — teal
    if (live.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle = "hsl(172, 75%, 38%)";
      ctx.lineWidth   = 5;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
      ctx.moveTo(live[0][0], live[0][1]);
      for (let i = 1; i < live.length; i++) ctx.lineTo(live[i][0], live[i][1]);
      ctx.stroke();
    }
  }, []);

  // Initial draw on mount
  useEffect(() => { redraw([]); }, [redraw]);

  // ── Character lookup ─────────────────────────────────────────────────────
  const doLookup = useCallback((strokeList) => {
    if (libStatus !== "ready" || !window.HanziLookup || strokeList.length === 0) return;
    try {
      const analyzed = new window.HanziLookup.AnalyzedCharacter(strokeList);
      const matcher  = new window.HanziLookup.Matcher("mmah");
      matcher.match(analyzed, 8, (matches) => {
        // matches: [{character, score}, ...]
        setCandidates(matches.map(m => ({ char: m.character, score: m.score })));
      });
    } catch (e) {
      console.error("[HandwritingPad] Lookup error:", e);
    }
  }, [libStatus]);

  // ── Pointer helpers ──────────────────────────────────────────────────────
  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return [
      Math.max(0, Math.min(CANVAS_PX, src.clientX - rect.left)),
      Math.max(0, Math.min(CANVAS_PX, src.clientY - rect.top)),
    ];
  };

  const onStart = useCallback((e) => {
    e.preventDefault();
    isDrawingRef.current = true;
    liveRef.current = [getPoint(e)];
  }, []);

  const onMove = useCallback((e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    liveRef.current.push(getPoint(e));
    redraw(strokes, liveRef.current);
  }, [strokes, redraw]);

  const onEnd = useCallback((e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    e?.preventDefault();

    const stroke = liveRef.current;
    liveRef.current = [];

    if (stroke.length < 2) { redraw(strokes); return; }

    setStrokes((prev) => {
      const next = [...prev, stroke];
      redraw(next);
      doLookup(next);
      return next;
    });
  }, [strokes, redraw, doLookup]);

  // ── Controls ─────────────────────────────────────────────────────────────
  const handleUndo = () => {
    setStrokes((prev) => {
      const next = prev.slice(0, -1);
      redraw(next);
      if (next.length > 0) doLookup(next);
      else setCandidates([]);
      return next;
    });
    setSelectedChar("");
  };

  const handleClear = () => {
    setStrokes([]);
    setCandidates([]);
    setSelectedChar("");
    liveRef.current = [];
    redraw([]);
    onClearSelection?.();
  };

  const handleSelect = (char) => {
    setSelectedChar(char);
    onSelect?.(char);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="handwriting-pad">

      {/* Status messages */}
      {libStatus === "loading" && (
        <div className="hw-status hw-loading">
          <span className="hw-spinner" /> {L(uiLang,
            "Đang tải thư viện nhận dạng chữ viết tay…",
            "正在加载手写识别库，请稍候…",
            "正在載入手寫識別庫，請稍候…"
          )}
        </div>
      )}
      {libStatus === "error" && (
        <div className="hw-status hw-error">
          ⚠️ {L(uiLang,
            "Không thể tải thư viện nhận dạng. Kiểm tra kết nối mạng và tải lại trang.",
            "无法加载识别库，请检查网络连接后刷新页面。",
            "無法載入識別庫，請檢查網路連線後重新整理頁面。"
          )}
        </div>
      )}

      {/* Canvas wrapper */}
      <div className="hw-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={CANVAS_PX}
          height={CANVAS_PX}
          className={`hw-canvas${libStatus !== "ready" ? " hw-canvas-dim" : ""}`}
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
          style={{ touchAction: "none" }}
        />
        {strokes.length === 0 && libStatus === "ready" && (
          <div className="hw-placeholder">
            ✏️ {L(uiLang, "Vẽ chữ Hán vào đây", "在此书写汉字", "在此書寫漢字")}
          </div>
        )}
      </div>

      {/* Stroke controls */}
      <div className="hw-controls">
        <button className="hw-btn" onClick={handleUndo} disabled={strokes.length === 0}>
          ↩ {L(uiLang, "Xóa nét", "撤销", "撤銷")}
        </button>
        <span className="hw-stroke-count">
          {strokes.length} {L(uiLang, "nét", "画", "畫")}
        </span>
        <button className="hw-btn hw-btn-danger" onClick={handleClear} disabled={strokes.length === 0}>
          🗑 {L(uiLang, "Xóa hết", "清除全部", "清除全部")}
        </button>
      </div>

      {/* Candidate characters */}
      {candidates.length > 0 && (
        <>
          <p className="hw-candidates-label">
            {L(uiLang, "Chọn ký tự phù hợp:", "选择匹配的汉字：", "選擇匹配的漢字：")}
          </p>
          <div className="candidate-grid">
            {candidates.map((cand, idx) => (
              <button
                key={idx}
                className={`candidate-btn ${selectedChar === cand.char ? "selected" : ""}`}
                onClick={() => handleSelect(cand.char)}
                title={cand.char}
              >
                <span className="cand-hanzi">{cand.char}</span>
                <span className="cand-pinyin">{Math.round(cand.score * 100)}%</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Selected preview */}
      {selectedChar && (
        <div className="typing-selected-preview">
          ✅ {t?.("labelSelected") || L(uiLang, "Đã chọn", "已选", "已選")}:{" "}
          <strong className="typing-selected-char">{selectedChar}</strong>
        </div>
      )}
    </div>
  );
}
