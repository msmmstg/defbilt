# Photo Editor Starter

A starter photo editor built with:
- HTML + CSS
- multiple JavaScript modules
- PyScript for Python-in-the-browser
- a plugin host for future extensions

## Features in the scaffold
- Load image
- Save PNG
- Tool buttons
- Brush / eraser
- Zoom / rotate / opacity
- Basic filters
- Undo / redo stack
- PyScript analysis panel
- Local preference persistence

## Run it
Because PyScript loads from a CDN, serve this folder with a local web server instead of opening `index.html` directly.

Examples:
- `python -m http.server 8000`
- `npx serve`

Then open:
- `http://localhost:8000`

## Project structure
- `index.html` — app shell
- `styles.css` — UI styling
- `js/` — editor logic split into modules
- `py/main.py` — Python analysis + storage via PyScript
- `pyscript.json` — PyScript config
