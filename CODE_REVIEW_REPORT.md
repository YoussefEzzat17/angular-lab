# Angular Lab — Code Review Report

Scope: `src/app/` (286 `.ts` files, about 38k lines). No source files were modified; no build or test commands were run. Line numbers refer to the files as they were during the review.

## Review coverage (read this first)

- **Read in full:**
  - all of `core/services/*.ts` except spec files
  - `core/guards`, `learn/learn.routes.ts`, `learn/learn.guards.ts`
  - `app.ts`, `app.config.ts`, `app.routes.ts`
  - `directives/*`, `pipes/*`
  - `learn/player/lesson-player.component.ts`, `learn/quiz/quiz.component.ts`
  - `shared/code-block.directive.ts` (from line 130)
  - the relevant parts of `navbar`, `search-palette`, `topics-sheet`, `feedback`, `movies`, `topic-complete`
- **Pattern-scanned only (not read line by line):** the ~60 large `pages/*` lesson components, the quiz bank data files, `topic-illustration.component.ts`, `topics.ts`, and the spec files. I scanned them with searches for:
  - `innerHTML` and `bypassSecurityTrust`
  - `subscribe`, timers and listeners
  - `any` and casts
  - `console.*`
  - lifecycle decorators
  - missing spec counterparts
- Findings in `pages/*` therefore cover leak, security and typing patterns only. A full read of those files may turn up more.
- Spec quality was assessed by existence and size, not by reading each test.

---

## Critical

None found. There is no exploitable XSS, and there are no secrets beyond the public EmailJS keys listed under Medium.

---

## High

### H1. Movies page gets stuck on "loading" when the request fails
- **File:** `src/app/pages/movies/movies.component.ts:320-330` (template at ~182-186)
- **Issue:**
  - `isLoading` is reset only in `complete:`. An Observable that errors never calls `complete`, so `isLoading` stays `true`.
  - The template checks `@if (isLoading())` before `@else if (error())`, so the error message is never shown.
  - Any network or API failure leaves the spinner on forever. The page also has no cancellation on destroy.
- **Fix:** use `finalize(() => this.isLoading.set(false))`, or set `isLoading` to `false` in both `next` and `error`. Add `takeUntilDestroyed()`, or switch to `rxResource`/`httpResource`.

### H2. Duplicate "section-done" activity and history entries
- **File:** `src/app/core/services/progress.service.ts:90-97`
- **Issue:**
  - `completeSection` patches progress idempotently (it returns the same object if the section is already done), but `addActivity` runs unconditionally.
  - `LessonPlayerComponent.completeAndNavigate` and `goToQuiz` (`learn/player/lesson-player.component.ts:251-260`) call it every time the learner presses "Next" or "Quiz" on an already-completed section.
  - The result is repeated history entries, wasted storage, and the 200-entry `ACTIVITY_LIMIT` evicting real history.
- **Fix:** have `patch` report whether it changed anything, and add the activity only when the section was newly completed.

### H3. Quiz can hang forever and has no error handling
- **File:** `src/app/learn/quiz/quiz.component.ts:109-121`
- **Issue:**
  - `startQuiz()` awaits `quizService.load()` (a dynamic `import()`) with no `try/catch`.
  - A failed chunk load (offline, deploy mismatch) rejects `ngOnInit`, and the phase stays `'loading'` forever with no retry.
  - Rapid retry clicks can interleave two `startQuiz()` calls, because nothing guards the awaited load against stale results.
- **Fix:** add `try/catch` with an `'error'` phase and a retry button, and ignore stale results (a request token). Consider `resource()`.

### H4. `/learn/:topic/complete` is unguarded
- **File:** `src/app/learn/learn.routes.ts:63`, `learn/quiz/topic-complete.component.ts`
- **Issue:**
  - `quiz` has `quizUnlockedGuard`, but `complete` has none.
  - Anyone can open it by URL for any topic and see "You've completed all sections and passed the quiz", with a confetti-style celebration, without having done either.
