import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type LessonCardVariant = 'default' | 'highlight' | 'danger' | 'success';
export type LessonCardTone = 'gold' | 'amber' | 'emerald' | 'rose';

// Full class strings (not built up from fragments) so Tailwind's scanner can see every one.
const SURFACES: Record<LessonCardVariant, { card: string; tone: LessonCardTone }> = {
  default: { card: 'border-stone-800 bg-stone-900', tone: 'gold' },
  highlight: { card: 'border-gold-400/30 bg-gold-950/20', tone: 'gold' },
  danger: { card: 'border-[rgb(var(--panel-danger-heading))]/30 bg-[rgb(var(--panel-danger-bg))]', tone: 'rose' },
  success: { card: 'border-emerald-500/30 bg-[rgb(var(--panel-success-bg))]', tone: 'emerald' },
};

const TONES: Record<LessonCardTone, string> = {
  gold: 'text-gold-300',
  amber: 'text-amber-300',
  emerald: 'text-emerald-300',
  rose: 'text-rose-300',
};

/**
 * Labels were written when every lesson was one long page ("6 · EFFECT()"). Sections split those pages up,
 * so the numbers no longer match the "Section 3 of 6" the player shows. The label keeps naming the card's
 * kind; the leading number is dropped.
 */
const LEADING_NUMBER = /^\s*\d+\s*·\s*/;

/**
 * One lesson section: small tracked label, optional heading, then whatever you project.
 * Spacing between cards is the parent's job — put `class="mt-5"` (or a grid span) on the host.
 * Cards rest on `shadow-card`; set `interactive` when the whole card responds to the pointer
 * (a picker, a clickable demo) so it lifts on hover and keyboard focus.
 *
 *  - `default`   plain card
 *  - `highlight` gold-tinted card for the "Try it" interactive sections
 *  - `danger` / `success` burgundy and green callouts
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-lesson-card',
  standalone: true,
  host: { class: 'block min-w-0' },
  template: `
    <article
      class="h-full rounded-2xl border p-6 shadow-card [&>ol]:max-w-[60ch] [&>p]:max-w-[60ch] [&>ul]:max-w-[60ch]"
      [class]="surface().card"
      [class.interactive-card]="interactive()"
    >
      <p class="text-xs font-bold tracking-wider" [class]="labelClass()">{{ displayLabel() }}</p>
      @if (heading()) {
        <h2 class="mt-2 font-bold" [class]="headingSize() === 'xl' ? 'text-xl' : 'text-lg'">{{ heading() }}</h2>
      }
      <ng-content />
    </article>
  `,
})
export class LessonCardComponent {
  readonly label = input.required<string>();
  readonly heading = input<string>();
  readonly variant = input<LessonCardVariant>('default');
  /** Override the label color when it should differ from the variant's default. */
  readonly tone = input<LessonCardTone>();
  readonly headingSize = input<'xl' | 'lg'>('xl');
  readonly interactive = input(false);

  protected readonly displayLabel = computed(() => this.label().replace(LEADING_NUMBER, ''));
  protected readonly surface = computed(() => SURFACES[this.variant()]);
  protected readonly labelClass = computed(() => TONES[this.tone() ?? this.surface().tone]);
}
