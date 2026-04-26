# ChordsService

Сервис, отвечающий за всё, что связано с диатоническими аккордами текущей тональности и их аппликатурами на грифе. Источник истины для виджетов [`wid-chords-row`](../src/app/widgets/chords-row/), [`wid-chord-diagram`](../src/app/widgets/chord-diagram/), а также для подсветки нот аккорда и заглушённых струн в [`wid-fretboard`](../src/app/widgets/fretboard/) и [`wid-gamma`](../src/app/widgets/gamma/).

Файл: [`src/app/services/chords/chords.service.ts`](../src/app/services/chords/chords.service.ts)
Зарегистрирован как `@Injectable({ providedIn: 'root' })` — singleton.

## Зависимости

| Сервис | Что берём |
| --- | --- |
| [`ScaleSteepsService`](../src/app/services/scale-steps/scale-steps.service.ts) | `selectedScaleState()`, `selectedTonic`, `selectedScale` — источник ступеней текущей тональности |
| [`NoteColorsService`](../src/app/services/note-colors/note-colors.service.ts) | `getNoteColor(note, stepNumber)` — цвет ячейки аккорда (тот же, что у сектора круга) |
| [`NoteNamesManager`](../src/app/services/note-names/note-names.service.ts) | `noteNames()` — спеллинг нот для имени аккорда |
| [`TuningService`](../src/app/services/tuning/tuning.service.ts) | `tuning()`, `fretsCount()`, `noteAt(s,f)`, `midiAt(s,f)` — конфигурация инструмента |
| [`I18nService`](../src/app/services/i18n/i18n.service.ts) | `t(key)` — локализация лейблов позиций |

## Публичный API

### Сигналы и computed

```ts
diatonicChords:    Signal<DiatonicChord[]>           // 7 аккордов выбранной гаммы (или меньше)
selectedChord:     WritableSignal<DiatonicChord | null>
highlightedNotes:  Signal<ReadonlySet<Note>>         // pitch-classы выбранного аккорда
availablePositions: Signal<ChordPosition[]>          // аппликатуры выбранного аккорда
selectedPositionId: WritableSignal<string | null>
selectedPosition:  Signal<ChordPosition | null>
```

### Методы

```ts
toggle(chord)           // выбрать аккорд, повторно — снять выбор
isSelected(chord)       // помечен ли этот аккорд выбранным
isChordFret(s, fret)    // подсвечивать ли (s,fret) в гриф-виджете
isStringMuted(s)        // помечать ли струну s заглушённой (только при выбранной позиции)
```

### Реактивная инвалидация

```ts
// Эффект 1: смена тональности → сбросить выбор аккорда
effect(() => {
  scaleSteeps.selectedTonic();
  scaleSteeps.selectedScale();
  selectedChord.set(null);
});

// Эффект 2: смена аккорда / строя / числа ладов → сбросить выбор позиции
effect(() => {
  selectedChord();
  tuning.tuning();
  tuning.fretsCount();
  selectedPositionId.set(null);
});
```

`availablePositions` пересчитывается через `computed`, реагируя на:
- `selectedChord()`
- `tuning.tuning()` и `tuning.fretsCount()` (читаются внутри `computePositions`)
- `i18n.t()` (через `positionLabel` — для локализации лейблов)

## Типы данных

### `DiatonicChord`

```ts
{
  root: Note;                 // 0-11, тоника
  isMinor: boolean;           // true для Minor и Diminished — нужно для матча с минорным кольцом круга
  name: string;               // "C", "Dm", "Bdim", "F+"
  numeral: string;            // "I", "ii", "iii°", "V+"
  stepNumber: number;         // 0-6, номер ступени в гамме
  type: ScaleStepQuality;     // Major / Minor / Diminished / Augmented
  notes: ReadonlySet<Note>;   // 3 pitch-class'а триады
  color: NoteColorsStyle;     // фон ячейки + текстовый цвет
}
```

### `ChordPosition`

```ts
{
  id: string;                                          // "0:3|1:5|2:5|3:5|4:3|5:-"
  minFret: number;                                     // самый низкий зажатый лад (или 0)
  maxFret: number;                                     // самый высокий
  fretsByString: ReadonlyMap<number, number | null>;  // лад на каждой струне; null = глушить
  fingering: ReadonlyMap<number, number | null>;      // палец 1-4 на каждой струне; null = открытая/глушёная
  barres: readonly ChordPositionBarre[];              // все барэ (индекс + мини-барэ)
  label: string;                                       // "1–3", "5", "Откр." — для селекта
}
```

### `ChordPositionBarre`

```ts
{
  fret: number;          // на каком ладу барэ
  fromString: number;    // первая струна (включительно), индекс в массиве строя
  toString: number;      // последняя струна
}
```

## Как строятся аккорды (`buildChord`)

