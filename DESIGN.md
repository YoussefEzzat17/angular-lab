---
name: Angular Lab
description: A warm, lamplit workbench for learning modern Angular by poking at live examples.
colors:
  workshop-night: "#0c0a09"
  oiled-walnut: "#1c1917"
  bench-top: "#292524"
  iron-rule: "#44403c"
  pencil-grey: "#a8a29e"
  chalk: "#f5f5f4"
  lamp-brass: "#c9a263"
  lamplight: "#dbb877"
  candle-wax: "#e8d3a6"
  burnished-brass: "#966c2c"
  burnished-brass-deep: "#805b24"
  claret: "#e0949e"
  claret-panel: "#3b141b"
  patina: "#6ee7b7"
  patina-panel: "#022c22"
  ember: "#fcd34d"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1
  headline:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.11
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.05em"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.625
rounded:
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
components:
  button-primary:
    backgroundColor: "{colors.burnished-brass}"
    textColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.burnished-brass-deep}"
  button-secondary:
    textColor: "{colors.pencil-grey}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.bench-top}"
  card:
    backgroundColor: "{colors.oiled-walnut}"
    rounded: "{rounded.xl}"
    padding: "16px"
  panel:
    backgroundColor: "{colors.oiled-walnut}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  dialog:
    backgroundColor: "{colors.oiled-walnut}"
    rounded: "{rounded.3xl}"
    padding: "32px"
  input:
    backgroundColor: "{colors.oiled-walnut}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.xl}"
    padding: "0 12px"
    height: "44px"
  chip:
    textColor: "{colors.lamplight}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  nav-item-active:
    textColor: "{colors.lamplight}"
    rounded: "{rounded.xl}"
  code-block:
    backgroundColor: "{colors.workshop-night}"
    textColor: "{colors.candle-wax}"
    typography: "{typography.code}"
    rounded: "{rounded.xl}"
    padding: "16px"
---

# Design System: Angular Lab

## Overview

**Creative North Star: "The Lamplit Workbench"**

Angular Lab is a warm, dark workshop late in the evening. Brass lamps light the bench, the tools are laid out within reach, and gold marks the one thing that matters right now. The surfaces are walnut and iron rather than glass and chrome. Everything is warm-tinted: the neutrals lean brown, never blue-grey, and even the error tone is wine instead of alarm red. The workbench is where things get built. The live examples, visualisers and diagrams are the work on the bench, and the interface around them is the bench itself: sturdy, familiar and out of the way.

The feel is friendly and tactile. Controls are generously rounded, large enough for a thumb (44px), and respond when touched. Cards sit up off the bench on soft shadows and lift a little more under the hand. Progress is rewarded with brass: badges, rings, XP and the occasional burst of confetti. Density is moderate. Most copy is set small (14px), so lessons hold a lot of information without feeling crowded, and large type is kept for page titles and the home hero.

The workshop also has a daylight mode. The same tokens repaint to warm parchment with darker brass, and every component works in both without special-casing. Some decorative panels, such as the home hero, stay lamplit whatever the theme.

**Key Characteristics:**
- Warm brown-black neutrals (stone) and a single brass/gold accent; no cool greys, no second brand hue.
- One solid brass button per view. Gold elsewhere is text, tint or outline.
- Rounded, thumb-sized controls (12px corners, 44px minimum height).
- Cards lifted on soft shadows; floating layers (dialogs, palette, toasts) lifted further.
- Light and dark share the same classes; tokens describe a role, not a fixed color.
- All motion honours `prefers-reduced-motion`.

## Colors

A warm two-family palette: brown-black stone neutrals and lamplit brass, with muted wine, patina and ember as the only status accents.

Every color is an RGB triplet CSS variable in `src/styles.css`, exposed to Tailwind through `themeVar()` so opacity modifiers work (`bg-gold-500/15`). The hex values in the frontmatter are the default dark theme. `:root[data-theme='light']` redefines the same variables, and `.theme-dark-scope` forces a subtree back to dark.

### Primary
- **Lamp Brass** (gold-400): the voice of the accent. Eyebrow labels above page titles, curriculum group headings, active nav text and focus borders on inputs. Light theme: `#825c28`.
- **Lamplight** (gold-300): brighter brass for text that needs more glow: active nav items, chips, code keywords, inline monospace values.
- **Candle Wax** (gold-200): the base text color inside code blocks.
- **Burnished Brass** (gold-solid): the only solid fill for primary buttons, always with white text (4.7:1). It exists because gold-400 under white text failed contrast. Its hover, **Burnished Brass Deep** (gold-solid-hover), gets darker, never lighter. Light theme: `#92682a`.
- **Brass tints** (gold-500 at 10–20% opacity): backgrounds for active nav items, chips and selected states.

