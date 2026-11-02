# Промпты для ИИ-генератора — Pocket Puzzle

Решение автора (2026-11-02): кит рисует ИИ-генератор картинок. Полный бриф — `UI-KIT-BRIEF.md`, короткое задание для человека — `DESIGNER-TASK.md`. Этот файл — то же самое, но в виде промптов для генератора.

## Как пользоваться

1. **Один промпт — одна картинка.** Не просить «весь кит сразу»: генератор начнёт выдумывать.
2. **Каждый раз прикладывать референсы:** `refs/kit-variant-2-system.jpg` (система, материалы) и `main-page/refs/room-mood-v1.png` (цвет). Для игр — ещё `refs/current-<game>.png` (механика).
3. **Перед каждым промптом вставлять блок STYLE** (ниже). Он держит единый стиль между картинками.
4. **Что генератор делает хорошо:** настроение, материалы, предметы, плитки, комнату, значки.
   **Что делает плохо:** точные hex, ровный текст, одинаковые размеры, все состояния компонента. Текст на картинках почти всегда будет кривой, это нормально: тексты и вёрстку мы соберём потом сами по токенам. Берём из генератора **вид**, а не цифры.
5. **Сначала только промпты 1 и 2** (лист стиля и плитки). Показать автору, выбрать, и только потом остальное. Самую удачную картинку дальше прикладывать как референс ко всем следующим.
6. **Отдельные предметы для Unity** (плитка, кубик, конверт, марка) — промпт 10, по одному предмету на картинку, на прозрачном или ровном фоне.

---

## STYLE — вставлять перед каждым промптом

```text
Style: calm, warm, tactile mobile game UI. Soft matte ceramic and clay objects,
warm paper, light wood. Rounded shapes, no sharp corners. Single soft light from
the top-left, warm brown contact shadows, no gloss, no glow, no neon, no glass
reflections, no gradients beyond soft shading. Lots of air. Light theme only.

Palette (approximate, keep the mood):
paper background #F7F2E9, card #F1E7D8, game board #E8DCCB, inset cell #DED0BD,
text #33312E, secondary text #6E6459, primary button deep olive-sage #526348
with cream text #FFF9EF.
Accents (muted): sage #A7B39B, dusty blue #A5BBC8, clay #C78D73, sun #E7BE70,
plum #A998AD.
Room scene is warmer: peach-cream walls #E6CEB4, olive-sage mailbox #AAA379,
orange sun #F6C379.

Typography look: elegant serif for a few headings, clean neutral sans-serif for
everything else. English text only.

Never include: bottom tab bar, streaks, fire icons, "day streak", locks or
padlocks, leaderboards, coins, shop, ads, red notification badges, colored
Easy/Medium/Hard tags, search bars, dark mode, the words "Puzzarium" or
"Tight Shelf".
```

---

## 1. Лист стиля (этап 1)

```text
A single design style sheet for a calm daily-puzzle mobile app called
"Pocket Puzzle", on a warm paper background, neatly arranged in labeled blocks:

1. Color palette: 6 neutral swatches (paper, card, board, cell, text, primary
   olive-sage) and 5 muted accent swatches (sage, dusty blue, clay, sun, plum).
2. Typography: one serif heading sample "Today's letter", one sans-serif body
   sample.
3. Materials: 4 tiles showing warm paper, matte ceramic, light wood, pressed
   cardboard.
4. One game tile (square, rounded, matte ceramic) in 4 states side by side:
   idle, pressed, lifted with larger shadow, placed.
5. Buttons: a primary pill button "Continue letter" in deep olive-sage with
   cream text, a secondary cream button "Back".
6. A task card: small game icon, "Level 4 · Arrow Flip", a small round check.
7. A cream paper envelope with a flap on top and one postage stamp with
   perforated edges; inside the stamp a small arrow icon and "1:24".
8. A small crop of a cozy room: a big rounded olive-sage mailbox on a low cream
   pedestal in front of an arched window with soft hills.
9. One phone screen of a 4x4 grid puzzle: inset cells, a few rounded ceramic
   tiles with white arrows.

Clean grid layout, generous spacing, soft daylight. Style reference: attached.
```

---

## 2. Игровые плитки и палитра плиток

