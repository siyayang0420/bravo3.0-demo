# Bravo Rewards 3.0 Demo

Interactive Bravo Rewards 3.0 redesign demo for review, presentation, and
handoff. The project is a self-contained Vite + React app: no backend, no
database, and no remote services are required to run it locally.

## What It Includes

- A live phone-frame app demo with animated Bravo Rewards screens.
- Review sections for what changed, design rationale, and Flutter handoff notes.
- A scoped mobile design system for the demo, separate from the review-site shell.
- PWA metadata so the demo can be installed to a phone home screen for a
  browser-chrome-free presentation.

## Tech Stack

- React 18
- TypeScript
- Vite
- Framer Motion
- Lucide React

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Open the local URL Vite prints, usually:

```text
http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Phone Presentation

The app can be installed as a PWA.

On iPhone, open the site in Safari, tap Share, then choose Add to Home Screen.
On Android, open the site in Chrome and choose Install app from the browser
menu.

When launched from the home screen, the demo opens directly into the app view
and can use the full screen without the browser URL bar.

## Project Structure

```text
src/
  components/        Review-site navigation and layout
  content/           Editable review copy and structured notes
  demo/              Bravo mobile app demo, screens, components, assets
  sections/          Review-site sections
  styles/            Review-site styling and tokens
docs/                Handoff and component notes
public/              Static PWA assets and competitor screenshot placeholders
Figma Variables/     Exported design-token JSON
```

## Editing Content

Most non-code review copy lives in:

- `src/content/changes.ts`
- `src/content/designSystem.tsx`
- `src/content/flutterNotes.ts`
- `src/content/rationale.ts`

Phone-demo data and screen copy live under:

- `src/demo/data/`
- `src/demo/screens/`

Competitor screenshots can be added to `public/competitors/` using the filenames
referenced by `src/content/rationale.ts`.

## Design Notes

The review shell and the phone demo intentionally use separate design systems.
The review shell uses global tokens from `src/styles/tokens.css`; the Bravo
mobile demo is scoped under `.bravo-app` in `src/demo/bravo-app.css` and uses
`--bv-*` variables generated from the Figma variable exports.

Before estimating or porting the demo to Flutter, read:

- `docs/REACT-TO-FLUTTER-NOTES.md`
- `docs/COMPONENTS.md`
