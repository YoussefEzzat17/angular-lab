import { Component, input, signal } from '@angular/core';

export interface KnowledgeCheckItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-knowledge-check',
  standalone: true,
  template: `
    <article class="mt-5 rounded-2xl border border-[rgb(var(--panel-danger-heading))]/30 bg-[rgb(var(--panel-danger-bg))] p-6">
      <p class="text-xs font-bold tracking-wider text-[rgb(var(--panel-danger-heading))]">KNOWLEDGE CHECK</p>
      <h2 class="mt-2 text-xl font-bold">Quick recap questions</h2>
      <p class="mt-2 text-sm text-stone-400">Think through each answer before revealing it.</p>
      <div class="mt-5 space-y-3">
        @for (item of items(); track item.question; let i = $index) {
          <div class="rounded-xl border border-stone-800 bg-stone-900 p-4">
            <button
              type="button"
              [id]="'kc-btn-' + i"
              [attr.aria-expanded]="isOpen(i)"
              [attr.aria-controls]="'kc-panel-' + i"
              (click)="toggle(i)"
              class="flex w-full items-center justify-between gap-3 text-left"
            >
              <span class="font-semibold text-stone-100">Q: {{ item.question }}</span>
              <span class="shrink-0 text-[rgb(var(--panel-danger-heading))] transition" [class.rotate-180]="isOpen(i)">▾</span>
            </button>
            @if (isOpen(i)) {
              <div [id]="'kc-panel-' + i" [attr.aria-labelledby]="'kc-btn-' + i" role="region">
                <p class="mt-3 border-t border-stone-800 pt-3 text-sm text-stone-300">
                  <span class="font-semibold text-[rgb(var(--panel-danger-heading))]">A:</span> {{ item.answer }}
                </p>
              </div>
            }
          </div>
        }
      </div>
    </article>
  `,
})
export class KnowledgeCheckComponent {
  readonly items = input.required<KnowledgeCheckItem[]>();
  private readonly openIndexes = signal<Set<number>>(new Set());

  isOpen(i: number): boolean {
    return this.openIndexes().has(i);
  }

  toggle(i: number): void {
    this.openIndexes.update((s) => {
      const next = new Set(s);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }
}
