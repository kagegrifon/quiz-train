# Quiz Train

[**Live Demo →**](https://kagegrifon.github.io/quiz-train/) · [🇷🇺 Русская версия](README-ru.md)

> Web application for taking programming quizzes with configurable answer reveal,
> partial scoring, and per-attempt statistics.

---

## Live Demo

**[https://kagegrifon.github.io/quiz-train/](https://kagegrifon.github.io/quiz-train/)**

Two built-in quizzes (JS Basics, TS Basics) are included. You can also upload
your own quiz as a JSON file and export any quiz back to JSON.

---

## Features

- **Markdown questions** — questions and answer options support full Markdown, including fenced code blocks with syntax highlighting
- **Single-select & multi-select** — radio (one answer) and checkbox (multiple answers) question types
- **Two reveal modes:**
  - `afterAnswer` — show correct/wrong highlight immediately after clicking "Answer"; response is locked
  - `onFinish` — freely navigate between questions, see results only on the Results page
- **Partial scoring** — multi-select questions award points proportionally to correctly chosen options
- **Optional countdown timer** — configurable time limit; quiz auto-submits at zero
- **Upload / export quizzes** — load any JSON quiz from disk; export built-in or user quizzes
- **Attempt history** — all attempts stored in `localStorage` with score, percentage, duration, and settings snapshot
- **Dark / light theme** — toggle in the header, persisted across sessions

---

## Tech Stack

| Category  | Tools                                                    |
|-----------|----------------------------------------------------------|
| UI        | React 19, Mantine 8, CSS Modules, Tabler Icons           |
| Routing   | TanStack Router (typed search params)                    |
| Build     | Vite, TypeScript (strict mode)                           |
| Testing   | Playwright (E2E)                                         |
| Quality   | ESLint, Husky + lint-staged, knip (dead code detection)  |
| Deploy    | GitHub Pages, gh-pages                                   |

---

## Architecture — Feature-Sliced Design

The project follows [Feature-Sliced Design](https://feature-sliced.design/) — a layered architecture where each layer can only import from layers below it.

| Layer      | Directory       | What's here                                             |
|------------|-----------------|---------------------------------------------------------|
| `app`      | `src/app/`      | Router, providers, global layout                        |
| `pages`    | `src/pages/`    | Full pages: Start, Quiz, Results, Stats, Settings       |
| `widgets`  | `src/widgets/`  | Complex UI blocks: QuestionView, AppHeader              |
| `entities` | `src/entities/` | Business entities: Question, Quiz, built-in quiz data   |
| `shared`   | `src/shared/`   | Reusable: scoring logic, storage helpers, UI primitives |

Each slice exposes only a public API via `index.ts`. The `@/` alias points to `src/`.

---

## Technical Highlights

- **Typed URL state** — TanStack Router validates all search params at the type level; quiz configuration (reveal mode, timer, show flags) lives in the URL, making results shareable
- **Two reveal modes with partial scoring** — `afterAnswer` locks each response individually; multi-select scoring uses `points × (correctSelected / correctTotal)` without penalty for extra picks
- **Playwright E2E suite** — covers catalog, quiz flow, results breakdown, upload/export, elapsed timer, and theme switching
- **Pre-commit quality gates** — Husky + lint-staged run ESLint with `--max-warnings=0` on staged files; commits are blocked on any warning
- **Bundle optimization** — route-level code splitting + `react-syntax-highlighter/prism-light` (registers only used languages) keeps the initial chunk small

---

## Getting Started

**Prerequisites:** Node.js 20+

```bash
git clone https://github.com/kagegrifon/quiz-train.git
cd quiz-train
npm install
npm run dev
```

App runs at `http://localhost:5173`.

---

## Commands

| Command           | Description                                  |
|-------------------|----------------------------------------------|
| `npm run dev`     | Start development server (HMR)               |
| `npm run build`   | Type-check + production build                |
| `npm run preview` | Preview production build locally             |
| `npm run e2e`     | Run Playwright E2E tests (headless)          |
| `npm run e2e:ui`  | Open Playwright interactive test runner      |
| `npm run lint`    | ESLint check on the entire project           |
| `npm run knip`    | Detect unused files, exports, dependencies   |
| `npm run deploy`  | Build + publish to GitHub Pages              |

---

## Docs

| Document | Description |
|----------|-------------|
| [docs/architecture.md](docs/architecture.md) | FSD layer rules and current slices |
| [docs/data-model.md](docs/data-model.md)     | Question / Quiz interface format    |
| [docs/scoring.md](docs/scoring.md)           | Scoring logic (single & multi)      |
| [docs/reveal-modes.md](docs/reveal-modes.md) | Reveal mode behaviour               |
| [docs/storage.md](docs/storage.md)           | localStorage schema                 |
