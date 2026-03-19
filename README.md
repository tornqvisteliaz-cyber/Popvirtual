# Popvirtual / Northlink

Static multi-page website for **Northlink**, an ATC training and virtual airline concept.

## Pages
- `index.html` - cinematic landing page
- `training.html` - ATC academy overview plus training request form
- `fleet.html` - editable fleet showcase
- `crew.html` - crew center dashboard
- `admin.html` - browser-based admin editor and training inbox

## Admin access
Open `admin.html` and use password `Popwings` to unlock editing.

## What the admin portal can change
- site name, logo letters, and tagline
- accent color and hero title color
- hero text, CTA labels, and briefing card text
- homepage highlight copy and training intro
- hero background image
- full fleet list using `aircraft|role|image URL`
- submitted training requests from the training page

## Run locally
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.