```text
A game-element sheet for three grid puzzle games that share one visual system,
warm paper background, labeled sections:

1. One inset board cell (pressed into the board) in states: empty, hint
   (dashed outline), preview (faint silhouette), blocked.
2. One square rounded matte ceramic tile, blank, in states: idle, pressed,
   lifted (floating, bigger soft shadow), placed.
3. A wall / obstacle cell, readable by shape and texture, not only by color.
4. Tile palette option A: four tiles in muted mid-tone colors —
   dusty blue #5F87A8, terracotta #B9694D, mustard #B8862E, sage #6E8A5E —
   each with a bold white symbol (arrow, number, circle, triangle).
5. Tile palette option B: four tiles in a slightly lighter, softer set, with
   dark #33312E symbols instead of white.
6. A small board fragment 3x3 mixing empty cells, a wall and two tiles.

All tiles identical in shape, light from top-left, warm contact shadows.
The four colors must be clearly distinct from each other and from the cells,
but calm, not saturated.
```

---

## 3. Arrow Flip — игровой экран

```text
Mobile game screen, portrait 390x844, for "Arrow Flip".
Top bar: back-to-levels icon on the left, "Level 4" centered, "?" and restart
icons on the right, small and quiet.
Center: a 4x4 board of inset cells on a warm board base; 6 square ceramic tiles,
each with a bold arrow. Tile color matches arrow direction (4 muted colors:
left dusty blue, up terracotta, down mustard, right sage).
One tile is mid-slide to the right edge; two tiles it brushed past are just
rotating 90° clockwise, marked with a subtle ring, not only by color.
Bottom: one short hint line "Tap a block — it slides where its arrow points."
Lots of empty paper around the board. No moves counter.
```

---

## 4. Perfect Fit — игровой экран

```text
Mobile game screen, portrait 390x844, for "Perfect Fit".
Top bar: back icon, "Level 10", "?" and restart icons.
Upper area: an irregular board shape inside an 8x8 frame, inset cells, one dark
obstacle cell, one cell with a small number "5", two cells with matching dots,
a thin seam line between two cells. Two placed pieces made of square ceramic
cubes, each piece with a shared soft underlay and outline in its color.
Bottom tray in thumb zone: left — a small 4x4 builder grid where a 6-cube piece
is being drawn; right — number chips 6, 5, 4 (one selected, one used and pale),
and a "Clear" button. A finished piece is being dragged up toward the board,
with a faint projection on the board where it will land.
Cubes use the same tile style as the other games.
```

---

## 5. The Gap — игровой экран

```text
Mobile game screen, portrait 390x844, for "The Gap".
Top bar: back icon, "Level 4", "?" and restart icons.
Below: small goal counters, one per color, each with its symbol (circle,
triangle, diamond).
Center: a 4x3 board with a dark frame that has 4 gaps (exits), each gap with a
small round number badge 1–4. Two solid wall cells. Square ceramic tiles in 3
muted colors, each with a white symbol: circle, triangle, diamond.
Bottom: a row of 4 flasks (narrow rounded containers in matte ceramic), each
with 3 slots stacked bottom-up and a number badge 1–4 below; one flask selected,
one holding two mixed tiles.
Same tile style as the other games. Calm, airy.
```

---

## 6. Почтовые предметы

```text
A sheet of postal objects for a calm mobile puzzle app, warm paper background,
soft top-left light, labeled:

1. A cream paper envelope, single front side with the flap on top, in three
   states: closed, open with a letter sheet peeking out, sent (with a round ink
   postmark partly over the left stamp).
2. The envelope with three empty stamp places, then with three stamps placed.
3. Postage stamps 48x56 with perforated edges, each with a small game icon
   (arrow / block shape / flask) and a time like "1:24"; states: in tray,
   selected (lifted), placed.
4. A stamp tray strip under the envelope.
5. A letter sheet: serif title "Your letter · Nov 2", three task rows with
   small game icons and checks.
6. The postman's note: a smaller sheet of a different, older-looking paper,
   sealed with a muted wax seal; and the same note opened, seal broken.
7. A round ink postmark with a date.
Objects only, no characters, no hands.
```

---

## 7. Компоненты интерфейса

