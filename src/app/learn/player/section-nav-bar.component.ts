import { Component, input, output } from '@angular/core';

export interface SectionNavItem {
  id: string;
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-section-nav-bar',
  standalone: true,
  template: `
    <nav class="sticky bottom-0 z-20 border-t border-stone-800 bg-stone-950/95 backdrop-blur"
         aria-label="Section navigation"
         style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom))">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">

        <!-- Previous -->
        @if (prevSection(); as prev) {
          <button type="button" (click)="go.emit(prev.id)"
            class="flex items-center gap-2 rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:bg-stone-800">
            <span>←</span> <span class="hidden sm:inline">{{ prev.title }}</span>
          </button>
        } @else {
          <div class="w-24"></div>
        }

        <!-- Dots -->
        <div class="flex items-center gap-1.5" role="list" [attr.aria-label]="'Section ' + (currentIndex() + 1) + ' of ' + sections().length">
          @for (s of sections(); track s.id; let i = $index) {
            <button
              type="button"
              role="listitem"
              (click)="go.emit(s.id)"
              [attr.aria-label]="'Section ' + (i + 1) + ': ' + s.title"
              [attr.aria-current]="s.id === currentSectionId() ? 'step' : null"
              class="rounded-full transition"
              [class]="s.id === currentSectionId()
                ? 'h-2.5 w-2.5 bg-gold-500'
                : s.done
                  ? 'h-2 w-2 bg-emerald-500/70'
                  : 'h-2 w-2 bg-stone-600 hover:bg-stone-500'"
            ></button>
          }
        </div>

        <!-- Next / Quiz -->
        @if (isLastSection()) {
          <button type="button" (click)="goQuiz.emit()"
            class="flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gold-400">
            Take the Quiz →
          </button>
        } @else if (nextSection(); as next) {
          <button type="button" (click)="completeAndGo.emit(next.id)"
            class="flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gold-400">
            <span class="hidden sm:inline">{{ next.title }}</span> <span>→</span>
          </button>
        } @else {
          <div class="w-24"></div>
        }
      </div>
    </nav>
  `,
})
export class SectionNavBarComponent {
  readonly sections = input.required<SectionNavItem[]>();
  readonly currentSectionId = input.required<string>();
  readonly go = output<string>();
  readonly completeAndGo = output<string>();
  readonly goQuiz = output<void>();

  protected readonly currentIndex = () => this.sections().findIndex((s) => s.id === this.currentSectionId());
  protected readonly prevSection = (): SectionNavItem | null => {
    const i = this.currentIndex();
    return i > 0 ? this.sections()[i - 1] : null;
  };
  protected readonly nextSection = (): SectionNavItem | null => {
    const i = this.currentIndex();
    return i >= 0 && i < this.sections().length - 1 ? this.sections()[i + 1] : null;
  };
  protected readonly isLastSection = () => this.currentIndex() === this.sections().length - 1;
}
