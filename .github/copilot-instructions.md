<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# My Digital Diary — Copilot Instructions

## Project Overview
This repository contains two projects:
1. **The Agency website** — a branding & marketing agency site (`index.html`, `style.css`, `script.js`)
2. **My Digital Diary app** — a standalone client-side diary application located in the `diary/` folder

## Digital Diary App (`diary/`)

### Structure
| File | Purpose |
|------|---------|
| `diary/index.html` | App shell with three views: home (entry list), editor, and reader |
| `diary/style.css` | Dark-theme styles; tokens defined as CSS custom properties |
| `diary/script.js` | All app logic — CRUD, localStorage persistence, routing, rendering |

### Features
- Create, read, edit, and delete diary entries
- Each entry: date, mood (6 options), title, tags (comma-separated), body text
- Live word count while writing
- Search entries by keyword; filter by mood
- Entries persisted to `localStorage` under the key `digital_diary_entries`
- Fully accessible (ARIA labels, keyboard navigation, focus management)
- No build step, no external dependencies — open `diary/index.html` directly in a browser

### Development Notes
- No framework or bundler — plain HTML/CSS/JS
- No server required; works as a static file
- All user-supplied strings are HTML-escaped before being rendered to prevent XSS

## Checklist

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements — digital diary app (HTML/CSS/JS, no framework)
- [x] Scaffold the Project — `diary/` folder with `index.html`, `style.css`, `script.js`
- [x] Customize the Project — full CRUD, localStorage, search/filter, responsive UI
- [x] Install Required Extensions — no extensions needed (vanilla web project)
- [x] Compile the Project — no build step required; open `diary/index.html` in a browser
- [x] Create and Run Task — no task runner needed
- [x] Launch the Project — open `diary/index.html` in any modern browser
- [x] Ensure Documentation is Complete — README.md created, this file updated

## Development Guidelines
- If the user has not specified project details, assume they want a "Hello World" project as a starting point.
- Avoid adding links of any type (URLs, files, folders, etc.) or integrations that are not explicitly required.
- Avoid generating images, videos, or any other media files unless explicitly requested.
- If you need to use any media assets as placeholders, let the user know that these are placeholders and should be replaced with the actual assets later.
- Ensure all generated components serve a clear purpose within the user's requested workflow.
- If a feature is assumed but not confirmed, prompt the user for clarification before including it.

- Work through each checklist item systematically.
- Keep communication concise and focused.
- Follow development best practices.
