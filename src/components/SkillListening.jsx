import React, { useState, useEffect } from "react";
import { listeningData } from "../data/vocabulary";

export default function SkillListening({
  mode,
  selectedLevel,
  addXp,
  triggerMascot,
  playSound
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Filter based on selectedLevel
  const filteredListeningData = listeningData.filter((item) => item.level === selectedLevel);
  const activeQuestion = filteredListeningData[currentIndex] || filteredListeningData[0];
  const targetText = activeQuestion ? (mode === "simplified" ? activeQuestion.simplified : activeQuestion.traditional) : "";

  // Reset indices and cards when level changes
  useEffect(() => {
    setCurrentIndex(0);
    resetCard();
    setScore(0);
    setQuizFinished(false);
  }, [selectedLevel]);

  useEffect(() => {
    resetCard();
    triggerMascot("Luyện nghe chuẩn xác! Hãy bấm vào nút loa chính hoặc nút rùa 🐢 để nghe phát âm, sau đó chọn nghĩa chính xác nhé! 🎧", "neutral");
  }, [currentIndex, mode]);

  // Reset states
  const resetCard = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // Play Speech Synthesis TTS audio
  const handlePlayAudio = (rate = 0.9) => {
    if (!window.speechSynthesis) {
      triggerMascot("Trình duyệt của bạn không hỗ trợ tổng hợp giọng nói.", "sad");
      return;
    }
    // Cancel any active speak jobs
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.lang = mode === "simplified" ? "zh-CN" : "zh-TW";
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
    
    if (rate < 0.7) {
      triggerMascot("Chế độ rùa 🐢 đang phát âm chậm rãi từng chữ một, hãy chú ý nghe rõ nhé!", "thinking");
    } else {
      triggerMascot("Đang phát âm ở tốc độ giao tiếp tiêu chuẩn. Bạn nghe rõ không? 🔊", "happy");
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

    if (isCorrect) {
      playSound("success");
      setScore((prev) => prev + 1);
      addXp(15);
      triggerMascot("Xuất sắc! Bạn đã nghe và chọn cực kỳ chính xác! Nhận +15 XP! 🏆", "excited");
    } else {
      playSound("wrong");
      triggerMascot(`Tiếc quá! Câu trả lời chính xác phải là: "${activeQuestion.translation}". Hãy thử nghe lại nhé! 🐃`, "sad");
    }
  };

  // Step to next question
  const handleNext = () => {
    if (currentIndex < filteredListeningData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      playSound("success");
      triggerMascot(`Hoàn thành thử thách luyện nghe! Bạn đã làm đúng ${score}/${filteredListeningData.length} câu. Quá tuyệt vời! 🎉`, "excited");
    }
  };

  // Restart full quiz
  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
    resetCard();
  };

  if (quizFinished) {
    return (
      <div className="listening-layout glass-panel" style={{ padding: "40px", textAlign: "center" }}>
        <span style={{ fontSize: "4.5rem", display: "block", marginBottom: "15px" }}>🏆</span>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "hsl(var(--primary-teal-dark))", marginBottom: "10px" }}>
          Hoàn Thành Bài Nghe!
        </h2>
        <p style={{ fontWeight: 700, color: "hsl(var(--neutral-gray))", marginBottom: "25px", fontSize: "1.05rem" }}>
          Kết quả của bạn: {score} / {filteredListeningData.length} câu trả lời đúng
        </p>
        
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={handleRestart}>
            🔄 Luyện tập lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="listening-layout">
      {/* Visual Progress Dot Indicators */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "10px" }}>
        {filteredListeningData.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: idx === currentIndex ? "hsl(var(--primary-teal))" : idx < currentIndex ? "hsl(var(--primary-teal-dark))" : "rgba(0,0,0,0.06)",
              transform: idx === currentIndex ? "scale(1.2)" : "scale(1)"
            }}
          />
        ))}
      </div>

      <div className="listening-question-prompt">
        Câu {currentIndex + 1} / {filteredListeningData.length}: Nhấp để nghe âm thanh tiếng Trung
      </div>

      {/* Main Speakers */}
      <div className="audio-trigger-box">
        {/* Slow Turtle speaker */}
        <button
          className="audio-btn audio-btn-slow"
          onClick={() => handlePlayAudio(0.5)}
          title="Nghe chậm (Giọng rùa 🐢)"
        >
          🐢
        </button>

        {/* Standard speaker */}
        <button
          className="audio-btn audio-btn-main"
          onClick={() => handlePlayAudio(0.9)}
          title="Nghe tốc độ tiêu chuẩn (🔊)"
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

      {/* Navigation Footer */}
      <div className="status-bar-interactive">
        {!isAnswered ? (
          <button
            className={`btn btn-primary ${selectedOption === null ? "btn-disabled" : ""}`}
            disabled={selectedOption === null}
            onClick={handleCheckAnswer}
          >
            ✓ Kiểm tra kết quả
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleNext}>
            {currentIndex === filteredListeningData.length - 1 ? "🏆 Kết thúc" : "Tiếp theo ➜"}
          </button>
        )}
      </div>
    </div>
  );
}
