# web — сайт для показа

Серый прототип для людей без доступа к claude.ai. Деплой — Vercel, проект `postie` (https://postie-jade.vercel.app). Корневой `vercel.json` отдаёт только папку `web/` — остальной репо (документы, мир) наружу не выходит. Каждый пуш в `main` обновляет сайт.

- Источник — `design/greybox/home.html` (артефакт «Pocket Puzzle Home»).
- После любой правки greybox: `python3 web/build.py`, закоммитить `web/index.html`.
- `noindex`: поисковики сайт не индексируют.
