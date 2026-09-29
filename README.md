# Angular Lab

A hands-on playground for learning Angular — every core concept as a real, editable page, not a slide.

**Live app:** https://youssefezzat17.github.io/angular-movie-app/

## What's here

Each topic below is a full lesson page under `src/app/pages/`: a plain-language explanation of *why* the concept exists and what problem it solves, a small animated diagram showing the actual direction data flows, and a live example you can edit and immediately see update in the browser.

| Topic | Route | Covers |
| --- | --- | --- |
| Data Binding | `/binding` | Interpolation, property binding, event binding, two-way binding |
| Component Communication | `/communication` | `@Input()`, `@Output()`, parent ↔ child |
| Directives | `/directives` | `*ngIf`, `*ngFor`, and a custom attribute directive |
| Angular Forms | `/forms` | Reactive forms vs. template-driven forms, validation |
| Signals | `/signals` | `signal()`, `computed()`, `effect()` |
| Fetch API & HTTP | `/movies` | `HttpClient`, services, a real public API |
| RxJS | `/rxjs` | Observables, operators (`map`, `filter`, `switchMap`, `debounceTime`…), memory leaks, the `async` pipe |

A small e-commerce demo (`/products`, `/favorites`) sits alongside the lessons — a "Demo App" in the nav — showing several of these concepts working together in one real feature, rather than a lesson in isolation.

## Stack

Angular 20 (standalone components, Signals, the new `@if`/`@for` control-flow syntax), Tailwind CSS, and RxJS. No backend — the Fetch API & HTTP lesson calls a real public API ([Studio Ghibli API](https://ghibliapi.vercel.app/films)), and everything else runs entirely client-side.

## Development server

```bash
npm install
ng serve
```

Open `http://localhost:4200/`. The app reloads automatically when you edit a source file — that's the point: change a component, save, and watch the concept it's teaching update live.

## Building

```bash
ng build
```

Build artifacts are written to `dist/angular-lab/`.

## Running unit tests

```bash
ng test
```

## Project structure

- `src/app/pages/` — one folder per lesson page (see the table above) plus the demo pages (`home`, `products`, `product-details`, `favorites`)
- `src/app/core/` — layout (`navbar`, `footer`, `toast`), models, and services (`CartService`, `FavoritesService`, `MovieService`, `ProductService`, `ToastService`)
- `src/app/shared/` — small components reused across lessons, including `FlowDiagramComponent` (the animated data-direction diagram) and `TitlePreviewComponent`
- `src/app/directives/` — the custom directives used in the Directives and Forms lessons

## Additional resources

- [Angular CLI command reference](https://angular.dev/tools/cli)
- [Angular documentation](https://angular.dev)

---

Made by **Youssef Ezzat (YE)**