```text
A UI components sheet for a calm daily-puzzle mobile app, warm paper background,
neatly labeled, English labels:

- Buttons: primary olive-sage pill, secondary cream, quiet text, round icon
  button; each in default, pressed, disabled.
- A wide bottom main button with two lines: "Continue letter" and
  "Task 2 of 3", with a small play icon.
- Section labels row: "Letters · Today · Games" with a small dot under the
  active one.
- A popup card floating over a blurred room background, with a two-tab
  segmented control "Calendar / Notes".
- A month calendar where some days are softly filled (a letter arrived), today
  outlined, other days neutral (no red, no crosses).
- Game cards in a 2-column grid: arrived (icon, name, "12 of 25"), not arrived
  (paler, small envelope icon, "Arrives by mail", no padlock).
- A level grid 3 per row: solved (check), current (play), future (pale).
- Toggle switches, a settings row, a small toast "Progress restored",
  tags "New", "Solved", "Sent".
- Counter card: "Letters sent: 12" with a small envelope.
```

---

## 8. Ключевые экраны

Генерировать по одному экрану за раз, приложив лучшие картинки из 1–7.

```text
Mobile screen 390x844. [ВСТАВИТЬ ОДИН ВАРИАНТ:]

a) Letter screen: serif title "Your letter", date "Nov 2", a short intro
   paragraph, three task cards (Arrow Flip, Perfect Fit, The Gap) with levels,
   a sealed postman's note at the bottom with "Opens when all tasks are solved".

b) Solved: a postage stamp appears with the Arrow Flip icon and "1:24",
   text "Level 4 solved", primary button "Next task", quiet "Back to letter".

c) Decorate envelope: the envelope in the center with three stamp places,
   stamp tray below, primary button "Send".

d) Sent: the envelope with a fresh postmark, "Next letter arrives tomorrow",
   buttons "Read the postman's note" and "Done".

e) Game page: game icon and name, "12 of 25" with a thin progress bar,
   level grid 3 per row, primary button "Play · level 13".
```

---

## 9. Значки игр и иконка приложения

```text
Three app-style game icons in the same matte ceramic style, square with rounded
corners, readable at small size, no text:
1) "Arrow Flip" — a ceramic tile with a bold arrow, dusty blue accent;
2) "Perfect Fit" — an L-shaped piece made of small cubes, clay accent;
3) "The Gap" — a small ceramic flask with a square dropping into it, plum accent.
Plus 3 app icon options, no text: an olive-sage rounded mailbox; a cream
envelope with a stamp; a single postage stamp with a tiny arrow.
Each on its own tile, warm paper background.
```

---

## 10. Отдельные предметы для Unity

По одному предмету на картинку. Если генератор умеет прозрачный фон — включить; если нет — ровный светлый фон, вырежем сами.

```text
A single [ПРЕДМЕТ] centered, front view, slightly from above, soft light from
the top-left, matte ceramic / paper material as in the reference, transparent
background, no shadow on the ground (shadow will be separate), no text,
high resolution 1024x1024.
```

Список предметов: blank square game tile (4 цвета палитры) · single cube for Perfect Fit (4 цвета) · inset board cell · wall cell · The Gap flask (empty) · envelope closed · envelope open · envelope flap alone · blank postage stamp with perforated edges · wax seal intact · wax seal broken · letter sheet · postman's note sheet · olive-sage mailbox with flag up · same with flag down.

Тени — отдельный промпт на тот же предмет: «only the soft contact shadow of a square tile, no object, transparent background».

---

## 11. Комната целиком — только настроение

Для сборки не годится (пропорции — см. §12). Подробное ТЗ — `main-page/ROOM-ART-BRIEF.md`.

```text
Wide panoramic illustration of a calm warm room, 1310x844, front view.
Peach-cream walls #E6CEB4, three arches.
Left arch: a wall calendar with a few softly filled days, below it a small
cream nightstand with a short stack of folded notes.
Center: a large arched window with soft hills and a sun; in front of it a big
rounded olive-sage mailbox #AAA379 with a slot and a small flag, standing on a
low cream pedestal.
Right arch: three light wooden shelves with a few matte ceramic game boxes
standing like books, a small lamp, a desk below.
Soft sunlight patches on the floor. No text, no labels, no characters,
nothing hanging or swinging. Matte clay-like rendering, top-left light.
```

Ночной вариант — тот же промпт плюс: «night: dark blue sky with a moon in the window, warm lamp light inside, same room unchanged».

---

## 12. Комната по частям — для сборки (главное)

Цельную панораму генератор в нужные пропорции не попадает: на `main-page/refs/room-panorama-v0.png` она 2,5:1 вместо 1,55:1, и в телефоне арки шире экрана, а низ уходит под кнопку. Поэтому комнату генерируем **по частям**, а я собираю её кодом по раскладке из `main-page/ROOM-ART-BRIEF.md` §2.3. Настроение и цвет — как на `room-panorama-v0.png` и `room-mood-v1.png`.

