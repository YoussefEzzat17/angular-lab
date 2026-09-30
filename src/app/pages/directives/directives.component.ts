import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HighlightDirective } from '../../directives/highlight.directive';
import { NumbersOnlyDirective } from '../../directives/numbers-only.directive';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, HighlightDirective, NumbersOnlyDirective, FlowDiagramComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-gold-400">HANDS-ON WORKSHOP</p>
          <h1 class="mt-1 text-3xl font-bold sm:text-4xl">Directives</h1>
        </div>
        <a
          href="/pdfs/directives.pdf"
          download="directives.pdf"
          class="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-500/20 hover:shadow-lg hover:shadow-gold-500/20 active:translate-y-0 active:scale-95"
        >
          <svg
            class="h-4 w-4 text-gold-300 transition-transform duration-200 group-hover:translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 18v-6" />
            <path d="m9 15 3 3 3-3" />
          </svg>
          Download PDF Guide
        </a>
      </div>
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

        <article class="md:col-span-2 rounded-2xl border border-gold-400/30 bg-gold-950/20 p-6">
          <p class="text-xs font-bold tracking-wider text-amber-300">ATTRIBUTE · A SECOND CUSTOM DIRECTIVE</p>
          <h2 class="mt-2 text-lg font-bold">appNumbersOnly — stop the wrong keystroke before it lands</h2>
          <p class="mt-2 text-sm text-stone-400">
            Instead of validating <em>after</em> the user types a letter, this directive listens on
            <code class="text-gold-300">(keydown)</code> and calls <code class="text-gold-300">event.preventDefault()</code>
            before any non-digit character reaches the input — arrow keys, backspace and copy/paste of a valid number still work.
            It also sanitizes pasted text.
          </p>

          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label class="text-xs text-stone-400">Try typing letters or symbols, or paste "abc123" — only digits get through</label>
              <input
                type="text"
                inputmode="numeric"
                appNumbersOnly
                (blocked)="onBlocked($event)"
                [ngModel]="phoneValue()"
                (ngModelChange)="phoneValue.set($event)"
                placeholder="e.g. 0100 123 4567"
                class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-stone-100 placeholder:text-stone-500 focus:border-gold-400 focus:outline-none"
              />
              <div class="mt-3 flex items-center justify-between text-xs">
                <span class="text-stone-500">
                  Value: <code class="text-gold-300">{{ phoneValue() || '—' }}</code>
                </span>
                <span [class.text-rose-400]="blockedCount() > 0" [class.text-stone-600]="blockedCount() === 0">
                  Blocked attempts: {{ blockedCount() }}
                </span>
              </div>
              @if (lastBlocked()) {
                <p class="mt-2 text-xs text-rose-300">✗ Blocked "{{ lastBlocked() }}" — not a digit.</p>
              }
            </div>
            <div>
              <p class="text-xs text-stone-500">The directive</p>
              <pre class="mt-2 overflow-x-auto rounded-xl bg-stone-950 p-4 text-[11px] leading-relaxed text-gold-200">&#64;Directive(&#123; selector: '[appNumbersOnly]' &#125;)
export class NumbersOnlyDirective &#123;
  readonly blocked = output&lt;string&gt;();

  &#64;HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) &#123;
    if (isNavigationKey(e) || e.ctrlKey) return;
    if (!/^[0-9]$/.test(e.key)) &#123;
      e.preventDefault();
      this.blocked.emit(e.key);
    &#125;
  &#125;
&#125;</pre>
              <p class="mt-3 text-xs text-stone-500"><code>&lt;input appNumbersOnly (blocked)="onBlocked($event)"&gt;</code></p>
            </div>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class DirectivesComponent {
  showTips = true;
  tips = ['*ngIf: show something conditionally', '*ngFor: repeat a list', 'appHighlight: our custom behavior'];

  readonly phoneValue = signal('');
  readonly blockedCount = signal(0);
  readonly lastBlocked = signal('');

  onBlocked(char: string): void {
    this.blockedCount.update((count) => count + 1);
    this.lastBlocked.set(char);
  }
}
