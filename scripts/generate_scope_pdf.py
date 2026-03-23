#!/usr/bin/env python3
"""Generate scope-details.pdf from scope-details.md (Unicode-safe)."""
import re
from pathlib import Path

import markdown
from fpdf import FPDF

ROOT = Path(__file__).resolve().parents[1]
MD_PATH = ROOT / "scope-details.md"
OUT_PATH = ROOT / "scope-details.pdf"
DejaVu = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
DejaVuBold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
DejaVuItalic = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf"
DejaVuBoldItalic = "/usr/share/fonts/truetype/dejavu/DejaVuSans-BoldOblique.ttf"


def main() -> None:
    text = MD_PATH.read_text(encoding="utf-8")
    # fpdf write_html + core paths: normalize fancy punctuation for robustness
    for a, b in (
        ("\u2014", " - "),  # em dash
        ("\u2013", " - "),  # en dash
        ("\u2019", "'"),
        ("\u201c", '"'),
        ("\u201d", '"'),
    ):
        text = text.replace(a, b)

    html = markdown.markdown(
        text,
        extensions=["tables", "fenced_code", "nl2br"],
    )
    # fpdf2 HTML: <td> cannot contain <strong>; flatten emphasis in tables
    html = re.sub(r"<strong>([^<]*)</strong>", r"\1", html)

    pdf = FPDF(format="A4", unit="mm")
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()
    pdf.add_font("DejaVu", "", DejaVu)
    pdf.add_font("DejaVu", "B", DejaVuBold)
    pdf.add_font("DejaVu", "I", DejaVuItalic)
    pdf.add_font("DejaVu", "BI", DejaVuBoldItalic)
    pdf.set_font("DejaVu", "", 10)
    pdf.write_html(html, font_family="DejaVu")

    pdf.output(str(OUT_PATH))
    print(f"Wrote {OUT_PATH} ({OUT_PATH.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
