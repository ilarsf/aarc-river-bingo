# AARC River Bingo

The finished static GitHub Pages webpage. Open `index.html` through a static server, or configure GitHub Pages to serve the repository root. No build step, installation, or runtime dependencies are needed.

This repository contains the webpage’s HTML, CSS, JavaScript, selected runtime images and site documentation. Keep relative paths intact. The original development code, source PNGs, rejected artwork, research, manifests, reviews, tests and tools live in the sibling `../aarc-river-bingo_dev/` repository.

The game has 41 catalog entries, 68 animal appearances, 25-square cards drawn from 29 rowing-eligible entries, a raptor silhouette guide, a link to Cornell’s Merlin Bird ID, and 82 fun facts. The card and its marked squares save automatically in each player’s browser.

How to play includes a short reminder that clearing browser data can erase progress. Optional Save backup and Load backup controls are tucked under “For the nerds: backups”; backups keep the card and its marks without a journal or dates. Restoring requires a reviewed confirmation; changes in another tab invalidate a stale restore preview. Failed saves preserve the committed marks, with an explicit choice to play temporarily in the current tab.

Tap a bingo square to mark it spotted; tap again to undo. Hold a square (or press Shift + F10) for pictures, field marks and fun facts. Animal details offer the same marking action for animals on the card. Warblers and Common Merganser stay in the guide but are left off new cards. Existing saved cards keep their marked squares when moving to this simpler version. Close popups with ×, Escape, or a click outside the card.

Animal illustrations use a stable mix of mirrored and original directions across the board, guide and details. Direction stays the same when marking squares or reloading.

The bingo view opens directly to the card. Share card sends a link to the same unmarked board, so friends can play with their own marks. The Wildlife Bingo title returns to the card. A short invitation to see wildlife on the river links to Ann Arbor Rowing Club and Argo Canoe Livery in new tabs. The club logo and Merlin link offer Leave / Stay choices before opening a new tab. Every Surprise me click shows another discovery. Animals explains that this is just a selection of wildlife and links to the Huron River Watershed Council for more.

Open Raptor silhouettes in Animals, or Flight silhouettes in a raptor’s details, to compare five birds, including Cooper’s Hawk, at a shared wingspan scale. References and artwork notes are kept in the repository’s [source notes](SOURCES.md).

To refresh this delivery, run `python3 scripts/export-site.py ../aarc-river-bingo` from the development repository and verify with `--check`. The exporter does not commit, push or configure hosting. The GitHub remote is `https://github.com/ilarsf/aarc-river-bingo.git`. Deployment preparation does not commit, push or change GitHub Pages settings.
