"""Check local links and fragments in the generated VuePress site."""

from __future__ import annotations

import argparse
from pathlib import Path
from urllib.parse import unquote, urlsplit

from lxml import html


SKIP_SCHEMES = {"http", "https", "mailto", "tel", "javascript", "data"}


def resolve_target(dist: Path, source: Path, path_value: str, base: str) -> Path | None:
    path_value = unquote(path_value)
    root_relative = path_value.startswith("/")
    if path_value.startswith(base):
        path_value = path_value[len(base) :]
        root_relative = True
    elif root_relative:
        return None

    candidate = dist / path_value.lstrip("/") if root_relative else source.parent / path_value
    candidate = candidate.resolve()
    if candidate.is_dir():
        candidate /= "index.html"
    elif candidate.suffix == "":
        index_candidate = candidate / "index.html"
        if index_candidate.exists():
            candidate = index_candidate
    return candidate


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("."))
    parser.add_argument("--base", default="/vlsi-testing-technology/")
    args = parser.parse_args()

    root = args.root.resolve()
    dist = root / "src" / ".vuepress" / "dist"
    if not dist.is_dir():
        raise SystemExit("Build output is missing. Run pnpm docs:build first.")

    documents = {
        path.resolve(): html.fromstring(path.read_bytes())
        for path in dist.rglob("*.html")
    }
    failures: list[str] = []
    checked = 0
    for source, document in documents.items():
        for element in document.xpath("//*[@href or @src]"):
            raw = element.get("href") or element.get("src")
            if not raw:
                continue
            split = urlsplit(raw)
            if split.scheme.lower() in SKIP_SCHEMES or raw.startswith("//"):
                continue
            if not split.path and not split.fragment:
                continue
            checked += 1

            if split.path:
                target = resolve_target(dist, source, split.path, args.base)
                if target is None:
                    failures.append(f"{source.relative_to(dist)} -> unsupported root URL {raw}")
                    continue
                if not target.exists():
                    failures.append(f"{source.relative_to(dist)} -> missing {raw}")
                    continue
            else:
                target = source

            if split.fragment and target.suffix == ".html":
                target_document = documents.get(target.resolve())
                if target_document is None:
                    target_document = html.fromstring(target.read_bytes())
                fragment = unquote(split.fragment)
                ids = {
                    value
                    for node in target_document.xpath("//*[@id]")
                    if (value := node.get("id"))
                }
                if fragment and fragment not in ids:
                    failures.append(f"{source.relative_to(dist)} -> missing anchor {raw}")

    if failures:
        print("\n".join(failures))
        raise SystemExit(f"{len(failures)} broken local link(s) among {checked} checked.")
    print(f"Checked {checked} local href/src values across {len(documents)} pages; all resolve.")


if __name__ == "__main__":
    main()
