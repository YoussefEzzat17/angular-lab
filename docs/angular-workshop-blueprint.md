# Angular Fundamentals Workshop — Implementation & Teaching Plan

*Archived planning document · not yet implemented.* This blueprint describes an earlier "Nimbus Shop" workshop concept and no longer matches the current Angular Lab app (15 lessons under `/learn/<id>`). Kept for reference only; see the README for the current structure.

A single blueprint for two connected deliverables — a slide deck and a working Angular app — built so every taught concept has one exact, named place it lives in the code. Nothing below has been built yet; this plan is for review and approval.

**Key parameters:**
- Audience: fresh graduate
- Angular: standalone components, no NgModules
- Styling: Tailwind CSS
- Deck: ~40 slides, focused workshop
- App: Nimbus Shop — mini product dashboard

---

## 1. Learning journey

The learner is a fresh graduate: comfortable with HTML/CSS/JS and basic TypeScript, new to Angular. The journey stays hands-on throughout — every concept is seen live in the running app within minutes of being introduced, never left as an abstract slide.

| Module | Time | What happens |
|---|---|---|
| **0 · Orientation** | 10 min | Tour of the finished Nimbus Shop app running live. Learner sees the destination before touching code — reduces anxiety, gives every later concept a visual anchor. |
| **1 · Data Binding** | 65 min | Interpolation → property binding → event binding → two-way binding, each demonstrated on a real product card, image, button, and profile form. |
| **2 · Pipes** | 35 min | What/why, then built-ins (date, currency, case) applied to real product and profile data, closing with one custom pipe. |
| **3 · Routing** | 55 min | Routes, Router, RouterOutlet, RouterLink, navigation, route params, ActivatedRoute — built up into the app's full four-page navigation. |
| **4 · Capstone** | 25 min | Final challenge: learner builds a small new feature independently, combining all three topic areas. |
| **Wrap-up** | 10 min | Recap, resources, what to learn next (forms, services/DI, HttpClient, signals) as a teaser, not taught. |

**Stats:** ~3h20 total workshop length · 3 core topic areas · 3 guided mini exercises · 1 independent final challenge

### Teaching methodology, applied consistently

**Problem → Concept → Visual → Simple example → Code → Result → Real-world usage → Mini exercise → Apply to Nimbus Shop**

This 9-beat flow repeats for every subtopic. On the ~40-slide budget, adjacent beats are sometimes merged onto one slide (e.g. Problem+Concept, or Result shown inline under Code) — see section 9 (Slide-by-slide flow) for exactly which beats share a slide per subtopic.

---

## 2. Application concept

**Nimbus Shop** — a small, fictional storefront and account dashboard for curated lifestyle goods (mugs, notebooks, desk gear, plants — nothing that requires real product data or licensing). Deliberately generic so the UI stays simple, but real enough that every binding, pipe, and route has an obvious reason to exist.

**Why this concept works for teaching:**

- **Products** naturally need interpolation (name, description), property binding (image src, disabled state), event binding (add to cart), and both currency and date pipes.
- **A profile page** is the one place a fresh graduate expects a form — the natural home for two-way binding via `[(ngModel)]`.
- **Four distinct pages** give routing real weight: a list→detail drill-down (route params + ActivatedRoute), a nav bar (RouterLink + RouterOutlet), and a settings-style page reached by simple navigation.
- Small enough to fully build and screenshot in a day; polished enough to feel like a real product, not a toy.

---

## 3. Application features

**Data binding**
- Product cards (image, name, price, rating)
- Dynamic product image via `[src]`
- "Add to cart" button, disabled when out of stock
- Live cart count in the nav bar
- Profile form with live preview as you type

**Pipes**
- Currency pipe on every price
- Date pipe on "added on" / "member since"
- Uppercase pipe on category badges
- Lowercase pipe on tag chips
- Custom `stockStatus` pipe (In Stock / Low Stock / Out of Stock)

**Routing**
- Nav bar with RouterLink + active-link styling
- Home → Products → Product Details drill-down
- Route parameter, e.g. `/products/25`
- ActivatedRoute reads the id, loads that product
- Programmatic navigation ("Back to Products")
- Wildcard 404 page (stretch, reinforces routing)

---

## 4. Pages

