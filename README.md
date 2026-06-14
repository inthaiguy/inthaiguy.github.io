```
▗▖▗▖  ▗▖▗▄▄▄▖▗▖ ▗▖ ▗▄▖ ▗▖ ▗▄▄▖▗▖ ▗▖▗▖ ▗▖   ▗▄▄▖▗▖▗▄▄▄▖▗▖ ▗▖▗▖ ▗▖▗▄▄▖   ▗▖ ▗▄▖
▐▌▐▛▚▖▐▌  ▐▌ ▐▌ ▐▌▐▌ ▐▌▐▌▐▌   ▐▌ ▐▌▝▚▗▞▘  ▐▌   ▐▌  ▐▌ ▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌  ▐▌▐▌ ▐▌
▐▌▐▌ ▝▜▌  ▐▌ ▐▛▀▜▌▐▛▀▜▌▐▌▐▌▝▜▌▐▌ ▐▌  ▐▌   ▐▌▝▜▌▐▌  ▐▌ ▐▛▀▜▌▐▌ ▐▌▐▛▀▜▌  ▐▌▐▌ ▐▌
▐▌▐▌  ▐▌  ▐▌ ▐▌ ▐▌▐▌ ▐▌▐▌▝▚▄▞▘▝▚▄▞▘  ▐▌ ▗▖▝▚▄▞▘▐▌  ▐▌ ▐▌ ▐▌▝▚▄▞▘▐▙▄▞▘▗▖▐▌▝▚▄▞▘
```

A personal GitHub Pages site with interactive projects, games, tools, and historical archives. Pure static HTML/CSS/JavaScript — no build step required. Features include:

<p align="center">
  <a href="https://inthaiguy.github.io">Website</a> - <a href="https://github.com/inthaiguy/inthaiguy.github.io">GitHub repo</a>
</p>

- Landing page with dynamic "Last seen" status fetched from a Google Sheet.
- 15+ interactive fun projects: clicker game, typing speed test, emoji editor, maze, soundboard, and more.
- Bitcoin history archive with 122 historical timeline entries.
- Kleier Story Bulletin — genealogy project documenting family history from 1885 Prussia.
- Tesla dashboard and crypto deposit page.
- Custom 404 page with consistent branding.

## Deployment

| Service | Details |
|---|---|
| **Hosting** | [GitHub Pages](https://pages.github.com/) — deploys from `gh-pages` branch |
| **Production URL** | [inthaiguy.github.io](https://inthaiguy.github.io) |
| **GitHub repo** | [inthaiguy/inthaiguy.github.io](https://github.com/inthaiguy/inthaiguy.github.io) |

## Tech Stack

- 💻 [HTML / CSS / JavaScript](https://developer.mozilla.org/en-US/docs/Web) (vanilla, no frameworks)
- 📡 [Google Sheets API](https://developers.google.com/sheets) (published HTML endpoint for "Last seen" data)
- 🌐 [GitHub Pages](https://pages.github.com/)

## Local setup

```bash
git clone https://github.com/inthaiguy/inthaiguy.github.io.git
cd inthaiguy.github.io
```

Serve locally with Python or Node:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Open [http://localhost:8000](http://localhost:8000) to preview.

## Project structure

```
/                         Landing page ("Last seen" status)
/fun/                     Interactive projects hub
  /age/                   Age dashboard
  /doubles/               Net worth doubles calculator
  /emojitype/             Emoji typing editor
  /islands/               Random tropical island explorer
  /maze/                  Chase the green dot game
  /mc/                    Minecraft counting game
  /quirky/                Quirky text editor
  /soundboard/            Soundboard
  /speedword/             Typing speed game
  /spinner/               Color spinner
  /timeline/              Interactive timeline
  /tmb/                   Birthday countdown
  clicker.html            10-second timed clicking game
  tshirt.html             Stretchable t-shirt interactive
  typeit.html             Type-it text editor
/crypto/                  Crypto deposit page (CoinPayments)
/history/                 Bitcoin history archive (122 entries)
/kleierstory/             Kleier family genealogy project
/tesla/                   Tesla dashboard
```
