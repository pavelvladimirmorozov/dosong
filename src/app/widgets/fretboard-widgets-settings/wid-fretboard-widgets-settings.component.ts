import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import {
  ComChordsIcon,
  ComCircleIcon,
  ComGammaIcon,
  ComGuitarIcon,
  ComSongIcon,
} from '@components/icons';

import { I18nService, TranslatePipe } from '@services/i18n';
import { FretboardWidgetId, FretboardWidgetSetting, SettingsRepository } from '@services/settings';

@Component({
  selector: 'wid-fretboard-widgets-settings',
  imports: [
    CdkDrag,
    CdkDropList,
    ComChordsIcon,
    ComCircleIcon,
    ComGammaIcon,
    ComGuitarIcon,
    ComSongIcon,
    TranslatePipe,
  ],
  templateUrl: './wid-fretboard-widgets-settings.component.html',
  styleUrl: './wid-fretboard-widgets-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidFretboardWidgetsSettings {
  protected readonly settings = inject(SettingsRepository);
  private readonly i18n = inject(I18nService);

  protected readonly widgets = computed(() => this.settings.fretboardWidgets());

  private ignoreNextWidgetClick = false;
  private dragClickGuardTimer: ReturnType<typeof setTimeout> | null = null;

  protected onWidgetDrop(event: CdkDragDrop<FretboardWidgetSetting[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    const widgets = [...this.settings.fretboardWidgets()];
    moveItemInArray(widgets, event.previousIndex, event.currentIndex);
    this.settings.fretboardWidgets.set(widgets);
  }

  protected onWidgetDragStarted(): void {
    if (this.dragClickGuardTimer !== null) {
      clearTimeout(this.dragClickGuardTimer);
      this.dragClickGuardTimer = null;
    }

    this.ignoreNextWidgetClick = true;
  }

  protected onWidgetDragEnded(): void {
    this.dragClickGuardTimer = setTimeout(() => {
      this.ignoreNextWidgetClick = false;
      this.dragClickGuardTimer = null;
    });
  }

  protected toggleWidget(widget: FretboardWidgetSetting): void {
    if (this.ignoreNextWidgetClick) return;

    this.settings.fretboardWidgets.update(widgets => widgets.map(item => item.id === widget.id
      ? { ...item, visible: !item.visible }
      : item
    ));
  }

  protected widgetLabel(id: FretboardWidgetId): string {
    return this.i18n.t(this.widgetLabelKey(id));
  }

  protected widgetToggleLabel(widget: FretboardWidgetSetting): string {
    const actionKey = widget.visible ? 'settings.widgetHide' : 'settings.widgetShow';
    return `${this.i18n.t(actionKey)}: ${this.widgetLabel(widget.id)}`;
  }

  protected widgetLabelKey(id: FretboardWidgetId): string {
    return `widget.${id}`;
  }

  protected trackWidget(_index: number, widget: FretboardWidgetSetting): FretboardWidgetId {
    return widget.id;
  }
}