| Page | Route | Purpose |
|---|---|---|
| **Home** | `/` | Hero banner, 1–2 featured products, CTA into Products. First page a learner sees — light on logic, mostly interpolation + property binding. |
| **Products** | `/products` | Grid of product cards. Main stage for data binding + pipes; links into Product Details. |
| **Product Details** | `/products/:id` | Full detail for one product, resolved from the route parameter. Main stage for route params + ActivatedRoute. |
| **Profile** | `/profile` | Editable user info (name, email, avatar URL, member-since date). Main stage for two-way binding and the date pipe. |
| **Not Found** *(stretch)* | `/**` | Simple wildcard page, only if time allows — reinforces that routing has a "catch-all" concept without adding new topics. |

**A note on scope: list rendering.** Product grids and the nav bar require Angular's `@for` control-flow block to render lists. This isn't one of the three named topics, so it will be shown only as "the syntax that loops," in one sentence, right when it's first needed (on the Products page) — never taught as its own module or slide sequence.

---

## 5. Angular concepts mapped to each feature

The authoritative map. Every subtopic below resolves to one exact component and one exact UI element — this table is also the seed of the deck ↔ app sync system in section 15.

| Concept | Feature / UI element | App location |
|---|---|---|
| Interpolation | Product name, description, price text, cart count | `pages/products/product-card.component.html` |
| Property binding | Dynamic `[src]` on product image; `[disabled]` on "Add to cart" | `pages/products/product-card.component.html` |
| Event binding | `(click)` on "Add to cart"; `(click)` on quantity stepper | `pages/products/product-card.component.ts` |
| Two-way binding | `[(ngModel)]` on profile name/email/avatar fields with live preview | `pages/profile/profile.component.html` |
| Date pipe | "Added on …" on Product Details; "Member since …" on Profile | `pages/product-details/…`, `pages/profile/…` |
| Currency pipe | Every displayed price | `pages/products/product-card.component.html` |
| Uppercase / lowercase pipe | Category badge (uppercase); tag chips (lowercase) | `pages/products/product-card.component.html` |
| Custom pipe | `stockStatus` — turns a stock number into a status label + color | `pipes/stock-status.pipe.ts` |
| Routes config | Four (or five, with 404) top-level routes | `app.routes.ts` |
| Router / RouterOutlet | Page area that swaps content | `app.component.ts` |
| RouterLink / active styling | Nav bar links (Home, Products, Profile) + cart icon | `core/layout/navbar.component.html` |
| Navigation (programmatic) | "View details" card click; "Back to Products" button | `pages/products/product-card.component.ts`, `pages/product-details/…` |
| Route parameters | `/products/:id`, e.g. `/products/25` | `app.routes.ts` |
| ActivatedRoute | Reads `id`, fetches the matching product for Product Details | `pages/product-details/product-details.component.ts` |

---

## 6. Suggested project structure

