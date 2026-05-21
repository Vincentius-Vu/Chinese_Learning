import React, { useState, useEffect, useRef } from "react";
import { speakingData } from "../data/vocabulary";

export default function SkillSpeaking({
  mode,
  selectedLevel,
  addXp,
  triggerMascot,
  playSound
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasMicSupport, setHasMicSupport] = useState(true);
  const [speechRecognizer, setSpeechRecognizer] = useState(null);

  // Filter based on selectedLevel
  const filteredSpeakingData = speakingData.filter((item) => item.level === selectedLevel);
  const activeQuestion = filteredSpeakingData[currentIndex] || filteredSpeakingData[0];
  const targetText = activeQuestion ? (mode === "simplified" ? activeQuestion.simplified : activeQuestion.traditional) : "";

  // Reset states when level changes
  useEffect(() => {
    setCurrentIndex(0);
    setScore(null);
    setTranscript("");
    setErrorMsg("");
  }, [selectedLevel]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasMicSupport(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript("");
        setScore(null);
        setErrorMsg("");
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        setIsRecording(false);
        if (event.error === "not-allowed") {
          setErrorMsg("Quyền truy cập Microphone bị từ chối.");
          triggerMascot("Vui lòng cấp quyền truy cập Microphone trong trình duyệt để luyện nói nhé! 🎙️", "sad");
        } else {
          setErrorMsg(`Có lỗi xảy ra: ${event.error}`);
        }
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        gradeUserSpeech(spokenText);
      };

      setSpeechRecognizer(recognition);
    }

    triggerMascot("Luyện nói tự tin! Nhấn giữ nút Micro, lắng nghe phát âm mẫu, sau đó đọc to câu mẫu để máy thu âm và chấm điểm nhé! 🎙️", "neutral");
  }, [currentIndex, mode]);

  // Clean active speech job on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Compare transcript and target phrase
  const gradeUserSpeech = (spoken) => {
    // Strip punctuations and spaces
    const cleanSpoken = spoken.replace(/[，。！？：、\s]/g, "");
    const cleanTarget = targetText.replace(/[，。！？：、\s]/g, "");

    if (cleanSpoken.length === 0) {
      setScore(0);
      triggerMascot("Máy chưa nghe rõ câu của bạn. Hãy nói to, rõ ràng và thử lại nhé! 🐃", "sad");
      playSound("wrong");
      return;
    }

    // Simple matching index similarity
    let matches = 0;
    const spokenChars = Array.from(cleanSpoken);
    const targetChars = Array.from(cleanTarget);

    targetChars.forEach((char) => {
      if (spokenChars.includes(char)) {
        matches++;
      }
    });

    const similarityScore = Math.min(100, Math.round((matches / targetChars.length) * 100));
    setScore(similarityScore);

    if (similarityScore >= 80) {
      playSound("success");
      addXp(20);
      triggerMascot(`Xuất sắc! Bạn phát âm cực kỳ chuẩn xác (${similarityScore}% khớp). Nhận +20 XP! 🌟`, "excited");
    } else if (similarityScore >= 50) {
      playSound("correct");
      addXp(10);
      triggerMascot(`Khá tốt! Độ chính xác là ${similarityScore}%. Hãy phát âm rõ từng chữ hơn một chút để đạt điểm tối đa nha! 👍`, "happy");
    } else {
      playSound("wrong");
      triggerMascot(`Bạn nói được ${similarityScore}%. Cần luyện tập thêm một chút, hãy nghe phát âm mẫu và nói lại nhé! 💪`, "sad");
    }
  };

  // Play target voice sample
  const handlePlaySample = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.lang = mode === "simplified" ? "zh-CN" : "zh-TW";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
    triggerMascot("Đang phát phát âm mẫu chuẩn. Hãy lắng nghe kỹ ngữ điệu và trọng âm nhé! 🔊", "thinking");
  };

  // Trigger microphone recording
  const handleToggleRecord = () => {
    if (!hasMicSupport || !speechRecognizer) {
      // Simulate speaking for unsupported browsers (Simulation Mode)
      simulateSpeaking();
      return;
    }

    if (isRecording) {
      speechRecognizer.stop();
    } else {
      speechRecognizer.lang = mode === "simplified" ? "zh-CN" : "zh-TW";
      try {
        speechRecognizer.start();
      } catch (err) {
        // Fallback
        speechRecognizer.stop();
      }
    }
  };

  // Simulation fallback trigger
  const simulateSpeaking = () => {
    setIsRecording(true);
    setTranscript("");
    setScore(null);
    triggerMascot("Hệ thống đang mô phỏng ghi âm... Hãy đàm thoại nói to vào Micro của bạn nhé!", "thinking");

    setTimeout(() => {
      setIsRecording(false);
      // Simulate perfect speaking
      const spokenMock = targetText;
      setTranscript(spokenMock);
      gradeUserSpeech(spokenMock);
    }, 2500);
  };

  const handleNext = () => {
    setScore(null);
    setTranscript("");
    setErrorMsg("");
    if (currentIndex < filteredSpeakingData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
      triggerMascot("Bạn đã hoàn thành toàn bộ bài luyện nói xuất sắc! Hãy tiếp tục luyện tập đều đặn nhé! 🎉", "excited");
    }
  };

  return (
    <div className="speaking-layout">
      {/* Visual sentence display */}
      <div className="speak-prompt-card">
        <span className="theme-badge" style={{ alignSelf: "flex-start" }}>
          Câu mẫu {currentIndex + 1} / {filteredSpeakingData.length}
        </span>
        
        <div className="speak-target-hanzi">{targetText}</div>
        <div className="speak-target-pinyin">{activeQuestion.pinyin}</div>
        <div className="speak-target-translation">"{activeQuestion.translation}"</div>

        {/* Audio helper button */}
        <button
          className="util-btn"
          onClick={handlePlaySample}
          style={{ marginTop: "10px", width: "42px", height: "42px", fontSize: "1.2rem" }}
          title="Nghe giọng mẫu chuẩn"
        >
          🔊
        </button>
      </div>

      {/* Record button */}
      <div className="mic-wrapper">
        <button
          className={`mic-btn ${isRecording ? "recording" : ""}`}
          onClick={handleToggleRecord}
          title={isRecording ? "Đang ghi âm... Nhấn để dừng" : "Nhấn để bắt đầu nói"}
        >
          {isRecording ? "🛑" : "🎙️"}
        </button>
        <span className="mic-btn-label">
          {isRecording ? "Đang lắng nghe... Đọc to câu mẫu" : "Nhấp vào để Ghi âm"}
        </span>
      </div>

      {/* Speech grading score box */}
      {score !== null && (
        <div className="speech-result-box">
          <div className="speech-result-header">
            <span style={{ fontWeight: 800, color: "hsl(var(--neutral-gray))" }}>Kế quả nhận diện:</span>
            <span
              className={`speech-score-badge ${
                score >= 80 ? "high" : score >= 50 ? "mid" : "low"
              }`}
            >
              {score >= 80 ? "Excellent 🌟" : score >= 50 ? "Good 👍" : "Try Again 💪"} ({score}%)
            </span>
          </div>

          <div className="speech-transcript-text">
            "{transcript || "(Không phát hiện từ Hán phù hợp)"}"
          </div>

          {score < 50 && (
            <p style={{ fontSize: "0.8rem", color: "hsl(var(--danger-red))", fontWeight: 700 }}>
              💡 Gợi ý: Hãy nhấp vào nút loa 🔊 để nghe phát âm mẫu, nói to, chậm rãi, để gần micro của bạn hơn nhé.
            </p>
          )}
        </div>
      )}

      {errorMsg && (
        <div style={{ color: "hsl(var(--danger-red))", fontWeight: 700, fontSize: "0.85rem", textAlign: "center" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Fallback notification */}
      {!hasMicSupport && (
        <p className="speaking-fallback-text">
          💡 <strong>Mẹo nhỏ:</strong> Trình duyệt của bạn đang chạy ở chế độ **Giả lập luyện nói**. Trải nghiệm thu âm đạt chất lượng tuyệt đối khi chạy trên Google Chrome hoặc Microsoft Edge!
        </p>
      )}

      {/* Footer Navigation */}
      <div className="status-bar-interactive">
        <button
          className={`btn btn-secondary ${score === null ? "btn-disabled" : ""}`}
          disabled={score === null}
          onClick={handleNext}
        >
          {currentIndex === filteredSpeakingData.length - 1 ? "Hoàn tất & Lặp lại 🔄" : "Câu tiếp theo ➜"}
        </button>
      </div>
    </div>
  );
}