- **Fix:** add a `canActivate` guard that checks `progress.status(topicId) === 'completed'` and redirects to the overview otherwise.

---

## Medium

### M1. Persisted state is trusted without validation (crash on corrupt or old data)
- **Files:**
  - `core/services/progress.service.ts:150-158`: only `version === 2` is checked, then the value is cast to `ProgressStateV2`. A stored `{version:2}` without `topics` or `activity` makes `Object.values(undefined)` and `.slice` throw at service construction, which breaks the whole app because `App` injects `GamificationService`.
  - `core/services/profile.service.ts:16-18`: `readStored<ProfileData>(...)` is not merged with `DEFAULT_PROFILE`. A partial object leaves `activeDays` undefined, so `computeStreak` throws.
  - `core/services/bookmark.service.ts:9`: an array is assumed with no check (a non-array breaks `.some`).
  - `core/services/sidebar-state.service.ts:8`: no type check on the stored value.
  - `core/services/progress-migration.ts:7-12`: `JSON.parse(raw)` is returned as `string[]` unchecked. A non-array value makes `new Set(...)` throw or misbehave.
  - `core/services/gamification.service.ts:67`: `stored.badges` is assumed to be an array.
- **Fix:** add runtime validators (a small guard function or schema) and fall back to defaults. Merge stored data over defaults.

### M2. Side effects inside signal updater functions
- **Files:**
  - `progress.service.ts:132-148`: `writeStored` runs inside `state.update`
  - `bookmark.service.ts:19-35`: same pattern
  - `profile.service.ts:42`: same pattern
  - `favorites.service.ts:22-31`: `addedDates` (a non-reactive `Map`) is mutated inside `ids.update`
- **Issue:** updater functions should be pure. These are also inconsistent: some services persist in an `effect()`, others inside the updater.
- **Fix:** compute the new value, `set` it, and persist from a single `effect` (or after `set`). Make `addedDates` part of the signal state, for example a `signal<Record<number,string>>`.

### M3. Two sequential state writes, two persistence writes per action
- **File:** `progress.service.ts:90-97, 112-124`
- **Issue:** `completeSection` and `recordQuizAttempt` call `patch` and then `addActivity`, each doing a `state.update` and a full JSON `localStorage` write.
- **Fix:** do a single combined update.

### M4. Streak/"yesterday" calculation ignores the injected clock and DST
- **File:** `core/services/clock.ts:19-37`
- **Issue:**
  - `computeStreak` uses `Date.now() - 86400000` instead of the `CLOCK` token or the `today` argument.
  - This breaks the testability that `CLOCK` was introduced for.
  - On a DST change day the calendar day can be 23 or 25 hours, so "yesterday" can be wrong near midnight.
  - `new Date('YYYY-MM-DD')` parses as UTC while `dayKey` is local. The `Math.round` hides this, but it is fragile.
- **Fix:** derive yesterday from the `today` string using calendar arithmetic, for example `new Date(y, m-1, d-1)`. Compare day keys numerically with UTC date math.

### M5. Gamification inconsistencies
- **File:** `core/services/gamification-rules.ts:75-87, 102-111`
- **Issue:**
  - `topicXp` requires `completedVia === 'quiz'` for the perfect bonus, but the "perfectionist" badge (`perfectQuizzes`) counts any `bestScore >= draw`.
  - `bestScore >= QUIZ_RULES.draw` assumes a perfect score equals the draw size. It breaks if a bank has fewer questions than `draw`.
  - `toggleManualComplete` (progress.service.ts:103-110) clears `completedVia`. Un-completing a quiz-passed topic silently removes its quiz XP while `bestScore` stays.
- **Fix:** compare against `attempt.total`, and define one "perfect" predicate used by both XP and badges. Do not clear `completedVia` when the completion came from a quiz.

### M6. Celebration state lost when storage is unavailable
- **File:** `core/services/gamification.service.ts:66-95`
- **Issue:**
  - `readStored` returns `null` when storage is blocked, so every effect run takes the "first run" branch, writes nothing, and never celebrates.
  - Conversely, `writeStored` happens before the toasts, and the first-run branch records the current badges silently.
