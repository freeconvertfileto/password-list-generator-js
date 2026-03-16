# Password List Generator

Generate bulk lists of cryptographically random passwords with configurable length range, character sets, and three output formats, entirely in the browser.

**Live Demo:** https://file-converter-free.com/en/developer-tools/password-list-generator

## How It Works

`secureRandom()` fills a single-element `Uint32Array` via `crypto.getRandomValues` and returns the value divided by `0xFFFFFFFF` to produce a floating-point value in [0, 1). Each password length is chosen per-password as `minLen + Math.floor(secureRandom() * (maxLen - minLen + 1))` for variable-length output. Characters are selected from a charset built from enabled pools (uppercase, lowercase, digits, symbols) by indexing at `Math.floor(secureRandom() * charset.length)`. Output is rendered in three formats: plain text (one per line), CSV (quoted, comma-separated on one line), or JSON array. Passwords auto-generate on page load and regenerate on any option change.

## Features

- `crypto.getRandomValues` for cryptographically secure randomness
- Variable length per password (min/max range)
- Configurable character sets: uppercase, lowercase, digits, symbols
- Count selector (up to configurable maximum)
- Three output formats: plain text, CSV, JSON array
- Copy output to clipboard
- Auto-generates on load

## Browser APIs Used

- Web Crypto API (`crypto.getRandomValues`)
- Clipboard API (`navigator.clipboard.writeText`)

## Code Structure

| File | Description |
|------|-------------|
| `password-list-generator.js` | `secureRandom()` (single `Uint32Array` / `0xFFFFFFFF`), per-password variable length, charset assembly, 3 output format renderers, auto-generate on load |

## Usage

| Element ID / Selector | Purpose |
|----------------------|---------|
| Count input | Number of passwords to generate |
| Min/max length inputs | Password length range |
| Character set checkboxes | Uppercase / lowercase / digits / symbols |
| Format selector | Plain / CSV / JSON output |
| Generate button | Regenerate list |
| Output area | Generated password list |
| Copy button | Copy output to clipboard |

## License

MIT