Standalone components throughout (Angular's current default — `bootstrapApplication`, no `AppModule`), Tailwind for styling, a tiny in-memory data service standing in for a backend.

```
src/
├── app/
│   ├── app.component.ts        // root shell: navbar + <router-outlet>
│   ├── app.routes.ts           // the 4–5 routes, incl. :id param
│   ├── app.config.ts           // provideRouter(), providers
│   │
│   ├── core/
│   │   ├── layout/
│   │   │   └── navbar.component.ts   // RouterLink, routerLinkActive, cart count
│   │   ├── models/
│   │   │   ├── product.model.ts
│   │   │   └── user.model.ts
│   │   └── services/
│   │       ├── product.service.ts    // mock catalog, getById(id)
│   │       └── cart.service.ts       // signal-based cart count
│   │
│   ├── pipes/
│   │   └── stock-status.pipe.ts      // custom pipe
│   │
│   └── pages/
│       ├── home/
│       │   └── home.component.ts
│       ├── products/
│       │   ├── products.component.ts       // grid, @for
│       │   └── product-card.component.ts   // binding + pipes epicenter
│       ├── product-details/
│       │   └── product-details.component.ts // ActivatedRoute epicenter
│       └── profile/
│           └── profile.component.ts         // two-way binding epicenter
│
├── assets/
│   └── products.ts              // ~8–10 mock products, plain TS array
├── index.html
├── main.ts                      // bootstrapApplication(AppComponent, appConfig)
├── styles.css                   // @tailwind base/components/utilities
└── tailwind.config.js
```

One component, one job: this structure means every slide's code sample can be a near-verbatim excerpt of a real file, with the file path shown as its caption (formalized in section 15).

---

## 7. UI/UX direction

**Visual language**
- Clean neutral background, one confident accent color, generous whitespace — Tailwind's default spacing scale used consistently (4/6/8/12 rhythm).
- Rounded-xl cards with a soft shadow for products; flat, borderless surfaces elsewhere.
- One accent color drives every interactive element (links, primary buttons, active nav state) so "what's clickable" is never ambiguous.
- Simple inline SVG icons (cart, star, arrow) — no icon library dependency, keeps the app self-contained and fast to set up.

**Layout & responsiveness**
- Product grid: 1 column mobile → 2 tablet → 3 desktop, via Tailwind's `grid-cols-*` + breakpoints.
- Sticky top nav bar, same on every page, so RouterLink active-state is always visible while teaching.
- Profile page as a single centered card/form — deliberately simple, since its job is to showcase two-way binding, not form design.
- Subtle hover/transition states only (e.g. card lift, button color shift) — no elaborate animation, keeps focus on Angular concepts.

**Guiding rule:** Polished, not over-engineered: every visual choice should make a binding, pipe, or route more obvious to a beginner — never compete with it for attention.

---

## 8. Presentation structure

~40 slides, sized for one focused ~2.5–3 hour workshop session, matching the module timing in section 1.

| Block | Slides | Contents |
|---|---|---|
| Title & orientation | 2 | Title slide; live tour framing (app itself is shown live, not on slides) |
| Module 1 — Data Binding | 13 | Intro/problem, interpolation, property binding, event binding, two-way binding, exercise, recap |
| Module 2 — Pipes | 10 | What/why, built-in pipes overview, date, currency, upper/lowercase, custom pipe, apply-to-app, exercise |
| Module 3 — Routing | 13 | SPA problem, routes config, Router/RouterOutlet, RouterLink/navigation, route params, ActivatedRoute, apply-to-app, exercise |
| Capstone & wrap-up | 3 | Final challenge brief, success criteria, recap + next-topic teaser |

**Stats:** 41 total slides (target) · 3 exercise slides · 9 "apply to Nimbus Shop" slides

---

## 9. Slide-by-slide teaching flow

The 9-beat methodology compressed to fit the slide budget. Beats in brackets share a single slide.

### Module 1 — Data Binding (13 slides)

| # | Slide | Beats covered |
|---|---|---|
| 1 | Why binding? The problem | Problem — static HTML can't reflect changing data (show a frozen mock product card) |
| 2 | Interpolation — concept + visual | Concept, Visual — `{{ }}` injects a value into text |
| 3 | Interpolation — code + result | Simple example, Code, Result |
| 4 | Interpolation in Nimbus Shop | Real-world usage, Apply to app — product name/price/description |
| 5 | Property binding — concept | Problem, Concept, Visual — attribute vs. property |
| 6 | Property binding — code + apply | Code, Result, Apply to app — `[src]`, `[disabled]` |
| 7 | Event binding — concept | Problem, Concept, Visual — listening for user actions |
| 8 | Event binding — code + apply | Code, Result, Apply to app — "Add to cart" click handler |
| 9 | Two-way binding — concept | Problem, Concept, Visual — combining property + event, `[(ngModel)]` banana-in-a-box |
| 10 | Two-way binding — code + apply | Code, Result, Apply to app — Profile form live preview |
| 11 | Side-by-side recap | All four binding types on one annotated screenshot of the product card |
| 12 | Mini exercise brief | Mini exercise — wishlist heart button |
| 13 | Module 1 recap | Key takeaways, transition to Pipes |

### Module 2 — Pipes (10 slides)

| # | Slide | Beats covered |
|---|---|---|
| 1 | The problem with raw data | Problem — a raw ISO date / float price shown next to the formatted version |
| 2 | What is a pipe? | Concept, Visual — the `value \| pipe` mental model, "a small transform in the template" |
| 3 | Built-in pipes overview | Concept — quick table of date/currency/case pipes |
| 4 | Date pipe | Simple example, Code, Result, Apply to app — "Added on"/"Member since" |
| 5 | Currency pipe | Code, Result, Apply to app — every product price |
| 6 | Uppercase / lowercase pipe | Code, Result, Apply to app — category badge, tag chips |
| 7 | Why build a custom pipe? | Problem, Concept — no built-in covers "stock status" |
| 8 | Custom pipe — code + result | Code, Result — `stockStatus` pipe, Apply to app |
| 9 | Mini exercise brief | Mini exercise — format "member since" + build an `initials` pipe |
| 10 | Module 2 recap | Key takeaways, transition to Routing |

### Module 3 — Routing (13 slides)

| # | Slide | Beats covered |
|---|---|---|
| 1 | One page pretending to be many | Problem, Concept — what an SPA is, why we need client-side routing |
| 2 | Defining routes | Concept, Visual — path → component mapping |
| 3 | Routes — code | Code — `app.routes.ts` for all four pages |
| 4 | Router & RouterOutlet | Concept, Visual, Code — the "slot" content swaps into |
| 5 | RouterLink | Concept, Code — declarative navigation vs. plain `<a href>` |
| 6 | RouterLink — result + apply | Result, Apply to app — the nav bar, active-link styling |
| 7 | Programmatic navigation | Concept, Code — `Router.navigate()`, Apply to app — "Back to Products" |
| 8 | Route parameters — concept | Problem, Concept, Visual — `/products/:id` → `/products/25` |
| 9 | ActivatedRoute — concept | Concept — how a component reads the live param |
| 10 | ActivatedRoute — code + result | Code, Result — Product Details resolving id 25 |
| 11 | Full navigation map | Real-world usage, Apply to app — diagram of all four/five routes |
| 12 | Mini exercise brief | Mini exercise — wildcard 404 route + "Page not found" link home |
| 13 | Module 3 recap | Key takeaways, transition to capstone |

---

## 10. Code examples that should appear in the presentation

Every snippet below is a real excerpt of an app file, never a simplified stand-in — enforced by the sync system in section 15.

**interpolation — product-card.component.html**
```html
<h3>{{ product.name }}</h3>
<p>{{ product.description }}</p>
```

**property binding — product-card.component.html**
```html
<img [src]="product.imageUrl" [alt]="product.name" />
<button [disabled]="product.stock === 0">Add to cart</button>
```

**event binding — product-card.component.ts**
```html
<button (click)="addToCart(product)">Add to cart</button>
```
```typescript
// in the component class
addToCart(product: Product) {
  this.cart.add(product);
}
```

**two-way binding — profile.component.html (needs FormsModule)**
```html
<input [(ngModel)]="user.name" name="name" />
<p>Preview: {{ user.name }}</p>
```

**pipes — product-card.component.html**
```html
{{ product.price | currency }}
{{ product.addedOn | date:'mediumDate' }}
{{ product.category | uppercase }}
```

**custom pipe — pipes/stock-status.pipe.ts**
```typescript
@Pipe({ name: 'stockStatus', standalone: true })
export class StockStatusPipe implements PipeTransform {
  transform(stock: number): string {
    if (stock === 0) return 'Out of stock';
    if (stock < 5) return 'Low stock';
    return 'In stock';
  }
}
```

**routes — app.routes.ts**
```typescript
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', component: NotFoundComponent },
];
```

**RouterOutlet + RouterLink — app.component.html / navbar.component.html**
```html
<!-- app.component.html -->
<app-navbar />
<router-outlet />

<!-- navbar.component.html -->
<a routerLink="/products" routerLinkActive="text-accent">Products</a>
```

**ActivatedRoute — product-details.component.ts**
```typescript
constructor(private route: ActivatedRoute, private products: ProductService) {}

ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.product = this.products.getById(id);
}
```

---

## 11. Mini exercises

**After Module 1 — Wishlist button**
Add a heart-shaped button to each product card: event binding toggles a `favorited` flag, property binding swaps the icon's fill/class, interpolation shows a live favorites count in the nav.

**After Module 2 — Format & build a pipe**
Reformat "member since" on Profile to a custom date format, then build a second tiny custom pipe — `initials` — that turns a full name into avatar initials.

**After Module 3 — 404 + programmatic return**
Wire up the wildcard route and NotFound page, then add a "Take me home" button using `Router.navigate(['/'])` instead of RouterLink, to feel the difference.

---

## 12. Final challenge

### Build the Favorites page — independently

Combine everything: add a `/favorites` route and nav link (routing), render only products the learner favorited earlier (data binding, reusing the product card), and show each one's price and "added to favorites on" date using the currency and date pipes (pipes). Stretch goal: reuse the custom `stockStatus` pipe here too.

Deliberately under-specified on exact markup — the learner should assemble it from patterns already seen three times over in the workshop, not from new instructions.

---

## 13. Acceptance criteria

**Deck**
- [ ] ~35–45 slides, matches the section 8/9 outline
- [ ] Every subtopic visibly follows Problem→Concept→...→Apply, even when beats share a slide
- [ ] Every code slide is a verbatim excerpt of a real app file, with its file path shown
- [ ] Every "Result" slide is a real screenshot of the running app, not a mockup
- [ ] Three mini-exercise slides + one final-challenge slide present

**Application**
- [ ] Builds and runs with zero console errors/warnings
- [ ] Standalone components only, no NgModules
- [ ] Tailwind CSS only — no Material, no Bootstrap
- [ ] All four core pages implemented and reachable via the nav
- [ ] Route parameter demonstrated with a real example (e.g. `/products/25`)
- [ ] Custom pipe implemented and used at least once
- [ ] Responsive from mobile to desktop

---

## 14. Definition of Done

| Deliverable | Done means |
|---|---|
| Angular app | All pages built, all mapped concepts (section 5) implemented at their named location, app deployed/runnable locally with one documented command, no TODOs left in demoed code paths. |
| Slide deck | Final slide count within range, every code/result slide verified against the actual running app in the same sitting it was captured, speaker-notes added for timing, exported as a polished .pptx. |
| Sync | Section 15's mapping table has zero unresolved rows — every taught example traces to one existing file and one captured screenshot. |
| Review pass | A full dry-run of the workshop flow (deck + live app switching) completes in the ~3h20 target without dead links, broken routes, or stale screenshots. |

---

## 15. How the deck and the app stay synchronized

This is the part that keeps two deliverables from drifting apart. Four concrete mechanisms, used together:

**1 — Build order**
The app is built *module by module*, ahead of its slides: implement all of Module 1's app features first, screenshot them, *then* write Module 1's slides from that working code. Repeat per module. Slides are never written from imagined code.

**2 — One mapping table, two consumers**
The table in section 5 is the single source of truth. Both the app's component structure and the deck's "Apply to app" slides are built directly from its rows — not from separate judgment calls.

**3 — File-path captions on every code slide**
Every code slide carries a small monospace caption with the exact file path (as shown throughout section 10), so mid-workshop the presenter can flip straight to that file in the editor or that exact screen in the running app.

**4 — Verbatim naming, real screenshots**
Variable and method names on slides are copy-pasted from the app, never simplified. "Result" slides are screenshots taken from the app in that exact state — no illustrated mockups standing in for real UI.

### Slide topic ↔ app location — the sync map

| Presentation example | Exact app location | Screenshot subject |
|---|---|---|
| Interpolation | `product-card.component.html` | Products grid, any card's text |
| Property binding | `product-card.component.html` | Product image + a disabled "Add to cart" button |
| Event binding | `product-card.component.ts` | Cart count changing after a click |
| Two-way binding | `profile.component.html/.ts` | Profile form + live preview panel |
| Date / currency pipes | `product-card.component.html` | A product card showing formatted price + date |
| Upper/lowercase pipes | `product-card.component.html` | Category badge + tag chips |
| Custom pipe | `pipes/stock-status.pipe.ts` | Stock badge in three states (in/low/out of stock) |
| Routes / RouterOutlet | `app.routes.ts`, `app.component.html` | Full app with nav bar, on any page |
| RouterLink + active state | `navbar.component.html` | Nav bar with the current page visibly highlighted |
| Route params + ActivatedRoute | `product-details.component.ts` | Product Details for `/products/25`, id visible in the URL bar |
| Programmatic navigation | `product-details.component.ts` | "Back to Products" button |

**Change-control rule:** If any app file in this table changes after its slides are written, the corresponding row is re-verified (code excerpt re-pasted, screenshot re-taken) before the deck is considered done — this is the last item in the Definition of Done above.

---

## Ready for review

This plan covers the learning journey, the Nimbus Shop app concept and features, the concept-to-code mapping, project structure, UI direction, the ~41-slide deck outline with full slide-by-slide flow, code examples, exercises, the final challenge, acceptance criteria, DoD, and the deck↔app sync system.

**Nothing has been built yet.** Once approved — or adjusted — the next step is implementation: the Angular app first (module by module, per the sync system above), then the PowerPoint deck built from the working app.
