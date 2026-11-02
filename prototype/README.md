# Кликабельный прототип Pocket Puzzle

## Как смотреть

- **`index.html`** — самостоятельная страница. Открывается в любом браузере, без claude.ai:
  - скачать файл и открыть двойным кликом;
  - или через GitHub Pages (Settings → Pages → Branch: `main`, папка `/ (root)`) — тогда ссылка вида `https://<аккаунт>.github.io/pocketpuzzle/prototype/`.
- **Холст на claude.ai:** https://claude.ai/artifact/E7n5buGvbbQbmWLGxdGHr2 (приватный; доступ через меню Share).

## Файлы

| Файл | Что это |
|---|---|
| `Main.dc.html` | Исходник: весь прототип — экраны, состояния, логика переходов |
| `Envelope.dc.html` | Исходник: конверт (слоты марок, штемпель) |
| `Stamp.dc.html` | Исходник: марка |
| `canvas.json` | Раскладка холста claude.ai |
| `standalone_runtime.js` | Мини-рантайм формата `.dc.html` для самостоятельной страницы |
| `build_standalone.py` | Сборщик `index.html` из исходников |
| `index.html` | Результат сборки — **не править руками** |

## Как обновлять

1. Правка делается в исходниках (`*.dc.html`) и публикуется в артефакт на claude.ai.
2. Исходники копируются сюда.
3. `python3 prototype/build_standalone.py` — пересобирает `index.html`.

Поля игр — заглушки, тексты глав — плейсхолдеры. Карта экранов — `design/SCREENS.md`, значения — `design/pocket-puzzle-tokens.json`.
