import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ProfileService } from '../services/profile.service';

interface TourStep {
  icon: string;
  title: string;
  body: string;
}

export const TOUR_STEPS: TourStep[] = [
  { icon: '📚', title: 'Pick a topic', body: 'The sidebar lists every topic in the order we recommend. On a phone, tap Topics in the bottom bar.' },
  { icon: '➡️', title: 'Move one section at a time', body: 'Each topic is split into short sections. Use the Next button and the dots at the bottom to move through them.' },
  { icon: '🧪', title: 'Play with the demos', body: 'Click, type and change things. The page reacts straight away, and that is how the idea sticks.' },
  { icon: '✅', title: 'Pass the quiz', body: 'When every section is done, take a 6-question quiz. 75% completes the topic and earns you XP.' },
  { icon: '🗺️', title: 'Find your way', body: 'Press Ctrl/⌘ + K to search every topic and section. Your level is in the sidebar, and the Journey page shows the whole map.' },
];

/** A short, skippable welcome tour. It shows once, right after the name prompt, and never blocks the page. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tour',
  standalone: true,
  host: { '(document:keydown.escape)': 'skip()' },
  template: `
    @if (visible()) {
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="tour-title"
        data-testid="tour"
        class="fixed inset-x-4 bottom-24 z-40 rounded-2xl border border-gold-500/40 bg-stone-900 p-5 shadow-2xl sm:left-auto sm:right-6 sm:w-96 lg:bottom-6"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-xs font-bold uppercase tracking-widest text-gold-400" data-testid="tour-progress">Quick tour · {{ index() + 1 }} of {{ total }}</p>
          <button type="button" data-testid="tour-skip" (click)="skip()" class="min-h-9 rounded-lg px-2 text-xs font-semibold text-stone-400 hover:text-stone-200">Skip tour</button>
        </div>
        <h2 id="tour-title" class="mt-3 text-lg font-bold text-stone-100" data-testid="tour-title">
          <span aria-hidden="true">{{ step().icon }}</span> {{ step().title }}
        </h2>
        <p class="mt-2 text-sm text-stone-400" aria-live="polite">{{ step().body }}</p>

        <div class="mt-5 flex items-center justify-between gap-3">
          <div class="flex gap-1.5" aria-hidden="true">
            @for (s of steps; track s.title; let i = $index) {
              <span class="h-1.5 w-5 rounded-full" [class]="i === index() ? 'bg-gold-400' : 'bg-stone-700'"></span>
            }
          </div>
          <div class="flex gap-2">
            @if (index() > 0) {
              <button type="button" data-testid="tour-back" (click)="back()" class="min-h-11 rounded-xl border border-stone-700 px-4 text-sm font-semibold text-stone-300 hover:bg-stone-800">Back</button>
            }
            <button type="button" data-testid="tour-next" (click)="next()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">
              {{ isLast() ? 'Got it' : 'Next' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class TourComponent {
  private readonly profile = inject(ProfileService);

  readonly steps = TOUR_STEPS;
  readonly total = TOUR_STEPS.length;
  readonly index = signal(0);

  readonly visible = computed(() => this.profile.onboardingDone() && !this.profile.tourDone());
  readonly step = computed(() => TOUR_STEPS[this.index()]);
  readonly isLast = computed(() => this.index() === TOUR_STEPS.length - 1);

  next(): void {
    if (this.isLast()) {
      this.profile.finishTour();
    } else {
      this.index.update((i) => i + 1);
    }
  }

  back(): void {
    this.index.update((i) => Math.max(0, i - 1));
  }

  skip(): void {
    if (this.visible()) {
      this.profile.finishTour();
    }
  }
}
