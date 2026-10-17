import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-learn-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-stone-800 bg-stone-950 pb-24 text-sm text-stone-500 lg:pb-6">
      <!-- On mobile: stack vertically, centred. On lg+: single row. -->
      <div class="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-5 lg:flex-row lg:justify-between">

        <!-- Left: brand (desktop only) -->
        <p class="hidden font-semibold text-gold-400 lg:block">
          &lt;Angular <span class="text-stone-100">Lab</span>&gt;
        </p>

        <!-- Right: Feedback + Made by -->
        <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center lg:justify-end">
          <a routerLink="/feedback"
             class="transition hover:text-gold-300">
            📝 Feedback
          </a>
          <span class="hidden text-stone-700 lg:inline">·</span>
          <p>
            Made by
            <a href="https://youssef-ezzat.vercel.app/"
               target="_blank"
               rel="noopener noreferrer"
               class="font-semibold text-gold-300 underline-offset-4 transition hover:underline">
              Youssef Ezzat
            </a>
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class LearnFooterComponent {}
