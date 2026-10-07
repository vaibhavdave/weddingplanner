# WedVerse AI

**See your wedding before you spend on it.** A single-file HTML prototype (`index.html`, no build step) for couples and wedding planners.

Open `index.html` in a modern browser (needs internet for three.js + Google Fonts from CDN).

## What's inside

| Area | Features |
|---|---|
| **1 · Upload Venue** | Drag-and-drop venue photos, floor plan (image/PDF) and video; auto-generated live floor plan; simulated "AI digital twin" that estimates hall dimensions |
| **2 · 3D Preview** | Real WebGL ballroom: mandap, floral arch, drapery, chandeliers, aisle, tables & chairs. Layouts (banquet / theatre / cocktail), 4 themes, lighting & mood, décor toggles, guest/table sizing with capacity warning, camera presets, aisle walkthrough, 2D plan mode, split-screen VR mode, PNG snapshot, fullscreen |
| **3 · Budget Optimizer** | Live decor estimate from the 3D design, budget health check, cost breakdown, one-click AI savings ideas, decor vendor comparison with "Best Value" |
| **Vendors** | Decor, catering, photography, music — compare, select, request quote, running budget tracker |
| **Quote** | Line-item quote generated from the scene, material estimation with wastage, GST, CSV / print-to-PDF |
| **Couple mode** | Countdown, plan summary, checklist |
| **Planner mode** | Client pipeline, KPIs, planner markup, client-view toggle, shareable preview links |

State persists in `localStorage`; "share" links encode the design in the URL hash.

## Prototype notes
- The "AI" venue analysis, vendor data and prices are **simulated** — wire `analyze()` and the `VENDORS` data to real services.
- VR mode is split-screen stereo (drag / WASD to move); headset gyroscope tracking is not implemented.
