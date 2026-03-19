# Popvirtual / Northlink

Static multi-page website for **Northlink**, an ATC training and virtual airline concept.

## Pages
- `index.html` - cinematic landing page
- `training.html` - ATC academy overview
- `fleet.html` - editable fleet showcase
- `crew.html` - crew center dashboard
- `admin.html` - browser-based admin editor

## Admin access
Open `admin.html` and use password `Popwings` to unlock editing.

Changes are stored in browser local storage, so text, logo letter, hero image, and fleet cards can be changed without editing code.

## Run locally
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.
