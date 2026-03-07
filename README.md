# My Digital Diary

A lightweight, client-side digital diary app — no server, no framework, no build step required.

## Getting Started

Open `diary/index.html` in any modern browser. That's it.

```
diary/
├── index.html   ← open this
├── style.css
└── script.js
```

## Features

| Feature | Details |
|---------|---------|
| **Create entries** | Date, mood, title, tags, and free-form text |
| **Edit & delete** | Full CRUD with confirmation prompt before deleting |
| **Search** | Keyword search across title, body, and tags |
| **Filter by mood** | 😊 Happy · 😐 Neutral · 😢 Sad · 🤩 Excited · 😰 Anxious · 🙏 Grateful |
| **Word count** | Live word counter while you write |
| **Persistence** | Entries saved to browser `localStorage` — survive page refreshes |
| **Responsive** | Works on desktop and mobile |
| **Accessible** | ARIA labels, keyboard navigation, focus management |

## Data Storage

All diary entries are stored locally in your browser's `localStorage` under the key `digital_diary_entries`. Data never leaves your device.

To export your entries, open the browser console and run:

```js
copy(localStorage.getItem('digital_diary_entries'));
// then paste into a .json file
```

To import entries from a backup:

```js
localStorage.setItem('digital_diary_entries', '<paste JSON here>');
location.reload();
```

## Tech Stack

- Plain HTML5, CSS3, and vanilla JavaScript (ES2020)
- [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) via Google Fonts
- Zero dependencies, zero build tools

## Repository Structure

```
.github/
  copilot-instructions.md
diary/           ← Digital Diary app
  index.html
  style.css
  script.js
index.html       ← The Agency marketing website
style.css
script.js
```
