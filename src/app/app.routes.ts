import { Routes } from '@angular/router';
import { FretboardPageComponent } from '@pages/fretboard/fretboard-page.component';
import { KnowledgeBaseComponent } from '@pages/knowledge-base/knowledge-base.component';
import { MetronomePageComponent } from '@pages/metronome/metronome-page.component';
import { TunerPageComponent } from '@pages/tuner/tuner-page.component';

export const routes: Routes = [
  {
    path: '',
    component: FretboardPageComponent,
  },
  {
    path: 'tuner',
    component: TunerPageComponent,
  },
  {
    path: 'knowledge-base',
    component: KnowledgeBaseComponent,
  },
  {
    path: 'metronome',
    component: MetronomePageComponent,
  },
];