### Tertiary (status)
- **Claret** (status-rose): errors, wrong answers and decorators in code. A wine tone that belongs in the palette, not a generic red.
- **Claret Panel** (panel-danger-bg): deep burgundy background for "watch out" callouts, headed in brass rather than red.
- **Patina** (status-emerald) / **Patina Panel** (panel-success-bg): correct answers, success callouts and strings in code.
- **Ember** (status-amber): numbers in code, rating stars and warnings.

### Neutral
- **Workshop Night** (stone-950): the page background, and the inset background for code blocks.
- **Oiled Walnut** (stone-900): cards, panels, dialogs, inputs and dropdowns.
- **Bench Top** (stone-800): hover fills, nested surfaces, hairline borders on cards (the most-used background after the page).
- **Iron Rule** (stone-700): stronger borders on inputs and secondary buttons.
- **Pencil Grey** (stone-400 / stone-500): secondary text, descriptions, metadata.
- **Chalk** (stone-100): primary text. Light theme: `#241d18` on parchment `#fdfaf4`.

### Named Rules
**The Role-Not-Value Rule.** A stone or gold step names a role, not a fixed color: stone-950 is always the page and stone-100 is always the main text, in either theme. Never write `dark:` or `light:` variants. If something looks wrong in one theme, fix the token, not the component.

**The One Lamp Rule.** Burnished Brass appears on at most one button per view, the primary action. Everything else that needs gold uses brass text, a tint or an outline. The lamp is bright because there is only one.

**The Label-Names-The-Kind Rule.** A card label names what kind of card it is ("TRY IT", "THE #1 MISTAKE", "SIGNAL()"). It never carries a sequence number; the player already says which section this is. `app-lesson-card` strips a leading "N · " from older labels.

**The No-Legacy-Classes Rule.** `src/styles.css` globally overrides `.bg-white`, `.bg-stone-50`, `.text-stone-800`, `.text-gold-600/700`, `.border-stone-200/300` and the rose/emerald/amber text classes, to keep old demo cards on-theme. New code never uses those classes for their literal meaning. Use the role tokens instead.

## Typography

**Display Font:** system sans (`ui-sans-serif, system-ui`), no webfont loaded
**Body Font:** system sans
**Label/Mono Font:** system monospace (`ui-monospace, SFMono-Regular, Menlo…`)

**Character:** The native system face, set firmly: semibold and bold carry the hierarchy, and size jumps are kept for titles. It reads as a familiar tool rather than a magazine, so the live examples get the attention. Monospace marks anything that is real code: identifiers, values and output.

### Hierarchy
- **Display** (700, 3.75rem / 60px, line-height 1): the home hero only.
- **Headline** (700, 1.875rem → 2.25rem at `sm`, line-height ~1.1): page and lesson titles in the page header.
- **Title** (700, 1.25rem): section titles, card headings, dialog titles.
- **Body** (400, 0.875rem / 14px, line-height 1.43): the default size for nearly all lesson and UI copy. Page intros go up to 1rem in Pencil Grey, at most `max-w-3xl` (~48rem).
- **Label** (700, 11px, uppercase, 0.05em tracking, Lamp Brass): eyebrows, curriculum group headings, panel kickers. 12px semibold for metadata and captions.
- **Code** (400, 0.75rem, monospace, Candle Wax on Workshop Night): code blocks; inline values in Lamplight.

### Named Rules
**The Semibold Spine Rule.** Hierarchy comes from weight (600 for controls and emphasis, 700 for headings) before size. Don't push body copy above 16px to create emphasis.

## Layout

Content sits in a centred column, `max-w-5xl` (1024px) for almost every page and `max-w-6xl` (1152px) for wide grids, with 16px side padding (`px-4`), growing to 24px at larger widths. Vertical rhythm is generous between page sections (`py-8` to `py-12`) and tight inside them (`gap-2` to `gap-3`, `space-y-2`).

Lesson prose is capped at 60ch (about 75 characters per line); demos, code and diagrams use the card's full width. Each section opens 24–32px below the lesson header.

