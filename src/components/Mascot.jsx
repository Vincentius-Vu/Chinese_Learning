import React from "react";

export default function Mascot({ speechText, expression = "neutral" }) {
  // Render dynamic SVG eyes/mouth based on mascot state expression (Water Buffalo Edition)
  const renderFaceElements = () => {
    switch (expression) {
      case "happy":
      case "excited":
        return (
          <>
            {/* Happy eyes - curved paths */}
            <path d="M 32 46 Q 37 40 42 46" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <path d="M 58 46 Q 63 40 68 46" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            {/* Wider smiling mouth */}
            <path d="M 45 71 Q 50 76 55 71" fill="none" stroke="#292524" strokeWidth="3.5" strokeLinecap="round" />
            {/* Rosy blush */}
            <circle cx="28" cy="58" r="5" fill="#f3d1cc" />
            <circle cx="72" cy="58" r="5" fill="#f3d1cc" />
          </>
        );
      case "sad":
        return (
          <>
            {/* Drooped eyes */}
            <circle cx="37" cy="46" r="2.5" fill="#ffffff" />
            <circle cx="63" cy="46" r="2.5" fill="#ffffff" />
            {/* Sad downturned mouth */}
            <path d="M 46 72 Q 50 68 54 72" fill="none" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
            {/* Faint blush */}
            <circle cx="28" cy="58" r="2.5" fill="#f3d1cc" opacity="0.4" />
            <circle cx="72" cy="58" r="2.5" fill="#f3d1cc" opacity="0.4" />
          </>
        );
      case "thinking":
        return (
          <>
            {/* Pupils looking up-right */}
            <circle cx="37" cy="46" r="3" fill="#ffffff" />
            <circle cx="63" cy="46" r="3" fill="#ffffff" />
            <circle cx="39" cy="44" r="1.5" fill="#292524" />
            <circle cx="65" cy="44" r="1.5" fill="#292524" />
            {/* Flat thinking mouth */}
            <line x1="46" y1="71" x2="54" y2="71" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
            {/* Small blush */}
            <circle cx="28" cy="58" r="3.5" fill="#f3d1cc" />
            <circle cx="72" cy="58" r="3.5" fill="#f3d1cc" />
          </>
        );
      case "neutral":
      default:
        return (
          <>
            {/* Standard eyes */}
            <circle cx="37" cy="46" r="3.5" fill="#ffffff" />
            <circle cx="63" cy="46" r="3.5" fill="#ffffff" />
            <circle cx="37" cy="46" r="1.8" fill="#292524" />
            <circle cx="63" cy="46" r="1.8" fill="#292524" />
            {/* Smiley mouth */}
            <path d="M 46 70 Q 50 73 54 70" fill="none" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" />
            {/* Blush */}
            <circle cx="28" cy="58" r="4" fill="#f3d1cc" />
            <circle cx="72" cy="58" r="4" fill="#f3d1cc" />
          </>
        );
    }
  };

  return (
    <div className="mascot-box">
      {/* Water Buffalo SVG Avatar */}
      <div className="mascot-avatar" title={`Bạn Trâu đang ở trạng thái: ${expression}`}>
        <svg viewBox="0 0 100 100" className="panda-svg" style={{ overflow: "visible" }}>
          {/* Horns (Sừng trâu Việt Nam) */}
          {/* Left Horn */}
          <path 
            d="M 38 35 Q 22 20 12 36 Q 10 33 16 22 Q 28 12 42 30 Z" 
            fill="#e2e8f0" 
            stroke="#292524" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />
          {/* Right Horn */}
          <path 
            d="M 62 35 Q 78 20 88 36 Q 90 33 84 22 Q 72 12 58 30 Z" 
            fill="#e2e8f0" 
            stroke="#292524" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />

          {/* Ears (Tai trâu) */}
          {/* Left Ear */}
          <path d="M 22 45 C 8 45 4 52 14 55 C 24 58 24 50 22 45 Z" fill="#57534e" stroke="#292524" strokeWidth="2" />
          <path d="M 20 47 C 12 47 9 52 15 54 C 21 56 22 51 20 47 Z" fill="#f3d1cc" opacity="0.8" />
          
          {/* Right Ear */}
          <path d="M 78 45 C 92 45 96 52 86 55 C 76 58 76 50 78 45 Z" fill="#57534e" stroke="#292524" strokeWidth="2" />
          <path d="M 80 47 C 88 47 91 52 85 54 C 79 56 78 51 80 47 Z" fill="#f3d1cc" opacity="0.8" />

          {/* Main Head Base */}
          <ellipse cx="50" cy="55" rx="30" ry="26" fill="#57534e" stroke="#292524" strokeWidth="3" />

          {/* Muzzle (Mõm trâu) */}
          <ellipse cx="50" cy="65" rx="19" ry="13" fill="#a8a29e" stroke="#292524" strokeWidth="2" />
          {/* Nostrils (Lỗ mũi trâu) */}
          <ellipse cx="44" cy="63" rx="2.5" ry="3.5" fill="#292524" />
          <ellipse cx="56" cy="63" rx="2.5" ry="3.5" fill="#292524" />

          {/* Face elements: eyes, mouth, blush */}
          {renderFaceElements()}
        </svg>
      </div>

      {/* Dynamic Comic Speech Bubble */}
      <div className="speech-bubble">
        <div>{speechText}</div>
      </div>
    </div>
  );
}
