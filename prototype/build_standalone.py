#!/usr/bin/env python3
"""Собирает prototype/index.html — самостоятельную страницу прототипа.

Берёт исходники холста claude.ai (Main.dc.html, Envelope.dc.html, Stamp.dc.html)
и встраивает их вместе с маленьким рантаймом, который понимает формат .dc.html:
{{дыры}}, <sc-if>, <sc-for>, <dc-import>, onClick/onPointer* и class Component extends DCLogic.

Запуск: python3 prototype/build_standalone.py
"""
import html
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
COMPONENTS = ["Main", "Envelope", "Stamp"]
ENTRY = "Main"


def parse_dc(name):
    src = (HERE / f"{name}.dc.html").read_text(encoding="utf-8")
    body = src[src.index("<x-dc>") + len("<x-dc>"): src.index("</x-dc>")]
    helmet = ""
    m = re.search(r"<helmet>(.*?)</helmet>", body, re.S)
    if m:
        helmet = m.group(1)
        body = body[: m.start()] + body[m.end():]
    sm = re.search(r"<script type=\"text/x-dc\" data-dc-script data-props='(.*?)'>(.*?)</script>", src, re.S)
    if not sm:
        raise SystemExit(f"{name}: не найден блок data-dc-script")
    props_raw = html.unescape(sm.group(1))
    props = json.loads(props_raw)
    defaults = {k: v["default"] for k, v in props.items() if isinstance(v, dict) and "default" in v}
    code = sm.group(2)
    if "</script" in code.lower():
        raise SystemExit(f"{name}: в коде встретилось </script")
    return body.strip(), helmet, defaults, code


def main():
    head_bits, seen = [], set()
    templates, codes, defaults = [], [], {}
    for name in COMPONENTS:
        body, helmet, dflt, code = parse_dc(name)
        defaults[name] = dflt
        for tag in re.findall(r"<link[^>]*>", helmet):
            if tag not in seen:
                seen.add(tag)
                head_bits.append(tag)
        for style in re.findall(r"<style>(.*?)</style>", helmet, re.S):
            key = style.strip()
            if key and key not in seen:
                seen.add(key)
                head_bits.append(f"<style>{style}</style>")
        templates.append(f'<template id="tpl-{name}">\n{body}\n</template>')
        codes.append(f'<script type="text/plain" id="code-{name}">\n{code}\n</script>')

    runtime = (HERE / "standalone_runtime.js").read_text(encoding="utf-8")
    out = f"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Pocket Puzzle — прототип</title>
{chr(10).join(head_bits)}
<style>
html, body {{ margin: 0; height: 100%; background: #DED0BD; }}
#stage {{ position: fixed; inset: 0; display: flex; align-items: flex-start; justify-content: center; overflow: hidden; }}
#app {{ transform-origin: top center; }}
#app > div {{ border-radius: 28px; box-shadow: 0 12px 28px rgba(76,57,36,0.16); }}
@media (max-width: 500px) {{ html, body {{ background: #F7F2E9; }} #app > div {{ border-radius: 0; box-shadow: none; }} }}
</style>
</head>
<body>
<div id="stage"><div id="app"></div></div>
<!-- Собрано из prototype/*.dc.html скриптом build_standalone.py. Не править руками. -->
{chr(10).join(templates)}
{chr(10).join(codes)}
<script>
window.__DC_COMPONENTS = {json.dumps(COMPONENTS)};
window.__DC_ENTRY = {json.dumps(ENTRY)};
window.__DC_DEFAULTS = {json.dumps(defaults, ensure_ascii=False)};
</script>
<script>
{runtime}
</script>
</body>
</html>
"""
    (HERE / "index.html").write_text(out, encoding="utf-8")
    print(f"prototype/index.html: {len(out)} байт")


if __name__ == "__main__":
    main()
