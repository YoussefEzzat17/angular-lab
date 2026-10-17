import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DEMO_LINKS, TOPICS } from '../data/topics';
import { ProgressService } from '../services/progress.service';
import { SearchPaletteService } from '../services/search-palette.service';

interface ResultItem {
  path: string;
  icon: string;
  title: string;
  description: string;
  isTopic: boolean;
}

@Component({
  selector: 'app-search-palette',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (palette.open()) {
      <div class="fixed inset-0 z-50 flex items-start justify-center bg-stone-950/80 px-4 pt-[12vh] backdrop-blur-sm" (click)="close()">
        <div
          class="w-full max-w-lg overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl shadow-black/60"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center gap-3 border-b border-stone-800 px-4 py-3">
            <span class="text-stone-500">⌘K</span>
            <input
              type="text"
              autofocus
              [ngModel]="query()"
              (ngModelChange)="onQueryChange($event)"
              placeholder="Search topics… (e.g. signals, forms, interceptor)"
              class="flex-1 bg-transparent text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none"
              autocomplete="off"
            />
            <kbd class="rounded border border-stone-700 px-1.5 py-0.5 text-[10px] text-stone-500">Esc</kbd>
          </div>

          <div class="max-h-[50vh] overflow-y-auto p-2">
            @if (results().length === 0) {
              <p class="px-3 py-6 text-center text-sm text-stone-500">No topics match "{{ query() }}"</p>
            }
            @for (item of results(); track item.path; let i = $index) {
              <button
                type="button"
                (mouseenter)="activeIndex.set(i)"
                (click)="go(item.path)"
                class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition"
                [class.bg-gold-500/15]="i === activeIndex()"
                [class.text-gold-300]="i === activeIndex()"
                [class.hover:bg-stone-800]="i !== activeIndex()"
              >
                <span class="text-lg">{{ item.icon }}</span>
                <span class="min-w-0 flex-1">
                  <span class="flex items-center gap-2">
                    <span class="block truncate font-semibold text-stone-100">{{ item.title }}</span>
                    @if (item.isTopic && progress.isCompleted(item.path)) {
                      <span class="shrink-0 text-xs text-emerald-400">✓</span>
                    }
                  </span>
                  <span class="block truncate text-xs text-stone-500">{{ item.description }}</span>
                </span>
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class SearchPaletteComponent {
  private readonly router = inject(Router);
  readonly progress = inject(ProgressService);
  readonly palette = inject(SearchPaletteService);

  readonly query = signal('');
  readonly activeIndex = signal(0);

  private readonly allItems: ResultItem[] = [
    ...TOPICS.map((t) => ({ path: t.path, icon: t.icon, title: t.title, description: t.description, isTopic: true })),
    ...DEMO_LINKS.map((d) => ({ path: d.path, icon: '🎬', title: d.label, description: 'Demo app', isTopic: false })),
  ];

  readonly results = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      return this.allItems;
    }
    return this.allItems.filter((item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
  });

  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent): void {
    const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    if (isCmdK) {
      event.preventDefault();
      this.palette.toggle();
      this.query.set('');
      this.activeIndex.set(0);
      return;
    }
    if (!this.palette.open()) {
      return;
    }
    if (event.key === 'Escape') {
      this.close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update((i) => Math.min(i + 1, this.results().length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      const item = this.results()[this.activeIndex()];
      if (item) {
        this.go(item.path);
      }
    }
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  go(path: string): void {
    this.router.navigateByUrl(path);
    this.close();
  }

  close(): void {
    this.palette.close();
  }
}
