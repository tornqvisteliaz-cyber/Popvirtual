# Popvirtual / Northlink

Static multi-page website for **Northlink**, an virtual airline concept.

## Pages
- `index.html` - cinematic landing page
- `training.html` - VA join/application page
- `fleet.html` - editable fleet showcase
- `crew.html` - crew center login and dashboard
- `admin.html` - locked admin portal, pilot application inbox, and crew login generator

## Admin access
Open `admin.html` and use password `Popwings` to unlock editing.

## What the admin portal can change
- site name, logo letters, and tagline
- accent color and hero title color
- hero text, CTA labels, and briefing card text
- homepage highlight copy and join-page intro
- hero background image
- full fleet list using `aircraft|role|image URL`
- submitted pilot applications from the join page with Discord usernames
- crew center access codes generated in the admin portal and linked to Discord usernames
- locally saved crew-center profiles keyed by the verified Discord identity

## Run locally
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.
