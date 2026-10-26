"""Convert a locally supplied PDF book into a page-linked Markdown working copy."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
from pathlib import Path

from PIL import Image


PDF_TO_PRINTED_OFFSET = 31
CHAPTERS = [
    (1, "Introduction", "Yinghua Min and Charles Stroud", 1),
    (2, "Design for Testability", "Laung-Terng Wang, Xiaoqing Wen, and Khader S. Abdel-Hafez", 37),
    (3, "Logic and Fault Simulation", "Jiun-Lang Huang, James C.-M. Li, and Duncan M. Walker", 105),
    (4, "Test Generation", "Michael S. Hsiao", 161),
    (5, "Logic Built-In Self-Test", "Laung-Terng Wang", 263),
    (6, "Test Compression", "Xiaowei Li, Kuen-Jong Lee, and Nur A. Touba", 341),
    (7, "Logic Diagnosis", "Shi-Yu Huang", 397),
    (8, "Memory Testing and Built-In Self-Test", "Cheng-Wen Wu", 461),
    (9, "Memory Diagnosis and Built-In Self-Repair", "Cheng-Wen Wu", 517),
    (10, "Boundary Scan and Core-Based Testing", "Kuen-Jong Lee", 557),
    (11, "Analog and Mixed-Signal Testing", "Chauchin Su", 619),
    (12, "Test Technology Trends in the Nanometer Age", "Kwang-Ting Cheng, Wen-Ben Jone, and Laung-Terng Wang", 679),
]


def write_text_lf(path: Path, text: str) -> None:
    path.write_bytes(text.encode("utf-8"))


def markdown_fence(text: str) -> str:
    longest = max((len(match.group(0)) for match in re.finditer(r"`+", text)), default=0)
    fence = "`" * max(3, longest + 1)
    return f"{fence}text\n{text}\n{fence}"


def scrub_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = "".join(char for char in text if char in "\n\t" or ord(char) >= 32)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{4,}", "\n\n\n", text)
    return text.strip()


def run_checked(command: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        check=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
    )


def read_pdf_info(pdf: Path, pdfinfo: str) -> tuple[int, str]:
    result = run_checked([pdfinfo, str(pdf)])
    pages_match = re.search(r"^Pages:\s+(\d+)$", result.stdout, re.MULTILINE)
    size_match = re.search(r"^Page size:\s+(.+)$", result.stdout, re.MULTILINE)
    if not pages_match:
        raise RuntimeError("Could not read the PDF page count.")
    return int(pages_match.group(1)), (size_match.group(1).strip() if size_match else "unknown")


def extract_pages(pdf: Path, pdftotext: str, expected_pages: int) -> list[str]:
    result = run_checked([pdftotext, "-layout", "-enc", "UTF-8", str(pdf), "-"])
    pages = result.stdout.split("\f")
    if pages and not scrub_text(pages[-1]):
        pages.pop()
    if len(pages) != expected_pages:
        raise RuntimeError(f"Expected {expected_pages} text pages, extracted {len(pages)}.")
    return pages


def book_sections(total_pages: int) -> list[dict]:
    starts = [chapter[3] + PDF_TO_PRINTED_OFFSET for chapter in CHAPTERS]
    sections = [
        {
            "key": "00-front-matter",
            "number": 0,
            "title": "Front Matter and Table of Contents",
            "author": "",
            "printed_start": None,
            "printed_end": None,
            "pdf_start": 1,
            "pdf_end": starts[0] - 1,
        }
    ]
    for index, (number, title, author, printed_start) in enumerate(CHAPTERS):
        pdf_start = starts[index]
        pdf_end = starts[index + 1] - 1 if index + 1 < len(starts) else 782 - 1
        sections.append(
            {
                "key": f"ch{number:02d}",
                "number": number,
                "title": title,
                "author": author,
                "printed_start": printed_start,
                "printed_end": pdf_end - PDF_TO_PRINTED_OFFSET,
                "pdf_start": pdf_start,
                "pdf_end": pdf_end,
            }
        )
    sections.append(
        {
            "key": "13-index",
            "number": 13,
            "title": "Index and Back Matter",
            "author": "",
            "printed_start": 751,
            "printed_end": total_pages - PDF_TO_PRINTED_OFFSET,
            "pdf_start": 782,
            "pdf_end": total_pages,
        }
    )
    return sections


def chapter_document(
    source_name: str,
    section: dict,
    page_texts: list[str],
) -> str:
    section_title = section["title"]
    number = section["number"]
    heading = f"第 {number} 章 · {section_title}" if number else section_title
    lines = [
        "---",
        f'title: "VLSI Test Principles and Architectures · {heading}"',
        f'source: "{source_name}"',
        "source_type: PDF",
        f'pages: {section["pdf_end"] - section["pdf_start"] + 1}',
        f'pdf_pages: "{section["pdf_start"]}-{section["pdf_end"]}"',
        "---",
        "",
        f"# {heading}",
        "",
        f"> 原书作者/章节作者：{section['author']}" if section["author"] else "> 原书前置或后置内容",
        "",
        "> 这是仅供本课程备课使用的本地转换副本，不随课程网站发布。",
        "> 文字来自 PDF 文本层；公式、图和表格的最终解释应以对应页面图像为准。",
        "",
        "## 章节位置",
        "",
        f"- PDF 物理页：{section['pdf_start']}–{section['pdf_end']}",
    ]
    if section["printed_start"] is not None:
        lines.append(
            f"- 原书印刷页：{section['printed_start']}–{section['printed_end']}"
        )
    lines.extend(["", "## 页面素材", ""])

    for pdf_page in range(section["pdf_start"], section["pdf_end"] + 1):
        text = scrub_text(page_texts[pdf_page - 1])
        printed = pdf_page - PDF_TO_PRINTED_OFFSET
        printed_label = f"原书第 {printed} 页" if printed > 0 else "前置页"
        image = f"assets/pages/page-{pdf_page:03d}.jpg"
        lines.extend(
            [
                f"## PDF 第 {pdf_page} 页 · {printed_label} {{#pdf-{pdf_page:03d}}}",
                "",
                f"![PDF 第 {pdf_page} 页](<{image}>)",
                "",
                markdown_fence(text or "本页没有可提取的文字，请查看页面图像。"),
                "",
            ]
        )
    return "\n".join(lines)


def index_document(
    source_name: str,
    total_pages: int,
    page_size: str,
    sections: list[dict],
) -> str:
    lines = [
        "---",
        "title: VLSI Test Principles and Architectures 本地 Markdown 索引",
        "---",
        "",
        "# VLSI Test Principles and Architectures 本地 Markdown 索引",
        "",
        f"- 原始文件：`{source_name}`",
        f"- PDF 物理页数：{total_pages}",
        f"- 页面尺寸：{page_size}",
        "- 公开状态：仅供课程备课，放在 Git 忽略的 `reference/` 下，不进入网站构建。",
        "",
        "## 章节",
        "",
        "| 章节 | 标题 | PDF 页 | 原书页 | Markdown |",
        "| --- | --- | ---: | ---: | --- |",
    ]
    for section in sections:
        printed = (
            f"{section['printed_start']}–{section['printed_end']}"
            if section["printed_start"] is not None
            else "—"
        )
        lines.append(
            f"| {section['number'] or '—'} | {section['title']} | "
            f"{section['pdf_start']}–{section['pdf_end']} | {printed} | "
            f"[{section['key']}.md]({section['key']}.md) |"
        )
    lines.extend(
        [
            "",
            "## 使用说明",
            "",
            "1. 检索概念时读文本；涉及公式、表格、波形和版式时打开同页图像核对。",
            "2. 引用时使用原书印刷页码，并用 PDF 物理页定位转换副本。",
            "3. 课件只重绘必要示意图和短引用，不批量公开原书页面。",
            "4. 原书出版于 2006 年；涉及标准版本、工艺趋势和工具实践时必须另查现行资料。",
            "",
        ]
    )
    return "\n".join(lines)


def render_pages(pdf: Path, output_root: Path, total_pages: int, dpi: int, pdftoppm: str) -> None:
    pages_dir = output_root / "assets" / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)
    existing = list(pages_dir.glob("page-*.jpg"))
    if len(existing) != total_pages:
        prefix = pages_dir / "page"
        for old in [*existing, *pages_dir.glob("page-*.png")]:
            old.unlink()
        run_checked(
            [
                pdftoppm,
                "-png",
                "-r",
                str(dpi),
                str(pdf),
                str(prefix),
            ]
        )
        for png in sorted(pages_dir.glob("page-*.png")):
            target = png.with_suffix(".jpg")
            with Image.open(png) as image:
                image.convert("RGB").save(target, "JPEG", quality=82, optimize=True)
            png.unlink()
    images = sorted(pages_dir.glob("page-*.jpg"))
    if len(images) != total_pages:
        raise RuntimeError(f"Expected {total_pages} rendered pages, found {len(images)}.")
    total_bytes = sum(image.stat().st_size for image in images)
    print(f"Rendered {len(images)} pages ({total_bytes / 1024 / 1024:.1f} MiB).")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--pdf",
        type=Path,
        default=Path("reference/VLSI Test Principles and Architectures Design for Testability.pdf"),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("reference/VLSI-Test-Principles-markdown"),
    )
    parser.add_argument("--dpi", type=int, default=110)
    parser.add_argument("--skip-images", action="store_true")
    args = parser.parse_args()

    pdf = args.pdf.resolve()
    if not pdf.is_file():
        raise SystemExit(f"PDF not found: {pdf}")
    pdfinfo = shutil.which("pdfinfo")
    pdftotext = shutil.which("pdftotext")
    pdftoppm = shutil.which("pdftoppm")
    if not pdfinfo or not pdftotext or (not args.skip_images and not pdftoppm):
        raise SystemExit("pdfinfo, pdftotext and pdftoppm are required.")

    total_pages, page_size = read_pdf_info(pdf, pdfinfo)
    page_texts = extract_pages(pdf, pdftotext, total_pages)
    sections = book_sections(total_pages)
    args.output.mkdir(parents=True, exist_ok=True)

    manifest = []
    for section in sections:
        document = chapter_document(pdf.name, section, page_texts)
        target = args.output / f"{section['key']}.md"
        write_text_lf(target, document)
        page_text = "\n".join(
            page_texts[section["pdf_start"] - 1 : section["pdf_end"]]
        )
        manifest.append(
            {
                **section,
                "output": target.name,
                "pages": section["pdf_end"] - section["pdf_start"] + 1,
                "text_characters": len(page_text),
            }
        )
        print(
            f"{target.name}: PDF {section['pdf_start']}-{section['pdf_end']}, "
            f"{manifest[-1]['pages']} pages"
        )

    write_text_lf(
        args.output / "README.md",
        index_document(pdf.name, total_pages, page_size, sections),
    )
    write_text_lf(
        args.output / "manifest.json",
        json.dumps(
            {
                "source": pdf.name,
                "total_pages": total_pages,
                "page_size": page_size,
                "printed_page_offset": PDF_TO_PRINTED_OFFSET,
                "sections": manifest,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
    )

    if not args.skip_images:
        render_pages(pdf, args.output, total_pages, args.dpi, pdftoppm)
    print(f"Wrote Markdown book to {args.output}")


if __name__ == "__main__":
    main()
