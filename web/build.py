#!/usr/bin/env python3
"""Собирает web/index.html из design/greybox/home.html — для показа людям через Vercel.

Артефакт claude.ai сам добавляет <!doctype>, <head> и viewport; для обычного сайта
их добавляем здесь. Запуск: python3 web/build.py (после любой правки greybox).
"""
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src = (root / "design/greybox/home.html").read_text(encoding="utf-8")
head = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#F7F2E9">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Pocket Puzzle">
<meta name="robots" content="noindex">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style>
"""
# <title>, <link>, <style> из исходника идут в <head>, остальное — в <body>
cut = src.index("</style>") + len("</style>")
out = head + src[:cut] + "\n</head>\n<body>\n" + src[cut:] + "\n</body>\n</html>\n"
(root / "web/index.html").write_text(out, encoding="utf-8")
print("web/index.html", len(out), "bytes")
