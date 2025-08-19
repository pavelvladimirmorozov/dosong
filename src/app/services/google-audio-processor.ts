import { Injectable, signal } from "@angular/core";
import { DefaultStrings, DefaultStringsKeys } from "../models/default-strings";

@Injectable({ providedIn: 'root' })
export class GoogleAudioProcessor {
  private readonly noteStrings = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

  currentNote = signal('');
  currentIndent = signal(50);
  currentCents = signal(0);
  currentHz = signal(0);
  currentOctave = signal(0);

  interval?: any;

  FFTSIZE = 2048;
  lastRms = 0;;
  rmsThreshold = 0.006;
  assessStringsUntilTime = 0;
  frequencyBufferLength = this.FFTSIZE;
  frequencyBuffer = new Float32Array(this.frequencyBufferLength);

  sendingAudioData = false;
  assessedStringsInLastFrame = false;

  stream?: MediaStream;
  audioContext = new AudioContext();
  analyser: AnalyserNode = this.audioContext.createAnalyser();
  gainNode: GainNode = this.audioContext.createGain();

  microphone?: MediaStreamAudioSourceNode;
  strings = new DefaultStrings(this.audioContext.sampleRate);

  stringsKeys: DefaultStringsKeys[] = Object.keys(this.strings) as DefaultStringsKeys[];

  public startStop() {
    console.log("startStop", this.sendingAudioData)
    if (this.sendingAudioData) {
      this.sendingAudioData = false;

      if (this.stream) {
        this.stream.getAudioTracks().forEach((track: MediaStreamTrack) => {
          track.stop();
        });
      }
      this.stream = undefined;
    } else {
      this.requestUserMedia();
    }
  }

  constructor() {
    this.gainNode.gain.value = 0;
    this.analyser.fftSize = this.FFTSIZE;
    this.analyser.smoothingTimeConstant = 0;
  }