- **Fix:** keep the celebrated set in an in-memory signal as well as storage.

### M7. Timer not tracked or cleared in `ToastService.dismiss`
- **File:** `core/services/toast.service.ts:61`
- **Issue:** the removal `setTimeout` is never stored, so it fires after the service or test teardown. Specs need fake timers to avoid cross-test leaks.
- **Fix:** track the handle, or use a `DestroyRef`/`animationend` approach. The `TOAST_LEAVE_MS` comment says it must be kept in step with a CSS animation, which is fragile coupling.

### M8. Hard-coded third-party credentials/IDs and no abuse protection
- **File:** `core/services/feedback.service.ts:3-5`
- **Issue:**
  - The EmailJS service ID, template ID and public key are committed in source. The public key is designed to be public, but the IDs let anyone send mail through the account.
  - The client-side cooldown (`feedback.component.ts:208`) is trivial to bypass.
  - The error is logged with `console.error` and the raw error object (feedback.component.ts:197).
- **Fix:** move the IDs to environment config and enable EmailJS domain allow-listing and rate limits. Consider a server proxy with CAPTCHA.

### M9. `MovieService`: URL hard-coded, ID not encoded
- **File:** `core/services/movie.service.ts:10-20`
- **Issue:**
  - The API URL is hard-coded (no environment config).
  - `getMovieById(id)` interpolates the raw string into the URL path. A user-entered ID such as `../` or `?x=` changes the request target.
  - The file has stray blank lines and trailing whitespace.
  - The third-party host (`ghibliapi.vercel.app`) is a single point of failure for the Movies lessons.
- **Fix:** use `encodeURIComponent(id)` and inject the base URL via an `InjectionToken`.

### M10. Duplicate/dead directive with the same selector and class name
- **Files:** `src/app/directives/number-only.directive.ts` and `src/app/directives/numbers-only.directive.ts`
- **Issue:**
  - Both declare `NumbersOnlyDirective` with selector `[appNumbersOnly]`.
  - Only `numbers-only` is imported (`pages/directives/directives.component.ts:5`). `number-only` (typo in the file name) is dead code.
  - If both were ever imported, Angular would apply the directive twice.
  - The dead one also strips input by mutating `value` without dispatching `input`, so form control and model values go out of sync.
- **Fix:** delete `number-only.directive.ts`.

### M11. Unrouted/dead pipe, with no tests
- **File:** `src/app/pipes/stock-status.pipe.ts`
- **Issue:**
  - `StockStatusPipe` is not imported anywhere outside its own file.
  - It is a single minified line, which hurts readability.
  - `stock === 0` ignores negative stock: -3 returns "Limited passes".
  - It has no spec, and `standalone: true` is redundant in Angular 22.
- **Fix:** delete it, or format it, use `stock <= 0`, and add a spec.

### M12. Missing spec files for logic-bearing code
87 non-data files have no `.spec.ts`. The ones that matter most:
- **Routing and guards:** `learn/learn.guards.ts` (redirect logic including the empty-sections case), `learn/learn.routes.ts`, `app.routes.ts`
- **Services:** `profile.service.ts` (initials, active-day recording, 400-day cap), `favorites.service.ts`, `theme.service.ts`, `feedback.service.ts`, `safe-storage.ts`, `demo-auth.service.ts`
- **Quiz components:** `learn/quiz/quiz.component.ts`, `quiz-question.component.ts`, `quiz-result.component.ts`, `topic-complete.component.ts`
- **Layout:** `core/layout/navbar.component.ts`, `learn/player/section-nav-bar.component.ts`
- **Directives and pipes:** `directives/*`, `pipes/*`
- **Other:** `core/models/learning.models.ts`, `core/data/topic-objectives.ts`
- **Edge cases missing from the existing specs I scanned:**
  - corrupt or partial `localStorage`
  - storage-blocked behaviour
  - quiz load failure
  - DST streaks
  - duplicate section completion (H2)
