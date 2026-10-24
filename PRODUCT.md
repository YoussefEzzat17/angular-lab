# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Self-taught beginners: fresh graduates and junior developers who know HTML, CSS, JavaScript and basic TypeScript but are new to Angular. They learn alone, at their own pace, usually in short sessions, with no instructor to ask when something doesn't click. Many are non-native English speakers.

## Product Purpose

Angular Lab teaches modern Angular through 18 interactive lessons. Each lesson explains why a concept exists, shows it working, and lets the learner change it. Success means a beginner finishes a topic able to explain what the concept does and why, passes its final quiz, and comes back for the next one.

## Positioning

Every concept is a live, poke-able example rather than a slide or a page of prose. Learners click, edit and watch real Angular update: animated diagrams, visualisers (change detection tree, DI tree, RxJS marbles, interceptor chain), and working demos. Each concept is explained *why* first, *how* second. Docs sites and video courses describe the concept. Angular Lab runs it in front of the learner.

## Operating Context

- Self-paced: home page → lesson overview → short sections (concept / try-it / reference) → final quiz, which unlocks once every section is done.
- Lessons follow a recommended path in five groups: Fundamentals, Forms & Navigation, Reactivity, Services & Data, Performance. Next / Previous follow that path.
- Supporting surfaces: dashboard (streak, level, XP, progress), journey map, history, saved sections, command palette (⌘/Ctrl+K), glossary tooltips, first-visit onboarding and tour.
- A small movie-and-series demo app shows several concepts working together in one real feature.
- Used on desktop and phone (bottom navigation and a topic sheet on mobile).

## Capabilities and Constraints

- Angular 20 only: standalone components, signals, signal inputs, `@if` / `@for` / `@switch`. No NgModules, no legacy patterns taught.
- No backend, ever. Everything runs client-side on GitHub Pages; persistence is `localStorage` through `safe-storage.ts`. The feedback form uses EmailJS with only the public key.
- `core/data/topics.ts` is the single source of truth for lessons, sections, objectives, levels, prerequisites and groups.
- Quizzes: 6 random questions from a bank of 10–15, 75% to pass, best score kept.
- Gamification: 10 XP per section, 50 for passing a quiz, 25 more for full marks; 7 levels and 8 badges.
- The Resource API lesson covers APIs that are experimental in Angular 20.

## Brand Commitments

- Name: Angular Lab.
- The gold accent and the CSS-variable light/dark token system in `src/styles.css`, mapped into Tailwind, are binding. Light and dark themes share the same classes and follow the system preference unless the learner toggles.
- Voice: plain, friendly English that non-native speakers can follow. Avoid jargon unless it's explained; hard words get glossary explanations.

## Evidence on Hand

- README screenshots in `docs/screenshots/` (home light/dark, dashboard, quiz, save-for-later, lessons, mobile).
- Live demo: https://youssefezzat17.github.io/angular-lab/
- App icons and OG image in `public/`.
- `docs/angular-workshop-blueprint.md` and the `.pptx` deck are an archived earlier concept ("Nimbus Shop"), not current product truth.
- No testimonials, user counts, learner outcomes or press exist. Do not fabricate them.

## Product Principles

1. Show it running. A concept isn't taught until the learner can see it work and change it.
2. Why before how. Every section starts from the problem the concept solves.
3. Beginner-first language. If a non-native beginner would stumble on a word, explain it or replace it.
4. Small steps, visible progress. Short sections, clear completion, and rewards that make coming back easy.
5. Modern Angular only. Teach today's idioms; never spend learner attention on legacy patterns.

## Accessibility & Inclusion

- Fully keyboard navigable; every control has an accessible name, checked by `testing/a11y-audit.ts` on every page and lesson section.
- Respect `prefers-reduced-motion` for all animation, diagrams and confetti.
- WCAG AA contrast in both themes (e.g. text on gold buttons was raised to 4.7:1).
- Works down to phone width.
- Plain language for non-native English speakers.
