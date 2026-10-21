#!/bin/zsh
# One-time setup on a new Mac, after `git clone`: installs the headless Chromium used to print the PDFs.
# Needs Node 18+. Skip it if Google Chrome is installed (render.sh falls back to it).
set -e
cd "${0:A:h}"
npx -y playwright@1.49.1 install chromium
chmod +x render.sh
echo "Done. Edit media-kit/build.mjs, then run: ./media-kit/render.sh"
