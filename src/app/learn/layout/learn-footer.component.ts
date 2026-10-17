import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-learn-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-stone-800 bg-stone-950 px-6 py-6 pb-20 text-center text-sm text-stone-500 lg:pb-6">
      <div class="mx-auto flex max-w-5xl flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p>Angular Lab — a hands-on playground for learning Angular.</p>
        <div class="flex items-center gap-4">
          <a routerLink="/about" class="transition hover:text-stone-300">About</a>
          <a routerLink="/feedback" class="transition hover:text-stone-300">Feedback</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="transition hover:text-stone-300">GitHub</a>
          <p>Made by <a href="https://youssef-ezzat.vercel.app/" target="_blank" rel="noopener noreferrer" class="font-semibold text-gold-300 transition hover:underline">Youssef Ezzat</a></p>
        </div>
      </div>
    </footer>
  `,
})
export class LearnFooterComponent {}
