import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { HighlightDirective } from '../../directives/highlight.directive';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';

@Component({
  standalone: true,
  imports: [CommonModule, HighlightDirective, FlowDiagramComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <p class="text-sm font-semibold text-gold-400">HANDS-ON WORKSHOP</p>
      <h1 class="mt-1 text-3xl font-bold sm:text-4xl">Directives</h1>
      <p class="mt-3 max-w-3xl text-stone-400">
        A directive is an Angular instruction attached to an element — without the overhead of writing a whole component
        for behavior you want to reuse. There are two flavors: <strong class="text-stone-200">structural</strong>
        directives (prefixed with <code class="text-gold-300">*</code>) add or remove elements from the DOM entirely;
        <strong class="text-stone-200">attribute</strong> directives change how an existing element looks or behaves
        without touching the DOM tree.
      </p>

      <div class="mt-8 grid gap-5 md:grid-cols-2">
        <article class="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p class="text-xs font-bold tracking-wider text-gold-300">STRUCTURAL · *ngIf</p>
          <h2 class="mt-2 text-lg font-bold">Adds or removes the element</h2>
          <p class="mt-2 text-sm text-stone-400">Unlike <code class="text-gold-300">display:none</code>, a false *ngIf takes the element out of the DOM completely.</p>
          <button (click)="showTips = !showTips" class="mt-4 rounded-xl bg-gold-500 px-4 py-2 font-semibold text-white">Toggle tips</button>

          <div class="mt-4 flex items-center gap-3 rounded-xl bg-stone-950 p-3 text-xs font-mono">
            <span class="text-stone-500">DOM:</span>
            <span class="rounded-lg border px-2 py-1" [class.border-gold-400]="showTips" [class.text-gold-300]="showTips" [class.border-stone-700]="!showTips" [class.text-stone-600]="!showTips" [class.opacity-40]="!showTips">
              &lt;div&gt; tips &lt;/div&gt;
            </span>
            <span class="text-stone-600">{{ showTips ? '— present' : '— removed' }}</span>
          </div>

          <div *ngIf="showTips" class="mt-4 rounded-xl bg-stone-800 p-4 text-sm text-stone-300">*ngIf adds or removes this block from the page.</div>
          <p class="mt-4 text-xs text-stone-500"><code>*ngIf="showTips"</code></p>
        </article>

        <article class="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p class="text-xs font-bold tracking-wider text-gold-300">STRUCTURAL · *ngFor</p>
          <h2 class="mt-2 text-lg font-bold">Repeats one template, many times</h2>
          <p class="mt-2 text-sm text-stone-400">Angular renders the element once per array item — write the template once, get N elements.</p>

          <div class="mt-4 flex items-center gap-2 rounded-xl bg-stone-950 p-3 text-xs font-mono">
            <span class="rounded-lg border border-gold-400/40 px-2 py-1 text-gold-300">&lt;li&gt; template</span>
            <span class="text-stone-600">×{{ tips.length }} →</span>
            @for (tip of tips; track tip) {
              <span class="h-2 w-2 rounded-full bg-gold-400"></span>
            }
          </div>

          <ul class="mt-4 space-y-2 text-sm text-stone-300">
            <li *ngFor="let tip of tips" class="rounded-lg bg-stone-800 px-3 py-2">{{ tip }}</li>
          </ul>
          <p class="mt-4 text-xs text-stone-500"><code>*ngFor="let tip of tips"</code></p>
        </article>

        <article class="md:col-span-2 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p class="text-xs font-bold tracking-wider text-amber-300">ATTRIBUTE · YOUR OWN DIRECTIVE</p>
          <h2 class="mt-2 text-lg font-bold">appHighlight — same element, new behavior</h2>
          <p class="mt-2 text-sm text-stone-400">
            The directive uses <code class="text-gold-300">@HostListener</code> to listen for mouse events on the element it's applied to,
            and <code class="text-gold-300">@HostBinding</code> to update that same element's style — no new element is added or removed.
          </p>
          <app-flow-diagram class="mt-4 block" from="(mouseenter)/(mouseleave)" to="@HostBinding style" direction="right" />
          <p class="mt-4 cursor-pointer rounded-xl border border-gold-400/30 p-4 text-stone-200" appHighlight>Hover me — <code>appHighlight</code> changes my background.</p>
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
