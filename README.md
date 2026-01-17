# inthaiguy.github.io

A personal website hosted on GitHub Pages with fun interactive projects and tools.

**Live site:** https://inthaiguy.github.io

## Project Structure

```
/                       # Main landing page
/fun/                   # Fun interactive projects
  /age/                 # Age dashboard - count-up/count-down timers
  /doubles/             # Net worth doubles calculator
  /emojitype/           # Emoji typing editor
  /islands/             # Random tropical island explorer
  /maze/                # Chase the green dot game
  /mc/                  # Minecraft counting game
  /quirky/              # Quirky text editor
  /soundboard/          # Soundboard
  /speedword/           # Typing speed game
  /spinner/             # Color spinner
  /timeline/            # Interactive timeline
  /tmb/                 # Birthday countdown
  clicker.html          # Clicker game
  tshirt.html           # Stretchable t-shirt
  typeit.html           # Type-it editor
/crypto/                # Crypto deposit page
/history/               # Bitcoin history archive
/kleierstory/           # The Kleier Story Bulletin
/tesla/                 # Tesla dashboard
/favicon/               # Site favicon assets
```

## Working with GitHub Pages

This is a static HTML/CSS/JS site hosted directly on GitHub Pages without any static site generator (no Jekyll, Hugo, etc.).

### Deployment

Changes pushed to the main branch are automatically deployed to GitHub Pages. No build step required.

### Local Development

Simply open any HTML file in a browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## GitHub Pages Best Practices

### Performance
- **Optimize images** - Use compressed formats (WebP, AVIF) and appropriate sizes
- **Minimize HTTP requests** - Combine CSS/JS where practical
- **Use browser caching** - Static assets are cached by GitHub's CDN

### SEO & Accessibility
- Include `<meta charset="UTF-8">` and `<meta name="viewport">` tags
- Use semantic HTML elements (`<header>`, `<main>`, `<nav>`, etc.)
- Add descriptive `<title>` tags to each page
- Include alt text for images

### Favicon Setup
Include these links in your `<head>` for cross-browser/device support:
```html
<link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
<link rel="shortcut icon" href="/favicon/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
<link rel="manifest" href="/favicon/site.webmanifest" />
```

### Custom 404 Page
Place a `404.html` file in the root directory. GitHub Pages automatically serves it for missing pages.

### HTTPS
GitHub Pages provides free HTTPS for all sites. Always use HTTPS links.

### File Naming
- Use lowercase filenames
- Avoid spaces (use hyphens instead)
- Keep URLs clean and descriptive

### Repository Settings
- Enable GitHub Pages in repository Settings > Pages
- Select the branch to deploy (usually `main` or `gh-pages`)
- Custom domains can be configured with a `CNAME` file

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Pages Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#usage-limits)
  - Sites should be < 1GB
  - Bandwidth limit: 100GB/month
  - 10 builds per hour limit
