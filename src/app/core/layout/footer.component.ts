import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-stone-800 bg-stone-950">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-stone-500 sm:flex-row sm:justify-between sm:px-6">
        <p>Angular Lab — a hands-on playground for learning Angular.</p>
        <p>
          Made by <span class="font-semibold text-gold-300">Youssef Ezzat</span>
          <span class="text-stone-600">&nbsp;(YE)</span>
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
