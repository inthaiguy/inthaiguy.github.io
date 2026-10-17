# AI Timeline

A static page at `/fun/aitimeline/`. `index.html` loads `events.json` and draws one card per event, sorted by `date` (oldest first). No build step.

## Add an event

1. Save a screenshot of the source page under `images/` as WebP. `image` is the thumbnail used on the card. `imageFull` is the larger file opened when someone clicks or taps the thumbnail. Do not draw a stand-in illustration, and do not hotlink the picture.
2. Add an object to the `events` array in `events.json`:

```json
{
  "id": "short-unique-id",
  "date": "YYYY-MM-DD",
  "title": "Short title",
  "summary": "A few sentences written after reading the source. Do not paste the article.",
  "dateNote": "Extra detail shown on hover or tap of the date.",
  "image": "images/your-file-thumb.webp",
  "imageFull": "images/your-file.webp",
  "imageAlt": "Screenshot of the source page",
  "imageNote": "Extra detail shown when hovering the picture and in the enlarged view.",
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
4. `image` and `imageFull` must look like `images/name.webp` (letters, numbers, `.`, `_`, `-` only).
5. `sources` can list more than one URL. Each `url` must be `http` or `https`.
6. `dateNote`, `imageNote`, `note`, and each source `note` are optional tooltips. They show on hover, keyboard focus, and tap. On a touch screen, the first tap on a source link shows its note and the next tap opens it.
7. Preview with a static server from the repo root (`python3 -m http.server`) and open `/fun/aitimeline/`.

## Example sites

These are layout references, not timeline events. Do not add them to `events.json`.

- [AI Digest timeline](https://theaidigest.org/timeline) — linked from the bottom-left of the page. Hover or tap the link for a short note. On a touch screen, the first tap shows the note and the next tap opens the site in a new tab.
