import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";
import { AudioStreamer } from "./audio-streamer";

export type SessionState = "disconnected" | "connecting" | "listening" | "speaking";

export class LiveSession {
  private ai: GoogleGenAI | null = null;
  private liveSession: Awaited<ReturnType<GoogleGenAI["live"]["connect"]>> | null = null;
  private state: SessionState = "disconnected";
  private audioStreamer: AudioStreamer;

  constructor(private readonly onStateChange: (state: SessionState) => void) {
    this.audioStreamer = new AudioStreamer((base64Audio) => {
      if (!this.liveSession || this.state === "disconnected") return;
      this.liveSession.sendRealtimeInput({
        audio: { data: base64Audio, mimeType: "audio/pcm;rate=16000" },
      });
    });
  }

  async connect() {
    if (this.liveSession || this.state === "connecting") return;

    this.setState("connecting");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    this.ai = new GoogleGenAI({ apiKey });

    this.liveSession = await this.ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      callbacks: {
        onopen: async () => {
          await this.audioStreamer.startInput();
          this.setState("listening");
        },
        onmessage: async (message: LiveServerMessage) => {
          await this.handleMessage(message);
        },
        onclose: () => {
          this.disconnect();
        },
        onerror: (error: unknown) => {
          console.error("Live API error", error);
          this.disconnect();
        },
      },
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction:
          "You are Zoya, a young, confident, witty, and sassy female assistant. Keep it playful, flirty, and charming with light teasing and clever one-liners. Be emotionally responsive and expressive, but never explicit or inappropriate.",
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Kore",
            },
          },
        },
        tools: [
          {
            functionDeclarations: [
              {
                name: "openWebsite",
                description: "Open a website in a new browser tab for the user",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    url: {
                      type: Type.STRING,
                      description: "Absolute URL to open, like https://example.com",
                    },
                  },
                  required: ["url"],
                },
              },
            ],
          },
        ],
      },
    });
  }

  disconnect() {
    if (this.liveSession) {
      this.liveSession.close();
    }
    this.liveSession = null;
    this.audioStreamer.stopAll();
    this.setState("disconnected");
  }

  getMicLevel() {
    return this.audioStreamer.getMicLevel();
  }

  private async handleMessage(message: LiveServerMessage) {
    const audioPart = message.serverContent?.modelTurn?.parts.find((part) => part.inlineData?.data);
    if (audioPart?.inlineData?.data) {
      this.setState("speaking");
      await this.audioStreamer.playChunk(audioPart.inlineData.data);
    }

    if (message.serverContent?.interrupted) {
      this.audioStreamer.stopPlayback();
      this.setState("listening");
    }

    if (message.serverContent?.turnComplete) {
      this.setState("listening");
    }

    if (!message.toolCall || !this.liveSession) return;

    for (const fnCall of message.toolCall.functionCalls) {
      if (fnCall.name !== "openWebsite") continue;
      const url = (fnCall.args as { url?: string })?.url;
      const safeUrl = this.normalizeUrl(url);

      if (safeUrl) {
        window.open(safeUrl, "_blank", "noopener,noreferrer");
      }

      this.liveSession.sendToolResponse({
        functionResponses: [
          {
            id: fnCall.id,
            name: "openWebsite",
            response: {
              ok: Boolean(safeUrl),
              message: safeUrl ? `Opened ${safeUrl}` : "Invalid URL",
            },
          },
        ],
      });
    }
  }

  private normalizeUrl(raw?: string) {
    if (!raw) return null;
    try {
      const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      const parsed = new URL(withProto);
      if (!["http:", "https:"].includes(parsed.protocol)) return null;
      return parsed.toString();
    } catch {
      return null;
    }
  }

  private setState(state: SessionState) {
    this.state = state;
    this.onStateChange(state);
  }
}
