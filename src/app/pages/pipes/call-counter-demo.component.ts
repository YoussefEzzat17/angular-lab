import { ChangeDetectionStrategy, Component, Injectable, Pipe, PipeTransform, inject, signal } from '@angular/core';

/** Counts calls outside the template, so showing the numbers cannot change what is being counted. */
@Injectable()
export class CallCounts {
  method = 0;
  pipe = 0;
}

@Pipe({ name: 'shout', standalone: true })
export class ShoutPipe implements PipeTransform {
  private readonly counts = inject(CallCounts);

  transform(value: string): string {
    this.counts.pipe++;
    return value.toUpperCase() + '!';
  }
}

const NAMES = ['castle in the sky', 'my neighbor totoro'];

/**
 * The same job done twice: a method called in the template, and a pure pipe. Press "Re-render" a few times, then read the counts:
 * the method runs on every check, the pipe only when its input changes.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-call-counter-demo',
  standalone: true,
  imports: [ShoutPipe],
  providers: [CallCounts],
  template: `
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <div class="rounded-xl bg-stone-950 p-4">
        <p class="text-xs font-bold tracking-wider text-stone-500">A METHOD IN THE TEMPLATE</p>
        <code class="mt-1 block text-xs text-stone-400">shout(name())</code>
        <p class="mt-2 text-sm font-semibold text-gold-300" data-testid="by-method">{{ shout(name()) }}</p>
      </div>
      <div class="rounded-xl bg-stone-950 p-4">
        <p class="text-xs font-bold tracking-wider text-stone-500">A PURE PIPE</p>
        <code class="mt-1 block text-xs text-stone-400">name() | shout</code>
        <p class="mt-2 text-sm font-semibold text-emerald-300" data-testid="by-pipe">{{ name() | shout }}</p>
      </div>
    </div>

    <p class="mt-2 text-xs text-stone-500" aria-hidden="true">Re-rendered {{ renders() }} times.</p>

    <div class="mt-3 flex flex-wrap gap-2">
      <button type="button" data-testid="rerender" (click)="rerender()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">Re-render the page</button>
      <button type="button" data-testid="rename" (click)="nextName()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">Change the name</button>
      <button type="button" data-testid="show-counts" (click)="showCounts()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Show the counts</button>
      <button type="button" data-testid="reset-counts" (click)="resetCounts()" class="min-h-11 rounded-xl px-4 text-sm font-semibold text-stone-400 hover:text-stone-200">Reset</button>
    </div>

    <div class="mt-3 rounded-xl bg-stone-950 p-4 text-sm" aria-live="polite">
      <p class="text-stone-300">Times the <strong class="text-gold-300">method</strong> ran: <strong class="text-stone-100" data-testid="count-method">{{ shown().method }}</strong></p>
      <p class="mt-1 text-stone-300">Times the <strong class="text-emerald-300">pipe</strong> ran: <strong class="text-stone-100" data-testid="count-pipe">{{ shown().pipe }}</strong></p>
    </div>
    <p class="mt-2 text-xs text-stone-500">In development mode Angular checks every binding twice, so the method count can look doubled. The gap between the two numbers is the point.</p>
  `,
})
export class CallCounterDemoComponent {
  private readonly counts = inject(CallCounts);
  protected readonly name = signal(NAMES[0]);
  protected readonly renders = signal(0);
  protected readonly shown = signal({ method: 0, pipe: 0 });

  protected shout(value: string): string {
    this.counts.method++;
    return value.toUpperCase() + '!';
  }

  protected rerender(): void {
    this.renders.update((n) => n + 1);
  }

  protected nextName(): void {
    this.name.update((current) => (current === NAMES[0] ? NAMES[1] : NAMES[0]));
  }

  protected showCounts(): void {
    this.shown.set({ method: this.counts.method, pipe: this.counts.pipe });
  }

  protected resetCounts(): void {
    this.counts.method = 0;
    this.counts.pipe = 0;
    this.shown.set({ method: 0, pipe: 0 });
  }
}
