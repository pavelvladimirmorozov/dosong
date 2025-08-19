import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class DeepSeekAudioProcessor {
  currentNote = signal('');
  currentIndent = signal(50);
  currentCents = signal(0);
  currentHz = signal(0);
  currentVolume = signal(0);

  audioContext!: AudioContext;
  analyser!: AnalyserNode;
  microphone!: MediaStreamAudioSourceNode;
  interval: any;

  // Параметры обработки звука
  readonly SAMPLE_RATE = 44100;
  readonly BUFFER_SIZE = 2048;
  readonly SILENCE_THRESHOLD = 0.05; // Порог громкости (0-1)
  readonly HISTORY_LENGTH = 5; // Количество последних измерений для усреднения

  frequencyHistory: Array<any> = [];
  lastValidFrequency = 0;
  
  timeDomainData: any;
  frequencies: any;

  public async startStop() {
    if (!this.interval)
      await this.startPitchDetection();
    else
      this.stopPitchDetection();
  }

  async startPitchDetection() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.audioContext = new AudioContext({
        sampleRate: this.SAMPLE_RATE
      });
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.BUFFER_SIZE;

      this.timeDomainData = new Float32Array(this.analyser.fftSize);
      this.frequencies = new Uint8Array(this.analyser.frequencyBinCount);

      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);

      // Обновляем отображение каждые 100 мс
      this.interval = setInterval(this.getSoundData, 100);

    } catch (error: any) {
      console.error('Ошибка доступа к микрофону:', error);
    }
  }
  
  getSoundData = () => {
    this.analyser.getFloatTimeDomainData(this.timeDomainData);
    this.analyser.getByteFrequencyData(this.frequencies);

    const currentFrequency = this.findDominantFrequency(this.timeDomainData, this.audioContext.sampleRate);
    const averageFrequency = this.getAverageFrequency(currentFrequency);

    if (averageFrequency !== null) {
      this.lastValidFrequency = averageFrequency;
      this.currentHz.set(averageFrequency);
    } else if (this.frequencyHistory.length > 0) {
      this.currentHz.set(this.lastValidFrequency);
    } else {
      this.currentHz.set(0);
    }
  }

  // Функция для расчета громкости
  calculateVolume(buffer: Float32Array<any>) {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
  }

  // Функция для поиска основной частоты
  findDominantFrequency(buffer: Float32Array<any>, sampleRate: number) {
    // 1. Проверяем громкость
    const volume = this.calculateVolume(buffer);
    this.currentVolume.set(volume);

    if (volume < this.SILENCE_THRESHOLD) {
      return null; // Слишком тихий звук
    }
    // 2. Автокорреляционный метод
    return this.autoCorrelate(buffer, sampleRate);
  }

  autoCorrelate(buffer: Float32Array<any>, sampleRate: number) {
    let bestOffset = -1;
    let bestCorrelation = -1;

    for (let offset = 20; offset < buffer.length / 2; offset++) {
      let correlation = 0;

      for (let i = 0; i < buffer.length / 2; i++) {
        correlation += buffer[i] * buffer[i + offset];
      }

      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    }

    if (bestOffset === -1) return null;

    return sampleRate / bestOffset;
  }

  // Функция для усреднения частоты
  getAverageFrequency(newFrequency: number | null) {
    if (newFrequency !== null) {
      this.frequencyHistory.push(newFrequency);
      if (this.frequencyHistory.length > this.HISTORY_LENGTH) {
        this.frequencyHistory.shift();
      }
    }

    if (this.frequencyHistory.length === 0) return null;

    // Вычисляем медиану для устранения выбросов
    const sorted = [...this.frequencyHistory].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 !== 0 ?
      sorted[mid] :
      (sorted[mid - 1] + sorted[mid]) / 2;
  }

  stopPitchDetection() {
    if (this.microphone && this.audioContext) {
      this.microphone.disconnect();
      this.audioContext.close();
    }

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }

    this.frequencyHistory = [];

    this.currentHz.set(0);
    this.currentVolume.set(0);
  }
}