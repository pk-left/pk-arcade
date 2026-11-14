# 🎮 PK Arcade

Free browser games and toys made in the Gambia 🇬🇲. Everything is plain **HTML, CSS and JavaScript**: there's no framework and no build step, and it's hosted on Netlify.

| | Game | What it does | How it's built |
|---|---|---|---|
| 🟩 | **[Wolof Wordle](wordle/)** | Guess the daily 5-letter Wolof word in 6 tries, then share your squares on WhatsApp | Seeded daily word, two-pass letter scoring (handles repeated letters), streaks saved in `localStorage` |
| 🛰️ | **[Guess the Place](guess-the-place/)** | Which Gambian town is this from space? | [Leaflet](https://leafletjs.com) + Esri satellite tiles; zooming out as a hint costs points |
| 🍵 | **[Ataya Master](ataya/)** | Pour tea between glasses to build the foam. Pour from higher for more foam, but your hand shakes | Canvas game loop; foam, spill and settling model tuned with a Python simulation |
| 🍲 | **[Which Gambian Dish Are You?](dish-quiz/)** | 8-question personality quiz with a shareable result card | Weighted scoring, card drawn on `<canvas>` and saved as PNG |
| 🔤 | **[Name Meanings](names/)** | Look up Gambian first names (Arabic, Wolof and Mandinka origins) and make a card | Matches different spellings (Ebou → Ebrima), seeded art from the name |
| 📢 | **[Sound Board](soundboard/)** | Gele-gele horns, the Banjul ferry, sabar drums, a NAWEC cut… | Every sound is synthesised live with the **Web Audio API**: no recordings |
| 🌌 | **[Sky Over Banjul](sky/)** | The live sky over the Gambia: stars, constellations, planets, moon phase, sunrise and sunset | Sidereal time → alt/az projection; [Astronomy Engine](https://github.com/cosinekitty/astronomy) for the planets |
| 🌉 | **[Bridge Builder](bridge/)** | Build a truss, send a car across and watch the forces | Mass-spring physics (60 substeps per frame); members snap in tension or compression |

## Run it locally

No install needed: serve the folder with any static server.

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deploy

The repo is connected to Netlify, so every push to `main` redeploys automatically. `netlify.toml` sets the publish folder to the repo root.

## Add content

Most content is in small data files you can edit without touching the game code:

- `wordle/words.js`: Wolof answer words and their meanings
- `guess-the-place/places.js`: towns, coordinates and fun facts
- `names/names.js`: names, other spellings, origins and meanings
- `bridge/index.html`: the `LEVELS` list at the top (gap, anchors, budget, car weight)

Spot a wrong Wolof spelling or name meaning? [Open an issue](https://github.com/pk-left/pk-arcade/issues) and I'll fix it.

## Credits

- Satellite imagery © Esri, Maxar, Earthstar Geographics; map © OpenStreetMap contributors
- Star and constellation data: [d3-celestial](https://github.com/ofrohn/d3-celestial) (BSD-3-Clause), from the Hipparcos catalogue
- Planet and moon positions: [Astronomy Engine](https://github.com/cosinekitty/astronomy) (MIT)
- Maps: [Leaflet](https://leafletjs.com) (BSD-2-Clause)

## License

MIT © Dodou Njie (PK)
