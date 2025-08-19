import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CustomAudioProcessor {

  private readonly noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  currentNote = signal('');
  currentIndent = signal(50);
  currentCents = signal(0);
  currentHz = signal(0);

  audioCtx!: AudioContext;
  analyserNode!: AnalyserNode;
  buffer!: Float32Array<ArrayBufferLike>;

  interval?: any;

  constructor() {
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyserNode = this.audioCtx.createAnalyser();
    this.buffer = new Float32Array(this.analyserNode.fftSize);
  }

  async startStop(): Promise<void> {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
      return;
    }
    const mediaStream = await this.setupMic();
    const mediaSource = this.audioCtx.createMediaStreamSource(mediaStream);
    mediaSource.connect(this.analyserNode);
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    this.interval = setInterval(this.getSoundData, 1);
  }

  private getSoundData = () => {
    this.analyserNode.getFloatTimeDomainData(this.buffer);
    const frequency = this.autoCorrelate(this.buffer, this.audioCtx.sampleRate);
    if (frequency > -1) {
      this.currentHz.set(frequency);
      const midiPitch = this.getNoteFromPitchFrequency(frequency);
      const playingNote = this.noteStrings[midiPitch % 12];
      this.currentNote.set(playingNote)

      const hzOffPitch = this.centsOffPitch(
        frequency,
        this.getPitchFrequencyFromNote(midiPitch)
      )
      this.currentCents.set(hzOffPitch);
      this.currentIndent.update((current) => this.lerp(
        current,
        hzOffPitch + 50,
        0.1
      ))
    }
  }

  private getNoteFromPitchFrequency(freq: number): number {
    return Math.round(12 * (Math.log(freq / 440) / Math.log(2))) + 69;
  }

  private getPitchFrequencyFromNote(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  private centsOffPitch(frequencyPlayed: number, correctFrequency: number): number {
    return Math.floor(
      (1200 * Math.log(frequencyPlayed / correctFrequency)) / Math.log(2)
    );
  }

  private async setupMic(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
  }

  private lerp(start: number, end: number, amt: number): number {
    return (1 - amt) * start + amt * end;
  }

  autoCorrelate(buf: Float32Array<ArrayBuffer>, sampleRate: number) {
    var SIZE = buf.length;
    var rms = 0;

    for (let i = 0; i < SIZE; i++) {
      var val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01)
      // not enough signal
      return -1;

    var r1 = 0,
      r2 = SIZE - 1,
      thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++)
      if (Math.abs(buf[i]) < thres) {
        r1 = i;
        break;
      }
    for (let i = 1; i < SIZE / 2; i++)
      if (Math.abs(buf[SIZE - i]) < thres) {
        r2 = SIZE - i;
        break;
      }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    var c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++)
      for (var j = 0; j < SIZE - i; j++) c[i] = c[i] + buf[j] * buf[j + i];

    var d = 0;
    while (c[d] > c[d + 1]) d++;
    var maxval = -1,
      maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    var T0 = maxpos;

    var x1 = c[T0 - 1],
      x2 = c[T0],
      x3 = c[T0 + 1];
    var a = (x1 + x3 - 2 * x2) / 2;
    var b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }
}