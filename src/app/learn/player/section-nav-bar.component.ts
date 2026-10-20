import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface SectionNavItem {
  id: string;
  title: string;
  done: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-section-nav-bar',
  standalone: true,
  template: `
    <nav class="sticky bottom-16 lg:bottom-0 z-20 border-t border-stone-800 bg-stone-950/95 backdrop-blur"
         aria-label="Section navigation"
         style="padding-bottom: max(0.5rem, env(safe-area-inset-bottom))">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3">

        <!-- Previous -->
        @if (prevSection(); as prev) {
          <button type="button" (click)="go.emit(prev.id)"
            class="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-stone-700 px-3 py-2 text-sm font-semibold text-stone-300 transition hover:bg-stone-800 sm:px-4">
            <span>←</span>
            <span class="hidden sm:inline max-w-[100px] truncate">{{ prev.title }}</span>
          </button>
        } @else {
          <div class="w-10 sm:w-24"></div>
        }

        <!-- Dots -->
        <div class="flex items-center gap-2" role="group"
             [attr.aria-label]="'Section ' + (currentIndex() + 1) + ' of ' + sections().length">
          @for (s of sections(); track s.id; let i = $index) {
            <button
              type="button"
              (click)="go.emit(s.id)"
              [attr.aria-label]="'Section ' + (i + 1) + ': ' + s.title"
              [attr.aria-current]="s.id === currentSectionId() ? 'step' : null"
              class="rounded-full transition"
              [class]="s.id === currentSectionId()
                ? 'h-3 w-3 bg-gold-500'
                : s.done
                  ? 'h-2.5 w-2.5 bg-emerald-500/70'
                  : 'h-2.5 w-2.5 bg-stone-600 hover:bg-stone-500'"
            ></button>
          }
        </div>

        <!-- Next / Quiz -->
        @if (isLastSection()) {
          <button type="button" (click)="goQuiz.emit()"
            class="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-gold-solid px-3 py-2 text-sm font-semibold text-white transition hover:bg-gold-solid-hover sm:px-4">
            <span class="hidden sm:inline">Take the Quiz</span>
            <span class="sm:hidden">Quiz</span>
            <span>→</span>
          </button>
        } @else if (nextSection(); as next) {
          <button type="button" (click)="completeAndGo.emit(next.id)"
            class="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-gold-solid px-3 py-2 text-sm font-semibold text-white transition hover:bg-gold-solid-hover sm:px-4">
            <span class="hidden sm:inline max-w-[100px] truncate">{{ next.title }}</span>
            <span>→</span>
          </button>
        } @else {
          <div class="w-10 sm:w-24"></div>
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
