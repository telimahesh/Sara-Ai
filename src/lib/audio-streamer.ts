/**
 * Captures microphone input as 16kHz PCM16 and plays model audio at 24kHz PCM16.
 */
export class AudioStreamer {
  private inputContext: AudioContext | null = null;
  private playbackContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private nextStartTime = 0;
  private recording = false;

  constructor(private readonly onAudioData: (base64Pcm16: string) => void) {}

  async startInput() {
    if (this.recording) return;

    this.inputContext = new AudioContext({ sampleRate: 16000 });
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    if (!this.inputContext) return;

    this.source = this.inputContext.createMediaStreamSource(this.stream);
    this.analyser = this.inputContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.processor = this.inputContext.createScriptProcessor(4096, 1, 1);

    this.source.connect(this.analyser);
    this.source.connect(this.processor);
    this.processor.connect(this.inputContext.destination);

    this.processor.onaudioprocess = (event) => {
      if (!this.recording) return;
      const float32 = event.inputBuffer.getChannelData(0);
      const pcm16 = this.floatToPcm16(float32);
      this.onAudioData(this.arrayBufferToBase64(pcm16.buffer));
    };

    this.recording = true;

    if (!this.playbackContext) {
      this.playbackContext = new AudioContext({ sampleRate: 24000 });
      this.nextStartTime = this.playbackContext.currentTime;
    } else if (this.playbackContext.state === "suspended") {
      await this.playbackContext.resume();
    }
  }

  stopInput() {
    this.recording = false;
    this.processor?.disconnect();
    this.source?.disconnect();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.inputContext?.close();
    this.inputContext = null;
  }

  async playChunk(base64Pcm16: string) {
    if (!this.playbackContext) {
      this.playbackContext = new AudioContext({ sampleRate: 24000 });
      this.nextStartTime = this.playbackContext.currentTime;
    }

    const binary = window.atob(base64Pcm16);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    const pcm16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 0x8000;

    const buffer = this.playbackContext.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);

    const src = this.playbackContext.createBufferSource();
    src.buffer = buffer;
    src.connect(this.playbackContext.destination);

    const startAt = Math.max(this.nextStartTime, this.playbackContext.currentTime);
    src.start(startAt);
    this.nextStartTime = startAt + buffer.duration;
  }

  stopPlayback() {
    this.playbackContext?.close();
    this.playbackContext = null;
    this.nextStartTime = 0;
  }

  getMicLevel() {
    if (!this.analyser) return 0;
    const values = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(values);
    const avg = values.reduce((acc, n) => acc + n, 0) / values.length;
    return avg / 255;
  }

  stopAll() {
    this.stopInput();
    this.stopPlayback();
  }

  private floatToPcm16(input: Float32Array) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const sample = Math.max(-1, Math.min(1, input[i]));
      output[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }
    return output;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  }
}
