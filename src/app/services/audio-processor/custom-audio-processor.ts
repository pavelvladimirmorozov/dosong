import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CustomAudioProcessor {

  private readonly noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  currentNote = signal('');
  currentIndent = signal(50);   // 0–100, 50 = в тон (25–75 при активном сигнале)
  currentCents = signal(0);    // −50 до +50
  currentHz = signal(0);
  currentVolume = signal(0);
  currentMidiNote = signal(0); // 0 = нет сигнала
  isActive = signal(false);

  private audioCtx: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private buffer: Float32Array<ArrayBuffer> | null = null;
  private mediaStream: MediaStream | null = null;
  private intervalId: any = null;

  private readonly SILENCE_THRESHOLD = 0.01;
  private readonly HISTORY_LENGTH = 5;
  private frequencyHistory: number[] = [];

  async startStop(): Promise<void> {
    if (this.isActive()) {
      this.stop();
    } else {
      await this.start();
    }
  }

  private async start(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      this.audioCtx = new AudioContext();
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 2048;
      this.buffer = new Float32Array(this.analyserNode.fftSize);

      const source = this.audioCtx.createMediaStreamSource(this.mediaStream);
      source.connect(this.analyserNode);

      this.isActive.set(true);
      this.intervalId = setInterval(this.getSoundData, 50);
    } catch (err) {
      console.error('Ошибка доступа к микрофону:', err);
    }
  }

  private stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.mediaStream = null;
    this.audioCtx?.close();
    this.audioCtx = null;
    this.analyserNode = null;
    this.buffer = null;

    this.frequencyHistory = [];
    this.isActive.set(false);
    this.currentNote.set('');
    this.currentMidiNote.set(0);
    this.currentHz.set(0);
    this.currentCents.set(0);
    this.currentIndent.set(50);
    this.currentVolume.set(0);
  }

  private getSoundData = (): void => {
    if (!this.analyserNode || !this.buffer || !this.audioCtx) return;

    this.analyserNode.getFloatTimeDomainData(this.buffer);

    const volume = this.calculateVolume(this.buffer);
    this.currentVolume.set(volume);

    if (volume < this.SILENCE_THRESHOLD) return;

    const rawFreq = this.autoCorrelate(this.buffer, this.audioCtx.sampleRate);
    if (rawFreq < 0) return;

    // Сглаживание медианным фильтром
    this.frequencyHistory.push(rawFreq);
    if (this.frequencyHistory.length > this.HISTORY_LENGTH) {
      this.frequencyHistory.shift();
    }
    const frequency = this.getMedianFrequency();

    this.currentHz.set(Math.round(frequency * 10) / 10);

    const midiNote = this.getNoteFromFreq(frequency);
    this.currentNote.set(this.noteStrings[midiNote % 12]);
    this.currentMidiNote.set(midiNote);

    const targetFreq = this.getFreqFromNote(midiNote);
    const cents = Math.max(-50, Math.min(50, this.centsOffPitch(frequency, targetFreq)));
    this.currentCents.set(cents);

    // Иголка движется в диапазоне 25–75%, отражая ±50¢
    // (0% и 100% — это зоны соседних нот на расширенной шкале)
    this.currentIndent.update(current => this.lerp(current, cents / 2 + 50, 0.15));
  };

  private calculateVolume(buf: Float32Array<ArrayBuffer>): number {
    let sum = 0;
    for (let i = 0; i < buf.length; i++) {
      sum += buf[i] * buf[i];
    }
    return Math.sqrt(sum / buf.length);
  }

  private getMedianFrequency(): number {
    const sorted = [...this.frequencyHistory].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  private getNoteFromFreq(freq: number): number {
    return Math.round(12 * (Math.log(freq / 440) / Math.log(2))) + 69;
  }

  private getFreqFromNote(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  private centsOffPitch(played: number, target: number): number {
    return Math.round((1200 * Math.log(played / target)) / Math.log(2));
  }

  private lerp(start: number, end: number, amt: number): number {
    return (1 - amt) * start + amt * end;
  }

  // Автокорреляция с windowing и параболической интерполяцией
  private autoCorrelate(buf: Float32Array<ArrayBuffer>, sampleRate: number): number {
    const SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
      rms += buf[i] * buf[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < this.SILENCE_THRESHOLD) return -1;

    // Найти границы устойчивого сигнала (windowing)
    let r1 = 0, r2 = SIZE - 1;
    const thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    }

    const cropped = buf.slice(r1, r2);
    const len = cropped.length;

    // Корреляция
    const c = new Array(len).fill(0);
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i; j++) {
        c[i] += cropped[j] * cropped[j + i];
      }
    }

    // Найти первый минимум, потом глобальный максимум
    let d = 0;
    while (d + 1 < len && c[d] > c[d + 1]) d++;

    let maxval = -1, maxpos = -1;
    for (let i = d; i < len; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    if (maxpos <= 0 || maxpos >= len - 1) return -1;

    // Параболическая интерполяция для точности
    let T0 = maxpos;
    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }
}
