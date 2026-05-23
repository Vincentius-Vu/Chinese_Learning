// Audio helper utility to record audio and convert it to 16kHz mono Float32Array for Whisper AI input.

export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
  }

  async start() {
    this.audioChunks = [];
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      this.mediaRecorder.start();
    } catch (err) {
      console.error("Failed to start audio recording", err);
      throw err;
    }
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("MediaRecorder not started"));
        return;
      }

      this.mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType || "audio/webm" });
          
          // Stop all audio tracks to release microphone
          if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
          }

          // Decode and resample audio to 16kHz single-channel Float32Array
          const float32Array = await this.getFloat32AudioData(audioBlob);
          resolve(float32Array);
        } catch (err) {
          reject(err);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  async getFloat32AudioData(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext({ sampleRate: 16000 });
    
    try {
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      // Extract single channel (mono)
      const channelData = audioBuffer.getChannelData(0);
      return channelData;
    } finally {
      await audioContext.close();
    }
  }
}