- **Fix:** add the missing specs, starting with the guards, `ProfileService`, `QuizComponent` and `safe-storage`.

### M13. Unvalidated `:section` route parameter
- **File:** `learn/learn.routes.ts:65-69`, `learn/player/lesson-player.component.ts:182-192`
- **Issue:**
  - `:section` matches any string. For topics rendered by `LessonPlayerComponent`, an unknown section silently falls back to the last visited or first section while the URL keeps the bad value. That produces non-canonical URLs, wrong breadcrumb and tab state, and the previous section being "visited".
  - Non-player topics ignore the param entirely, so `/learn/pipes/anything` renders the full page.
- **Fix:** add a `canMatch`/`canActivate` that redirects unknown section ids to the overview or the first section. Use a `matcher` or `ResolveFn`.

### M14. `any` and loose typing in the route table
- **File:** `learn/learn.routes.ts:9, 67`
- **Issue:**
  - `TOPIC_LOADERS` is typed `Record<TopicId, () => Promise<unknown>>`, which is then cast with `as () => Promise<any>`.
  - `t.id as TopicId` is redundant.
- **Fix:** type it as `() => Promise<Type<unknown>>` (`Type` from `@angular/core`), which removes both casts.

### M15. Duplicate loader maps keyed by topic
- **Files:** `learn/learn.routes.ts:9-44` (`TOPIC_LOADERS`) and `core/services/quiz.service.ts:5-40` (`QUIZ_BANK_LOADERS`)
- **Issue:** both are hand-maintained 33-entry maps, so adding a topic means editing at least three places (`topics.ts`, both maps) with only a type check to catch omissions.
- **Fix:** attach `loadComponent` and `loadQuiz` to the topic definition, or generate both from one registry.

---

## Low

### L1. `LessonPlayerComponent` uses plain arrow functions as derived state
- **File:** `learn/player/lesson-player.component.ts:176-214`
- **Issue:**
  - `topicMeta`, `activeSectionId`, `navItems` and the rest are arrow functions rather than `computed()`.
  - Each is re-run on every template evaluation. `topicMeta()` runs about 15 times per pass, each calling `TOPICS.find`, and `navItems()` rebuilds its array every pass.
  - `track sec.appLessonSection()` is fine, but `navItems()` returns new objects each time.
- **Fix:** convert them to `computed()`.

### L2. Unhandled router navigation promises
- **Files:** `lesson-player.component.ts:248, 254, 259`, `quiz.component.ts:138`, `search-palette.component.ts:112`
- **Issue:** `router.navigate(...)` and `navigateByUrl(...)` promises are not awaited or handled.
- **Fix:** `void`-mark them, or handle a rejected or false result.

### L3. Selector string built without escaping
- **File:** `lesson-player.component.ts:286`
- **Issue:** `querySelector(`[data-section-tab="${id}"]`)` interpolates the section id unescaped. The ids come from static data today, so this is safe now but fragile.
- **Fix:** use `CSS.escape`.

### L4. Direct `window`/`document`/`navigator` access
- **Files:**
  - `lesson-player.component.ts:270` (`window.matchMedia`)
  - `navbar.component.ts:312-322` (`window.innerWidth`, `document.body.style.overflow` in an effect)
  - `theme.service.ts:27` (`document.documentElement`)
  - `safe-storage.ts`, `progress-migration.ts`, `theme.service.ts` (`localStorage`)
  - `gamification.service.ts:27` (`matchMedia`)
  - `code-block.directive.ts:169` (`navigator.platform`, which is deprecated)
- **Issue:** these break under SSR and prerendering. The app ships an SSR lesson, so that is relevant if SSR is ever enabled. `ThemeService` and `ProgressMigration` also bypass the shared `readStored`/`writeStored` wrappers.
- **Fix:** inject `DOCUMENT` and `PLATFORM_ID`, and route all storage through `safe-storage`.

