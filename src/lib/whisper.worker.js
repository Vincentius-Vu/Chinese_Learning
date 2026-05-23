import { pipeline, env } from '@huggingface/transformers';

// Configure transformers environment
env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1; // Safe thread limit for mobile/tablet browsers

let transcriber = null;

const getTranscriber = async (progress_callback) => {
  if (!transcriber) {
    transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
      progress_callback,
      quantized: false, // Force stable unquantized model to fix ONNX Runtime Web TransposeDQWeights error
    });
  }
  return transcriber;
};

self.addEventListener('message', async (event) => {
  const { audio, language = 'chinese' } = event.data;

  try {
    const pipe = await getTranscriber((data) => {
      // Send progress update to main thread (especially model download progress)
      self.postMessage({ status: 'progress', data });
    });

    self.postMessage({ status: 'started' });

    // Execute speech-to-text
    const response = await pipe(audio, {
      chunk_length_s: 30,
      stride_length_s: 5,
      language: language,
      task: 'transcribe',
      return_timestamps: false
    });

    self.postMessage({ status: 'completed', text: response.text });
  } catch (error) {
    console.error("Whisper Web Worker Error:", error);
    self.postMessage({ status: 'error', error: error.message });
  }
});
