# PK Arcade

Free browser games made in the Gambia. Play at **https://pk-arcade.pages.dev**.

Everything is plain HTML, CSS and JavaScript. There is no framework and no build step. The site installs to a phone's home screen and most of it works offline.

| Game | What it does | How it's built |
|---|---|---|
| **[Wolof Wordle](wordle/)** | Guess the 5-letter Wolof word in 6 tries. A daily word for everyone, plus a practice mode | Seeded daily word, two-pass letter scoring (handles repeated letters), streaks in `localStorage` |
| **[Guess the Place](guess-the-place/)** | *Name it*: see a Gambian town from space and pick its name. *Pin it*: get a name and drop a pin on the map | [Leaflet](https://leafletjs.com) with Esri satellite tiles; distance scoring |
| **[Ataya Master](ataya/)** | Pour tea between two glasses to build the foam. Pour from higher for more foam, but your hand shakes. Three levels, including a Harmattan wind | Low-resolution canvas scaled up for the pixel look; foam and spill model tuned with a simulation |
| **[Bridge Builder](bridge/)** | Build a truss across six gaps, send a car over, and watch the forces | Mass-spring physics, 60 substeps per frame; members snap in tension or compression; every level solved by an automatic test |
| **[Which Dish Are You?](dish-quiz/)** | Eight questions, then a result card to save or share | Weighted scoring; card drawn on `<canvas>` |
| **[Name Meanings](names/)** | Look up Gambian first names (Arabic, Wolof, Mandinka and Fula origins) | Matches different spellings (Ebou finds Ebrima); pattern seeded from the name |
| **[Sound Board](soundboard/)** | Gele-gele horns, the Banjul ferry, sabar drums. Record a mix and loop it | Every sound is synthesised live with the Web Audio API |
| **[Sky Over Banjul](sky/)** | The live sky over the Gambia: stars, constellations, planets, moon phase | Sidereal time to altitude/azimuth projection; [Astronomy Engine](https://github.com/cosinekitty/astronomy) for the planets |

## Design

The look is an arcade cabinet: pixel type, hard edges, solid offset shadows and CRT scanlines. Colours come from the Gambian flag. There are two themes, night and day, with a switch in the top bar; the site follows the phone's setting until you choose. Sound effects are short square-wave blips with a mute button.

- `assets/style.css`: colour tokens for both themes and the shared components
- `assets/common.js`: top bar, theme and sound switches, sound effects, confetti, storage helpers
- `assets/icons.js`: 12 x 12 pixel art for each game
- `sw.js` and `manifest.webmanifest`: install and offline support

## Run it locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deploy

Hosted on Cloudflare Pages, connected to this repo. Every push to `main` goes live. There is no build command and the output directory is the repo root. When you change files, bump `CACHE` in `sw.js` so phones pick up the new version.

## Add content

- `wordle/words.js`: Wolof words and meanings
- `guess-the-place/places.js`: places, coordinates and facts
- `names/names.js`: names, other spellings, origins and meanings
- `bridge/index.html`: the `LEVELS` list at the top

Spot a wrong Wolof spelling or name meaning? [Open an issue](https://github.com/pk-left/pk-arcade/issues).

## Credits

- Satellite imagery: Esri, Maxar, Earthstar Geographics. Map: OpenStreetMap contributors
- Star data: [d3-celestial](https://github.com/ofrohn/d3-celestial) (BSD-3-Clause), from the Hipparcos catalogue
- Planet and moon positions: [Astronomy Engine](https://github.com/cosinekitty/astronomy) (MIT)
- Maps: [Leaflet](https://leafletjs.com) (BSD-2-Clause)
- Fonts: Press Start 2P and VT323 (SIL Open Font License)

## License

MIT, Dodou Njie (PK)