Сервис идёт по `selectedScaleState()` и для каждой ступени, у которой:
- `midiNote != null`
- `interval != null`
- `type ∈ {Major, Minor, Diminished, Augmented}` (не `None`/`Any`)

— строит `DiatonicChord`. Триада берётся из [`CHORD_INTERVALS`](../src/app/services/chords/chords.constants.ts):

```ts
Major:      [0, 4, 7]   // root, M3, P5
Minor:      [0, 3, 7]   // root, m3, P5
Diminished: [0, 3, 6]   // root, m3, b5
Augmented:  [0, 4, 8]   // root, M3, #5
```

Имя и нумерал декорируются хелперами [`decorateChordName`/`qualitySuffix`](../src/app/services/chords/chords.utils.ts) — суффиксы `dim`/`aug`, символы `°`/`+`. Те же утилиты переиспользует [`wid-cuart-circle`](../src/app/widgets/cuart-circle/wid-cuart-circle.component.ts).

Для пентатоник, блюзовой гаммы, хроматизма ступени с типом `None`/`Any` пропускаются — список аккордов получается короче или вовсе пустой.

## Как считаются позиции (`computePositions`)

Алгоритм — sliding window поверх ладов с энумерацией всех допустимых voicing'ов и выбором лучшего по скорингу. Подход универсален для любого строя и числа струн.

### 1. Сбор кандидатов в окне

Для каждого `windowStart ∈ [0, fretsCount]` берётся окно `[windowStart, windowStart + POSITION_WINDOW - 1]` (по умолчанию 4 лада). Для каждой струны собираются все лады в этом окне, на которых находится нота аккорда.

```ts
candidatesPerString[s] = [f for f in window if chord.notes.has(noteAt(s, f))]
```

### 2. Энумерация voicing'ов (`findBestVoicing`)

Перебираются **непрерывные диапазоны** струн `[low, high]` размером `≥ minStrings` (3 по умолчанию или меньше для коротких инструментов). Это автоматически запрещает «дырки» посередине: глушёные струны разрешены только по краям.

Для каждого диапазона строится Cartesian product кандидатов на струнах диапазона. Каждый получившийся voicing валидируется и оценивается. Берётся **один** voicing с максимальным скором на окно.

### 3. Валидация (`evaluateVoicing`)

Voicing отбрасывается если:
- Не содержит **тонику**
- Не содержит **терцию** (`intervals[1]`)
- Не содержит **квинту** (`intervals[2]`)
- `span = maxClosedFret - minClosedFret >= POSITION_WINDOW` (защита от перебора при граничных окнах)
- `computeFingering` вернул `null` (не хватает пальцев)

### 4. Скоринг

```ts
score = 0
score += bassNote === root  ? +100 :
         bassNote === fifth ? +30  : -10   // тоника в басу — сильный приоритет
score += usedStrings * 5                    // фуллер voicing лучше
score -= span * 3                           // компактнее лучше
score -= indexBarre ? 2 : 0                 // барэ слегка пенализуется
score += safeMinFret <= 3 ? 5 : 0           // нижние позиции легче
```

**Бас по высоте, не по индексу:** определяется через `tuning.midiAt(s, f)`, что корректно для реэнтрантных строев (укулеле GCEA, банджо).

### 5. Дедупликация и сортировка

Voicing'и из разных окон, давшие одну и ту же раскладку (`positionKey`), отбрасываются. Итоговый список сортируется по `(minFret, maxFret)` ascending — позиции в селекте идут снизу вверх по грифу.

## Назначение пальцев (`computeFingering`)

Вход: `fretsByString` + `indexBarre` (или `null`). Выход: `Map<stringIndex, finger | null>` или `null` если требуется > `MAX_FINGERS` пальцев.

1. **Открытые/глушёные** струны → `null` (палец не нужен).
2. **Индекс-барэ** (если есть) → струнам, играющим на ладу барэ, ставится палец `1`.
3. **Остальные закрытые струны** группируются по ладу. Лады сортируются по возрастанию.
4. Для каждой группы:
   - Если ≥2 струн **подряд** на одном ладу → **мини-барэ** одним пальцем (`finger = nextFinger`, `nextFinger++`).
   - Иначе каждая струна получает свой палец (по нарастающей).

Если нумерация дошла до пальца > 4 — voicing отбраковывается.

## Поиск барэ (`findAllBarres`)

Возвращает массив `ChordPositionBarre`. Различает два типа:

### Индекс-барэ (на минимальном закрытом ладу)

«Указательный лежит под всеми струнами в диапазоне». Условия:
- `fret === minClosedFret`
- `≥2` струн на этом ладу
- Расстояние от первой до последней такой струны `≥ BARRE_MIN_STRINGS` (3)
- Все струны в этом диапазоне играют (не `null`) и зажаты на ладу `≥ fret`

При выполнении создаётся одно барэ от самой низкой до самой высокой строки (включая струны, прижатые на более высоких ладах — индекс «лежит» под ними).

