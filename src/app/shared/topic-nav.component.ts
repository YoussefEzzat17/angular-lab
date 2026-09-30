import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { TOPICS } from '../core/data/topics';
import { ProgressService } from '../core/services/progress.service';

@Component({
  selector: 'app-topic-nav',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="mt-10 flex flex-col items-center gap-3 border-t border-stone-800 pt-6 sm:flex-row sm:justify-between">
      <p class="text-sm text-stone-400">Read through the topic and tried the demo above?</p>
      <button
        type="button"
        (click)="toggleComplete()"
        class="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition"
        [class.border-emerald-400/50]="isCompleted()"
        [class.bg-emerald-500/15]="isCompleted()"
        [class.text-emerald-300]="isCompleted()"
        [class.border-gold-400/40]="!isCompleted()"
        [class.bg-gold-500/10]="!isCompleted()"
        [class.text-gold-300]="!isCompleted()"
        [class.hover:bg-gold-500/20]="!isCompleted()"
      >
        @if (isCompleted()) {
          <span>✅</span>
          <span>Completed</span>
        } @else {
          <span class="h-4 w-4 rounded-full border-2 border-current"></span>
          <span>Mark as Complete</span>
        }
      </button>
    </div>

    <nav class="mt-4 flex items-stretch justify-between gap-3">
      @if (previous()) {
        <a
          [routerLink]="previous()!.path"
          class="group flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-stone-800 bg-stone-900 p-4 transition hover:border-gold-400/50 hover:bg-stone-800"
        >
          <span class="text-gold-400 transition group-hover:-translate-x-1">←</span>
          <span class="min-w-0">
            <span class="block text-xs text-stone-500">Previous</span>
            <span class="block truncate font-semibold text-stone-100">{{ previous()!.icon }} {{ previous()!.title }}</span>
          </span>
        </a>
      } @else {
        <div class="flex-1"></div>
      }

      @if (next()) {
        <a
          [routerLink]="next()!.path"
          class="group flex min-w-0 flex-1 items-center justify-end gap-3 rounded-2xl border border-stone-800 bg-stone-900 p-4 text-right transition hover:border-gold-400/50 hover:bg-stone-800"
        >
          <span class="min-w-0">
            <span class="block text-xs text-stone-500">Next</span>
            <span class="block truncate font-semibold text-stone-100">{{ next()!.icon }} {{ next()!.title }}</span>
          </span>
          <span class="text-gold-400 transition group-hover:translate-x-1">→</span>
        </a>
      } @else {
        <div class="flex-1"></div>
      }
    </nav>
  `,
})
export class TopicNavComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly progress = inject(ProgressService);

  private readonly currentPath = this.router.url.split('?')[0];
  private readonly currentIndex = TOPICS.findIndex((topic) => topic.path === this.currentPath);

  ngOnInit(): void {
    this.progress.markVisited(this.currentPath);
  }

  isCompleted(): boolean {
    return this.progress.isCompleted(this.currentPath);
  }

  toggleComplete(): void {
    this.progress.toggleCompleted(this.currentPath);
  }

  previous() {
    return this.currentIndex > 0 ? TOPICS[this.currentIndex - 1] : null;
  }

  next() {
    return this.currentIndex >= 0 && this.currentIndex < TOPICS.length - 1 ? TOPICS[this.currentIndex + 1] : null;
  }
}