Lessons use a three-zone shell: a collapsible curriculum sidebar on the left (it collapses to an icon rail with tooltips), the lesson column in the centre, and a section navigation bar. Below `lg` (1024px) the sidebar goes away and a fixed bottom bar takes over (Home, Topics as a bottom sheet, Journey, Dashboard, Saved), translucent Workshop Night at 95% with backdrop blur and safe-area padding.

Breakpoints are Tailwind defaults (sm 640, md 768, lg 1024), written mobile-first. `sm:` does most of the work. Layout must hold at phone width with no horizontal scroll; `html` clips overflow-x as a safety net.

## Elevation & Depth

Cards are lifted. A surface reads as an object on the bench: Oiled Walnut over Workshop Night, edged with a Bench Top hairline, and set on a soft, dark ambient shadow. Interactive cards lift further on hover (a slight upward shift and a brass-tinted ring), so they feel picked up. Floating layers (dropdowns, the command palette, dialogs, the tour, toasts) sit highest, on large dark shadows. Tonal stepping (950 → 900 → 800) still does the structural work. Shadows add the tactile part on top and never replace the tonal step.

Shadows are tokens, not one-off utilities: `shadow-card`, `shadow-card-lift` and `shadow-float` in `tailwind.config.js`, tuned per theme by `--shadow-color`, `--shadow-near`, `--shadow-far` and `--shadow-highlight` in `src/styles.css`. Dark mode uses black at higher strength plus a faint 1px top highlight, because a black shadow alone vanishes on Workshop Night. Light mode uses a warm brown (`rgb(61 42 24)`) at low strength. `lesson-card` rests on `shadow-card`; menus, the command palette, dialogs, the tour and toasts use `shadow-float`. The home hero's Lamp glow is the only shadow outside the tokens.

### Shadow Vocabulary
- **Card rest** (`shadow-card`: top highlight, `0 1px 2px` near shadow, `0 8px 24px -10px` far shadow): every card and panel at rest.
- **Card lifted** (`shadow-card-lift`: `0 2px 4px` near, `0 18px 36px -12px` far at 1.4× strength, plus a brass edge `border-gold-500/60` and, motion-safe only, `translateY(-2px)`): an interactive card on hover or keyboard focus. Apply with the `.interactive-card` class, or `interactive` on `app-lesson-card`.
- **Floating** (`shadow-float`: `0 4px 8px` near, `0 28px 56px -16px` far at 1.6× strength): dropdowns, the command palette, dialogs, the tour, toasts.
- **Lamp glow** (`box-shadow: 0 10px 15px -3px rgb(var(--gold-500) / 0.2)`): the home hero's primary call to action only.
- **Signal glow** (`box-shadow: 0 0 6px 2px rgb(201 162 99 / 0.7)`): the moving dot in flow diagrams and arrows.

### Named Rules
**The Flat-Inside Rule.** Only the outer card is lifted. Anything set inside a card (a demo value, a nested group, a code panel, a log) is flat: `.tile` (Bench Top) or `.well` (Workshop Night), never a second shadow.

**The Tone-Then-Shadow Rule.** Every lifted surface first sits one stone step above what is beneath it, then gets its shadow. A shadow on the same tone as its background is mud.

## Shapes

Generously rounded, never sharp. The workhorse corner is 12px (`rounded-xl`, by far the most used), for buttons, inputs, cards, code blocks and nav items. Larger containers round more as they grow: 16px for feature panels, callouts and dropdowns, 24px for dialogs and showcase forms. 8px is for small things (tooltips, compact buttons, sub-items), and full pills are for chips, badges, avatars and step numbers. Borders are 1px hairlines in Bench Top (containers) or Iron Rule (controls).

## Components

