import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { FretboardWidgetId, FretboardWidgetSetting, SettingsRepository } from '@services/settings';
import { WidChordProgression } from '@widgets/chord-progression/wid-chord-progression.component';
import { WidChordsRow } from '@widgets/chords-row/wid-chords-row.component';
import { WidCuartCircle } from '@widgets/cuart-circle/wid-cuart-circle.component';
import { WidFretboardWidgetsSettings } from '@widgets/fretboard-widgets-settings/wid-fretboard-widgets-settings.component';
import { WidFretboard } from '@widgets/fretboard/wid-fretboard.component';
import { WidGamma } from '@widgets/gamma/wid-gamma.component';
import { WidTonality } from '@widgets/tonality/wid-tonality.component';

@Component({
  selector: 'app-fretboard-page',
  imports: [
    WidChordProgression,
    WidChordsRow,
    WidCuartCircle,
    WidFretboard,
    WidFretboardWidgetsSettings,
    WidGamma,
    WidTonality,
  ],
  templateUrl: './fretboard-page.component.html',
  styleUrl: './fretboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FretboardPageComponent {
  private readonly settings = inject(SettingsRepository);

  protected readonly visibleWidgets = computed(() =>
    this.settings.fretboardWidgets().filter(widget => widget.visible)
  );

  protected trackWidget(_index: number, widget: FretboardWidgetSetting): FretboardWidgetId {
    return widget.id;
  }
}
