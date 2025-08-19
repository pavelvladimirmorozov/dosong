import { Component, inject } from '@angular/core';
import { DecimalPipe, NgStyle } from '@angular/common';

import { DeepSeekAudioProcessor } from '@services/deepseek-audio-processor';

@Component({
  selector: 'com-tuner',
  imports: [NgStyle, DecimalPipe],
  templateUrl: './com-tuner.component.html',
  styleUrl: './com-tuner.component.scss'
})
export class ComTuner {
  // processor = inject(CustomAudioProcessor);
  // processor = inject(GoogleAudioProcessor);
  processor = inject(DeepSeekAudioProcessor);
}
