# web — сайт для показа

Серый прототип для людей без доступа к claude.ai. Деплой — Vercel, папка `web/` как корень проекта; каждый пуш в `main` обновляет сайт.

- Источник — `design/greybox/home.html` (артефакт «Pocket Puzzle Home»).
- После любой правки greybox: `python3 web/build.py`, закоммитить `web/index.html`.
- `noindex`: поисковики сайт не индексируют.
