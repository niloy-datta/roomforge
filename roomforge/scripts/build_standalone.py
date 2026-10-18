"""Create dependency-free, self-contained HTML for direct static deployment.

Run: python3 scripts/build_standalone.py
Output: dist/index.html, dist/studio.html, dist/guides/flooring-calculator.html
Source files stay authoritative; never edit dist by hand.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / 'assets/styles.css').read_text(encoding='utf-8')
PAGES = {
    'index.html': ['src/core/calculations.js', 'src/pages/home.js'],
    'studio.html': [
        'src/core/calculations.js',
        'src/core/materials.js',
        'src/core/state.js',
        'src/ui/floor-plan.js',
        'src/pages/studio.js',
    ],
    'guides/flooring-calculator.html': [],
}

for page, modules in PAGES.items():
    html = (ROOT / page).read_text(encoding='utf-8')
    html = re.sub(
        r'<link\s+rel="stylesheet"\s+href="[^"]+"\s*/>',
        lambda _m: '<style>\n' + CSS + '\n</style>',
        html,
    )
    scripts = []
    for module in modules:
        code = (ROOT / module).read_text(encoding='utf-8')
        code = re.sub(r'^import\s+.*?;\s*$', '', code, flags=re.M)
        code = re.sub(r'\bexport\s+(?=(const|let|function|class)\b)', '', code)
        scripts.append(code)
    html = re.sub(r'<script type="module" src="[^"]+"></script>', '', html)
    if scripts:
        script = '<script type="module">\n' + '\n'.join(scripts) + '\n</script>'
        html = html.replace('</body>', script + '\n</body>')
    out = ROOT / 'dist' / page
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding='utf-8')
    print(f'{page} -> {out.relative_to(ROOT)} ({out.stat().st_size:,} bytes)')
