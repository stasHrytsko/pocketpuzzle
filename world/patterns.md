# Как строили вики-миры: паттерны и правила

Разбор для Pocket Puzzle, 2 ноября 2026. Выводы — Claude; источники в конце.

| # | Паттерн | Где видно | Что берём |
|---|---|---|---|
| 1 | **Лор живёт в вещах, а не в рассказе.** Сюжет разложен по описаниям предметов, именам, расстановке, обрывкам фраз. | Dark Souls: история почти вся в описаниях предметов и в уровнях | Записка привязана к вещи, которую игрок и так держит: марка, штемпель, конверт, вид за окном |
| 2 | **Пропуски — это дизайн.** Игрок сам собирает куски и дописывает историю. | Dark Souls; Миядзаки сам говорил, что прямой рассказ ему даётся плохо | «Образ точный, событие несказанное» (`WORLD.md` §7) |
| 3 | **Сухой тон и негативное пространство.** Ужас и чудо — через то, что не сказано, а не через эпитеты. | SCP: клинический, сжатый тон; страшное — в пропуске | Голос почтальона: короткие фразы, без оценок. Часть записок — как опись или журнал |
| 4 | **Канон скрыт, но существует.** Автор знает ответ; копатели проверяют на противоречия. | Все сильные миры | `world/` с ID, правило «факт сначала в канон, потом в записку» |
| 5 | **Регулярная выдача.** Новый кусочек на каждом шаге держит сообщество. | Gravity Falls: шифр в титрах каждой серии, их писал сам автор | Шифр или знак — в каждом письме, а не раз в месяц |
| 6 | **Шифр простой, сообщество большое.** Atbash, Цезарь, Виженер — решаемо ребёнком с листком; сложность — в том, чтобы заметить. | Gravity Falls | Алфавит почтальона — простая подстановка (`ciphers.md`) |
| 7 | **Шифр выходит за пределы.** Позже — общая охота для всех игроков. | Gravity Falls → ARG Cipher Hunt (2016) | Большие шифры из кусков разных игроков — с соцслоем |
| 8 | **Лор — внутри игры, не на сайте.** Вынести лор наружу — ошибка: игроки злились, что читать надо вне игры. | Destiny: карточки Grimoire читались только на сайте Bungie; во второй части от них отказались ради лора в игре | Все записки читаются в приложении (вкладка Notes). Вики — у сообщества, не у нас |
| 9 | **Лор не обязателен.** Можно пройти всё и ничего не узнать. | Dark Souls, Fez, Tunic | Шифры и записки не стоят на пути (`ciphers.md` §1) |

## Правило тумана
Читатель после записки должен **уметь сказать, что он увидел** — и **не уметь сказать, что случилось**. Если он не может сказать, что увидел, — это туман, а не визг тормозов.

## Источники
- [GDC 2017, Calvin Walantus — narrative](https://media.gdcvault.com/gdc2017/GameNarrativeReview/Calvin_Walantus_UCSC_GDC_Narrative.pdf)
- [Narration of Things — First Person Scholar](https://www.firstpersonscholar.com/?p=2844)
- [Миядзаки о своём стиле рассказа](https://fandomwire.com/im-just-not-good-at-hidetaka-miyazaki-admitted-a-storytelling-flaw-that-stops-thousands-from-enjoying-elden-ring-dark-souls/)
- [Canonical SCP Foundation Writing](https://krisyotam.com/deep-research/scp-writing-guide/)
- [SCP Wiki — эссе о повествовании](https://scp-wiki.wikidot.com/you-already-know-what-the-fuck-is-going-on)
- [Looper — шифры Gravity Falls](https://looper.com/1325919/gravity-falls-how-solve-show-codes-cryptograms-caesar-cipher)
- [IMDb — Gravity Falls trivia](https://imdb.com/title/tt1865718/trivia)
- [Cipher Hunt — Wikipedia](https://en.wikipedia.org/wiki/Cipher_Hunt)
- [GameSpot — Destiny 2 без Grimoire](https://gamespot.com/articles/destiny-2-drops-grimoire-cards-to-showcase-the-sto/1100-6450228/)
- [Windows Central — плюсы и минусы отказа от Grimoire](https://windowscentral.com/no-grimoire-destiny-2-pros-and-cons)
