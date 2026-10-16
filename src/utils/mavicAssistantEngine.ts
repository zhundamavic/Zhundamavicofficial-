/**
 * Mavic OS Offline Voice Assistant Engine ("MAVIC")
 * Supports Speech Recognition, Speech Synthesis, Wake-word "Hi Mavic",
 * Offline storage, and system command execution.
 */

export interface MavicCommandResult {
  reply: string;
  actionTaken?: string;
  executedAction?: () => void;
  needsNameInput?: boolean;
}

export class MavicSpeechEngine {
  private recognition: any = null;
  public isListening: boolean = false;
  private onTranscriptCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onWakeWordCallback: (() => void) | null = null;

  constructor() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const combined = (finalTranscript || interimTranscript).trim().toLowerCase();

          // Check wake word: "hi mavic" or "hey mavic"
          if (combined.includes('hi mavic') || combined.includes('hey mavic') || combined.includes('hello mavic')) {
            if (this.onWakeWordCallback) {
              this.onWakeWordCallback();
            }
          }

          if (this.onTranscriptCallback) {
            this.onTranscriptCallback(finalTranscript || interimTranscript, Boolean(finalTranscript));
          }
        };

        this.recognition.onend = () => {
          // If still marked listening, restart recognition (continuous listening)
          if (this.isListening) {
            try {
              this.recognition.start();
            } catch {
              // Ignore already started errors
            }
          }
        };

        this.recognition.onerror = () => {
          // Soft ignore errors like no-speech
        };
      } catch {
        // Recognition not supported
      }
    }
  }

  public setCallbacks(
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onWakeWord: () => void
  ) {
    this.onTranscriptCallback = onTranscript;
    this.onWakeWordCallback = onWakeWord;
  }

  public startListening() {
    if (!this.recognition) return false;
    try {
      this.isListening = true;
      this.recognition.start();
      return true;
    } catch {
      return false;
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      // Pick a clean natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Samantha') ||
            v.name.includes('Siri') ||
            v.name.includes('Natural') ||
            v.name.includes('Google US English'))
      );
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => {
        onEnd?.();
      };
      utterance.onerror = () => {
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      onEnd?.();
    }
  }
}

export const mavicSpeech = new MavicSpeechEngine();
