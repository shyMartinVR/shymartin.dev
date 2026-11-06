# AI generated script to inject favicon HTML into website pages

from pathlib import Path
import re
import shutil

ROOT = Path(".")
OUTPUT = ROOT / "_site"
FRAGMENT = ROOT / "includes" / "favicon.html"

START = "<!-- FAVICONS:START -->"
END = "<!-- FAVICONS:END -->"

# Folders and files that should not be published as website content.
EXCLUDED_DIRS = {
    ".git", ".github", "_site", "includes", "scripts"
}

fragment = FRAGMENT.read_text(encoding="utf-8").strip()
block = f"{START}\n{fragment}\n{END}"

# Build a clean output directory from the original source files.
if OUTPUT.exists():
    shutil.rmtree(OUTPUT)

OUTPUT.mkdir(parents=True)

for source in ROOT.rglob("*"):
    if not source.is_file():
        continue

    relative = source.relative_to(ROOT)

    if any(part in EXCLUDED_DIRS for part in relative.parts):
        continue

    destination = OUTPUT / relative
    destination.parent.mkdir(parents=True, exist_ok=True)

    # Don't accidentally copy the generator's source files.
    if relative == FRAGMENT:
        continue

    if source.suffix.lower() == ".html":
        html = source.read_text(encoding="utf-8")

        # Replace a previously inserted block, if present.
        html = re.sub(
            re.escape(START) + r".*?" + re.escape(END),
            lambda _: block,
            html,
            flags=re.DOTALL,
        )

        # Otherwise insert the block immediately after <head>.
        if START not in html:
            html, count = re.subn(
                r"<head\b[^>]*>",
                lambda match: match.group(0) + "\n" + block,
                html,
                count=1,
                flags=re.IGNORECASE,
            )
            if count == 0:
                print(f"WARNING: No <head> found in {relative}")

        destination.write_text(html, encoding="utf-8")
    else:
        shutil.copy2(source, destination)

print("Website prepared in _site/")
