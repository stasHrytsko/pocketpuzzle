#!/usr/bin/env python3
"""Собирает самостоятельную страницу index.html из исходника артефакта room.html.

room.html — исходник артефакта «Pocket Puzzle Room» на claude.ai: без <!doctype>, <html>, <head>, <body>
(их добавляет сам артефакт при публикации). index.html — то же самое в полной обёртке,
открывается в любом браузере: скачать файл или открыть через GitHub Pages.

Запуск: python3 design/ui-kit/main-page/prototype/build_standalone.py
"""
from pathlib import Path

here = Path(__file__).resolve().parent
src = (here / "room.html").read_text(encoding="utf-8")

head_end = src.index("</style>") + len("</style>")
head, body = src[:head_end], src[head_end:]

page = (
    "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n"
    "<!-- Собрано из room.html скриптом build_standalone.py. Не править руками. -->\n"
    "<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}"
    "body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n"
    + head + "\n</head>\n<body>\n" + body.strip() + "\n</body>\n</html>\n"
)
(here / "index.html").write_text(page, encoding="utf-8")
print(f"index.html: {len(page.encode('utf-8'))} байт")
