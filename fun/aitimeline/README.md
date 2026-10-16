# AI Timeline

A static page at `/fun/aitimeline/`. `index.html` loads `events.json` and draws one card per event, sorted by `date` (oldest first). No build step.

## Add an event

1. Draw a self-contained SVG and save it under `images/`. Keep it in the repo. Do not hotlink an image.
2. Add an object to the `events` array in `events.json`:

```json
{
  "id": "short-unique-id",
  "date": "YYYY-MM-DD",
  "title": "Short title",
  "summary": "A few sentences written after reading the source. Do not paste the article.",
  "dateNote": "Extra detail shown on hover or tap of the date.",
  "image": "images/your-file.svg",
  "imageAlt": "What the illustration shows",
  "imageNote": "Extra detail shown on hover or tap of the picture.",
  "note": "Extra detail shown on the info icon.",
  "sources": [
    {
      "label": "Publication",
      "url": "https://example.com/story",
      "note": "Extra detail shown on hover or tap of this link."
    }
  ]
}
```

3. `date` is an ISO calendar date. File order does not matter; the page sorts by date.
4. `image` must look like `images/name.svg` (letters, numbers, `.`, `_`, `-` only).
5. `sources` can list more than one URL. Each `url` must be `http` or `https`.
6. `dateNote`, `imageNote`, `note`, and each source `note` are optional tooltips. They show on hover, keyboard focus, and tap. On a touch screen, the first tap on a source link shows its note and the next tap opens it.
7. Preview with a static server from the repo root (`python3 -m http.server`) and open `/fun/aitimeline/`.