### L5. `NavbarComponent` manual subscription and `ngOnDestroy`
- **File:** `core/layout/navbar.component.ts:261-263, 323-326`
- **Issue:** it stores a `Subscription` and unsubscribes by hand. The sibling `topics-sheet.component.ts:125-127` already uses `takeUntilDestroyed`.
- **Fix:** use `takeUntilDestroyed(inject(DestroyRef))`. Also, three body-level `@HostListener('document:click')` handlers re-run change detection on every click, so consider the `host` metadata field and the `outsideClick` approach.
- **Related:** `FeedbackComponent` keeps `ngOnDestroy` plus an `Interval` handle. A `DestroyRef` callback would be tidier.

### L6. Decorator-based `@HostListener`, `@Input` in teaching samples, and inconsistent style
- **Files:** `directives/*`, `navbar`, `search-palette`, `topics-sheet`
- **Issue:**
  - The codebase otherwise uses signals (`input()`, `output()`), so `@HostListener` is inconsistent. Prefer the `host: {}` metadata.
  - `highlight.directive.ts` and the dead `number-only.directive.ts` use untyped `ElementRef` (so `nativeElement` is `any`) and no `readonly`.
  - `pages/devtools/devtools.component.ts:277` has `@Input() name: any;` and `template-tools.component.ts:304` has `TemplateRef<any>`. If these are demo snippets in a string, ignore them. If they are live code, tighten the types.
- **Fix:** use `ElementRef<HTMLElement>`, `readonly`, and `host`.

### L7. Magic colours and styling in a directive
- **File:** `directives/highlight.directive.ts:11`
- **Issue:** a hard-coded `#7c3aed` is set by direct DOM style mutation. It should be a CSS class or a themeable CSS variable, since the app has light and dark themes.

### L8. Misleading names
- **Files:**
  - `core/services/cart.service.ts`: `CartService` is a watchlist (`WATCHLIST_KEY`), and its `Product`/stock logic is cart vocabulary
  - `bookmark.service.ts:11`: `all = computed(() => this.items())` is a pointless wrapper over `items`
  - `learning.facade.ts:18-32`: most members are pure pass-throughs that just alias the underlying service signals
- **Fix:** rename `CartService` to `WatchlistService`, and expose `items.asReadonly()`.

### L9. Formatting/readability
- **Files:** `core/services/product.service.ts` (two-line minified file), `pipes/stock-status.pipe.ts` (single line), `movie.service.ts` (stray blank lines), `directives/*.ts` (no trailing newline, a stray `// numbers-only.directive.ts` header)
- **Fix:** run Prettier (a config check in CI would catch these).

### L10. Product data imported from outside `app/`
- **File:** `core/services/product.service.ts:1` imports `../../../assets/products`
- **Issue:** a TypeScript data file lives in `assets/`, and a TS data file is bundled rather than served. It also depends on external Unsplash image URLs with no `NgOptimizedImage` `priority`/`loader` control from here.
- **Fix:** move the data into `app/core/data/`.

### L11. `crypto.randomUUID()` requires a secure context
- **File:** `core/services/quiz.service.ts:76`
- **Issue:** it is undefined on plain `http://` hosts other than `localhost`, so grading throws and the attempt is lost.
- **Fix:** add a fallback ID generator.

### L12. Edge cases in `QuizService`
- **File:** `core/services/quiz.service.ts:49-81`
- **Issue:**
  - `grade` divides by `drawn.length`, so `total === 0` gives `NaN >= passRatio` which is `false` (harmless but silent).
  - If a bank has fewer than `draw` questions, quizzes are shorter, yet the "perfect" checks assume `draw` (see M5).
  - There are two copies of the Fisher–Yates shuffle (`draw` and `shuffleChoices`).
- **Fix:** extract one `shuffle(arr, random)` helper and assert bank size at load time.

### L13. Quiz answers and answer keys ship in the client bundle
- **File:** `core/data/quizzes/*.ts`
- **Issue:** the correct answers are inspectable, and quizzes can be retaken without limit. That is acceptable for a self-study app but it means quiz XP and badges are trivially gameable. State this deliberately, or do not present XP as meaningful.