  requestUserMedia() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {

      this.sendingAudioData = true;
      this.stream = stream;
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // this.interval = setInterval(this.dispatchAudioData, 1);

      requestAnimationFrame(this.dispatchAudioData);

    }, (err) => {
      console.log('Unable to access the microphone');
    });
  }

  sortStringKeysByDifference = (a: DefaultStringsKeys, b: DefaultStringsKeys) => {
    return this.strings[a].difference - this.strings[b].difference;
  }

  /**
   * Autocorrelate the audio data, which is basically where you
   * compare the audio buffer to itself, offsetting by one each
   * time, up to the half way point. You sum the differences and
   * you see how small the difference comes out.
   */
  autocorrelateAudioData = (time: number) => {
    let searchSize = this.frequencyBufferLength * 0.5;
    let sampleRate = this.audioContext.sampleRate;
    let offsetKey = null;
    let offset = 0;
    let difference = 0;
    let tolerance = 0.001;
    let rms = 0;
    let rmsMin = 0.008;
    let assessedStringsInLastFrame = this.assessedStringsInLastFrame;

    // Fill up the data.
    this.analyser.getFloatTimeDomainData(this.frequencyBuffer);

    // Figure out the root-mean-square, or rms, of the audio. Basically
    // this seems to be the amount of signal in the buffer.
    for (let d = 0; d < this.frequencyBuffer.length; d++) {
      rms += this.frequencyBuffer[d] * this.frequencyBuffer[d];
    }

    rms = Math.sqrt(rms / this.frequencyBuffer.length);

    // If there's little signal in the buffer quit out.
    if (rms < rmsMin)
      return 0;

    // Only check for a new string if the volume goes up. Otherwise assume
    // that the string is the same as the last frame.
    if (rms > this.lastRms + this.rmsThreshold)
      this.assessStringsUntilTime = time + 250;

    if (time < this.assessStringsUntilTime) {

      this.assessedStringsInLastFrame = true;

      // Go through each string and figure out which is the most
      // likely candidate for the string being tuned based on the
      // difference to the "perfect" tuning.
      for (let o = 0; o < this.stringsKeys.length; o++) {

        offsetKey = this.stringsKeys[o];
        offset = this.strings[offsetKey].offset;
        difference = 0;

        // Reset how often this string came out as the closest.
        if (assessedStringsInLastFrame === false)
          this.strings[offsetKey].difference = 0;

        // Now we know where the peak is, we can start
        // assessing this sample based on that. We will
        // step through for this string comparing it to a
        // "perfect wave" for this string.
        for (let i = 0; i < searchSize; i++) {
          difference += Math.abs(this.frequencyBuffer[i] -
            this.frequencyBuffer[i + offset]);
        }

        difference /= searchSize;

        // Weight the difference by frequency. So lower strings get
        // less preferential treatment (higher offset values). This
        // is because harmonics can mess things up nicely, so we
        // course correct a little bit here.
        this.strings[offsetKey].difference += (difference * offset);
      }



    } else {
      this.assessedStringsInLastFrame = false;
    }

    // If this is the first frame where we've not had to reassess strings
    // then we will order by the string with the largest number of matches.
    if (assessedStringsInLastFrame === true &&
      this.assessedStringsInLastFrame === false) {
      this.stringsKeys.sort(this.sortStringKeysByDifference);
    }

    // Next for the top candidate in the set, figure out what
    // the actual offset is from the intended target.
    // We'll do it by making a full sweep from offset - 10 -> offset + 10
    // and seeing exactly how long it takes for this wave to repeat itself.
    // And that will be our *actual* frequency.
    let searchRange = 10;
    let assumedString = this.strings[this.stringsKeys[0]];
    let searchStart = assumedString.offset - searchRange;
    let searchEnd = assumedString.offset + searchRange;
    let actualFrequency = assumedString.offset;
    let smallestDifference = Number.POSITIVE_INFINITY;

    console.log("actualFrequency",this.audioContext.sampleRate / actualFrequency);

    for (let s = searchStart; s < searchEnd; s++) {

      difference = 0;

      // For each iteration calculate the difference of every element of the
      // array. The data in the buffer should be PCM, so values ranging
      // from -1 to 1. If they match perfectly then they'd essentially
      // cancel out. But this is real data so we'll be looking for small
      // amounts. If it's below tolerance assume a perfect match, otherwise
      // go with the smallest.
      //
      // A better version of this would be to curve match on the data.
      for (let i = 0; i < searchSize; i++) {
        difference += Math.abs(this.frequencyBuffer[i] -
          this.frequencyBuffer[i + s]);
      }

      difference /= searchSize;

      if (difference < smallestDifference) {
        smallestDifference = difference;
        actualFrequency = s;
      }

      if (difference < tolerance) {
        actualFrequency = s;
        break;
      }
    }

    this.lastRms = rms;

    return this.audioContext.sampleRate / actualFrequency;

  }

  dispatchAudioData = (time: number) => {

    if (this.sendingAudioData)
      requestAnimationFrame(this.dispatchAudioData);

    let frequency = this.autocorrelateAudioData(time);

    console.log("dispatchAudioData", frequency);

    if (frequency === 0)
      return;

    // Convert the most active frequency to linear, based on A440.
    let dominantFrequency = Math.log2(frequency / 440);

    // Figure out how many semitones that equates to.
    let semitonesFromA4 = 12 * dominantFrequency;

    // The octave is A440 for 4, so start there, then adjust by the
    // number of semitones. Since we're at A, we need only 3 more to
    // push us up to octave 5, and 9 to drop us to 3. So there's the magic
    // 9 in that line below accounted for.
    let octave = 4 + ((9 + semitonesFromA4) / 12);
    octave = Math.floor(octave);

    // The note is 0 for A, all the way to 11 for G#.
    let note = (12 + (Math.round(semitonesFromA4) % 12)) % 12;

    this.currentHz.set(frequency);
    this.currentOctave.set(octave);
    this.currentNote.set(this.noteStrings[note]);

  }
}