import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-stone-800 bg-stone-950">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-stone-500 sm:flex-row sm:justify-between sm:px-6">
        <p>Angular Lab — a hands-on playground for learning Angular.</p>
        <p>
          Made by
          <a
            href="https://youssef-ezzat.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold text-gold-300 underline-offset-4 transition hover:underline"
            aria-label="Youssef Ezzat — portfolio (opens in a new tab)"
            >Youssef Ezzat</a
          >
          <span class="text-stone-500">&nbsp;(YE)</span>
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
