import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ComNoteColorPresenter } from '@components/note-color-presenter/com-note-color-presenter.component';
import { ComNotePresenter } from '@components/note-presenter';

import { ChordsService, DiatonicChord } from '@services/chords';
import { NoteNamesManager } from '@services/note-names/note-names.service';

@Component({
  selector: 'wid-chords-row',
  imports: [ComNoteColorPresenter, ComNotePresenter],
  templateUrl: './wid-chords-row.component.html',
  styleUrl: './wid-chords-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidChordsRow {
  protected readonly chords = inject(ChordsService);
  private readonly noteNames = inject(NoteNamesManager);

  protected readonly selectedChordNotes = computed(() => {
    const chord = this.chords.selectedChord();
    if (!chord) return '';
    const names = this.noteNames.noteNames();
    return [...chord.notes].map(n => names[n].name).join(' · ');
  });

  protected trackChord(_index: number, chord: DiatonicChord): string {
    return `${chord.root}:${chord.isMinor}`;
  }
}
