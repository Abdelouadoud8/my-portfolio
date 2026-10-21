#!/bin/zsh
# Builds the HTML (print pages here, web pages in ../public/media-kit/) and prints the 3 PDFs into ../public/media-kit/pdf/.
# Uses $CHROME if set, else Playwright's Chromium (../setup.sh installs it), else Google Chrome.
cd "${0:A:h}" || exit 1
node build.mjs || exit 1
mkdir -p ../public/media-kit/pdf
C="${CHROME:-}"
if [ -z "$C" ]; then
  for c in "$HOME"/Library/Caches/ms-playwright/chromium-*/chrome-mac*/Chromium.app/Contents/MacOS/Chromium(N) \
           "$HOME"/Library/Caches/ms-playwright/chromium-*/chrome-mac*/Google\ Chrome\ for\ Testing.app/Contents/MacOS/Google\ Chrome\ for\ Testing(N) \
           "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    [ -x "$c" ] && C="$c"
  done
fi
[ -x "$C" ] || { echo "No Chrome/Chromium found: run ../setup.sh"; exit 1; }
for f pdf in Media-Kit-EN Media-Kit-EN-MAHDAOUI Media-Kit-FR Media-Kit-FR-MAHDAOUI Media-Kit-Darja Media-Kit-Darja-MAHDAOUI; do
  "$C" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
    --print-to-pdf="$PWD/../public/media-kit/pdf/$pdf.pdf" "file://$PWD/$f.html" 2>/dev/null
done
echo "PDFs written to ${PWD:h}/public/media-kit/pdf"