### Buttons
Friendly, thumb-sized and sure. Use the shared classes in `src/styles.css` (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-icon`) rather than repeating utility strings.
- **Shape:** 12px corners, minimum height 44px (`min-h-11`).
- **Primary:** Burnished Brass with white 14px semibold text, 16px horizontal padding (24px / py-3 for hero CTAs).
- **Hover / Focus:** darkens to Burnished Brass Deep with the default 150ms transition. Disabled drops to 40% opacity with a not-allowed cursor.
- **Secondary:** transparent with an Iron Rule border and Pencil Grey/stone-300 text; hover fills Bench Top.
- **Icon button:** a 44×44 square, 8px corners, the secondary outline treatment.

### Chips
- **Style:** pill, brass tint (gold-500 at 15%) background, Lamplight text, 12px bold.
- **State:** status chips swap to the matching status tint (e.g. ember at 15%). Numbered step dots use Bench Top with stone-300 text.

### Cards / Containers
Use `app-lesson-card` in lessons and `.card` elsewhere; add `.interactive-card` when the whole card is clickable.
- **Corner Style:** 12px for small cards, 16px for panels, 24px for dialogs.
- **Background:** Oiled Walnut on the page. Nested items use Bench Top.
- **Shadow Strategy:** Card rest, then Card lifted on interactive hover (see Elevation & Depth).
- **Border:** Bench Top hairline. Brass at 40% for onboarding/tour emphasis.
- **Internal Padding:** 16px for cards, 20–24px for panels, 32px for dialogs.

### Inputs / Fields
- **Style:** Oiled Walnut fill, Iron Rule 1px border, 12px corners, 44px height, 12px horizontal padding, Chalk text at 14px.
- **Focus:** the border changes to Lamp Brass.
- **Error:** Claret text below the field. Validation state is taught live, so error copy stays plain and specific.

### Icons
Drawn outline SVGs from `shared/icon.component.ts` (24px grid, 2px stroke, round caps), painted with `currentColor`. Curriculum groups and section types map to icons in `shared/learning-icons.ts`. Emoji are not an icon system: topic emoji stay in the data, out of navigation.

### Focus
One ring everywhere: 2px solid Lamp Brass, 2px offset, on `:focus-visible` (set globally). Inputs replace it with a Lamp Brass border. Text selection is a 35% brass tint.

### Navigation
- **Header (56px, one line at every desktop width):** brand, overall progress (from 1280px) and Continue, search, then the app's pages as text links (Journey, Dashboard, Saved Topics, from 1024px; History is reached from the Dashboard) and Feedback, the theme toggle (40px) and avatar. The ⌘K hint shows from 1536px.
- **Desktop sidebar (280px):** the curriculum only, under a small "Topics" heading with the 44px collapse button.
- **Curriculum groups:** 44px toggles with the group's drawn icon in Lamp Brass, the title in 13px semibold, done/total topics in tabular figures, and a chevron; `aria-expanded` and `aria-controls` on each. The group of the topic being studied opens on arrival; the others keep the learner's choice (shared with the phone drawer).
- **Topic rows (44px):** a status ring first: an empty ring (not started), a ring filling in Lamp Brass with the share of sections done (in progress; its track dims to stone-700 so the arc reads), or a filled Patina check (completed). The status is also written out after the name for screen readers ("Signals, in progress"). Long names truncate with the full name in `title`.
- **Section rows (40px):** only under the current topic, indented behind a 1px guide line: a Patina check when done, a small dot otherwise (Lamp Brass when current).
- **Active:** brass tint (gold-500 at 10–15%) with Lamplight text; the current section uses Bench Top. No left border bars. `aria-current="page"` marks the page, `"true"` the topic around it.
- **Collapsed rail (72px):** the expand button, then one 56px entry per curriculum group: its icon inside a ring that fills with the group's finished sections (Patina once every topic is complete), topics done beneath in 11px tabular figures. The current group gets the brass tint. Hover or focus shows a card with the group name and progress; a click expands the sidebar with that group open.
- **Phone:** a fixed bottom bar (exactly 70px including the safe area, which the lesson's sticky bar relies on): Home, Topics, Journey, Dashboard, Saved, each a 24px outline icon over a 12px semibold label filling its column. Topics opens the curriculum as a bottom sheet (no app pages, no second heading; 44px close button).

### Code Block (signature)
Code is a first-class surface, built by `shared/code-block.directive.ts` around every `<pre>` in a component that imports it.
- **Panel:** a flat figure inside the card (Flat-Inside Rule), 12px corners, a 1px `--code-border` edge, on `--code-bg`: darker than the card in dark mode, deeper parchment than the card in light mode.
- **Header (44px):** the file name when the example sets `data-file`, otherwise the language (TypeScript, HTML, CSS, JSON, Terminal; `data-lang` overrides the guess), in 12px semibold monospace. The Copy button sits on the right: always visible, 36px tall with a larger hit area, copy icon plus "Copy". After copying it shows a Patina check and "Copied" for 2s, announced through a polite live region. If the clipboard is unavailable it selects the code and says which shortcut to press.
- **Body:** 13px/24px monospace in Candle Wax, 2-space tabs. Line numbers (3+ lines) sit in a separate gutter that is hidden from assistive tech, cannot be selected, and is never copied. Only the code scrolls sideways; when it does, it becomes a focusable, labelled region so the arrow keys scroll it.
- **Colors:** `.tok-kw` Lamplight semibold (keywords, interpolation, control flow), `.tok-str` Patina, `.tok-dec` Claret (decorators, at-rules), `.tok-num` Ember, `.tok-com` Pencil Grey italic, `.tok-tag` Lamplight (HTML tags, CSS selectors), `.tok-attr` Claret (attributes, CSS properties).
- **Copy is exact:** the button copies the plain code string (indentation and newlines intact, shared template indentation removed), never the highlighted markup.
- **Diagrams stay plain:** ASCII diagrams (box-drawing lines, ▶ and ↓) get no panel, colors or Copy; `data-plain` / `data-code` force either way. Code that changes while its `<pre>` stays on screen binds `[appCode]`.

### Lesson Header (signature)
The top of every lesson section, owned by the lesson player: breadcrumbs (group › topic link › section), the section title as the page's only `<h1>` (24px → 30px bold, balanced), the topic description (max 60ch, Pencil Grey), and a meta line (Section N of M · kind · minutes). Save for later sits on the right as a 44px outline button. Below it, the **section tabs**: one link per real section plus Quiz, 44px tall, with the section-kind icon (or a Patina check when done); the current tab gets a 2px Lamp Brass underline and Lamplight text. The Quiz tab shows a lock and is not a link until every section is done. On phones the tab row scrolls sideways and keeps the current tab centred. Inside a section, `app-page-header` steps down to `<h2>` and drops its label.

### Progress (Dashboard)
The Dashboard opens with its welcome card: greeting, streak, an overall progress bar (topics), Continue and Demo app on the left; a large topic progress ring with Complete / Remaining / Day streak on the right. Level, XP and badges sit below in a clickable lifted card that opens the journey, then topics by group (status rings, sections done per topic) and recent activity.

### Empty States
A resting card, centred: the drawn icon (36px, Lamp Brass, no tile behind it), a 20px bold heading, one plain sentence of what to do, and at most one `.btn-primary`.

### Callout Panels (signature)
Key-takeaway and warning panels: 16px corners, 24px padding. The danger panel is Claret Panel with a 30% brass-heading border, an 11px brass kicker and an xl bold title. The success panel uses Patina Panel with a Patina heading. Body text inside uses the ordinary stone tokens.

### Flow Diagrams & Visualisers (signature)
The animated lesson diagrams: stone nodes joined by arrows, with a brass dot carrying a soft Signal glow along the path to show data moving. Motion explains the mechanism and stops under reduced motion.

## Do's and Don'ts

### Do:
- **Do** use the stone/gold role tokens for every color, so both themes work from one class list.
- **Do** keep every tappable control at least 44px tall (`min-h-11`).
- **Do** use Burnished Brass with white text for the single primary action per view, and darken it on hover.
- **Do** use 12px corners as the default, rounding up for bigger containers (16px panels, 24px dialogs).
- **Do** give cards one tonal step plus `shadow-card`, and lift interactive cards with `.interactive-card` (hover and keyboard focus).
- **Do** keep everything inside a card flat (`.tile`, `.well`).
- **Do** mark eyebrows and group headings with 11px bold uppercase Lamp Brass.
- **Do** set real code and values in monospace with the palette's syntax colors.
- **Do** keep text contrast at WCAG AA in both themes, and let the global reduced-motion rule apply to every animation.

### Don't:
- **Don't** write `dark:` / `light:` variants or hard-code hex colors in components.
- **Don't** use gold-400/500 as a button fill under white text. It fails contrast, which is why gold-solid exists.
- **Don't** put more than one solid brass button in a view.
- **Don't** introduce cool greys, blues or a second brand hue. Status colors stay muted (wine, patina, ember).
- **Don't** use `.bg-white`, `.text-stone-800`, `.border-stone-200` and the other globally-overridden legacy classes in new code.
- **Don't** set a shadow on a surface with the same tone as its background.
- **Don't** write one-off shadow utilities (`shadow-xl shadow-black/20`); use the elevation tokens.
- **Don't** use emoji as icons in navigation or controls.
- **Don't** use sharp corners (under 8px) on interactive elements.
