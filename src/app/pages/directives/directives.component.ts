import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  standalone: true,
  imports: [CommonModule, HighlightDirective],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <p class="text-sm font-semibold text-gold-400">DIRECTIVES</p>
      <h1 class="mt-1 text-3xl font-bold sm:text-4xl">Give HTML extra behavior</h1>
      <p class="mt-3 max-w-3xl text-stone-400">A directive is an Angular instruction attached to an element. We use one to show/hide, repeat items, or change an element’s behavior without creating a whole component.</p>

      <div class="mt-8 grid gap-5 md:grid-cols-2">
        <article class="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p class="text-xs font-bold tracking-wider text-gold-300">BUILT-IN DIRECTIVES</p>
          <button  appHighlight (click)="showTips = !showTips" class="mt-4 rounded-xl bg-gold-500 px-4 py-2 font-semibold text-white">Toggle tips</button>
          <div *ngIf="showTips" class="mt-4 rounded-xl bg-stone-800 p-4 text-sm text-stone-300">*ngIf adds or removes this block from the page.</div>
          <ul class="mt-4 space-y-2 text-sm text-stone-300">
            <li *ngFor="let tip of tips" class="rounded-lg bg-stone-800 px-3 py-2">{{ tip }}</li>
          </ul>
          <p class="mt-4 text-xs text-stone-500"><code>*ngIf</code> controls visibility · <code>*ngFor</code> repeats a template.</p>
        </article>

        <article class="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p class="text-xs font-bold tracking-wider text-amber-300">YOUR OWN ATTRIBUTE DIRECTIVE</p>
          <p  class="mt-4 cursor-pointer rounded-xl border border-gold-400/30 p-4 text-stone-200">Hover me — <code>appHighlight</code> changes my background.</p>
          <p  class="mt-4 text-sm text-stone-400">The directive uses <code class="text-gold-300">@HostListener</code> to listen for mouse events and <code class="text-gold-300">@HostBinding</code> to update the host element style.</p>
          <code class="mt-4 block rounded-lg bg-stone-950 p-3 text-xs text-gold-300">@Directive(&#123; selector: '[appHighlight]' &#125;)</code>
        </article>
      </div>
    </section>
  `,
})
export class DirectivesComponent {
  showTips = true;
  tips = ['*ngIf: show something conditionally', '*ngFor: repeat a list', 'appHighlight: our custom behavior'];
}
