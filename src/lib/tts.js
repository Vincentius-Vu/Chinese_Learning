// Clean and highly robust TTS helper for mobile and desktop web browsers.
// Fixes iOS Safari/Chrome Web Speech synthesis deadlock, asynchronous voice loading, and garbage collection cut-off.

export const speakText = (text, options = {}) => {
  const {
    lang = "zh-CN",
    rate = 0.85,
    onStart = null,
    onEnd = null,
    onError = null
  } = options;

  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("SpeechSynthesis not supported in this browser.");
    if (onError) onError(new Error("SpeechSynthesis not supported"));
    return;
  }

  // 1. Cancel any active speech synthesis immediately to clear the queue
  try {
    window.speechSynthesis.cancel();
  } catch (e) {
    console.warn("Failed to cancel speech synthesis queue", e);
  }

  // 2. Create the new SpeechSynthesisUtterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;

  // 3. Robust voice selection with fallbacks
  try {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      // Find exact language match (case-insensitive, handles underscores/dashes)
      const target = lang.toLowerCase().replace("_", "-");
      let selectedVoice = voices.find(v => {
        const vLang = v.lang.toLowerCase().replace("_", "-");
        return vLang === target;
      });

      // Fallback: match any Chinese voice (starts with 'zh')
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith("zh"));
      }

      // Fallback: match a specific Chinese name if any
      if (!selectedVoice) {
        selectedVoice = voices.find(v => 
          v.name.toLowerCase().includes("chinese") || 
          v.name.toLowerCase().includes("ting-ting") ||
          v.name.toLowerCase().includes("tingting") ||
          v.name.toLowerCase().includes("mei-jia")
        );
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
  } catch (e) {
    console.warn("Failed to match Chinese voices dynamically", e);
  }

  // 4. Garbage Collection Protection (iOS Safari bug)
  // Store a global reference to prevent GC mid-speech
  window._activeUtterance = utterance;
  if (!window._utteranceCache) {
    window._utteranceCache = new Set();
  }
  window._utteranceCache.add(utterance);

  // Set event hooks
  utterance.onstart = (e) => {
    if (onStart) onStart(e);
  };

  const cleanup = () => {
    window._utteranceCache.delete(utterance);
    if (window._activeUtterance === utterance) {
      window._activeUtterance = null;
    }
  };

  utterance.onend = (e) => {
    cleanup();
    if (onEnd) onEnd(e);
  };

  utterance.onerror = (e) => {
    cleanup();
    if (onError) onError(e);
  };

  // 5. Fixed iOS Safari deadlock freeze using async timeout
  // Calling speak synchronously right after cancel causes a lock in iOS.
  setTimeout(() => {
    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("SpeechSynthesis speak failed", e);
      if (onError) onError(e);
    }
  }, 60);
};