**Что делаю сам, рисовать не нужно:** контактные тени, свечение лампы, флажок в поднятом положении (поворачиваю), числа и закраска в календаре, значки игр на коробках, цвет коробок, маленький конверт «придёт по почте», точка «новое», переплёт окна в нужном месте.

### Блок ROOM — вставлять перед каждым промптом части

```text
Part of a calm, warm, minimal room illustration for a mobile game.
One single object, front orthographic view, straight on, eye level,
no perspective distortion. Soft matte clay / paper / light wood materials,
rounded edges, single soft light from the top-left, subtle shading only.
NO cast shadow on the ground, NO floor, NO wall behind the object.
Isolated on a flat pure white background (#FFFFFF), object centered,
small even margin around it. No text, no letters, no numbers, no logos.
Palette: cream #F1E7D8, highlight #FFF9EF, warm beige #E8DCCB,
soft seams #C6B7A5, sage mailbox #A7B39B with shade #526348 and light #E2E8D9,
sky #E2EAF0, sun #E7BE70. Same style as the attached room reference.
```

### Размеры

pt — размер в комнате (панорама 1310 × 844 pt). px — размер, в котором нужна картинка (@3x). Если генератор не умеет точный размер — главное **соотношение сторон**, масштаб подгоню я. **[предложение]** — размера в ТЗ комнаты не было, предлагаю я.

| # | Часть | pt | px @3x | Соотношение | Варианты |
|---|---|---|---|---|---|
| 1 | Фон: стена и пол, без арок и окна | 1310 × 844 | 3930 × 2532 | 1,55 : 1 | — |
| 2 | Ниша-арка (одна на обе зоны) | 300 × 480 | 900 × 1440 | 5 : 8 | — |
| 3 | Рама окна с подоконником, проём пустой | 340 × 400 (проём 300 × 370) | 1020 × 1200 | 17 : 20 | — |
| 4a | Вид за окном: небо и солнце / луна | 520 × 400 | 1560 × 1200 | 13 : 10 | день, ночь |
| 4b | Дальние холмы | 470 × 400 | 1410 × 1200 | 47 : 40 | день, ночь |
| 4c | Ближние холмы | 410 × 400 | 1230 × 1200 | 41 : 40 | день, ночь |
| 5 | Почтомат без флажка, щель пустая | 220 × 230 | 660 × 690 | ≈ 1 : 1 | — |
| 6 | Флажок почтомата | 24 × 70 **[предложение]** | 72 × 210 | 1 : 3 | — |
| 7 | Пьедестал | 250 × 26 | 750 × 78 | ≈ 10 : 1 | — |
| 8 | Конверт с сургучом (торчит из щели) | 120 × 80 **[предложение]** | 360 × 240 | 3 : 2 | — |
| 9 | Раскрытый конверт с листом (у пьедестала) | 90 × 70 | 270 × 210 | 9 : 7 | — |
| 10 | Лист календаря без чисел, со шнурком и гвоздём | 210 × 285 (лист 210 × 256) | 630 × 855 | ≈ 3 : 4 | — |
| 11 | Тумбочка | 226 × 116 | 678 × 348 | ≈ 2 : 1 | — |
| 12 | Сложенная записка | 80 × 50 **[предложение]** | 240 × 150 | 8 : 5 | 2 цвета бумаги |
| 13 | Полки (доска) | 210 × 12, 190 × 12, 180 × 12 | 630 × 36 и т. д. | ≈ 16 : 1 | 3 длины |
| 14 | Коробка игры, **белая** | 30 × 64 · 46 × 46 · 54 × 36 | 90 × 192 · 138 × 138 · 162 × 108 | 15 : 32 · 1 : 1 · 3 : 2 | 3 формы |
| 15 | Горшок с растением (верхняя полка) | 40 × 56 **[предложение]** | 120 × 168 | 5 : 7 | — |
| 16 | Стол | 380 × 120 **[предложение]** | 1140 × 360 | ≈ 3 : 1 | — |
| 17 | Лампа | 70 × 130 **[предложение]** | 210 × 390 | 7 : 13 | — |
| 18 | Ваза с веткой (между зонами) | 60 × 120 **[предложение]** | 180 × 360 | 1 : 2 | — |

Очень вытянутые части (7 и 13) генератор рисует плохо — проси их на холсте шире (например, 4 : 1) с объектом посередине, я обрежу.

