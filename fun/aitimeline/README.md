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
  "image": "images/your-file.svg",
  "imageAlt": "What the illustration shows",
  "sources": [
    { "label": "Publication", "url": "https://example.com/story" }
  ]
}
```

3. `date` is an ISO calendar date. File order does not matter; the page sorts by date.
4. `image` must look like `images/name.svg` (letters, numbers, `.`, `_`, `-` only).
5. `sources` can list more than one URL. Each `url` must be `http` or `https`.
6. Preview with a static server from the repo root (`python3 -m http.server`) and open `/fun/aitimeline/`.