### Мини-барэ (на любом другом ладу)

Любой непрерывный набор `≥2` струн на одном и том же ладу. На одном ладу может быть несколько мини-барэ, если струны разделены пропусками.

### Используется

- В `evaluateVoicing` индекс-барэ передаётся в `computeFingering` для разметки пальцев и для скоринга
- В `wid-fretboard` все барэ рендерятся как SVG-прямоугольники поверх грифа
- В `wid-chord-diagram` все барэ рисуются как закруглённые палочки на маленькой схеме; точки на этих ладах не рисуются (накрыты барэ)

## Константы

Файл: [`chords.service.ts`](../src/app/services/chords/chords.service.ts) (вершина файла) и [`chords.constants.ts`](../src/app/services/chords/chords.constants.ts).

| Константа | Значение | Что значит |
| --- | --- | --- |
| `POSITION_WINDOW` | `4` | Размер окна ладов для одной позиции (растяжка руки) |
| `MIN_USED_STRINGS` | `3` | Минимум звучащих струн в voicing'е (клампается через `Math.min` к `stringsCount`) |
| `MAX_FINGERS` | `4` | Лимит пальцев — без учёта барэ-индекса (он считается одним «пальцем» за весь барэ) |
| `BARRE_MIN_STRINGS` | `3` | Минимальная ширина (от первой до последней струны) индекс-барэ |
| `CHORD_INTERVALS` | `Record<ScaleStepQuality, readonly number[]>` | Полутоны от тоники для каждого типа аккорда |

Параметры скоринга — литералы внутри `evaluateVoicing` (см. секцию «Скоринг»).

## Универсальность

Алгоритм работает с любым строем и любым числом струн без специальных шаблонов:

- `MIN_USED_STRINGS` клампается к `stringsCount` — для 4-струнного баса/3-струнного cigar-box не отвалится.
- Бас определяется по `midiAt`, а не по индексу — реэнтрантные строи (укулеле, банджо) корректно отрабатывают.
- Соседство струн считается **по индексу в массиве строя** — это «физическое» соседство, по которому ходит палец, независимо от высот.
- Имена форм типа CAGED не привязаны — лейбл всегда числовой (`«1–3»`, `«5»`, `«Откр.»`).
- Если в текущем строе/диапазоне ладов аккорд нельзя сыграть — `availablePositions()` вернёт пустой массив. Тогда селектор позиции в [wid-chords-row](../src/app/widgets/chords-row/wid-chords-row.component.html) скрывается, и работает только подсветка по pitch-class через `highlightedNotes`.

## Поведение «Все ноты»

Если `selectedPositionId === null`, метод `isChordFret(s, f)` подсвечивает любой `(s, f)` где нота аккорда (по pitch-class). Это поведение по умолчанию, до выбора конкретной позиции. Когда позиция выбрана, подсветка сужается до точных `(струна, лад)` пар из `position.fretsByString`.

`isStringMuted(s)` возвращает `true` только при выбранной позиции — в режиме «Все ноты» струны не помечаются глушёнными.

## Потребители

| Потребитель | Что использует |
| --- | --- |
| [`wid-chords-row`](../src/app/widgets/chords-row/wid-chords-row.component.ts) | `diatonicChords`, `selectedChord`, `availablePositions`, `selectedPositionId`, `toggle`, `isSelected` |
| [`wid-chord-diagram`](../src/app/widgets/chord-diagram/wid-chord-diagram.component.ts) | `ChordPosition` через input |
| [`wid-fretboard`](../src/app/widgets/fretboard/wid-fretboard.component.ts) | `selectedPosition()` для барэ-оверлея |
| [`wid-fretboard-string`](../src/app/widgets/fretboard/fretboard-string/wid-fretboard-string.component.ts) | `isChordFret(s, fret)` |
| [`wid-gamma`](../src/app/widgets/gamma/wid-gamma.component.ts) | `highlightedNotes()` для подсветки в формуле гаммы |
| [`cuart-circle-sector`](../src/app/widgets/cuart-circle/cuart-circle-sector/cuart-circle-sector.component.ts) | `selectedChord()` для обводки сектора |

## Известные ограничения

- Алгоритм требует **полный триад** (root + 3rd + 5th). Power-chord (root+5) не выводится — нужно ослабить требование явным флагом, если понадобится для бас-гитары.
- Один voicing на окно. Альтернативные постановки (root в басу vs 1st inversion vs 2nd inversion в одной зоне грифа) не рассматриваются.
- Назначение пальцев предпочитает мини-барэ (один палец на нескольких подряд струнах одного лада). Альтернативные раскладки с раздельными пальцами не генерируются.
- Имена и расположение CAGED-форм не выводятся — только числовые лейблы. Можно добавить опционально для стандартного гитарного строя.
- Диапазон ладов считается по `fretsCount` из `TuningService` — позиции выше этого порога не находятся, даже если физически на инструменте лады есть.