### Промпты частей (после блока ROOM)

```text
1  Plain room background: a smooth warm cream wall (#F1E7D8) taking the upper
   71% and a light floor (#E8DCCB fading to #F1E7D8 toward the bottom) below,
   a soft horizontal floor line at 71% height. Gentle diagonal sunlight patch
   from the top-left on the wall and floor. No arches, no window, no objects.
   Wide 1.55:1. (For this one: ignore "no wall / no floor" from ROOM.)

2  A tall arched wall niche, recessed into the wall: rounded semicircle top,
   straight sides, a shallow ledge at the bottom. Inside slightly deeper warm
   beige #E8DCCB, rim lighter #FFF9EF. Neutral cream, NOT yellow, NOT green.
   Empty. Ratio 5:8.

3  An arched window frame in light rounded wood/plaster with a deep sill.
   The opening inside the frame is filled with flat pure magenta #FF00FF
   (it will be cut out). Semicircle top. Ratio 17:20.

4a Sky seen through a window, no frame: pale sky #E2EAF0, a soft round sun
   #E7BE70 upper right, a few faint clouds. Ratio 13:10.
   NIGHT: deep blue sky #3D647D, a pale moon #F3E6CA, a few small stars.

4b Distant soft rolling hills, very light sage #E2E8D9, air perspective,
   on flat pure magenta #FF00FF above the hills. Ratio 47:40.
   NIGHT: the same hills in #526348.

4c Near rolling hills, sage #A7B39B, a bit darker at the bottom, on flat
   pure magenta #FF00FF above the hills. Ratio 41:40.
   NIGHT: the same hills in #43523B.

5  A big rounded sage mailbox (#A7B39B): rectangular body with rounded top
   corners, a horizontal mail slot near the top (empty), an embossed
   postage-stamp emblem with a tiny mountain, one cabinet door with a small
   round knob, two short legs. No flag. Ratio about 1:1.

6  A small mailbox flag: a short sage-dark (#526348) post with a rounded
   rectangular flag, pivot at the bottom, shown pointing straight up.
   Ratio 1:3.

7  A low, wide, soft cream pedestal / plinth with rounded edges, very flat,
   for a mailbox to stand on. Wide 4:1 canvas, object in the middle.

8  A sealed cream envelope with a clay-red wax seal (#C78D73), tilted about
   6 degrees, seen from the front. Ratio 3:2.

9  An opened cream envelope with a letter sheet sticking out, standing
   leaning slightly. Ratio 9:7.

10 A blank wall calendar sheet: cream paper #FFF9EF with a header strip
   #DED0BD and two small rings at the top, hanging on a short string from a
   small nail. NO numbers, NO month name, NO grid. Ratio about 3:4.

11 A small light-wood nightstand with two doors, small round handles and
   short legs, rounded edges. Empty top. Ratio about 2:1.

12 A small folded paper note, slightly thick, cream #FFF9EF, lying flat,
   seen from the front-top. Second version in pale yellow #F3E6CA.
   Ratio 8:5.

13 A simple floating wall shelf: one light-wood board with rounded ends,
   seen straight on. Wide 4:1 canvas, board in the middle.

14 A game box standing like a book, pure WHITE body (it will be tinted),
   matte, rounded edges, with a small lighter rounded label area on the
   front, empty. Three versions: tall (15:32), square (1:1), wide (3:2).

15 A small ceramic pot with a few soft sage leaves. Ratio 5:7.
16 A simple light-wood desk with rounded edges, thin legs. Ratio 3:1.
17 A small desk lamp, cream rounded shade, light-wood stand, lamp OFF
   (glow is added separately). Ratio 7:13.
18 A cream ceramic vase with one thin sage branch. Ratio 1:2.
```

### Что важно для всех частей
- Один ракурс (строго спереди) и один свет (сверху слева) на всех картинках — иначе собранная комната развалится.
- Генерировать по одной части, к каждой прикладывать `room-panorama-v0.png` как референс стиля.
- Магента `#FF00FF` — только там, где нужна дырка или прозрачность; я её вырежу.

---

## Что потом делаем мы

Из одобренных картинок снимаем цвета и проверяем контраст, обновляем токены, собираем кит (компоненты, состояния, размеры, тексты) по токенам, а предметы и плитки с картинок вырезаем в PNG для Unity. Стартовые цвета плиток в промпте 2 (вариант A) уже проверены: белый символ на каждом — от 3,2:1 до 4,1:1.
