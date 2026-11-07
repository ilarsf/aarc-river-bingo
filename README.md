# AARC River Bingo

The finished static GitHub Pages webpage. Open `index.html` through a static server, or configure GitHub Pages to serve the repository root. No build step, installation, or runtime dependencies are needed.

This repository contains only the webpage’s HTML, CSS, JavaScript and selected runtime images. Keep relative paths intact. Development code, source PNGs, rejected artwork, prompts, research, manifests, reviews, tests and tools live in the sibling `../aarc-river-bingo_dev/` repository.

The game has 41 catalog entries, 68 animal appearances, daylight bingo cards, a sighting journal, file backup/restore, identification help, 82 sourced facts and crew-card sharing. Progress stays in each player’s browser. Use Save backup to keep a recoverable copy outside browser storage.

To refresh this delivery, run `python3 scripts/export-site.py ../aarc-river-bingo` from the development repository and verify with `--check`. The exporter does not commit, push or configure hosting. No GitHub remote is currently configured in this local delivery repository.
