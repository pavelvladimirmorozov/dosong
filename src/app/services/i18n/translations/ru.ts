export const RU_TRANSLATIONS: Record<string, string> = {
  // Common
  'common.ok': 'ОК',
  'common.cancel': 'Отмена',

  // Navigation
  'nav.fretboard': 'Гриф',
  'nav.metronome': 'Метроном',
  'nav.tuner': 'Тюнер',
  'nav.settings': 'Настройки',

  // Settings page
  'settings.title': 'Настройки',
  'settings.darkTheme': 'Тёмная тема',
  'settings.dynamicNoteNaming': 'Динамическое именование нот',
  'settings.dynamicNoteNamingHint': 'Названия подстраиваются под тональность',
  'settings.staticNoteNamingHint': 'Всегда используются названия с диезами',
  'settings.highlight': 'Подсветка нот',
  'settings.octaveHighlight': 'Подсветка октав',
  'settings.language': 'Язык',

  // Languages
  'language.ru': 'Русский',
  'language.en': 'English',

  // Highlight modes
  'highlight.off': 'Без подсветки',
  'highlight.dynamicSingle': 'Динамическая одноцветная',
  'highlight.dynamicMulti': 'Динамическая цветная',
  'highlight.staticMulti': 'Статическая цветная',

  // Gamma
  'gamma.formula': 'Формула:',
  'gamma.showAllNotes': 'Отображать все ноты',
  'gamma.semitone.1': 'полутон',
  'gamma.semitone.2': 'тон',
  'gamma.semitone.3': '1½ тона',
  'gamma.semitone.4': '2 тона',
  'gamma.semitone.5': '2½ тона',
  'gamma.semitone.6': '3 тона',

  // Chords
  'chords.position': 'Позиция',
  'chords.allNotes': 'Все ноты',
  'chords.frets': 'Лады',
  'chords.openShort': 'Откр.',
  'chords.prevPosition': 'Предыдущая позиция',
  'chords.nextPosition': 'Следующая позиция',
  'chords.kind.natural': 'Натуральный',
  'chords.kind.harmonic': 'Гармонический',
  'chords.kind.melodic': 'Мелодический',
  'chords.kind.pentatonic': 'Пентатоника',
  'chords.kind.blues': 'Блюзовый',
  'chords.kind.chromatic': 'Хроматический',
  'chords.kind.japanese': 'Японская',
  'chords.kind.egyptian': 'Египетская',
  'chords.addToProgression': 'В прогрессию',
  'chords.borrowed': 'Заимствованные',
  'chords.notSelected': 'Аккорд не выбран',
  'chords.emptySlot': 'Пауза',

  // Chord modifiers
  'chordModifier.none': 'Без',
  'chordModifier.sus2': 'sus2',
  'chordModifier.sus4': 'sus4',
  'chordModifier.six': '6',
  'chordModifier.seven': '7',
  'chordModifier.maj7': 'maj7',
  'chordModifier.add9': 'add9',
  'chordModifier.nine': '9',
  'chordModifier.dim': 'dim',
  'chordModifier.dim7': 'dim7',
  'chordModifier.m7b5': 'm7b5',
  'chordModifier.aug': 'aug',

  // Progression
  'progression.title': 'Прогрессия песни',
  'progression.empty': 'Нет сохранённых прогрессий',
  'progression.new': 'Новая',
  'progression.rename': 'Переименовать',
  'progression.delete': 'Удалить',
  'progression.start': 'Старт',
  'progression.stop': 'Стоп',
  'progression.modifier': 'Тип',
  'progression.beats': 'Долей',
  'progression.namePlaceholder': 'Песня',
  'progression.moveLeft': 'Левее',
  'progression.moveRight': 'Правее',
  'progression.removeSlot': 'Убрать аккорд',
  'progression.addHint': 'Добавьте аккорды из палитры',
  'progression.save': 'Сохранить',
  'progression.cancel': 'Отмена',
  'progression.notSelected': 'Не выбрана',
  'progression.confirmApplyContext': 'Строй и тональность будут изменены. Продолжить?',
  'progression.confirmFinishSong': 'Хотите завершить работу с текущей песней? Все изменения будут сохранены.',

  // Fretboard
  'fretboard.instrument': 'Инструмент',
  'fretboard.customInstrument': 'Свой строй',

  // Instruments
  'instrument.guitar': 'Гитара',
  'instrument.bass': 'Бас-гитара',
  'instrument.guitar7': 'Русская гитара (7 струн)',
  'instrument.ukulele': 'Укулеле',
  'instrument.domra': 'Домра',
  'instrument.balalaika': 'Балалайка',
  'instrument.mandolin': 'Мандолина',
  'instrument.banjo': 'Банджо',

  // Metronome
  'metronome.volume': 'Громкость',
  'metronome.beats': 'Доли',
  'metronome.start': 'Старт',
  'metronome.stop': 'Стоп',

  // Auto tempo
  'autoTempo.title': 'Автотемп',
  'autoTempo.enable': 'Включить постепенное изменение темпа',
  'autoTempo.bpmStep': 'Шаг BPM',
  'autoTempo.bpmStepHint': '+ ускоряет, − замедляет',
  'autoTempo.period': 'Период',
  'autoTempo.periodUnit': 'тактов между шагами',
  'autoTempo.targetBpm': 'Целевой BPM',

  // Tuner
  'tuner.start': 'Старт',
  'tuner.stop': 'Стоп',

  // Metronome indicator (aria)
  'metronomeIndicator.start': 'Запустить',
  'metronomeIndicator.stop': 'Стоп',
  'metronomeIndicator.close': 'Закрыть',

  // Scale names
  'scale.chromatic': 'Хроматизм',
  'scale.major': 'Натуральный мажор',
  'scale.minor': 'Натуральный минор',
  'scale.harmonicMinor': 'Гармонический минор',
  'scale.melodicMinor': 'Мелодический минор',
  'scale.harmonicMajor': 'Гармонический мажор',
  'scale.melodicMajor': 'Мелодический мажор',
  'scale.majorPentatonic': 'Мажорная пентатоника',
  'scale.minorPentatonic': 'Минорная пентатоника',
  'scale.blues': 'Блюзовая гамма',
  'scale.egyptianPentatonic': 'Египетская пентатоника',
  'scale.japanesePentatonic': 'Японская пентатоника',

  // Scale quality
  'quality.major': 'Мажор',
  'quality.minor': 'Минор',
  'quality.none': 'Без',

  // Scale kind
  'kind.natural': 'Натуральный',
  'kind.harmonic': 'Гармонический',
  'kind.melodic': 'Мелодический',
  'kind.pentatonic': 'Пентатоника',
  'kind.blues': 'Блюзовый',
  'kind.chromatic': 'Хроматический',
  'kind.japanese': 'Японская пентатоника',
  'kind.egyptian': 'Египетская пентатоника',

  // Octaves
  'octave.0': '0 - Субсубконтроктава',
  'octave.1': '1 - Субконтроктава',
  'octave.2': '2 - Контроктава',
  'octave.3': '3 - Большая октава',
  'octave.4': '4 - Малая октава',
  'octave.5': '5 - Первая октава',
  'octave.6': '6 - Вторая октава',
  'octave.7': '7 - Третья октава',
  'octave.8': '8 - Четвёртая октава',
};
