import { Component, computed, input } from '@angular/core';

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
 * One lesson section: small tracked label, optional heading, then whatever you project.
 * Spacing between cards is the parent's job — put `class="mt-5"` (or a grid span) on the host.
 *
 *  - `default`   plain card
 *  - `highlight` gold-tinted card for the "Try it" interactive sections
 *  - `danger` / `success` burgundy and green callouts
 */
@Component({
  selector: 'app-lesson-card',
  standalone: true,
  host: { class: 'block' },
  template: `
    <article class="h-full rounded-2xl border p-6" [class]="surface().card">
      <p class="text-xs font-bold tracking-wider" [class]="labelClass()">{{ label() }}</p>
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

  protected readonly surface = computed(() => SURFACES[this.variant()]);
  protected readonly labelClass = computed(() => TONES[this.tone() ?? this.surface().tone]);
}