### L14. `ProgressService.load()` writes during construction
- **File:** `progress.service.ts:155-158`
- **Issue:** when no v2 data exists, it runs the migration and immediately writes the result in a property initialiser. The legacy keys are never removed, so the migration re-runs and re-seeds every time the v2 key is missing. For example, after `reset()` clears state and the user clears only the v2 key.
- **Fix:** delete or mark the legacy keys after a successful migration.

### L15. `ProfileService` module-level default timestamp
- **File:** `profile.service.ts:8-11`
- **Issue:** `DEFAULT_PROFILE.createdAt = new Date().toISOString()` is evaluated once at module load, and the array and object are shared by reference. It is not currently mutated, but `activeDays: []` is a shared reference.
- **Fix:** make it a factory function.

### L16. `app.config.ts` choices
- **File:** `app.config.ts`
- **Issue:**
  - `provideZoneChangeDetection({ eventCoalescing: true })` keeps zone.js (`zone.js ~0.15`) in a signals-first v22 app where the lessons teach zoneless and OnPush. Confirm it is intentional.
  - There is no global `ErrorHandler`, no `withPreloading`, no scroll restoration (`withInMemoryScrolling`), and no `withViewTransitions`. These are optional, but for an app of ~33 lazy topics, preloading and scroll behaviour are worth a decision.
  - `HomeComponent` and `SiteLayoutComponent` are eagerly imported in `app.routes.ts`. `TOPICS` (a 469-line data module) is in the main bundle.
- **Fix:** document or change these choices.

### L17. `console.*` left in non-demo code
- **Files:** `pages/feedback/feedback.component.ts:197` (`console.error`). The `console.log` calls in `signals-playground.component.ts:144,405` and `lifecycle.component.ts:302,308` look like deliberate lesson demos, but they do run in production.
- **Fix:** route app errors through an `ErrorHandler`/logger service, and confirm the demo logs are intended.

### L18. `CodeBlockDirective` hardening notes (no vulnerability found)
- **File:** `shared/code-block.directive.ts:62-63, 180, 301-309`
- **Issue:**
  - `pre.innerHTML = highlight(...)` is safe today because `highlight()` HTML-escapes `&`, `<` and `>` before inserting spans, and all `[appCode]` sources are static or quiz data.
  - It is a safe-by-convention sink: any future change to the escaping order, or any token regex that emits captured text into an attribute, would create an XSS. A unit test asserting that `<img onerror>` input stays inert would pin this down.
  - `setCopyState` uses `innerHTML` with constant icon strings only (safe).
  - Several `!` non-null assertions (`this.panel!`, `copyButton!`, `status!`) depend on call order.
- **Fix:** add the escaping test, and build the DOM nodes (or use `textContent` and SVG nodes) instead of `innerHTML`.

### L19. Unvalidated `routerLink`/dynamic path data
- **File:** `core/services/activity-history.ts:73-76`
- **Issue:** `activityLink` builds a path from stored `topicId`/`sectionId` values that come from `localStorage`, which is user-editable. It only produces a router link (no code execution), but a tampered ID leads to the 404 page, or to the issue in M13.

---

## Security summary

- **No `bypassSecurityTrust*` calls** exist in app code. Matches are only lesson text and code samples in `pages/security`.
- **`[innerHTML]`** is used once as a live binding (`pages/security/security.component.ts:90`), and Angular sanitizes it. It is the intentional demo.
- **Direct `innerHTML` assignments** are in `code-block.directive.ts` only (escaped; see L18).
- **Real exposure:** the EmailJS identifiers (M8) and unvalidated `localStorage` data (M1).

## Suggested order of work
1. **First:** H1 (movies stuck loading), H2 (duplicate activity), H3 (quiz load error), H4 (`complete` route guard).
2. **Next:** M1 (storage validation) and M2/M3 (pure updaters, one write per action), then M4–M6.
3. **Cleanup:** delete the dead `number-only.directive.ts` and `StockStatusPipe` (M10, M11), then add the specs in M12.
